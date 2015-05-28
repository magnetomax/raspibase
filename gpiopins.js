var readline = require('readline');
var fs = require('fs');
var gpio = require('rpi-gpio');
//gpio.setPollFrequency(10000);
     // gpio.setup(7,gpio.DIR_OUT,function(){
     //         gpio.write(7,0,function(err){
     //                 if(err) throw err;
     //                 console.log('Written to pin 7');
     //         });
     // });

fs.exists('/home/pi/raspibase/movinglog.txt',function(exists){
	console.log(exists?'File Exists!!':'File Doesnt Exists');
	if(exists){
		writeLogToFile('The Survillence application started on '+ Date().toString()+'\n');
	}
});

function writeLogToFile(text){
	fs.appendFile('movinglog.txt',text,function(err){
		if(err) throw err;
	});
}//writeLogToFile

gpio.setup(7,gpio.DIR_IN,function(){
	console.log('Setting Done!');
});

setInterval(function(){
	gpio.read(7,function(err,val){
		if(val){
			console.log(val);
			writeLogToFile('Moving Object Detected on '+Date().toString()+'\n');
		}
	});
},2500);

process.on('exit',function(){
gpio.destroy();
});
