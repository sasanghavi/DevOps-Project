var request = require('request');
//var nr = require('newrelic')
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http      = require('http');
var httpProxy = require('http-proxy');
var HashMap = require('hashmap');
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})


var options = {};
var proxy   = httpProxy.createProxyServer(options);

var map = new HashMap();
map.set(1, '/');
map.set(2, '/res/big.pdf');
map.set(3, '/res/hello.txt');
map.set(4, '/recent');
map.set(5, '/listservers');
map.set(6, 'default');


var proxyServer  = http.createServer(function(req, res)
{
    console.log("Got Request for: " + req.url);

    client.select(0, function(err){
        console.log("selected 0");
        client.lrange("servers", 0, -1, function(err,value){

            var rand =  Math.floor(Math.random()*value.length);
            var i = 0;
            value.forEach(function (server)
            {
                if (i == rand) {
                    console.log('Using server at ' + server + " ... ");
                    proxy.web( req, res, {target: server} );
                }
                i++;
            });
        });

        var dateNow = Date.now()
        var dbNum = 6      // default
        if(req.url == '/'){
          dbNum = 1
        }
        else if(req.url == '/res/big.pdf'){
          dbNum = 2
        }
        else if(req.url == '/res/hello.txt'){
          dbNum = 3
        }
        else if(req.url == '/recent'){
          dbNum = 4
        }
        else if(req.url == '/listservers'){
          dbNum = 5
        }

        client.select(dbNum, function(err){
          
          console.log("dbNum : "+dbNum);
          if(err) return console.log("Error select: "+err);
          
          client.set(dateNow,0)
          client.expire(dateNow, 15)
          
          client.keys('*', function (err, keys) {
          if (err) return console.log("Error keys: "+err);
          if (keys.length>3) {

            var notif = "`DDoS Attack` signature detected! ("
            notif += keys.length + " requests/min) \n "
            notif += "Targetted resource: " + map.get(dbNum)
            notif += "\n <http://192.241.179.54:8080/|Ignore> | "
            notif += "<http://192.241.179.54:8080/shutdown|Pull down target resource> "
            notif += " | <http://192.241.179.54:8080/cdn|Migrate resource to CDN>"
            request({
              uri: "https://hooks.slack.com/services/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",
              method: "POST",
              json:{
                "channel": "#general",
                "username": "DDoS",
                "text": notif,
                "icon_emoji": ":ghost:"
              }
            });

            console.log("Trigger slack message. Possible ddos attack at "+map.get(dbNum)+ " endpoint")
            client.del(dateNow)
            client.flushdb()
          };
          // for(var i = 0, len = keys.length; i < len; i++) {
          // console.log(keys[i]);
          // }
        }
        )
        });
    });


});
proxyServer.listen(8080);