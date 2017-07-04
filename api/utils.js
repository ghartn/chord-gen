module.exports.asyncLoop = function(o) {
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
};

module.exports.findAllIndices = function(arr, elem) {
	var indices = [];
	var idx = arr.indexOf(elem);
	while (idx != -1) {
		indices.push(idx);
		idx = arr.indexOf(elem, idx + 1);
	}
	return indices;
};

module.exports.euclideanDistance = function(point1, point2) {
	if (point1.length != point2.length) return -1;
	var euclideanDistance = 0;
	for (var i = 0; i < point1.length; i++) {
		euclideanDistance += Math.pow(point1[i] - point2[i], 2);
	}
	euclideanDistance = Math.sqrt(euclideanDistance);
	return euclideanDistance;
};
