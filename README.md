Latest Commit: <https://bitbucket.org/cps490f20-team8/cps490-project-team8/commits/71434f1c18c05d3290148026511c5c6a3d378bfe>

University of Dayton

Department of Computer Science

CPS 490 - Capstone I, Fall 2020

Instructor: Dr. Phu Phung


# Capstone I Project 


## Courier: The Messenger Application
![Logo](logo.png)


## Team 8

1.  Jacob Scheetz, scheetzj2@udayton.edu
2.  Beth Hosek, hoseke1@udayton.edu
3.  Justen Stall, stallj2@udayton.edu 101447307
4.  Dena Schaeffer, backd1@udayton.edu


## Project Management Information

Management board (private access): <https://trello.com/b/ddzbQQx4/team-project>

Source code repository (private access): <https://bitbucket.org/cps490f20-team8/cps490-project-team8/src/master/>


### Revision History

| Date     |   Version     |  Description |
|----------|:-------------:|-------------:|
|11/30/2020|  0.4          | Sprint 3
|10/28/2020|  0.3          | Sprint 2     |
|09/30/2020|  0.2          | Sprint 1     |
|09/10/2020|  0.1          | Added details|
|09/03/2020|  0.0          | Init draft   |


## Overview

The messenger application is a live-chat application that communicates between the client and chat server (web application in Node.js). 

![High Level Architecture](architecture.png)

## System Analysis

* In the current state of the application, sprint 2, we are able to deploy our application to Heroku so that the hosting is taken care of. 
* With this, the application does not have to be spun up locally to interact with the application everytime. This allows users to access the app who are not on the local machine.

### User Requirements

- Users can type text and send a single receiver
- Users can type text and send to a group
- Users can register to the system
- Users can login with a registered account
- Users should receive the messages sent to them in real time
- Users can view the message history
- Users can see if the sent messages have been read


### Use cases

![Use Case Diagram](usecase.png)

#### Register an Account
 * Actor: Unregistered user
 * User Story: As an unregistered user, I want to register to gain access to the application features
 * Use Case Description: in index.html, user will enter a username and password. Then in the ChatServer.js, the username and password are checked against security requirements. If it passes, messengerdb.js will check it against existing users, and add it to the database with a hashed password if the username is not taken. If taken, user is brought back to registration screen. If avaialable, user is taken to login screen.
#### Login
 * Actor: Registered User
 * User Story: As a registered user, I want to login to access the features for registered users.
 * Use Case Description: in index.html, user enters username and password. Then in ChatServer.js, a boolean variable is created, with the results of sending the username/password to messengerdb.js and checking it (while hashing the password) with the database. Back in ChatServer.js, if it returns true, the user will be pushed to the active list of users and the chat screen will be visible. If it returns false, the user will be notified and will stay on the login screen.
#### Send Message
 * Actor: Authenticated User
 * User Story: As a registered user, I want to send a message to all of the users in the users list.
 * Use Case Description: In index.html, user identifies 'all users' as a recipient and typed message is read. Then in ChatServer.js, check that user is authenticated.  After that, check message for language, and send the message object with inputted&filtered message, sender, reciever (all), and timestamp. Message object is stored via messengerdb.js, and sent from ChatServer.js to index.html, where it is displayed
#### Send Private Message
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to send a private message to another user.
 * Use Case Description: In index.html, user identifies a specific user as a recipient and typed message is read. Then in ChatServer.js, check that user is authenticated.  After that, check message for language, and send the message object with inputted&filtered message, sender, reciever, and timestamp. Message object is stored for both sender and reciever via messengerdb.js, and sent from ChatServer.js to index.html, where it is displayed
#### Create Group
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to create a group from logged-in users
 * Use Case Description: in index.html, select users for group from logged-in users and input group name. Then in ChatServer, create group. Back in index.html, group should be a selectable reciepient.
 #### Send Group Chat
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to create and send messages to a group of selected users from the active user list. 
 * Use Case Description: In index.html, user identifies a group as a recipient and typed message is read. Then in ChatServer.js, check that user is authenticated.  After that, check message for language, and send message object with inputted&filtered message, sender, reciever (group), and timestamp. Message object is stored via messengerdb.js, and sent from ChatServer.js to index.html, where it is displayed
#### View Message History
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to view the message history from times I am logged out or inactive.
 * Use Case Description: on login, in index.html call to colllect all mesages for any given user (public, private, and group messages). messengerdb.js will collect messages from the database and send back through ChatServer.js. Then, index.html will display them in the appropriate windows.
#### User Typing Notification
 * Actor: Authenticated User
 * User Story: As a registered user, I want to see when other users are typing a message. 
 * Use Case Description: on action of typing, in index.html call the typing function, which in ChatServer.js will create a message of "(user) is typing" and call index.html, which will broadcst it to all users. when sending memssage, broadcast will end.
