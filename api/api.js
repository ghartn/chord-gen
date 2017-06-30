var express = require("express");
var router = express.Router();
var axios = require("axios");
var scales = require("./scales");
var chords = require("./chords");
var keys = require("./keys");
var chordConversions = require("./chordConversions");
var authKey = null;
const HOOK_THEORY = "https://api.hooktheory.com/v1/";
const AUTH = "users/auth";
const TRENDS = "trends/nodes?cp=";
const USERNAME = "ghartn";
const PASSWORD = "peanutbuttermonkeywrench";
const VOICING_THRESHOLD = 4; //every note in a chord has to be atleast 3 semitones apart
var tonalProgression = require("tonal-progression");
var tonalChord = require("tonal-chord");
var tonalNote = require("tonal-note");
var tonalDistance = require("tonal-distance");

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
	url: "https://gateway.watsonplatform.net/tone-analyzer/api",
	username: "7f240490-e244-45a2-90b4-8a3e11f13089",
	password: "6iJSZ7uIBYk5",
	version_date: "2016-05-19"
});

router.post("/watson/tone", function(req, res, next) {
	let feel = req.body.feel;
	let key = req.body.key;
	key = generateKey(key);
	console.log(key);
	if (!feel) feel = "random";
	tone_analyzer.tone(
		{
			text: feel
		},
		function(err, tone) {
			if (err) console.log(err);
			else {
				let tonePoint = generateTonePoint(tone);
				let firstChord = generateFirstChord(tonePoint);
				generateChordProgression(
					firstChord,
					tonePoint,
					key
				).then(progression => {
					console.log(progression);
					let response = {};
					response.progression = progression;
					response.notes = getChordNotes(progression);
					response.key = key;
					res.send(response);
				});
			}
		}
	);
});

function authorizeHookTheory() {
	return axios
		.post(HOOK_THEORY + AUTH, {
			username: USERNAME,
			password: PASSWORD
		})
		.then(res => {
			authKey = res.data.activkey;
		})
		.catch(err => {
			console.log(err);
		});
}

function generateKey(key) {
	if (key === "random") {
		key = keys[Math.floor(Math.random() * keys.length)];
	}
	return key;
}

function cleanProgression(progression, key) {
	console.log(progression);
	let romanized = romanizeProgression(progression);
	console.log(romanized);
	let cleanedProgression = tonalProgression.concrete(romanized, key);
	return cleanedProgression;
}

function euclideanDistance(point1, point2) {
	if (point1.length != point2.length) return -1;
	var euclideanDistance = 0;
	for (var i = 0; i < point1.length; i++) {
		euclideanDistance += Math.pow(point1[i] - point2[i], 2);
	}
	euclideanDistance = Math.sqrt(euclideanDistance);
	return euclideanDistance;
}

function generateTonePoint(tone) {
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
}

function determineScale(tonePoint) {
	var distances = [];
	for (var index in scales) {
		let scale = scales[index];
		//overly convoluted way of getting the object
		let scalePoint = scales[index][Object.keys(scales[index])[0]];
		distances.push(euclideanDistance(tonePoint, scalePoint));
	}
	let minDistance = Math.min(...distances);
	let scaleIndex = distances.indexOf(minDistance);
	let determinedScale = scales[scaleIndex];
	let scale = Object.keys(determinedScale)[0];
	return scale;
}

function generateFirstChord(tonePoint) {
	var distances = [];
	for (var key in chords) {
		let chordPoint = chords[key].tone;
		distances.push(euclideanDistance(tonePoint, chordPoint));
	}
	let minDistance = Math.min(...distances);
	let chordIndex = distances.indexOf(minDistance);
	//let generatedChord = chords[key].name;
	let ids = chords[chordIndex].ids;
	let randomIndex = Math.floor(Math.random() * ids.length);
	let generatedChord = ids[randomIndex];
	return generatedChord;
}

function generateChordProgression(firstChord, originalTone, key) {
	let chordProgression = [firstChord];
	currentURL = TRENDS + firstChord;
	let promise = new Promise((resolve, reject) => {
		asyncLoop({
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
}

function generateNextChord(
	chordProgression,
	currentURL,
	originalTone,
	loop,
	i
) {
	axios
		.get(HOOK_THEORY + currentURL, {
			headers: {
				Authorization: "Bearer " + authKey
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
							euclideanDistance(chordTone, originalTone)
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
				let indicies = findAllIndices(distances, currentDistance);
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
			loop();
		})
		.catch(err => {
			console.log(err.data);
		});
}

function romanizeProgression(progression) {
	var roman = "";
	for (var index in progression) {
		let chord = progression[index];
		let romanChord = chordConversions[chord];
		//console.log(tonalProgression.parseRomanChord(romanChord));
		roman += romanChord + " ";
	}
	return roman.trim();
}

function getChordNotes(progression) {
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
}

function voiceChord(chordNotes) {
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
}

function asyncLoop(o) {
	var i = -1;

	var loop = function() {
		i++;
		if (i == o.length) {
			o.callback();
			return;
		}
		o.functionToLoop(loop, i);
	};
	loop(); //init
}

function findAllIndices(arr, elem) {
	var indices = [];
	var idx = arr.indexOf(elem);
	while (idx != -1) {
		indices.push(idx);
		idx = arr.indexOf(elem, idx + 1);
	}
	return indices;
}

authorizeHookTheory();

module.exports = router;
