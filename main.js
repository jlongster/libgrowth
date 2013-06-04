var express = require('express');
var nunjucks = require('nunjucks');

var app = express();

var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader('views'),
    { dev: true }
);
env.express(app);

app.get('/', function(req, res) {
    res.render('index.html');
});

console.log('Started server on ' + settings.port + '...');
app.listen(settings.port);
