var http = require('http')
var app = require('express')()
var server = http.createServer(app)
const port = process.env.PORT || 8080
server.listen(port);
console.log(`Express HTTP Server is listening on port ${port}`)
app.get('/', (request, response) => {
    console.log("Got HTTP request")
    response.sendFile(__dirname+'/index.html')
});
var io = require('socket.io');
var socketio = io.listen(server);
console.log("Socket.IO is listening at port: " + port);
socketio.on("connection", function (socketclient) {
    console.log("A new Socket.IO client is connected. ID= " + socketclient.id)
});
socketclient.on("login", (username) => {
    socketclient.username = username;
    var welcomemessage = username + "has joined the chat system!";
    console.log(welcomemessage);
})