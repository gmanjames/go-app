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
let numUsers = 0,
    move      = 'b',
    locked   = true;

io.on('connection', socket => {
    let addedUser = false,
        game      = {};

    socket.on('add-user', dat => {
        if (numUsers === 2
        ||  addedUser) {
            return;
        }

        addedUser = true;
        numUsers++;

        let color = numUsers === 1 ? 'black' : 'white';

        if (color === 'black')
            locked = false;

        socket.emit('login', {
            name  : dat,
            color : color
        });
    }); // end on.add-user

    socket.on('try-move', dat => {
        if (locked
        || (dat.color === 'black' && move === 'w')
        || (dat.color === 'white' && move === 'b'))
            return;

        let legal = true;

        if (legal) {
            socket.emit('move', { legal: true, pos: {x: dat.x, y: dat.y}, image: dat.image });

            socket.broadcast.emit('update-board', {
                color   : dat.color,
                image   : dat.image,
                results : [],
                pos     : {x: dat.x, y: dat.y}
            });

            move = move === 'b' ? 'w' : 'b';
        }
    });
});

io.on('disconnect', socket => {
    if (numUsers > 0) numUsers--;
});


