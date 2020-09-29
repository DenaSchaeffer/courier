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
    socketclient.on("login", (username,password) => {
        socketclient.username = username;
        console.log("Debug>got username=" + username + " password="+ password);
        if(DataLayer.checklogin(username,password)){
            socketclient.authenticated=true;
            socketclient.emit("authenticated");
            var welcomemessage = username + " has joined the chat system!";
            console.log(welcomemessage);
            SendToAuthenticatedClient(socketclient, "welcome", welcomemessage);
          }

        
    });
    socketclient.on("chat", (message) => {
        if(!socketclient.authenticated)
        {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log(chatmessage);
        socketio.sockets.emit("chat", chatmessage);
    });

    
    // testing pm
    var users = {};

    socket.on('login', function(user){
    // on connection store users, you can delete object properties on disconnect
    users[user.username] = socket.id; // usernames and their socket ids are related now.
    });
    socket.on('newmsg', function(message){
    if(message.indexOf('/w') == 0){ // Check, is user whispering
        var messageArray = message.split(' '); // Split string as array
        var username = messageArray[1]; // we got username
        var msg = messageArray.splice(2).join(' '); // join message's words
        socket.broadcast.to(users[username]).emit('newmsg', msg); // gets message (users[username] gives his socket.id)
    }else{
        // send message everybody
    }
    });
    //end pm test

});
var DataLayer = {
    info: 'Data Layer Implementation for  Messenger',
    checklogin(username,password){
        //for testing only
        console.log("checklogin: " + username + "/:" + password);
        console.log("just for testing return true");
        return true;
    }
}
function SendToAuthenticatedClient(sendersocket, type, data){
    var sockets = socketio.sockets.sockets;
    for(var socketId in sockets){
        var socketclient=sockets[socketId];
        if(socketclient.authenticated){
            socketclient.emit(type,data);
            var logmsg= "Debug:>sent to " + socketclient.username + " with ID=" + socketId;
            console.log(logmsg);
        }
    }

}