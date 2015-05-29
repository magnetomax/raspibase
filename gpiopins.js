var readline = require('readline');
var fs = require('fs');
var gpio = require('rpi-gpio');

	var writeLogToFile = function(text){
		fs.appendFile('movinglog.txt',text,function(err){
			if(err) throw err;
		});
	}//writeLogToFile
	exports.MotionSensorInitialize = function(){
		gpio.setup(7,gpio.DIR_IN,function(){
			//console.log('Setting Done!');
		});
		
		fs.exists('/home/pi/raspibase/movinglog.txt',function(exists){
			console.log(exists?'File Exists!!':'File Doesnt Exists');
			if(exists){
				writeLogToFile('The Survillence application started on '+ Date().toString()+'\n');
			}
		});
		
		setInterval(function(){
			gpio.read(7,function(err,val){
				if(val){
					console.log(val);
					writeLogToFile('Moving Object Detected on '+Date().toString()+'\n');
				}
			});
		},2500);
	};
