const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatMessage(null, 'Welcome to MyChat!'));

        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(null, `${user.username} has joined a chat`));

        socket.emit('setMyUser', user.username);
        setRoomInfo(user.room);
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room)
            .emit('message', formatMessage(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user){
            io.to(user.room)
                .emit('message', formatMessage(null, `${user.username} has left the chat`));
                setRoomInfo(user.room);
        }
    });

    function setRoomInfo(room){
        io.to(room)
                .emit('roomUsers', {
                    room: room,
                    users: getRoomUsers(room)
                });
    }
});



const PORT = 3000 || process.env.Port;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
