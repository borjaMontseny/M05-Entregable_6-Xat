const socket = io();

document.getElementById('create-room').addEventListener('click', function() {
    const room = document.getElementById('room-input').value;
    const username = localStorage.getItem('username') || 'Anonymous';
    if (room.trim()) {
        socket.emit('join room', room, username);
        updateRoomSelector(room);
    }
});

document.getElementById('join-room').addEventListener('click', function() {
    const room = document.getElementById('room-select').value;
    const username = localStorage.getItem('username') || 'Anonymous';
    socket.emit('join room', room, username);
});

document.getElementById('leave-room').addEventListener('click', function() {
    const room = socket.room;
    socket.emit('leave room', room);
    document.getElementById('leave-room').style.display = 'none';
});

document.getElementById('send-button').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('message-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
    }
});

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    const username = localStorage.getItem('username') || 'Anonymous';
    if (message.trim() !== "") {
        const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        socket.emit('chat message', { message, username, timestamp });
        messageInput.value = "";
        launchConfetti();
    }
}

function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function updateRoomSelector(newRoom) {
    const roomSelect = document.getElementById('room-select');
    const option = document.createElement('option');
    option.value = newRoom;
    option.textContent = newRoom;
    roomSelect.appendChild(option);
}

socket.on('chat message', function(data) {
    const item = document.createElement('div');
    item.innerHTML = `<strong>${data.username}</strong><div>${data.message}</div><small>${data.timestamp}</small>`;
    document.getElementById('chat-box').appendChild(item);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
});
document.getElementById('theme-toggle').addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });
  