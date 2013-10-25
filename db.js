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

function setDateCount(proj, date, count) {
    return getDateCount(proj, date).then(function(prev) {
        if(!prev || count > prev) {
            return r.set(dbkey(proj, date), count);
        }
    });
}

function getDateCount(proj, date) {
    return r.get(dbkey(proj, date)).then(function(x) {
        return x && parseInt(x, 10);
    });
}

function getCounts(proj) {
    return r.keys(dbkey(proj, '*')).then(function(keys) {
        var obj = {};

        return Q.all(keys.map(function(dateKey) {
            var date = dateKey.split('::')[2];
            return r.get(dateKey).then(function(dk) {
                obj[date] = parseInt(dk, 10);
            });
        })).then(function() {
            return obj;
        });
    });
}

db.quit = quit;
function quit() {
    client.quit();
}

module.exports = {
    setDateCount: setDateCount,
    getDateCount: getDateCount,
    getCounts: getCounts,
    quit: quit
};
