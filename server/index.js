var express = require('express');
var path = require('path');

var app = express();

app.use('/', express.static(path.join(__dirname, '../client')));

var port = 3000;

var server = app.listen(port, function () {
    console.log("Express server listening on port %d", port);
});

