var keyNames = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];

var keyFeels = [
	{
		tonic: "C",
		type: "Major",
		tone: [
			0.124039,
			0.063529,
			0.005472,
			0.47084,
			0.264453,
			0.117548,
			0.99091,
			0,
			0.954199,
			0.107757,
			0.389172,
			0.653944,
			0.009799
		]
	},
	{
		tonic: "C",
		type: "Minor",
		tone: [
			0.059768,
			0.006639,
			0.030289,
			0.768347,
			0.147141,
			0.952399,
			0.922197,
			0,
			0.834487,
			0.122659,
			0.298568,
			0.720353,
			0.004129
		]
	},
	{
		tonic: "C#",
		type: "Major",
		tone: [
			0.029391,
			0.006599,
			0.024393,
			0.227898,
			0.738984,
			0.7496,
			0,
			0,
			0.67206,
			0.002737,
			0.000047,
			0.765967,
			0.000001
		]
	},
	{
		tonic: "C#",
		type: "Minor",
		tone: [
			0.032031,
			0.003104,
			0.005405,
			0.618525,
			0.349837,
			0,
			0,
			0,
			0.791013,
			0.019213,
			0.838081,
			0.920036,
			0.000919
		]
	},
	{
		tonic: "D",
		type: "Major",
		tone: [
			0.035207,
			0.001624,
			0.025656,
			0.583764,
			0.363917,
			0.674485,
			0,
			0,
			0.800668,
			0.384115,
			0.109381,
			0.387494,
			0.25095
		]
	},
	{
		tonic: "D",
		type: "Minor",
		tone: [
			0.088794,
			0.072431,
			0.087539,
			0.157996,
			0.137363,
			0,
			0,
			0,
			0.473152,
			0.148077,
			0.349872,
			0.025952,
			0.019755
		]
	},
	{
		tonic: "D#",
		type: "Major",
		tone: [
			0.050013,
			0.004555,
			0.017079,
			0.867391,
			0.054005,
			0.065036,
			0,
			0,
			0.886386,
			0.355868,
			0.666719,
			0.698987,
			0.253405
		]
	},
	{
		tonic: "D#",
		type: "Minor",
		tone: [
			0.031603,
			0.005618,
			0.885375,
			0.01007,
			0.173235,
			0.354894,
			0,
			0.795534,
			0.920532,
			0.037181,
			0.025585,
			0.265608,
			0.003214
		]
	},
	{
		tonic: "E",
		type: "Major",
		tone: [
			0.037849,
			0.023324,
			0.011917,
			0.908051,
			0.007948,
			0,
			0,
			0,
			0.812576,
			0.196896,
			0.387625,
			0.82098,
			0.03402
		]
	},
	{
		tonic: "E",
		type: "Minor",
		tone: [
			0.016026,
			0.002266,
			0.00274,
			0.850763,
			0.107056,
			0.730849,
			0,
			0.069423,
			0.839737,
			0.393931,
			0.076523,
			0.939077,
			0.014391
		]
	},
	{
		tonic: "F",
		type: "Major",
		tone: [
			0.074742,
			0.007242,
			0.16214,
			0.674188,
			0.029312,
			0,
			0,
			0,
			0.362351,
			0.273809,
			0.542373,
			0.596546,
			0.115895
		]
	},
	{
		tonic: "F",
		type: "Minor",
		tone: [
			0.127954,
			0.016158,
			0.041052,
			0.00929,
			0.867261,
			0,
			0,
			0,
			0.949662,
			0.088668,
			0.229236,
			0.570174,
			0.00007
		]
	},
	{
		tonic: "F#",
		type: "Major",
		tone: [
			0.109884,
			0.062037,
			0.085866,
			0.427567,
			0.378961,
			0.147263,
			0.449032,
			0,
			0.935006,
			0.786483,
			0.308177,
			0.197818,
			0.344304
		]
	},
	{
		tonic: "F#",
		type: "Minor",
		tone: [
			0.116375,
			0.079775,
			0.482682,
			0.272161,
			0.186594,
			0.130001,
			0,
			0,
			0.729333,
			0.006809,
			0.400002,
			0.218855,
			0.000633
		]
	},
	{
		tonic: "G",
		type: "Major",
		tone: [
			0.031841,
			0.003819,
			0.005883,
			0.928299,
			0.031316,
			0.594429,
			0.925664,
			0,
			0.948305,
			0.639242,
			0.827844,
			0.857755,
			0.306617
		]
	},
	{
		tonic: "G",
		type: "Minor",
		tone: [
			0.368908,
			0.337129,
			0.12161,
			0.012645,
			0.380031,
			0.74948,
			0,
			0.291123,
			0.488632,
			0,
			0.176165,
			0.00007,
			0.001179
		]
	},
	{
		tonic: "G#",
		type: "Major",
		tone: [
			0.428035,
			0.064006,
			0.120328,
			0.028007,
			0.536251,
			0.821551,
			0,
			0,
			0.913972,
			0.168053,
			0.432756,
			0.567882,
			0.313861
		]
	},
	{
		tonic: "G#",
		type: "Minor",
		tone: [
			0.1049,
			0.006076,
			0.129563,
			0.055167,
			0.815645,
			0.597565,
			0,
			0,
			0.755726,
			0.048436,
			0.02214,
			0.045136,
			0.012276
		]
	},
	{
		tonic: "A",
		type: "Major",
		tone: [
			0.034839,
			0.027013,
			0.035082,
			0.822574,
			0.073153,
			0.528596,
			0,
			0.379998,
			0.82569,
			0.686509,
			0.729955,
			0.987056,
			0.124871
		]
	},
	{
		tonic: "A",
		type: "Minor",
		tone: [
			0.074424,
			0.209156,
			0.007709,
			0.115472,
			0.142191,
			0.182902,
			0,
			0,
			0.958422,
			0.204146,
			0.175152,
			0.181511,
			0.005812
		]
	},
	{
		tonic: "A#",
		type: "Major",
		tone: [
			0.018888,
			0.019356,
			0.016491,
			0.87397,
			0.032072,
			0.522484,
			0,
			0,
			0.492836,
			0.305865,
			0.642508,
			0.821909,
			0.12173
		]
	},
	{
		tonic: "A#",
		type: "Minor",
		tone: [
			0.059607,
			0.353521,
			0.290693,
			0.266945,
			0.163633,
			0.394131,
			0,
			0,
			0.980433,
			0.033788,
			0.340478,
			0.362258,
			0.087685
		]
	},
	{
		tonic: "B",
		type: "Major",
		tone: [
			0.770598,
			0.017634,
			0.00702,
			0.122437,
			0.178531,
			0.010096,
			0.770765,
			0,
			0.995479,
			0.056618,
			0.27176,
			0.3067,
			0.010271
		]
	},
	{
		tonic: "B",
		type: "Minor",
		tone: [
			0.171725,
			0.001972,
			0.294915,
			0.335425,
			0.132964,
			0.156176,
			0,
			0,
			0.987877,
			0.889645,
			0.375978,
			0.596437,
			0.273261
		]
	}
];

module.exports.keyNames = keyNames;
module.exports.keyFeels = keyFeels;