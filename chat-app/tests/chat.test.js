const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

describe('chat functionality', () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on('connection', socket => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should communicate', (done) => {
    clientSocket.on('echo', (message) => {
      expect(message).toBe('Hello World');
      done();
    });
    serverSocket.emit('echo', 'Hello World');
  });
});
