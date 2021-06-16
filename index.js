// Externe Bibliotheken
const app = require('express')();
const express = require("express");
const path = require("path"); //nicht in seinem bsp
const http = require('http').Server(app);
const io = require('socket.io')(http);
const shortid = require('shortid');


//App Initialisieren
const port = process.env.PORT || 3000;

// App Konfiguration nicht in seinem BSP;
app.use("/public", express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs'); // set ejs as view engine

//App Routen
app.get("/", function(req, res) {
    res.render("pages/chessboard"); // wir übergebne beim rendern der index.ejs Datei, den Array gespeichert in dem key "data"
});     

app.get("/hostroom", (reg, res)=> {
    res.render("pages/hostroom");
})

//websocket on connection
io.on('connection', function(socket){
    let room = shortid.generate();
    socket.emit('room', room);
    socket.join(room);
    console.log('a user connected');
    
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('message', function(msg){
      console.log(`Message: ${msg} in Room: ${room}`);
      io.sockets.in(room).emit('message', msg); // nur an alle die in dem Raum sind wird die message über den message kanal geschickt
    });

  
    socket.on('room', function(r){   // wenn von einem socket (Client) ein Raum über den room kanal kommt
      console.log('user joined room ' + r);
      socket.join(r); //joined er diesem
      room = r;
    });
  });

//app start
http.listen(port, function() {
    console.log(`Server is running on port: ${port}`);
//gibt in der bash den port zurück
});
