var express = require("express");
var router = express.Router();
var scales = require("./scales");

var ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

var tone_analyzer = new ToneAnalyzerV3({
	url: "https://gateway.watsonplatform.net/tone-analyzer/api",
	username: "7f240490-e244-45a2-90b4-8a3e11f13089",
	password: "6iJSZ7uIBYk5",
	version_date: "2016-05-19"
});

router.post("/watson/tone", function(req, res, next) {
	var feel = req.body.feel;
	if (!feel) feel = "";
	tone_analyzer.tone(
		{
			text: feel
		},
		function(err, tone) {
			if (err) console.log(err);
			else {
				let tonePoint = generateTonePoint(tone);
				let scale = determineScale(tonePoint);
				res.send(scale);
			}
		}
	);
});

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

module.exports = router;
