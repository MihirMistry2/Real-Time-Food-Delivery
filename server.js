require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4200;

const server = app.listen(PORT, () => {
    console.log(`listening port ${PORT}`);
});

const io = require('socket.io')(server);
const eventEmitter = app.get('eventEmitter');

io.on('connection', (socket) => {
    socket.on('data', (orderId) => {
        socket.join(orderId);
    });
});

eventEmitter.on('orderStatusUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
});
