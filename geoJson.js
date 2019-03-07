class GeoJSON {
	constructor(data) {
		this.features = data.features;
		print(this.features);
	}
	vis(map) {
		this.features.forEach(function(elm) {
			let canvasPos = map.latLngToPixel(elm.geometry.coordinates[1], elm.geometry.coordinates[0]);
			ellipse(canvasPos.x, canvasPos.y, 5);
			textAlign(CENTER);
			text(elm.properties.Husnavne, canvasPos.x, canvasPos.y - 10);


		})
	}

	match(map, stekst) {
		stekst = "B"; // kun tol test
		this.features.forEach(function(elm) {
			if (elm.properties.Husnavne.substring(0, stekst.length).toUpperCase() == stekst.toUpperCase()) {
				fill(0, 255, 0);
			}
			//  else {
			//    fill(0, 0, 255);
			// }

			let canvasPos = map.latLngToPixel(elm.geometry.coordinates[1], elm.geometry.coordinates[0]);
			ellipse(canvasPos.x, canvasPos.y, 5);
			textAlign(CENTER);
			text(elm.properties.Husnavne, canvasPos.x, canvasPos.y - 10);


		})
	}


	clickedOn(x, y, map) {
		let navn = "ingen ting her"
		this.features.forEach(function(elm) {
			let canvasPos = map.latLngToPixel(elm.geometry.coordinates[1], elm.geometry.coordinates[0]);
			if (dist(canvasPos.x, canvasPos.y, x, y) < 30) {
				navn = elm.properties.Husnavne
			}
		})
		return navn;
		//............  line(canvasPos.x, canvasPos.y, sidstePos.latitude, sidstePos.longitude);
	} //clickedOn
} //class GeoJSON

let kortStatus = "ikkeKlar";
let statusP; //bruges til at infomere brugeren om status op appen
let geoJSON;
let gpsService;
let sidstePos;


// Create an instance of Leaflet
const mappa = new Mappa('Leaflet');
let myMap;

let canvas

// callback for GeoJSON data
function modtagData(data) {
	statusP.html("modtager data");
	geoJSON = new GeoJSON(data);
}
// opdater prossesing canvas ting
function opdaterKort() {
	clear();
	if (sidstePos) {
		let canvasPos = myMap.latLngToPixel(sidstePos.latitude, sidstePos.longitude);
		fill(0, 0, 255);
		ellipse(canvasPos.x, canvasPos.y, 10);
	}
	if (geoJSON) {
		geoJSON.vis(myMap);
	}
}
//callback når kortet er klart
function kortKlar() {
	kortStatus = "klar";
	myMap.onChange(opdaterKort);
}

// callback når der er GPS data /opret kort
function lavKort(pos) {
	const options = {
		lat: pos.latitude,
		lng: pos.longitude,
		zoom: 17,
		style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
	}
	myMap = mappa.tileMap(options);
	// Overlay the canvas to the new tile map created.
	myMap.overlay(canvas, kortKlar);
}
//callback for GPS data
function positionChanged(pos) {
	statusP.html("vi har GPS data");
	sidstePos = pos;
	if (myMap) {
		opdaterKort();
	} else {
		lavKort(pos);
	}
}

function setup() {
	canvas = createCanvas(640, 640);
	statusP = createP().html("Næsten klar").parent("#infoText");
	// henter geoJSON data
	let rucPunkterURL = "https://skattejagt.github.io/ruc/ruc.geojson"
	loadJSON(rucPunkterURL, modtagData);
	// heter GPS koordinater



	watchOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};
	gpsService = watchPosition(positionChanged, watchOptions)

}

function mouseClicked() {
	//ellipse(mouseX, mouseY, 5, 5);
	if (geoJSON) {
		statusP.html(geoJSON.clickedOn(mouseX, mouseY, myMap))
	}
	// prevent default
	return false;
}

function draw() {


}

function keyPressed() {
	print(keyCode);
	g

}