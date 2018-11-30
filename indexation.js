//Build an hashmap that contains faces neighbors of each face.
//Credit : https://stackoverflow.com/questions/33073136/given-a-mesh-face-find-its-neighboring-faces
function facesNeighbors(vertexToFace, geometryMesh){
	for (var fx = 0; fx < geometryMesh.faces.length; fx++) {
		vertexToFace[fx] = new Array();
	}
	for (var fx = 0; fx < geometryMesh.faces.length; fx++) {
		var f = geometryMesh.faces[fx];
		var ax = f.a;
		var bx = f.b;
		var cx = f.c;

		vertexToFace[ax].push(fx);
		vertexToFace[bx].push(fx);
		vertexToFace[cx].push(fx);
	}
}

function buildFaceInfo(n, geometryMesh, vertexToFace/*, p*/){
	var v1 = geometryMesh.vertices[geometryMesh.faces[n].a];
	var v2 = geometryMesh.vertices[geometryMesh.faces[n].b];
	var v3 = geometryMesh.vertices[geometryMesh.faces[n].c];
	var faceinfo = {
		//Face centroid
		centerX : (v1.x + v2.x + v3.x) / 3,
		centerY : (v1.y + v2.y + v3.y) / 3,
		centerZ : (v1.z + v2.z + v3.z) / 3,
		//Data for A* Algorithm
		//cout : 0,
		faceId : n,
		//parentObj : p,
		neighbors : [
			vertexToFace[geometryMesh.faces[n].a], 
			vertexToFace[geometryMesh.faces[n].b], 
			vertexToFace[geometryMesh.faces[n].c]
		]
	};
	return faceinfo;
}

function draw_outline(facestart, faceend, geometryMesh, outline){
	var maxDiff, currDiff, nextFace;
	for(var i = 0; i < facestart.neighbors.length; i++){
		for(var j = 0; j < facestart.neighbors[i].length; j++){
			if(facestart.neighbors[i][j] == faceend.faceId) return;
		}
	}
	//Compute distance between facestart and faceend
	var distX = faceend.centerX - facestart.centerX;
	var distY = faceend.centerY - facestart.centerY;
	var distZ = faceend.centerZ - facestart.centerZ;
	var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2) + Math.pow(distZ, 2));
	for(var i = 0; i < facestart.neighbors.length; i++){
		for(var j = 0; j < facestart.neighbors[i].length; j++){
			var faceinfo = buildFaceInfo(facestart.neighbors[i][j], geometryMesh, vertexToFace);
			//Compute distance between neighbor of facestart and faceend
			var distneighX = faceend.centerX - faceinfo.centerX;
			var distneighY = faceend.centerY - faceinfo.centerY;
			var distneighZ = faceend.centerZ - faceinfo.centerZ;
			var distneigh = Math.sqrt(Math.pow(distneighX, 2) + Math.pow(distneighY, 2) + Math.pow(distneighZ, 2));
			currDiff = dist - distneigh;
			//If facestart neighbor's centroid is the nearest one of faceend's centroid (for now)
			if(maxDiff == undefined || maxDiff < currDiff){
				if(outline.indexOf(faceinfo.faceId) == -1){
					maxDiff = currDiff;
					nextFace = faceinfo;
				}
			}
		}
	}
	//Elected face is selected, we call this function again with this face
	//instead of facestart as first parameter.
	geometryMesh.faces[nextFace.faceId].color.setRGB(0,1,0);
	outline[outline.length] = nextFace.faceId;
	draw_outline(nextFace, faceend, geometryMesh, outline);
}

function getOutlineCenterFace(lastface, firstface, geometryMesh, vertexToFace){
	var currMinDist, oldMinDist, minDist, centerFace = lastface, bestneigh;
	//Compute center of right between faces parameters' centroids
	var cX = (lastface.centerX + firstface.centerX) / 2;
	var cY = (lastface.centerY + firstface.centerY) / 2;
	var cZ = (lastface.centerZ + firstface.centerZ) / 2;
	//Compute distance between lastface and center of right.
	var distX = cX - lastface.centerX;
	var distY = cY - lastface.centerY;
	var distZ = cZ - lastface.centerZ;
	var dist = (Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2) + Math.pow(distZ, 2)));
	currMinDist = dist;
	oldMinDist = dist + 1;
	//Search for a face which its centroid is the nearest point from the outline center
	//(Stop when distance increases, that is to say when last distance computed > distance computed
	//before this one).
	while(currMinDist < oldMinDist){
		for(var i = 0; i < centerFace.neighbors.length; i++){
			for(var j = 0; j < centerFace.neighbors[i].length; j++){
				var faceinfo = buildFaceInfo(centerFace.neighbors[i][j], geometryMesh, vertexToFace);
				//Compute distance between neighbor of current centerFace and center of right.
				var distneighX = cX - faceinfo.centerX;
				var distneighY = cY - faceinfo.centerY;
				var distneighZ = cZ - faceinfo.centerZ;
				var distneigh = (Math.sqrt(Math.pow(distneighX, 2) + Math.pow(distneighY, 2) + Math.pow(distneighZ, 2)));
				//If facestart neighbor's centroid is the nearest one of center of right (for now)
				if(minDist == undefined || minDist > distneigh){
					if(faceinfo.faceId != centerFace.faceId){
						minDist = distneigh;
						bestneigh = faceinfo;
					}
				}
			}
		}
		centerFace = bestneigh;
		oldMinDist = currMinDist;
		currMinDist = minDist;
		minDist = undefined;
		bestneigh = undefined;
	}
	return centerFace;
}

