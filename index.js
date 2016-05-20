var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(client) {
    var str = 'Connection event: \n';
    str += '\tID: ' + client.id + '\n';
    str += '\tAddress: ' + client.conn.remoteAddress;
    console.log(str);

    client.on('subscribe', function(data) {
        var str = 'Join event: \n';
        str += '\tID: ' + client.id + '\n';
        str += '\tChannel: ' + data;
        console.log(str);
        client.join(data);
    });

    client.on('update', function(data) {
        console.log(data);
        if (data.room) {
            io.sockets.in(data.room).emit('update', data);
        } else {
            console.error('no room or room doesn\'t exist');
        }
    });
});
app.use('/', require('express').static('static'));
var port = 3000;
server.listen(port, function() {
    console.log(__dirname + ' listening on port ' + port);
});
