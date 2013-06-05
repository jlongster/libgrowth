var express = require('express');
var nunjucks = require('nunjucks');
var settings = require('./settings');
var db = require('./db');

var app = express();

var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader('views'),
    { dev: true }
);
env.express(app);

app.configure(function() {
    app.use(express.static(__dirname + '/static'));
});

// routes

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/project/:name', function(req, res) {
    db.getCounts(req.params.name).done(function(counts) {
        res.send(counts);
    });
});

// serve

console.log('Started server on ' + settings.port + '...');
app.listen(settings.port);
