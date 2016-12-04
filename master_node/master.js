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

var redisIP = '127.0.0.1'
var redis_client = redis.createClient(6379, redisIP, {})
var redis_client_static = redis.createClient(6379, '159.203.120.47', {})



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


fs.unlink('/root/redisIP', function(err){
    // Ignore error if no file already exists
    if (err && err.code !== 'ENOENT')
        throw err;

    var options = { flag : 'w' };
    fs.writeFile('/root/redisIP', ""+ myIP , options, function(err) {
        if (err) throw err;
        console.log('file saved');
    });

    // Save host IP for jenkins
    redis_client_static.set("masterIP", myIP, function (err, value) {
    	//
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
  res.send('<h2>I am your master!</h2>')
});


app.get('/deploy', deployCallback);
app.post('/deploy', deployCallback);

function deployCallback(req, res) {
    res.send('<h2>Got new code. Deploy!</h2>')

    var name = "App" + parseInt(new Date().getTime() / 10000);
	var region = "nyc2";
	var image = "centos-6-5-x64";
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		if(!err && resp.statusCode == 202)
		{
			var dropletId = resp.body.droplet.id;
			console.log("Got droplet: " + dropletId + " polling for public IP...");

		    redis_client.lpush("reservations", dropletId, function(err,value){
		    	// add ids to DO for delete
		    });


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
}






app.get('/canary', function(req, res) {
    res.send('<h2>Got new Canary code. Deploy!</h2>')

    var name = "Canary" + parseInt(new Date().getTime() / 10000);
	var region = "nyc2";
	var image = "centos-6-5-x64";
	client.createDroplet(name, region, image, function(err, resp, body)
	{
		if(!err && resp.statusCode == 202)
		{
			var dropletId = resp.body.droplet.id;
			console.log("Got droplet: " + dropletId + " polling for public IP...");
			redis_client.lpush("reservations_canary", dropletId, function(err,value){
		    	// add ids to DO for delete
		    });

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

						      exec('ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory ../canary_playbook.yml',
							  function (error2, stdout2, stderr2) {
							    console.log('stdout: ' + stdout2);
							    console.log('stderr: ' + stderr2);
							    if (error2 !== null) {
							      console.log('exec error: ' + error2);
							    }
								});
						});

					}); 

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
var server = app.listen(2500, function () {

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
			"ssh_keys":[4563235],
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