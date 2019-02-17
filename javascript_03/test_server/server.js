const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function (ws) {
  ws.on('message', function(message) {

    message = JSON.parse(message);

    if(message.type == "name"){
        ws.personName =  message.data;
        return;
    }
    console.log('received: %s', message.data);
    
    wss.clients.forEach(function e(client){
      if(client != ws )
        client.send(JSON.stringify({
          name: ws.personName,
          data: message.data
        }
        ));
    });
  });

  ws.on('close', function () {
    console.log("I lost a client");
   //
  });
  
});