function spreadCheckedColor(face, insidetab, geometryMesh, outline, vertexToFace){
	var outlineReached = false;
	var currFace = face;
	for(var i = 0; i < currFace.neighbors.length; i++){
		for(var j = 0; j < currFace.neighbors[i].length; j++){
			var faceinfo = buildFaceInfo(currFace.neighbors[i][j], geometryMesh, vertexToFace);
			//Check if this neighbor belongs to the outline
			if(outline.indexOf(faceinfo.faceId) != -1){
				geometryMesh.faces[currFace.faceId].color.setRGB(0, 1, 0);
				return;
			}
		}
	}
	for(var i = 0; i < currFace.neighbors.length; i++){
		for(var j = 0; j < currFace.neighbors[i].length; j++){
			var faceinfo = buildFaceInfo(currFace.neighbors[i][j], geometryMesh, vertexToFace);
			var color = geometryMesh.faces[faceinfo.faceId].color;
			if(insidetab.indexOf(faceinfo.faceId) == -1){
				geometryMesh.faces[faceinfo.faceId].color.setRGB(0, 1, 0);
				insidetab[insidetab.length] = faceinfo.faceId;
				spreadCheckedColor(faceinfo, insidetab, geometryMesh, outline, vertexToFace);
			}
		}
	}
}

function fill_outline(lastface, firstface, geometryMesh, outline, vertexToFace){
	var inside = new Array();
	var centerFace = getOutlineCenterFace(lastface, firstface, geometryMesh, vertexToFace);
	spreadCheckedColor(centerFace, inside, geometryMesh, outline, vertexToFace);
	outline = outline.concat(inside);
	return outline;
}

//NOT USED ANYMORE (PERFORMANCE ISSUES)

//Path-finding algorithm between two faces.
//Pseudo-code here : https://fr.wikipedia.org/wiki/Algorithme_A*
/*function astar_algorithm(ptstart, ptend, costlimit){
	var closedList = new Array();
	var openList = new Array();
	openList.push(ptstart);
	while(openList.length != 0){
		//openList is a priority queue, extract object with min heuristic first.
		var u = openList.shift();
		if(u.faceId == ptend.faceId){
			//Reconstitution chemin, qui débute par le dernier
			//élément de la liste fermée.
			console.log("A* algorithm finished successfully, recover path ...");
			var parentc = closedList[closedList.length - 1].parentObj;
			//On colore les faces par ascendence.
			while(parentc != undefined){
				geometryMesh.faces[parentc.faceId].color.setRGB(0,1,0);
				outline[outline.length] = parentc.faceId;
				parentc = parentc.parentObj;
			}
			geometryMesh.colorsNeedUpdate = true;
			return;
		}
		for(var i = 0; i < u.neighbors.length; i++){
			for(var j = 0; j < u.neighbors[i].length; j++){
				var n = u.neighbors[i][j];
				var faceinfo;
				var ok = true;
				if(u.cout + 1 > costlimit){
					ok = false;
				}
				if(ok && findWithAttribute(closedList, 'faceId', n) != -1){
					if(closedList[findWithAttribute(closedList, 'faceId', n)].cout < u.cout + 1){
						ok = false;
					}
				} 
				if(ok && findWithAttribute(openList, 'faceId', n) != -1){
					if(openList[findWithAttribute(openList, 'faceId', n)].cout < u.cout + 1){
						ok = false;
					}
				}
				if(ok){
					faceinfo = buildFaceInfo(n, geometryMesh, vertexToFace, u);
					faceinfo.cout = u.cout + 1;
					openList.push(faceinfo);
				}
			}
		}
		closedList.push(u);
	}
	console.log("End of A* Algorithm, no path found.");
}*/