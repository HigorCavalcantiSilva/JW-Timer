const Service = require('node-windows').Service;

// Criação de um novo serviço
const svc = new Service({
    name: 'JWTimer',
    description: 'Serviço para gerenciar temporizador',
    script: require('path').join(__dirname, 'index.js')
});

svc.on('install', () => {
    svc.start();
});

svc.install();