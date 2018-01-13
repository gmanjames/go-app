const express = require('express'),
      app     = express(),
      server  = require('http').createServer(app);
      io      = require('socket.io')(server);


// Serve public assets
app.use(express.static('./public'));


// Start up app listening on port
app.listen('3000');


