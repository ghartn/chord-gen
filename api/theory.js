var axios = require("axios");
var utils = require("./utils");
var api = require("./credentials");
var scales = require("./scales");
var chords = require("./chords");
var keys = require("./keys");
var chordConversions = require("./chordConversions");

var tonalProgression = require("tonal-progression");
var tonalChord = require("tonal-chord");
var tonalNote = require("tonal-note");
var tonalDistance = require("tonal-distance");
const VOICING_THRESHOLD = 4;

module.exports.generateKey = function(key) {
	if (key === "random") {
		key = keys[Math.floor(Math.random() * keys.length)];
	}
	return key;
};

var cleanProgression = function(progression, key) {
	console.log(progression);
	let romanized = romanizeProgression(progression);
	console.log(romanized);
	let cleanedProgression = tonalProgression.concrete(romanized, key);
	return cleanedProgression;
};

module.exports.generateTonePoint = function(tone) {
	let point = [];
	tone = tone.document_tone;
	for (var key in tone.tone_categories) {
		let toneCategory = tone.tone_categories[key];
		let tones = toneCategory.tones;
		for (var key in tones) {
			point.push(tones[key].score);
		}
	}
	return point;
};

module.exports.generateFirstChord = function(tonePoint) {
	var distances = [];
	for (var key in chords) {
		let chordPoint = chords[key].tone;
		distances.push(utils.euclideanDistance(tonePoint, chordPoint));
	}
	let minDistance = Math.min(...distances);
	let chordIndex = distances.indexOf(minDistance);
	//let generatedChord = chords[key].name;
	let ids = chords[chordIndex].ids;
	let randomIndex = Math.floor(Math.random() * ids.length);
	let generatedChord = ids[randomIndex];
	return generatedChord;
};

module.exports.generateChordProgression = function(
	firstChord,
	originalTone,
	key
) {
	let chordProgression = [firstChord];
	currentURL = api.TRENDS + firstChord;
	let promise = new Promise((resolve, reject) => {
		utils.asyncLoop({
			length: 3,
			functionToLoop: (loop, i) =>
				generateNextChord(
					chordProgression,
					currentURL,
					originalTone,
					loop,
					i
				),
			callback: function() {
				resolve(cleanProgression(chordProgression, key));
			}
		});
	});
	return promise;
};

var generateNextChord = function(
	chordProgression,
	currentURL,
	originalTone,
	loop,
	i
) {
	axios
		.get(api.HOOK_THEORY + currentURL, {
			headers: {
				Authorization: "Bearer " + api.authKey
			}
		})
		.then(res => {
			let distances = [];
			let originalIndexes = []; //this doesn't support every hooktheory chord, so we track original indexes for mapping
			let response = res.data;
			//go through every chord from the hooktheory response
			for (var key in response) {
				let currentChord = response[key];
				let currentID = currentChord.chord_ID;
				//with the chord id, find the chord from our objects that matches and calculate tone distance
				for (var chord in chords) {
					let ids = chords[chord].ids;
					if (ids.find(id => id === currentID)) {
						//we know the IDS are unique, so if this returns anything but undefined we have the chord and tone
						let chordTone = chords[chord].tone;
						//console.log(chordProgression, currentID);
						distances.push(
							utils.euclideanDistance(chordTone, originalTone)
						);
						originalIndexes.push(key);
					}
				}
			}
			let sortedDistances = distances.sort((a, b) => a > b);
			let found = false;
			var generatedChordID;
			for (var j = 0; j < sortedDistances.length; j++) {
				let currentDistance = sortedDistances[j];
				let indicies = utils.findAllIndices(distances, currentDistance);
				for (var k = 0; k < indicies.length; k++) {
					generatedChordID =
						response[originalIndexes[indicies[k]]].chord_ID;
					if (!chordProgression.find(id => id === generatedChordID)) {
						found = true;
					}
					if (found) break;
				}
				if (found) break;
			}
			chordProgression.push(generatedChordID);
			currentURL += "," + generatedChordID;
			console.log(chordProgression);
			loop();
		})
		.catch(err => {
			console.log(err.data);
		});
};

var romanizeProgression = function(progression) {
	var roman = "";
	for (var index in progression) {
		let chord = progression[index];
		let romanChord = chordConversions[chord];
		//console.log(tonalProgression.parseRomanChord(romanChord));
		roman += romanChord + " ";
	}
	return roman.trim();
};

module.exports.getChordNotes = function(progression) {
	let noteArray = [];
	for (var i in progression) {
		let currentChord = progression[i];
		let chordNotes = [];
		tonalChord.isKnownChord(currentChord)
			? (chordNotes = tonalChord.notes(currentChord))
			: (chordNotes = null);
		let chordVoicing = voiceChord(chordNotes);
		noteArray.push(chordVoicing);
	}
	console.log(noteArray);
	return noteArray;
};

var voiceChord = function(chordNotes) {
	if (!chordNotes) return [];
	let voicing = [];
	for (var i in chordNotes) {
		//TODO: sometimes append 4 or 2? bass notes? better inversions
		let note = chordNotes[i];
		note = tonalNote.simplify(note);
		if (i == 0) {
			//bass note, we will duplicate it in lower octave
			voicing.push(note + "2");
			voicing.push(note + "3");
		} else {
			//this algorithm is bad and makes no sense
			let voiced = false;
			let octave = 3;
			while (!voiced) {
				let noteToTry = note + octave;
				for (var j = 1; j < voicing.length; j++) {
					let noteVoiced = voicing[j];
					let distance = Math.abs(
						tonalDistance.semitones(noteVoiced, noteToTry)
					);
					console.log(noteVoiced, noteToTry, distance, voicing);
					if (distance < VOICING_THRESHOLD) {
						//note voice is too close to note already voiced
						break;
					} else {
						voiced = true;
						voicing.push(noteToTry);
						break;
					}
				}
				octave++;
			}
		}
	}
	return voicing;
};
