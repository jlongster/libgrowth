var Q = require('q');
var http = require('q-io/http');
var cheerio = require('cheerio');
var moment = require('moment');
var db = require('./db');
var settings = require('./settings');

Q.all(settings.projects.map(Q.async(function*(proj) {
    var res = yield http.request('https://npmjs.org/package/' + proj);
    var html = (yield res.body.read()).toString();
    var $ = cheerio.load(html);

    var cols = $('#package .downloads tr:first-child td');
    var count = $(cols[0]).text();
    var text = $(cols[1]).text();

    if(text.indexOf('last day') !== -1) {
        count = count.replace(' ', '');

        if(parseInt(count, 10)) {
            var date = moment().format('YYYYMMDD');
            yield db.setDateCount(proj, date, count);
        }
    }
}))).done(function() {
    db.quit();
});
