//var nr = require('newrelic');
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http      = require('http');
var httpProxy = require('http-proxy')
var app = express()
// REDIS

var redisIP = '104.131.119.23'
var client = redis.createClient(6379, redisIP, {})

var options = {};

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
        console.log(req.method, req.url);
        next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
  res.send('<h2>I am your master!</h2>')
});


app.get('/deploy', function(req, res) {
  res.send('<h2>Got new code. Deploy!</h2>')
});



// HTTP SERVER
var server = app.listen(2000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
