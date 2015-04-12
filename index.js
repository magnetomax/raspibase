//Author : Mahesh Gudgila
//index.js
//This is the entry point of the application.
//I am using camel case notation to name the variables inculding short forms

var q = require('q');
var firebase = require('firebase');
var os = require('os');
var gpio = require('rpi-gpio');
var exec = require('child_process').exec;

raspiBaseRoot = new firebase('https://sizzling-heat-2023.firebaseio.com/raspberryPi');

//function to execute command
function executeCommand(command){
	var defer = q.defer();
	//console.log('Executing COmmand: '+command);
	exec(command,function(error, stdout, stderr){
	//	console.log('Output: '+ error + stdout + stderr);
		defer.resolve({
			'error':error,
			'stdout':stdout,
			'stderr':stderr
		});
	});
	return defer.promise;
}//executeCommand

//set data
raspiBaseRoot.update({
	name:"Raspberry Pi",
	osTemperoryDirectory : os.tmpdir(),
	osHostName : os.hostname(),
	osTypeOfOs : os.type(),
	osPlatform : os.platform(),
	osArchitecture : os.arch(),
	osRelease : os.release(),
	osUptime : os.uptime(),
	osAvgLoad : os.loadavg(),
	osTotalMemory : os.totalmem(),
	osFreeMemory : os.freemem(),
	osCpus :os.cpus(),
	osNetworkInterfaces : os.networkInterfaces(),
	osEol : os.EOL,
	isConnected : true,
	gpioPins : {
			gpio1:false,
			gpio2:false,
			gpio3:false
		 },
	execCommand : '',
	commandOutput : '',
	osTemperature: ''
});

//Set isConnected to false if raspberryPi disconnects
//Simple presence System
var connectedRef = new firebase('https://sizzling-heat-2083.firebaseio.com/.info/connected');
connectedRef.on('value', function(snap){
	if(snap.val() == true){
		var con = raspiBaseRoot.child('isConnected');
		con.set(true);
		con.onDisconnect().set(false);
		
	}
});


//update memory after some time
setInterval(function(){
	raspiBaseRoot.update({
		osFreeMemory: os.freemem(),
		osUptime: os.uptime(),
		osAvgLoad: os.loadavg(),
	});
},10000);

//check if command is changed
raspiBaseRoot.child("execCommand").on("value",function(snapshot){
	if(snapshot.val()){
		//console.log('snapshot : '+snapshot.val());
		executeCommand(snapshot.val()).then(function(data){
			raspiBaseRoot.child("commandOutput")
			.update(data);	
		});	
	}	
});


//check if pins are changed
//var gpioPins = raspiBaseRoot.child("gpioPins");
//gpioPins.child("gpio1").on("value",function(snapshot){
//	gpio.setup(7,gpio.DIR_OUT,function(){
//		gpio.write(7,snapshot.val(),function(err){
//			if(err) throw err;
//			console.log('Written to pin 7');
//		});
//	});
//}, function(error){
//	console.log("The read failed:"+error.code);
//});

