var express = require("express");
var router = express.Router();
var axios = require("axios");
var authKey = null;
var MidiWriter = require("midi-writer-js");
var theory = require("./theory");
var api = require("./credentials");

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
	url: api.WATSON,
	username: api.WATSON_USERNAME,
	password: api.WATSON_PASSWORD,
	version_date: "2016-05-19"
});

router.post("/generate", function(req, res, next) {
	let feel = req.body.feel;
	var key = req.body.key;
	key = theory.generateKey(key);
	if (!feel) feel = "random";
	tone_analyzer.tone(
		{
			text: feel
		},
		function(err, tone) {
			if (err) console.log(err);
			else {
				console.log(key);
				let tonePoint = theory.generateTonePoint(tone);
				let firstChord = theory.generateFirstChord(tonePoint);
				theory.generateChordProgression(
					firstChord,
					tonePoint,
					key
				).then(progression => {
					console.log(progression);
					let response = {};
					response.progression = progression;
					response.notes = theory.getChordNotes(progression);
					response.key = key;
					res.send(response);
				});
			}
		}
	);
});

router.post("/midi", function(req, res, next) {
	let notes = req.body.notes;
	let bpm = req.body.bpm;

	var track = new MidiWriter.Track();

	track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

	// Add some notes:
	for (var i in notes) {
		var note = new MidiWriter.NoteEvent({
			pitch: notes[i],
			duration: "4",
			//wait: i * 4
		});
		track.addEvent(note);
	}
	// Generate a data URI
	var write = new MidiWriter.Writer([track]);
	//write.saveMIDI('generated-midi-' + new Date().toDateString());
	res.send(write.dataUri());
});

function authorizeHookTheory() {
	return axios
		.post(api.HOOK_THEORY + api.AUTH, {
			username: api.HOOK_USERNAME,
			password: api.HOOK_PASSWORD
		})
		.then(res => {
			api.authKey = res.data.activkey;
		})
		.catch(err => {
			console.log(err);
		});
}

authorizeHookTheory();

module.exports = router;
