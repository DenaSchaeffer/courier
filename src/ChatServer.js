var http = require('http')
var app = require('express')()
var server = http.createServer(app)
const port = process.env.PORT || 8080
server.listen(port);
console.log(`Express HTTP Server is listening on port ${port}`)
app.get('/', (request, response) => {
    console.log("Got HTTP request")
    response.sendFile(__dirname+'/index.html')
})
