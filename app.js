'use strict';

const express = require('express'),
      app     = express(),
      server  = require('http').createServer(app),
      io      = require('socket.io')(server);


// Serve public assets
app.use(express.static('./public'));


// Start up app listening on port
server.listen('3000');


// Application
let numUsers = 0;

io.on('connection', socket => {
    let addedUser = false;

    socket.on('add-user', dat => {
        if (numUsers === 2
        ||  addedUser) {
            return;
        }

        addedUser = true;
        numUsers++;

        socket.emit('login', {
            name  : dat,
            color : numUsers === 1 ? 'black' : 'white'
        });
    }); // end on.add-user

    socket.on('try-move', dat => {
        let legal = true;

        if (legal) {
            socket.emit('move', { legal: true, pos: {x: dat.x, y: dat.y}, image: dat.image });

            socket.broadcast.emit('update-board', {
                color   : dat.color,
                image   : dat.image,
                results : [],
                pos     : {x: dat.x, y: dat.y}
            });
        }
    });
});

io.on('disconnect', socket => {
    if (numUsers > 0) numUsers--;
});


