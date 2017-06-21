var scales = require("./scales");
var chords = require("./chords");

function main() {
	let tone = {
		document_tone: {
			tone_categories: [
				{
					tones: [
						{
							score: 0.067271,
							tone_id: "anger",
							tone_name: "Anger"
						},
						{
							score: 0.052218,
							tone_id: "disgust",
							tone_name: "Disgust"
						},
						{
							score: 0.144031,
							tone_id: "fear",
							tone_name: "Fear"
						},
						{
							score: 0.367503,
							tone_id: "joy",
							tone_name: "Joy"
						},
						{
							score: 0.37734,
							tone_id: "sadness",
							tone_name: "Sadness"
						}
					],
					category_id: "emotion_tone",
					category_name: "Emotion Tone"
				},
				{
					tones: [
						{
							score: 0.620279,
							tone_id: "analytical",
							tone_name: "Analytical"
						},
						{
							score: 0,
							tone_id: "confident",
							tone_name: "Confident"
						},
						{
							score: 0.994446,
							tone_id: "tentative",
							tone_name: "Tentative"
						}
					],
					category_id: "language_tone",
					category_name: "Language Tone"
				},
				{
					tones: [
						{
							score: 0.142912,
							tone_id: "openness_big5",
							tone_name: "Openness"
						},
						{
							score: 0.135114,
							tone_id: "conscientiousness_big5",
							tone_name: "Conscientiousness"
						},
						{
							score: 0.047882,
							tone_id: "extraversion_big5",
							tone_name: "Extraversion"
						},
						{
							score: 0.893164,
							tone_id: "agreeableness_big5",
							tone_name: "Agreeableness"
						},
						{
							score: 0.004524,
							tone_id: "emotional_range_big5",
							tone_name: "Emotional Range"
						}
					],
					category_id: "social_tone",
					category_name: "Social Tone"
				}
			]
		}
	};
	let tonePoint = generateTonePoint(tone);
	let chord = generateChord(tonePoint);
  console.log(chord);
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

function generateChord(tonePoint) {
	var distances = [];
  var keys = [];
  for(var key in chords) {
    let chordPoint = chords[key];
    keys.push(key);
    distances.push(euclideanDistance(tonePoint, chordPoint));
  }
	let minDistance = Math.min(...distances);
	let chordIndex = distances.indexOf(minDistance);
	let generatedChord = keys[chordIndex];
  return generatedChord;
}

main();
