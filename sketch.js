let myMap;
let canvas;
let myLat;
let myLng;
var timetaken = 1;
var punkter = [];
var playing = false;
var closest = null;
let refreshRate =60;
let json;
let won = false;
let whilePlaying = [];
const mappa = new Mappa('Leaflet');
const options = {
  lat: 55.6532171,
  lng: 12.1412066,
  zoom: 12,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}
class Punkt{
  constructor(navn,y,x) {this.navn = navn; this.y = x; this.x = y; }
}
function preload() {
  let url ='punkter.geojson';
  json = loadJSON(url);
}

function setup(){
  if(getPlatformType() == 0){
    refreshRate = 1;
  } else if (getPlatformType() == 1){
    refreshRate = 15;
  } else if (getPlatformType() == 2){
    refreshRate = 30;
  }
  //refreshRate = 60;
  console.log("Running refreshRate: " + refreshRate)
  for(var data in json.features){
    var coords = json.features[data].geometry.coordinates;
    var name = json.features[data].properties.name;
    punkter.push(new Punkt(name,coords[0],coords[1]));
  }
  canvas = createCanvas(640,640).parent("#kort");
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas) 
  fill(200, 100, 100);
  navigator.geolocation.getCurrentPosition(setPos);
}

function draw(){
  //refreshRate
  if (frameCount % refreshRate == 0){
      navigator.geolocation.getCurrentPosition(setPos);
  }
}

function setPos(position) {
  //slet when done
  let mousePos = myMap.pixelToLatLng(mouseX, mouseY);
  //console.log(mousePos);
  myLat = mousePos.lat;
  myLng = mousePos.lng;

  //myLat = position.coords.latitude;
  //myLng = position.coords.longitude;
  if(!playing){
    closest = punkter[getClosest(myLat,myLng,punkter)];
    // det er omvendt fordi idk, noget gik galt i matrixen
    closest = myMap.latLngToPixel(closest.y, closest.x);
  } else if (playing){
    closest = whilePlaying[getClosest(myLat,myLng,whilePlaying)];
    // det er omvendt fordi idk, noget gik galt i matrixen
    closest = myMap.latLngToPixel(closest.y, closest.x);
  }
  myMap.onChange(drawGraphics);
}
function getClosest(lat,lng,pList){
  var closestPunkt = null;
  var closestDist = null;
  for (var i = 0; i < pList.length; i++) {
    var p = pList[i];
    //console.log(closestDist);
    if(dist(lat,lng,p.y,p.x) < closestDist || closestPunkt == null){
      closestDist = dist(lat,lng,p.y,p.x);
      if (closestDist < 0.0002){
        if(!playing){
            playing = true;
            console.log("Starting game in: ...");
            let newArray = pList;
            newArray = pList.splice(i,1);
            console.log(newArray,pList);
            whilePlaying = pList;
            enCountDown();
          } else {
            won = true;
            //playing = false;
          }
        }
        closestPunkt = i;
      }
      //console.log(closestPunkt,closestDist);
    }
    //console.log(closestDist);
   //console.log(lat,lng,punkter[0].x,punkter[0].y);
  //var distance = dist(lat,lng,punkter[0].x,punkter[0].y);
  return closestPunkt;
}
function drawGraphics(){
  clear();
  const her = myMap.latLngToPixel(myLat, myLng);
  line(closest.x,closest.y,her.x,her.y);
  for (var i = 0; i < punkter.length; i++) {
    fill(0,255,0);
    var punkt = myMap.latLngToPixel(punkter[i].y, punkter[i].x);
    ellipse(punkt.x,punkt.y,5,5);
  }
  fill(0,0,255);
  ellipse(her.x, her.y, 10, 10);
}
