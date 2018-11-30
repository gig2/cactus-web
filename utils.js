function updateObjectInfo(vertices, faces){
	var obji = document.getElementById('objinfo');
	obji.innerHTML = vertices + " vertices, " + faces + " faces.";
}

var getMousePosition = function (dom, x, y ) {
	var rect = dom.getBoundingClientRect();
	return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
};

function findWithAttribute(array, attr, value){
	for(var i = 0; i < array.length; i += 1) {
		if(array[i][attr] === value) {
			return i;
		}
	}
	return -1;
}