import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8070 });

wss.on('connection', function connection(ws) {
    const playedCards = new Array();
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const messages = JSON.parse(data);
        console.log('messages received: ', messages);
        for (const message of messages) {
            if (message.type === 'cardplayed') {
                playedCards.push(message.data);
            }
        }
        
        ws.send(JSON.stringify(playedCards));
    });

    ws.send(JSON.stringify(playedCards));
});