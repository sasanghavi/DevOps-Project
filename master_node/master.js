//var nr = require('newrelic');
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http      = require('http');
var httpProxy = require('http-proxy')
var needle = require("needle");
const exec = require('child_process').exec;
var app = express()
// REDIS

var redisIP = '104.131.119.23'
var client = redis.createClient(6379, redisIP, {})

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

    var name = "App";
	var region = "nyc2";
	var image = "centos-6-5-x64";
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		if(!err && resp.statusCode == 202)
		{
			var dropletId = resp.body.droplet.id;
			console.log("Got droplet: " + dropletId + " polling for public IP...");

			// Get IP Handler
			function getIPCallback(error, response)
			{
				var data = response.body;
				if( (data.droplet.networks.v4.length > 0)  && (data.droplet.status == "active") )
				{
					//console.log(data.droplet.networks.v4[0].ip_address);
					pubIP_DO = data.droplet.networks.v4[0].ip_address;

					// Run Ansible Playbook here
					console.log("ALL DONE!.." + pubIP_DO + "... Run ansible now!")  
					invStr = "node0 ansible_ssh_host="+ pubIP_DO +" ansible_ssh_user=root ansible_ssh_private_key_file=~/.ssh/id_rsa\n"
					fs.writeFile("inventory", invStr, function(err) {
					    if(err) {
					        return console.log(err);
					    }
					    console.log("Ansible Inventory file generated, running playbook!");

					    // Run playbook
	  					exec('sleep 30',
						  function (error, stdout, stderr) {
						  		console.log("sleep done...")

						      exec('ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory ../app_playbook.yml',
							  function (error2, stdout2, stderr2) {
							    console.log('stdout: ' + stdout2);
							    console.log('stderr: ' + stderr2);
							    if (error2 !== null) {
							      console.log('exec error: ' + error2);
							    }
								});
						});

					}); 

					// Run Playbook



				} else {
					console.log("...");
					setTimeout(function () {
			        	client.getIP(dropletId, getIPCallback);
			    	}, 1000);
				}
			}

			// Get IP
			client.getIP(dropletId, getIPCallback);
		}
	});
});



// HTTP SERVER
var server = app.listen(2000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});






// DIGITAL OCEAN - Client
var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' +  process.env.DO_TOKEN
};


var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},


	listImages: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/images", {headers:headers}, onResponse)
	},


	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[3407276],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create Droplet: "+ JSON.stringify(data) + "\n" );
		console.log("Headers:" + JSON.stringify(headers) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},


	getIP: function(dropletId, onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletId, {headers:headers}, onResponse)
	},


	deleteDroplet: function (dropletId, onResponse)
	{
		var data = null;

		console.log("Attempting to delete: "+ dropletId );

		needle.delete("https://api.digitalocean.com/v2/droplets/"+dropletId, data, {headers:headers,json:true}, onResponse );
	},

};