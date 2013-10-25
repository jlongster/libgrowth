var Q = require('q');
var http = require('q-io/http');
var cheerio = require('cheerio');
var moment = require('moment');
var db = require('./db');
var settings = require('./settings');

Q.all(settings.projects.map((function (proj) {
    return http.request('https://npmjs.org/package/' + proj).then(function(res) {
        return res.body.read();
    }).then(function(html) {
        html = html.toString();
        var $ = cheerio.load(html);

        var cols = $('#package .downloads tr:first-child td');
        var count = $(cols[0]).text();
        var text = $(cols[1]).text();

        if(text.indexOf('last day') !== -1) {
            count = count.replace(' ', '');

            if(parseInt(count, 10)) {
                var date = moment().format('YYYYMMDD');
                return db.setDateCount(proj, date, count);
            }
        }
    });
}))).then(function() {
    db.quit();
}).done();

