var redis = require('redis');
var Q = require('q');
var http = require('q-io/http');
var cheerio = require('cheerio');
var moment = require('moment');

var client = redis.createClient();

var db = {
    get: Q.nbind(client.get, client),
    set: Q.nbind(client.set, client)
};

function dbkey() {
    var arr = ['npm-tracker'];
    Array.prototype.push.apply(arr, arguments);
    return arr.join('::');
}

Q.spawn(function*() {
    var res = yield http.request('https://npmjs.org/package/nunjucks');
    var html = (yield res.body.read()).toString();
    var $ = cheerio.load(html);

    var count = $('#package .downloads tr:first-child td:first-child');
    var date = moment().format('YYYYMMDD');

    if(yield db.get(dbkey(date))) {
        throw new Error('date already fetched: ' + date);
    }

    yield db.set(dbkey(date), count);
    client.quit();
});
