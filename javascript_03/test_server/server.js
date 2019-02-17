const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function (ws) {
  console.log('Client connected');
  ws.on('message', function(message) {

    message = JSON.parse(message);
    if(message.type == "name"){
        ws.personName =  message.data;
        return;
      }

    if(message.type == "chat"){      
      wss.clients.forEach(function e(client){
        if(client != ws)
              client.send(JSON.stringify({
                type: "chat",
                name: ws.personName,
                data: message.data
              }
          ));
      });
    }
    else if(message.type == "cordsData"){
      //console.log(message.type + message.lat + message.lng + message.id);
      wss.clients.forEach(function e(client){
        if(client != ws)
              client.send(JSON.stringify({
                type: "cordsData",
                id: ws.personName,
                lat: message.lat,
                lng: message.lng
              }
          ));
      });
    }

  });

  ws.on('close', function () {
    console.log("I lost a client");
   //
  });
  
});