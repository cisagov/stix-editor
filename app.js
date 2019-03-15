var https = require('https');
var fs = require('fs');
var express = require('express');
var helmet = require('helmet')

var options = {
    key: fs.readFileSync( './app/certs/localhost.key' ),
    cert: fs.readFileSync( './app/certs/localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};

var app = express();
app.use(helmet.noSniff());
app.use('/', express.static(__dirname + '/app'));
var port = process.env.PORT || 443;
app.get('*', function(req, res) {
    res.sendfile('app/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

var server = https.createServer( options, app );

server.listen( port, function () {
    console.log( 'Express server listening on port ' + server.address().port );
} );

