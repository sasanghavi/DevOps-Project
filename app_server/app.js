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
var redis_client;
fs.readFile('/root/redisIP', 'utf8', function (err,data) {
 if (err) {
   return console.log(err);
 }
 console.log("read this:" + data);
 redisIP = data;

  //redisIP = "159.203.120.47";
  redis_client = redis.createClient(6379, redisIP, {})

  // initialize links
  redis_client.set("big_file", "res/big.pdf", function(err,data){
  });

  // HTTP SERVER
  var server = app.listen(3090, function () {
    var host = server.address().address
    var port = server.address().port
    console.log( "http://"+myIP+":"+port)
    redis_client.lpush("servers", "http://"+myIP+":"+port , function(err, data){
      console.log('Example app listening at http://%s:%s', myIP, port)
    });
  });
});
console.log("IP : "+myIP)
var options = {
};


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
  redis_client.get("feature1", function(err,value){ 
    console.log(value);
    var footer = "<hr/> Request Served by http://" + myIP + ":"+req.socket.server.address().port

    if (value == "true")
      res.send('<h2>Hello World!</h2>' + "Feature!!!" + footer)
    else {
      redis_client.get("big_file", function(err,value){ 

        var body = '<h2>Hello World!</h2>';
        body += 'Link to Reseource 1 (12 KB): <a href="res/hello.txt">hello-world.txt</a> <br/>'
        if (value != null)
          body += 'Link to Reseource 2 (3 MB): <a href="' + value + '">prospectus.pdf</a>'
        else
          body += 'Link to Reseource 2 (3 MB): <a>prospectus.pdf</a>'
        
        res.send(body + footer);
      });


    }
  });
});

app.get('/shutdown', function(req, res) {
    console.log("pulling down res");
    redis_client.del("big_file", function(err,data){
      //
    });
    res.send("Quarantine Mode!");
});

app.get('/cdn', function(req, res) {
    console.log("pulling down res");
      redis_client.set("big_file", "http://s3.aws.com/res/big.pdf", function(err,data){
        //
      });
    res.send("Quarantine Mode!");
});

// serve static files in the res folder
app.use('/res', express.static('res'));