#### Dark Mode
 * Actor: Unregistered, Registered, and Authenticated User
 * User Story: As a user, I want to be able to toggle dark mode with the click of a button.
 * Use Case Description: In index.html, click of butten detects the background color (White or Black), and changes to the opposite. This will also change the color of the text & the chat bubbles.
#### Send URLs
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to send clickable URLS through the messages.
 * Use Case Description: In index.html, check user-inputted message to be a URL using regulat expression. If message is found to be a URL, display clickable link
#### Secure Against XSS
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be protected against cross site scripting. 
 * Use Case Description: in ChatServer.js, xss filter, the result of adding a username, messages sent to any/all users and all properties of a message (sender/reciever/timestamp) to prevent against malicious insertion of code
#### Filter Language
 * Actor: Authenticated User
 * User Story: As a registered user, I want to have foul language filtered out in the messages and be alerted if my message is filtered.
 * Use Case Description: in ChatServer.js, before sending a message filter for swear words from a given list. If a swearword is found, replace word with asteriks same length of word, and call index.html to alert user that message  has been filtered. Then, proceede with sending message function
#### Encrypt Passwords
 * Actor: Authenticated User
 * User Story: As a registered user, I want to have my password encrypted for my account to increase security. 
 * Use Case Description: When creating user, once it gets to messenger.db to add user to database, hash the password and store the hashed password instead. Then, when logging in, same file will hash the plaintext password entered by the user and check that to the hashed password in the database.
#### Active Users List
 * Actor: Authenticated User
 * User Story: As a registered user, I want to have an updated list of active users who are logged into the chat application.
 * Use Case Description: On login, index.html will display a list of all users who have previously logged in, using the users list in ChatServer.js. On logout, the users list is called again in ChatServer.js, and will update for active users via index.html
#### Logout
 * Actor: Authenticated User
 * User Story: As a registered user, I want to be able to logout of the application.
 * Use Case Description: On logout via the button, user will be redirected back to the loginUI via index.html. Then for all logouts (either via the logout button or by exiting the tab), chatserver.js will remove user from list of active users and emit message to still-active users that the user has left the chat. Then active user list will be updated to remove user so you cannot send them any messages.


## System Design

* Our system is designed such that a user must login before they are able to access the application.
* Once logged in, the user is able to send messages to everyone, send messages privately, or view the messages they have been sent.

### Use-Case Realization

* The functionality that we as a team feel is necessary to implement next is the ability to show a list of active users within the system. We feel that this will help improve the practicality of our application

### Database 

* MongoDB is the database hosting the data for our app. It stores the registered user data into a JSON file that is later parsed through upon login.
* EXPAND HERE

### User Interface

* Our first distinctive UI element that we have implemented into our system is a Dark Mode toggle button. 
* This implementation allows the end user to click a button to change the interface color depending on preference.
* Our second implementation is having read receipts on messages a user has sent.
* Our third implementation is showing when a user is typing to a group. 

## Implementation
* We implemented the following use cases into our messenger application:
1. Users need to login with username/password. Invalid username/password cannot be logged in
2. Anyone can register for a new account to log in
3. Only logged-in users can send/receive messages (any)
4. Logged-in users can logout
5. Logged-in users can create a group chat (more than 2 members)
6. Logged-in users in a group chat can send/receive messages from the group
7. Seperated chat window for group chat
8. Read receipts
9. User typing notification
* Similar to sprint 1, the implementations were deployed on Heroku, furthering our development of the ChatServer.js file in node and updating the home page in HTML.
* The new methods implemented in ChatServer.js are in the code snippets below:

```
socketclient.on("register", (username, password) => {
    if (validateUsername(username) && validatePassword(password)) {
        DataLayer.addUser(username, password, (result) => {
            socketclient.emit("registration", result);
        });
    } else {
        var result = "invalid login"
        socketclient.emit("registration", result);
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

socketclient.on("groupchat", (message) => {
    if (!socketclient.authenticated) {
        console.log("Unauthenticated client sent a chat. Supress!");
        return;
    }
    // var stringmessage = "(" + message.groupName + ") " + socketclient.username + " says: " + message.message;
    var chatmessage = {
        message: "(" + message.groupName + ") " + socketclient.username + " says: " + message.message,
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
});

socketio.on('disconnect', (socketclient) => {
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
});

function validateUsername(username) {
    return (username && username.length > 4);
}

function validatePassword(password) {
    //require at least one digit, one upper and lower case letter
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);
}


```

### Sprint 1

* During this sprint, we were mainly focused on the funtionality of our messenger application. 
* We implemented the following the uses: The ability to login to the system, the ability to send messages to groups, the ability to send a message to a single user, and the ability to toggle dark and light mode on the interface. 
* This implementations were done by deploying the application on Heroku, furthering our development of the ChatServer.js file in node and updating the home page in HTML. 
* the updates to ChatServer.js are in the code snippets below:
``` 
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
```

