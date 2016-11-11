//var nr = require('newrelic')
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http      = require('http');
var httpProxy = require('http-proxy')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})


var options = {};
var proxy   = httpProxy.createProxyServer(options);

var proxyServer  = http.createServer(function(req, res)
{
    console.log("Got Request");
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
});
proxyServer.listen(8080);