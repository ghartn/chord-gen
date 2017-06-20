//defined scales with a point of the tone that they provide via tone analyzer
//[anger, disgust, fear, joy, sadness]
//definitely need to include all metrics (conversational tone, etc)
var scales = [
	{
		Major: [
			0.023035,
			0.007103,
			0.02285,
			0.796897,
			0.108979,
			0,
			0,
			0.88939,
			0.515412,
			0.187892,
			0.692871,
			0.719084,
			0.026994
		]
	},
	{
		Dorian: [
			0.05634,
			0.116932,
			0.082693,
			0.233865,
			0.104754,
			0,
			0,
			0,
			0.347322,
			0.274389,
			0.544005,
			0.599467,
			0.283982
		]
	},
	{
		Phrygian: [
			0.236902,
			0.029163,
			0.229386,
			0.151603,
			0.186633,
			0.772284,
			0,
			0,
			0.523868,
			0.270494,
			0.55206,
			0.594098,
			0.103713
		]
	},
	{
		Lydian: [
			0.088794,
			0.072431,
			0.087539,
			0.157996,
			0.137363,
			0,
			0,
			0,
			0.559959,
			0.273626,
			0.550509,
			0.600815,
			0.213737
		]
	},
	{
		Mixolydian: [
			0.035536,
			0.039817,
			0.078044,
			0.745004,
			0.063599,
			0.144719,
			0,
			0,
			0.730823,
			0.232718,
			0.669386,
			0.596518,
			0.348531
		]
	},
	{
		Minor: [
			0.029871,
			0.1876,
			0.111788,
			0.001751,
			0.987435,
			0,
			0,
			0.994704,
			0.444793,
			0.123048,
			0.429357,
			0.612557,
			0.019919
		]
	},
	{
		Locrian: [
			0.024131,
			0.037832,
			0.735469,
			0.007032,
			0.317738,
			0.49039,
			0.961633,
			0,
			0.639903,
			0.242796,
			0.50831,
			0.617186,
			0.004968
		]
	}
];

module.exports = scales;