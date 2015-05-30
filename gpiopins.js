var readline = require('readline');
var fs = require('fs');
var gpio = require('rpi-gpio');

	var MotionSensor = function () {
		this.intervalObj='';
	};
	
	var writeLogToFile = function(text){
		fs.appendFile('movinglog.txt',text,function(err){
			if(err) throw err;
		});
	}//writeLogToFile
	
    MotionSensor.prototype.initialize = function () {
    	gpio.setup(7,gpio.DIR_IN,function(){
			//console.log('Setting Done!');
		});
    };
    
    MotionSensor.prototype.startSensing = function () {
		writeLogToFile('The Survillence application started on '+ Date().toString()+'\n');
		intervalObj = setInterval(function(){
			gpio.read(7,function(err,val){
				if(val){
					console.log(val);
					writeLogToFile('Moving Object Detected on '+Date().toString()+'\n');
				}
			});
		},2500);
    };
    
    MotionSensor.prototype.stopSensing = function () {
    	writeLogToFile('Application stopped on '+Date().toString()+'\n');
    	clearInterval(intervalObj);
    };

    module.exports = new MotionSensor();
    
	
