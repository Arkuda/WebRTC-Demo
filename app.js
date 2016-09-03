var express = require('express');
var app = express();
//var io = require('socket.io')(app);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server); //pass a http.Server instance
server.listen(process.env.PORT || 5000);


//app.use(express.static(__dirname + '/client'));


app.get('/', function(req, res) {
    res.send('Hello))))');
});

module.exports = app;
