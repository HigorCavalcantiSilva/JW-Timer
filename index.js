const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let countdownMinutes = 1; // Defina o número de minutos aqui
let countdownSeconds = 0; // Defina os segundos iniciais aqui
let timer;

let times = [{title: 'Parte 1', time: 10}, {title: 'Parte 2', time: 15}, {title: 'Parte 3', time: 7}, {title: 'Parte 4', time: 8}];
let pos_times = 0;
let socket;

app.use(express.static('public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));

io.on('connection', (socketIO) => {
    socket = socketIO;
    socket.on('start', () => {
        if (!timer) {
            timer = setInterval(() => {
                if (countdownSeconds === 0) {
                    if (countdownMinutes === 0) {
                        clearInterval(timer);
                        timer = null;
                        return;
                    } else {
                        countdownMinutes--;
                        countdownSeconds = 59;
                    }
                } else {
                    countdownSeconds--;
                }

                io.emit('updateCountdown', { minutes: countdownMinutes, seconds: countdownSeconds });
            }, 1000);
        }
    });

    socket.on('stop', () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    });

    socket.on('changeTalkTime', pos => {
        pos_times = pos;
        countdownMinutes = times[pos_times].time;
        countdownSeconds = 0;
        
        updateCountdown();
    });

    updateCountdown();
    updateTalks();

    socket.on('disconnect', () => {
        console.log('Um usuário desconectou');
    });
});

function updateCountdown() {
    socket.emit('updateCountdown', { minutes: countdownMinutes, seconds: countdownSeconds });
}

function updateTalks() {
    socket.emit('updateTalks', { times });
}

app.get('/control', (req, res) => {
    res.sendFile(__dirname + '/public/control.html');
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});