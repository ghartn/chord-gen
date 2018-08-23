let express = require("express");
let router = express.Router();
let axios = require("axios");
let authKey = null;
let MidiWriter = require("midi-writer-js");
let theory = require("./theory");
let credentials = require("./credentials");
let urls = require("./urls");

let ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

let tone_analyzer = new ToneAnalyzerV3({
	url: urls.WATSON,
	username: credentials.WATSON_USERNAME,
	password: credentials.WATSON_PASSWORD,
	version_date: "2016-05-19"
});

router.post("/generate", function(req, res, next) {
	let feel = req.body.feel;
	let key = req.body.key;
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
				key = theory.generateKey(key, tonePoint);
				theory
					.generateChordProgression(firstChord, tonePoint, key)
					.then(progression => {
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

	track.setTempo(bpm);

	track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

	track.addEvent(
		[
			new MidiWriter.NoteEvent({ pitch: notes[0], duration: "4" }),
			new MidiWriter.NoteEvent({ pitch: notes[1], duration: "4" }),
			new MidiWriter.NoteEvent({ pitch: notes[2], duration: "4" }),
			new MidiWriter.NoteEvent({ pitch: notes[3], duration: "4" })
		],
		function(event, index) {
			return { sequential: true };
		}
	);
	// Generate a data URI
	var write = new MidiWriter.Writer([track]);
	//write.saveMIDI('generated-midi-' + new Date().toDateString());
	res.send(write.dataUri());
});

function authorizeHookTheory() {
	return axios
		.post(urls.HOOK_THEORY + urls.AUTH, {
			username: credentials.HOOK_USERNAME,
			password: credentials.HOOK_PASSWORD
		})
		.then(res => {
			credentials.authKey = res.data.activkey;
		})
		.catch(err => {
			console.log(err);
		});
}

authorizeHookTheory();

module.exports = router;
