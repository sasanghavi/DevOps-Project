var nr = require('newrelic');
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http      = require('http');
var httpProxy = require('http-proxy')
var app = express()
// REDIS

var redisIP;
var client;
fs.readFile('/root/redisIP', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log("read this:" + data);
  redisIP = data;
  client = redis.createClient(6379, redisIP, {})

  // HTTP SERVER
  var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    client.lpush("servers", "http://"+myIP+":"+port , function(err, data){
      console.log('Example app listening at http://%s:%s', myIP, port)
    });
  });
});

var options = {};


///////// SELF IP //////////////
var myIP;

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
      myIP = iface.address
    }
    ++alias;
  });
});



///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
        console.log(req.method, req.url);
        next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
  client.get("feature1", function(err,value){ 
    console.log(value);
    var footer = "<hr/> Request Served by http://" + myIP + ":"+req.socket.server.address().port

    if (value == "true")
      res.send('<h2>Hello World!</h2>' + "Feature!!!" + footer)
    else
      res.send('<h2>Hello World!</h2>' + footer)
  });

});