```
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
            //socketio.sockets.emit("welcome", welcomemessage);
            SendToAuthenticatedClient(socketclient, "Welcome", welcomemessage);
          }
    }

        
    socketclient.on("chat", (message) => {
        if(!socketclient.authenticated)
        {
            console.log("Unauthenticated client sent a chat. Supress!");
            return;
        }
        var chatmessage = socketclient.username + " says: " + message;
        console.log(chatmessage);
        socketio.sockets.emit("chat", chatmessage);
        }
    });
```

### Deployment

* Our team decided to deploy the application onto Heroku so that we would be able to maintain version control, have a central point to collaborate on the code and have the ability to create a dynamic web application.
* ELABORATE MORE
* URL: <https://cps490-messenger.herokuapp.com/>

## Software Process Management

Introduce how your team uses a software management process, e.g., Scrum, how your teamwork, collaborate.

Include the Trello board with product backlog and sprint cycles in an overview figure and also in detail description. _(Main focus of Sprint 0)_

Also, include the Gantt chart reflects the timeline from the Trello board. _(Main focus of Sprint 0)_

![Sprint 0 timeline](ganttchart.png)

### Scrum process

#### Sprint 0
##### Completed Tasks:
1. Use cases defined
2. Use case diagram made
3. Gantt chart created in Trello

##### Contributions: 

1.  Jacob Scheetz, 4 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
2.  Beth Hosek 2, 4 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
3.  Justen Stall, 4 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
4.  Dena Schaeffer, 4 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 


Duration: 09-01-2020 to 09-10-2020

#### Sprint 1
##### Completed Tasks:
1. Ability to send message to everyone 
2. Login functionality 
3. Send messages to indiviuals
4. Read messages that have been sent to you

Duration: 09-11-2020 to 10-01-2020


##### Contributions: 

1.  Jacob Scheetz, 4 hours, contributed in README, class code updates, powerpoint slides 
2.  Beth Hosek 2, 4 hours, contributed in README, class code updates, powerpoint slides 
3.  Justen Stall, 4 hours, contributed in README, class code updates, powerpoint slides 
4.  Dena Schaeffer, 4 hours, contributed in README, class code updates, powerpoint slides 

#### Sprint 2
##### Completed Tasks:
1. User typing notifications
2. View list of active users
3. Logout functionality
4. Database implementation
5. User registration
6. Group chat implementation

Duration: 10-02-2020 to 10-29-2020

##### Contributions: 

1.  Jacob Scheetz, 8 hours, contributed in README, login and register, powerpoint slides 
2.  Beth Hosek 2, 8 hours, contributed in README, logout and use case diagrams, powerpoint slides 
3.  Justen Stall, 8 hours, contributed in README, authentication and separated chat windows, powerpoint slides 
4.  Dena Schaeffer, 8 hours, contributed in README, group messaging and use case diagrams, powerpoint slides 

#### Sprint 3
##### Completed Tasks:
1. Store chat messages in database
2. Encrypt passwords
3. Users can view the message history
4. Secure against web attacks
5. Users can send URLs
6. Filter language

##### Contributions: 

1.  Jacob Scheetz, 18 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
2.  Beth Hosek 2, 18 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
3.  Justen Stall, 18 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 
4.  Dena Schaeffer, 18 hours, contributed in use case, powerpoint, Trello, and use case diagram creation 


##### Sprint Retrospective:
#### Sprint 2: ###
* There were no major issues with the code
* The regular meetings helped us with time management
* Dividing the tasks among members helped improve efficiency

| Good     |   Could have been better    |  How to improve?  |
|----------|:---------------------------:|------------------:|
|   No issues with the code      |    Deployment to Heroku resulted in bugs      |   Work on bug fixes throughout           |

#### Sprint 1: ###
* We felt that working on the information on a regular basis as it was being discussed in class helped improve our understnafding of what we were developing
* We also felt that dividing tasks between the team members prior to working on things was most efficient in accomplishing tasks and heightening responsibility
* Lastly we felt that having regular meetings together gave us the opportunity to help each other out in areas that we may have been struggling or needed assistance

| Good     |   Could have been better    |  How to improve?  |
|----------|:---------------------------:|------------------:|
|   Great teamwork   |  We could have gone to office hours more   |     We can add more use cases to improve UX  |


## User guide/Demo

Write as a demo with screenshots and as a guide for users to use your system.

* Users can toggle between light mode: 

![light](lightmode.png)
* Or dark mode:

![dark](darkmode.png)

* Users can register to the system:

![register](register.png)

* Users can logon to the system with their username and password:

![login](userlogin.png)

* Once logged in, the users can send messages in the chat and see who joins the chat:

![chat](userlist.png)

* Users can see when someone is typing:

![chat](typing.png)

* Users can send a private chat via the selection of an active user:

![private-send](private.png)

* Users can receive a private chat: 

![receive-private](privatefrom.png)

* Users private messages are not seen by others that are not recipients in the same chat: 

![private](noprivate.png)

* Users can create a group chat:

![chat](group1.png)
![chat](group2.png)

* Users can logout (brings user back to login screen and notifies active users): 

![chat](logout.png)

