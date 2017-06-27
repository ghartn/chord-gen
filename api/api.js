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
var tonalProgression = require('tonal-progression')
var tonalChord = require('tonal-chord');

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
	url: "https://gateway.watsonplatform.net/tone-analyzer/api",
	username: "7f240490-e244-45a2-90b4-8a3e11f13089",
	password: "6iJSZ7uIBYk5",
	version_date: "2016-05-19"
});

router.post("/watson/tone", function(req, res, next) {
	var feel = req.body.feel;
	var key = req.body.key;
	if (!feel) feel = "";
	tone_analyzer.tone(
		{
			text: feel
		},
		function(err, tone) {
			if (err) console.log(err);
			else {
				let tonePoint = generateTonePoint(tone);
				let firstChord = generateFirstChord(tonePoint);
				let chordProgession = generateChordProgression(
					firstChord,
					tonePoint,
					function(progression) {
						if(progression.length > 3) cleanProgression(progression, key)
					}
				);
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

function cleanProgression(progression, key) {
	console.log(progression);
	let romanized = romanizeProgression(progression);
	console.log(romanized);
	if(key === 'random') {
		let key = keys[Math.floor(Math.random() * keys.length)]
	}
	let cleanedProgression = tonalProgression.concrete(romanized, key);
	console.log(cleanedProgression);
}

authorizeHookTheory();

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

function generateChordProgression(firstChord, originalTone, callback) {
	let chordProgression = [firstChord];
	let currentURL = TRENDS + firstChord;
	//we have one chord, loop for the three next chords
	for (let i = 0; i < 3; i++) {
		axios
			.get(HOOK_THEORY + currentURL, {
				headers: {
					Authorization: "Bearer " + authKey
				}
			})
			.then(res => {
				let response = res.data;
				let distances = [];
				//go through every chord from the hooktheory response
				for (var key in response) {
					let currentChord = response[key];
					let currentID = currentChord.chord_ID;
					//with the chord id, find the chord from our objects that matches and calculate tone distance
					for (var chord in chords) {
						let ids = chords[chord].ids;
						if (ids.find(id => id === currentID)) {
							//we know the IDS are unique, so if this returns anything but undefined we have the chord and tone
							if (chordProgression.find(id => id === currentID))
								break; //the chord progression already contains this chord, break
							let chordTone = chords[chord].tone;
							distances.push(
								euclideanDistance(chordTone, originalTone)
							);
						}
					}
				}
				let minDistance = Math.min(...distances);
				let chordIndex = distances.indexOf(minDistance);
				let generatedChordID = response[chordIndex].chord_ID;
				chordProgression.push(generatedChordID);
				currentURL += "," + generatedChordID;
				callback(chordProgression);
			})
			.catch(err => {
				console.log(err);
			});
	}
}

function romanizeProgression(progression) {
	var roman = "";
	for (var index in progression) {
		let chord = progression[index];
		let romanChord = chordConversions[chord];
		//console.log(romanChord + ": " + tonalChord.isKnownChord(romanChord))
		console.log(tonalProgression.parseRomanChord(romanChord))
		roman += romanChord + " ";
	}
	return roman.trim();
}

module.exports = router;
