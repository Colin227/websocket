import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8070 });
const playedCards = new Array();

wss.on('connection', function connection(ws) {

    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const messages = JSON.parse(data);
        console.log('messages received: ', messages);
        for (const message of messages) {
            if (message.type === 'cardplayed') {
                
                playedCards.push(message.data);
            }

            if (message.type == 'reset') {
                playedCards.length = 0;
            }

            if (message.type === 'flipCard') {
                const cardToFlip = message.data;
                let card = playedCards.findIndex((card) => card.id === message.data.id);
                if (card !== -1) {
                    playedCards[card].displayed = !playedCards[card].displayed;
                }
            }

            if (message.type === 'flipAllCards') {
                playedCards.forEach((card) => {
                    card.displayed = true;
                })
            }
        }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(playedCards))
            }
        })
    });

    ws.send(JSON.stringify(playedCards));
});