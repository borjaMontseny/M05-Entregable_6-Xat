const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);
const cheerio = require('cheerio');

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room, username) => {
        socket.join(room);
        socket.room = room;
        io.to(room).emit('chat message', { username: 'System', message: `${username} has joined ${room}`, timestamp: new Date().toISOString() });
    });

    socket.on('chat message', async (data) => {
        if (isValidHttpUrl(data.message)) {
            data = await enrichMessage(data);
        }
        io.to(socket.room).emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

async function enrichMessage(data) {
    try {
        const response = await fetch(data.message);
        const html = await response.text();
        const $ = cheerio.load(html);
        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const image = $('meta[property="og:image"]').attr('content');
        const description = $('meta[property="og:description"]').attr('content');
        data.preview = { title, image, description };
    } catch (error) {
        console.log('Error fetching URL metadata:', error);
    }
    return data;
}

function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false; 
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
