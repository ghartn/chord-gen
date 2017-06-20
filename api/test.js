var scales = require("./scales");

function main() {
	let tone = {
		document_tone: {
			tone_categories: [
				{
					tones: [
						{
							score: 0.088655,
							tone_id: "anger",
							tone_name: "Anger"
						},
						{
							score: 0.073668,
							tone_id: "disgust",
							tone_name: "Disgust"
						},
						{
							score: 0.179802,
							tone_id: "fear",
							tone_name: "Fear"
						},
						{
							score: 0.276571,
							tone_id: "joy",
							tone_name: "Joy"
						},
						{
							score: 0.325982,
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
							score: 0.284673,
							tone_id: "openness_big5",
							tone_name: "Openness"
						},
						{
							score: 0.153895,
							tone_id: "conscientiousness_big5",
							tone_name: "Conscientiousness"
						},
						{
							score: 0.103424,
							tone_id: "extraversion_big5",
							tone_name: "Extraversion"
						},
						{
							score: 0.894485,
							tone_id: "agreeableness_big5",
							tone_name: "Agreeableness"
						},
						{
							score: 0.005693,
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
	let tonePoint = cleanTone(tone);
	let generatedScale = determineScale(tonePoint);
	console.log(generatedScale);
}



main();