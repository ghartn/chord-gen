var axios = require("axios");
var theory = require("./theory");
var api = require("./credentials");

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
	url: api.WATSON,
	username: api.WATSON_USERNAME,
	password: api.WATSON_PASSWORD,
	version_date: "2016-05-19"
});

function main() {
	let feel = "who am i";
	var key = "E";
	tone_analyzer.tone(
		{
			text: feel
		},
		function(err, tone) {
			console.log(key);
			if (err) console.log(err);
			else {
				let tonePoint = theory.generateTonePoint(tone);
				let firstChord = theory.generateFirstChord(tonePoint);
				theory.generateChordProgression(
					firstChord,
					tonePoint,
					key
				).then(progression => {
					console.log(progression);
					let chordNotes = theory.getChordNotes(progression);
				});
			}
		}
	);
}

function authorizeHookTheory() {
	return axios
		.post(api.HOOK_THEORY + api.AUTH, {
			username: api.HOOK_USERNAME,
			password: api.HOOK_PASSWORD
		})
		.then(res => {
			api.authKey = res.data.activkey;
			main();
		})
		.catch(err => {
			console.log(err);
		});
}

theory.test();

//authorizeHookTheory();