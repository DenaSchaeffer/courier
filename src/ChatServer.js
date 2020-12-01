var http = require('http')
const express = require('express');
var app = express();
var server = http.createServer(app)
const port = process.env.PORT || 8080
var xssfilter = require("xss");

server.listen(port);
console.log(`Express HTTP Server is listening on port ${port}`)

//array
var users = [];
var groups = [];

app.get('/', (request, response) => {
    console.log("Got HTTP request")
    response.sendFile(__dirname + '/index.html')
});

app.use(express.static('src'));

var io = require('socket.io');
var socketio = io.listen(server);
console.log("Socket.IO is listening at port: " + port);
socketio.on("connection", (socketclient) => {
    console.log("A new Socket.IO client is connected. ID= " + socketclient.id);

    /* LOGIN/REGISTRATION EVENTS */

    socketclient.on("login", async (username, password) => {
        console.log("Debug>got username=" + username + " password=" + password);
        var checklogin = await DataLayer.checklogin(username, password);
        socketclient.username = username;
        if (checklogin) {
            users.push({
                id: socketclient.id,
                username: username
            });
            socketclient.authenticated = true;
            socketclient.emit("authenticated", username);
            socketclient.username = username;
            var welcomemessage = username + " has joined the chat system!";
            console.log(welcomemessage);
            // socketio.sockets.emit("welcome", welcomemessage);
            socketio.emit("newuser", users);
            SendToAuthenticatedClient(socketclient, "welcome", welcomemessage);
            console.log(users);

            //load chat history
            var chat_history = await messengerdb.loadChatHistory(username);
            if(chat_history && chat_history.length > 0){
                chat_history = chat_history.reverse();
                //reverse the order as we get the latest first
                // var data = xssfilter(chat_history);
                // socketclient.emit("chat_history", data);
                socketclient.emit("chat_history", chat_history);
            }
        } else {
            console.log("Debug>DataLayer.checklogin->result=false");
            socketclient.emit("loginfailed");
        }
    });

    socketclient.on("register", (username, password) => {
        if (validateUsername(username) && validatePassword(password)) {
            DataLayer.addUser(username, password, (result) => {
                var data = xssfilter(result);
                socketclient.emit("registration", data);
            });
        } else {
            var result = "invalid login"
            var data = xssfilter(result);
            socketclient.emit("registration", data);
        }
    });

    socketclient.on("logout", () => {
        users = users.filter(user => user.id !== socketclient.id);

        var logoutmessage = {
            message: socketclient.username + " has disconnected from the chat",
            sender: 'all'
        }
        // emit a chat to send logout message
        socketio.sockets.emit("chat", logoutmessage);

        // emit newuser to update active user list
        socketio.sockets.emit("newuser", users);

        var logmsg = "Debug:> logged out";
        console.log(logmsg);

        socketclient.disconnect();
        // socketclient.id = null;
    });

    /* CHAT FUNCTIONALITY */

    socketclient.on("chat", (message) => {
        if (!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var newMessage = filterMessage(message);
        var chatmessage = message;
        var timestamp = Date.now();
        var chatmessage = {
            message: newMessage,
            sender: socketclient.username,
            receiver: 'all',
            timestamp: timestamp
        }
        console.log(chatmessage);
        // socketio.sockets.emit("chat", chatmessage);
        SendToAuthenticatedClient(socketclient, "chat", chatmessage);
    });

    socketclient.on("privatechat", (message) => {
        if (!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var receivingUser = users.find(user => user.id === message.socketId);
        // var stringchatmessage = "(PRIVATE) " + socketclient.username + " says: " + message.message;
        // var stringsentmessage = "(PRIVATE to " + receivingUser.username + ") " + socketclient.username + " says: " + message.message;
        var newMessage = filterMessage(message);
        var timestamp = Date.now();
        var chatmessage = {
            message: newMessage,
            sender: socketclient.username,
            receiver: socketclient.id,
            timestamp: timestamp
        }
        var sentmessage = {
            message: newMessage,
            sender: socketclient.username,
            receiver: receivingUser.username,
            timestamp: timestamp
        }
        console.log(chatmessage);
        socketio.to(message.socketId).emit("chat", chatmessage);
        socketio.to(socketclient.id).emit("chat", sentmessage);
    });


    socketclient.on("groupchat", (message) => {
        if (!socketclient.authenticated) {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        // var stringmessage = "(" + message.groupName + ") " + socketclient.username + " says: " + message.message;
        var newMessage = filterMessage(message);
        var chatmessage = {
            message: "(" + message.groupName + ") " + socketclient.username + " says: " + newMessage,
            sender: message.groupName
        }
        console.log(chatmessage);
        socketio.to(message.groupName).emit("chat", chatmessage);
    })

    socketclient.on("typing", () => {
        var typingmessage = socketclient.username + " is typing...";
        socketclient.broadcast.emit("typing", typingmessage);
    });

    socketclient.on("creategroup", (groupName, selections) => {
        console.log("users being added to group:", selections);
        selections.forEach(element => {
            socketio.sockets.connected[element].join(groupName);
        });
        groups.push(groupName);
        socketio.to(groupName).emit("newgroup", groupName);
        console.log(groups);
    });

    socketclient.on('disconnect', () => {
        console.log(socketclient.id);
        users = users.filter(user => user.id !== socketclient.id);

        var logoutmessage = {
            message: socketclient.username + " has disconnected from the chat",
            sender: 'all'
        }
        console.log(logoutmessage.message);

        // emit a chat to send logout message
        socketio.sockets.emit("chat", logoutmessage);

        // emit newuser to update active user list
        socketio.sockets.emit("newuser", users);

        var logmsg = "Debug:> logged out";
        console.log(logmsg);
    });

    function filterMessage(chatmessage) {
        //filter out all swearwords
        newMessage = chatmessage;

        var swear3 = /ass|pee/gi;
        var swear4 = /fuck|shit|damn|crap|piss|poop|hell|cunt/gi;
        var swear5 = /bitch/gi;
        var swear6 = /Justin/gi;
        var allSwears = ["ass", "fuck", "shit", "bitch", "damn", "crap", "piss", "poop", "pee", "hell", "Justin", "cunt"];

        for(x = 0; x <allSwears.length; x++)
        {
            if(newMessage.includes(allSwears[x]))
            {
                newMessage = newMessage.replace(swear3, "***");
                newMessage = newMessage.replace(swear4, "****");
                newMessage = newMessage.replace(swear5, "*****");
                newMessage = newMessage.replace(swear6, "******");

                socketclient.emit("swear");

                return newMessage;
            }
            
        }
        return newMessage;

    }
});





/* DATABASE FUNCTIONS */

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
            if (typeof data === 'object' && data !== null) {
                for (let property in data) {
                    console.log('property:', data[property]);
                    data[property] = xssfilter(data[property]);
                    console.log('xss filtered:', data[property]);
                }
                data['timestamp'] = parseFloat(data['timestamp']);
                console.log('new object:', data);
            } else if (typeof data === 'string') {
                data = xssfilter(data);
            }
            socketclient.emit(type, data);
            var logmsg = "Debug:>sent to " + socketclient.username + " with ID=" + socketId;
            console.log(logmsg);
            if(type=="chat")
                messengerdb.storePublicChat(data);
        }
    }
}

function validateUsername(username) {
    return (username && username.length > 4);
}

function validatePassword(password) {
    //require at least one digit, one upper and lower case letter
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
}


