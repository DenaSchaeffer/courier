var http = require('http')
var app = require('express')()
var server = http.createServer(app)
const port = process.env.PORT || 8080

server.listen(port);
console.log(`Express HTTP Server is listening on port ${port}`)

//array
var users = [];



app.get('/', (request, response) => {
    console.log("Got HTTP request")
    response.sendFile(__dirname + '/index.html')
});


var io = require('socket.io');
var socketio = io.listen(server);
console.log("Socket.IO is listening at port: " + port);
socketio.on("connection", function (socketclient) {
    console.log("A new Socket.IO client is connected. ID= " + socketclient.id)
    socketclient.on("login", async (username, password) => {
        console.log("Debug>got username=" + username + " password=" + password);
        var checklogin = await DataLayer.checklogin(username, password);
        socketclient.username = username;
        if (checklogin) {
            users.push({
                id: socketclient.id,
                username: username
            })
            socketclient.authenticated = true;
            socketclient.emit("authenticated");
            socketclient.username = username;
            var welcomemessage = username + " has joined the chat system!";
            console.log(welcomemessage);
            // socketio.sockets.emit("welcome", welcomemessage);
            SendToAuthenticatedClient(socketclient, "welcome", welcomemessage);
        } else {
            console.log("Debug>DataLayer.checklogin->result=false");
            socketclient.emit("loginfailed");
        }
    });
    socketclient.on("chat", (message) => {
        if (!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log(chatmessage);
        socketio.sockets.emit("chat", chatmessage);
    });

    socketclient.on("register", (username, password) => {
        if (validateUsername(username) && validatePassword(password)){
            DataLayer.addUser(username, password, (result) => {
            socketclient.emit("registration", result);
            });
        } else {
            var result = "invalid login"
            socketclient.emit("registration", result);
        }
    });

    socketclient.on("privatechat", (message) => {
        if (!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var receivingUser = users.find(user => user.id === message.socketId);
        var chatmessage = "(PRIVATE) " + socketclient.username + " says: " + message.message;
        var sentmessage = "(PRIVATE to " + receivingUser.username + ") " + socketclient.username + " says: " + message.message;
        console.log(chatmessage);
        socketio.to(message.socketId).emit("chat", chatmessage);
        socketio.to(socketclient.id).emit("chat", sentmessage);
    });
});

var messengerdb = require('./messengerdb');
var DataLayer = {
    info: 'Data Layer Implementation for Messenger',
    async checklogin(username, password) {
        var checklogin_result = await messengerdb.checklogin(username, password);
        return checklogin_result;
    },
    addUser(username, password, callback) {
        messengerdb.addUser(username, password, (result) => {
            callback(result);
        });
    }
}
function SendToAuthenticatedClient(sendersocket, type, data) {
    var sockets = socketio.sockets.sockets;
    for (var socketId in sockets) {
        var socketclient = sockets[socketId];
        if (socketclient.authenticated) {
            socketclient.emit(type, data);
            var logmsg = "Debug:>sent to " + socketclient.username + " with ID=" + socketId;
            console.log(logmsg);
        }
    }
}

function validateUsername(username){
    return (username && username.length > 4);
}

function validatePassword (password){
    //require at least one digit, one upper and lower case letter
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
}

