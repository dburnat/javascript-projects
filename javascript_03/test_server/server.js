const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function (ws) {
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
                name: ws.personName,
                data: message.data
              }
          ));
      });
    }
    else if(message.type == "cordsData"){
      console.log('kappa');
    }

  });

  ws.on('close', function () {
    console.log("I lost a client");
   //
  });
  
});