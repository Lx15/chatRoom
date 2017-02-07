
var http= require('http')
var express = require('express');
var sio = require('socket.io');
var app = express();
var server = http.createServer(app);
server.listen(80);
var io = sio.listen(server);
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});
var names=[];
io.sockets.on('connection',function(socket){
    socket.on('login',function(name){
        for(var i=0;i<names.length;i++){
            if(names[i] == name){
                socket.emit('duplicate');
                return;
            }
        }
        names.push(name);
        io.sockets.emit('login',name);
         io.sockets.emit('chatlist',names)
    })
    socket.on('chat',function(data){
         io.sockets.emit('chat',data);
    })
    socket.on('logout',function(name){
        for(var i=0;i<names.length;i++){
            if(names[i] == name){
                names.splice(i,1);
                break;
            }
        }
        socket.broadcast.emit('logout',name);
        io.sockets.emit('chatlist',names)
    })
})