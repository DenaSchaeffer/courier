const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://stallj2:f5aMs2i7gWtN8OCe@cluster0.ldtqx.mongodb.net/messenger?retryWrites=true&w=majority";
const uri = "mongodb+srv://admin:KROW.tooc1skal-roy@messengerdb.mdvfu.mongodb.net/messenger?retryWrites=true&w=majority";
const bcrypt = require("bcryptjs")

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
    var user = await users.findOne({ username: username});
    if (user != null && user.username == username) {
        //var hashedpassword = bcrypt.hashSync(password);
        console.log("Debug>messengerdb.checklogin-> user found:\n" + JSON.stringify(user));
        //console.log(hashedpassword);
        return bcrypt.compareSync(password, user.password);
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
            var hashedpassword = bcrypt.hashSync(password,10);
            var newUser = { "username": username, "password": hashedpassword }
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
const storePublicChat = (message) => {
    //TODO: validate the data and print out debug info
    
    // Implementation from Phu's lecture code
    // let timestamp =  Date.now();
    // let chat = { receiver: receiver, message: message , timestamp: timestamp };
    // // getDb().collection("public_chat").insertOne(chat, function(err,doc){
    getDb().collection("public_chat").insertOne(message, function(err,doc){
        if (err != null) {
            console.log(err);
        } else {
            console.log("Debug: message is added:" + JSON.stringify(doc.ops));
        }
    });
}
const loadChatHistory = async (receiver, limits=100) => {
    //TODO: fix the find so that it can get by receiver and by all
    var private_chat_history = await getDb().collection("public_chat").find({receiver:receiver}).sort({timestamp:-1}).limit(limits).toArray();
    var public_chat_history = await getDb().collection("public_chat").find({receiver:"all"}).sort({timestamp:-1}).limit(limits).toArray();
    var appended_history = private_chat_history.concat(public_chat_history);
    //print debug info ex. using JSON.stringify(chat_history)
    if (appended_history && appended_history.length > 0) 
        return appended_history;
    //print debug info ex. using JSON.stringify(chat_history)
}
module.exports = { checklogin, addUser,storePublicChat, loadChatHistory }