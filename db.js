var redis = require('redis');
var Q = require('q');

var db = module.exports;
var client = redis.createClient();
var r = {
    get: Q.nbind(client.get, client),
    set: Q.nbind(client.set, client),
    keys: Q.nbind(client.keys, client)
};

function dbkey() {
    var arr = ['npm-tracker2'];
    Array.prototype.push.apply(arr, arguments);
    return arr.join('::');
}

db.setDateCount = Q.async(setDateCount);
function* setDateCount(proj, date, count) {
    var prev = yield db.getDateCount(proj, date);
    if(!prev || count > prev) {
        yield r.set(dbkey(proj, date), count);
    }
}

db.getDateCount = Q.async(getDateCount);
function* getDateCount(proj, date) {
    var x = yield r.get(dbkey(proj, date));
    return x && parseInt(x, 10);
}

db.getCounts = Q.async(getCounts);
function* getCounts(proj) {
    var keys = yield r.keys(dbkey(proj, '*'));
    var obj = {};

    yield Q.all(keys.map(Q.async(function*(dateKey) {
        var date = dateKey.split('::')[2];
        obj[date] = parseInt(yield r.get(dateKey), 10);
    })));

    return obj;
}

db.quit = quit;
function quit() {
    client.quit();
}
