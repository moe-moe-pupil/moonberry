import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 7778 });
var newData;
wss.on('connection', function connection(ws) {
  ws.on('message', (data) => {
    console.log('received: %s', data);
    newData = data.toString()
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(newData)
      }
    });
  });
  console.log('someone connected');
});