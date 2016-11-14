var request = require("request");
var express = require('express')
// var exec = require('exec');
// var cmd=require('node-cmd');
// var redisIP;
// var redis_client;

// cmd.get('redis-cli -h 159.203.120.47 lindex servers -1', function (data){
// console.log("data "+ data)  // command output is in stdout
// });
var base_url = "http://9.85.138.205:3090"
//var base_url = "http://localhost:3090/"
describe("basic server", function() {
  describe("GET /", function() {
    it("returns status code 200", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns hello world", function(done) {
      request.get(base_url, function(error, response, body) {
        expect(body).toContain("Hello World!");
        done();
      });
    });
  });
});
