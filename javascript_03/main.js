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

let log = document.getElementById('log')
let name = prompt('What is your name?'); //asking user for a name

// Funkcjonalności:

// 3. Wyświetlenie na mapie markera w postaci własnego avatara w geolokalizacji użytkownika.

// 5. Spięcie własnego markera z udostępnionym (dane poniżej) serwerem Websocket w celu utworzenia gry w gonienie się po mapie (można przetestować z np. dwóch przeglądarek). 
// 6. Opracowanie protokołu komunikacji filtrującego niechciane komunikaty (np. od innej aplikacji korzystającej z tego samego serwera) - np. prywatne mapy.

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

function moveMarker(key) {
    let lat = marker.getPosition().lat();
    let lng = marker.getPosition().lng();
    let bounds = map.getBounds();


    switch (key.code) {
        case 'ArrowUp':
            lat += 0.01;
            sendPosition();
            break;
        case 'ArrowDown':
            lat -= 0.01;
            sendPosition();
            break;
        case 'ArrowRight':
            lng += 0.01;
            sendPosition();
            break;
        case 'ArrowLeft':
            lng -= 0.01;
            sendPosition();
            break;
        default:
            break;
    }
    console.log("lat:" + lat);
    console.log("lng" + lng);
   // console.log("maplng" + map.center.lng());
    marker.setPosition({ lat, lng });


    moveData = {
        type: "cordsData",

        lat: lat,
        lng: lng,
        id: name
    }
    
}


//websocket part


sock.onopen = function(e){
    sock.send(JSON.stringify({
        type: "name",           //what do we want to send
        data: name              //value of what we send
    }));
};


sock.onmessage = function(event){
    console.log(event);
    let json = JSON.parse(event.data);
    if(json.type == "chat"){
        console.log(json.type);
        log.innerHTML += json.name + ": " + json.data +"<br>";
    }

    else if(json.type == "cordsData"){
        console.log(json.type + " " + json.id + " " + json.lat +" " + json.lng)
    }
};


document.querySelector('button').onclick = function(){
    var text = document.getElementById('text').value;
    sock.send(JSON.stringify({
        type: "chat",
        data: text
    }));
    log.innerHTML += "You: " + text + "<br>";
};

refreshFrequency = 100;
function sendPosition(){
    setTimeout(sendPosition, refreshFrequency);
    if(moveData)
        sock.send(JSON.stringify(moveData));
}


// Adds a marker to the map and pushes it into markers array
function addNewMarkers(latNew, lngNew, playerName) {
  var marker = new google.maps.Marker({
    position: { lat: latNew, lng: lngNew },
    map: map,
    icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    label: playerName
  });
  markers.push(marker);
}
