// username.js
document.addEventListener('DOMContentLoaded', function() {
    let username = localStorage.getItem('username');
    if (!username) {
        username = prompt('Por favor, ingresa tu nombre de usuario:');
        if (username) {
            localStorage.setItem('username', username);
        }
    }
    // Actualizar la navbar con el nombre de usuario
    if (username) {
        document.getElementById('username-display').textContent = '@' + username;
    }
});
