const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://stallj2:f5aMs2i7gWtN8OCe@cluster0.ldtqx.mongodb.net/messenger?retryWrites=true&w=majority";
const uri = "mongodb+srv://admin:KROW.tooc1skal-roy@messengerdb.mdvfu.mongodb.net/MessengerDB?retryWrites=true&w=majority";

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
    var users = getDb().collection("users");
    var user = await users.findOne({ username: username, password: password });
    if (user != null && user.username == username) {
        console.log("Debug>messengerdb.checklogin-> user found:\n" + JSON.stringify(user));
        return true;
    }
    return false
}
module.exports = { checklogin };