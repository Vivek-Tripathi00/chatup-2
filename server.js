const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path'); // Import the path module

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define the path to the public folder
const publicPath = path.join(__dirname, 'public');

// Serve the index.html file when a GET request is made to the root path ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
// Inside your server-side code, emit the 'user count' event to all clients whenever a new user connects or disconnects
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Increment user count on connection
  io.emit('user count', io.engine.clientsCount);

  // Decrement user count on disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    io.emit('user count', io.engine.clientsCount);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle custom events or communication logic
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
