var map;

let data,
url = 'ws://localhost:8080',
sock = new WebSocket(url),
sendMessage,
moveData,
marker,
marker1,
gameName = 'catchme',
refreshFrequency,
players = {},
overlay,
cordsData,
markers = [];

let log = document.getElementById('log');
let btn = document.getElementById('sendbutton');
let name = prompt('What is your name?'); //asking user for a name


// Funkcjonalności:

// 3. Wyświetlenie na mapie markera w postaci własnego avatara w geolokalizacji użytkownika.

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12,
        keyboardShortcuts: false,
        disableDefaultUI: true
    });
    marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: map,
        label: name,
        //icon: img.src,
        animation: google.maps.Animation.DROP
    });  
    getLocalization();
    addKeyboardEvent();
};




//ustawianie nakładki google maps
function setOverlay() {
    overlay = new google.maps.OverlayView();
    if (!overlay) setTimeout(setOverlay, 500);
    else {
        overlay.draw = function () {};
        overlay.setMap(map);
    }
}



function getLocalization() {
    navigator.geolocation.getCurrentPosition(geoOk, geoFail);
}

function geoOk(data) {
    
    let coords = { lat: data.coords.latitude, lng: data.coords.longitude }
    map.setCenter(coords);
    marker.setPosition(coords);
}

function geoFail(err) {
    console.log(err);
}

function addKeyboardEvent() {
    window.addEventListener('keydown', moveMarker);
}

btn.addEventListener('click' , sendText);
//function used
function moveMarker(key) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let bounds = map.getBounds();
    switch (key.code) {
        case 'ArrowUp':
            lat += 0.01;
            break;
        case 'ArrowDown':
            lat -= 0.01;
            break;
        case 'ArrowRight':
            lng += 0.01;
            break;
        case 'ArrowLeft':
            lng -= 0.01;
            break;
        default:
            break;
    }
    marker.setPosition({ lat, lng });
    //array with data to send
    moveData = {
        type: "cordsData",

        lat: lat,
        lng: lng,
        id: name
    }
    sendPosition();
}


//websocket part

//sending username
sock.onopen = function(e){
    sock.send(JSON.stringify({
        type: "name",           //what do we want to send
        data: name              //value of what we send
    }));
};

//handling communication
sock.onmessage = function(event){
    let json = JSON.parse(event.data);
    //handling chat
    if(json.type == "chat"){
        console.log(json.type);
        log.innerHTML += json.name + ": " + json.data +"<br>";
    }
    //handling coordinates
    else if(json.type == "cordsData"){
        if (!players["user" + json.id]) //if user doesnt exist create new marker
            addNewMarkers(json.id , json.id, json.lat ,json.lng);
         else if(players["user" + json.id] ) //if user exists only update his position
            updatePositionOfPlayer(json.id, json.lat, json.lng);
    }
};


refreshFrequency = 300;
function sendPosition(){
    setTimeout(sendPosition, refreshFrequency);
    if(moveData)
        sock.send(JSON.stringify(moveData));
}

// adds a marker to the map and pushes it into markers array
function addNewMarkers(playerID, playerName, latNew, lngNew) {
    players["user" + playerID] = new google.maps.Marker({
    position: { lat: latNew, lng: lngNew },
    map: map,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    label: playerName
  });
  markers.push(marker);
}

//function used to update positionofplayer
function updatePositionOfPlayer(playerID, latUpd, lngUpd){
    players["user" + playerID].setPosition({
        lat: latUpd,
        lng: lngUpd
    });
}

//function used to send text
function sendText(){
    let text = document.getElementById('text');
    console.log(text.value);
    sock.send(JSON.stringify({
        type: "chat",
        data: text.value
    }));
    log.innerHTML += "You: " + text.value + "<br>";
    text.value = '';
}