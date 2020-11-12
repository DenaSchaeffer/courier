const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://stallj2:f5aMs2i7gWtN8OCe@cluster0.ldtqx.mongodb.net/messenger?retryWrites=true&w=majority";
const uri = "mongodb+srv://admin:KROW.tooc1skal-roy@messengerdb.mdvfu.mongodb.net/messenger?retryWrites=true&w=majority";

const mongodbclient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;
mongodbclient.connect((err, connection) => {
    if (err) throw err;
    console.log("Connected to the MongoDB cluster!");
    db = connection.db();
})
const dbIsReady = () => {
    return db != null;
};
const getDb = () => {
    if (!dbIsReady())
        throw Error("No database connection");
    return db;
}
const checklogin = async (username, password) => {
    console.log("Debug>messengerdb.checklogin: " + username + "/" + password);
    var users = getDb().collection("users");
    var user = await users.findOne({ username: username, password: password });
    if (user != null && user.username == username) {
        console.log("Debug>messengerdb.checklogin-> user found:\n" + JSON.stringify(user));
        return true;
    }
    return false
}
const addUser = (username, password, callback) => {
    console.log("Debug>messengerdb.addUser:" + username + "/" + password)
    var users = getDb().collection("users");
    users.findOne({ username: username }).then(user => {
        if (user && user.username === username) {
            console.log(`Debug>messengerdb.addUser: Username '${username}' exists!`);
            callback("UserExist");
        } else {
            // input validation (password strength)
            // callback("InvalidInput");
            var newUser = { "username": username, "password": password }
            users.insertOne(newUser, (err, result) => {
                if (err) {
                    console.log("Debug>messengerdb.addUser: error for adding '" + username + "':\n", err);
                    callback("Error");
                } else {
                    console.log("Debug>messengerdb.addUser: a new user added: \n", result.ops[0].username);
                    callback("Success");
                }
            });
        }
    });
}
const storePublicChat = (receiver, message) => {
    //TODO: validate the data and print out debug info
    let timestamp =  Date.now();
    let chat = { receiver: receiver, message: message , timestamp: timestamp };
    getDb().collection("public_chat").insertOne(chat, function(err,doc){
        if (err != null) {
            console.log(err);
        } else {
            console.log("Debug: message is added:" + JSON.stringify(doc.ops));
        }
    });
}
const loadChatHistory = async (receiver, limits=100) => {
    var chat_history = await getDb().collection("public_chat").find({receiver:receiver}).sort({timestamp:-1}).limit(limits).toArray();
    //print debug info ex. using JSON.stringify(chat_history)
    if (chat_history && chat_history.length > 0) 
        return chat_history;
}
module.exports = { checklogin, addUser,storePublicChat, loadChatHistory }