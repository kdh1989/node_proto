var Promise = require('bluebird');

var ParamCheck = function(body) {

	return new Promise(function(resoleve,reject) {
		
		if(body.param == null || body.param == undefined) {
			reject("null Param Data ");
		}
		else {
			resoleve(body.param);
		}
		
	});
	

};

var ParamIsVal = function(param) {
	
	return new Promise(function(resoleve, reject) {
		
		for(key in param) {
			
			if(param[key] == null || param[key] == "") {
				return reject("null Param Key : " + key);
			}

		}

	
		return resoleve(true);
	});

}

/*
var ParamCheck = function(body,callback) {
	var param = body.param; 
	
	if(param == null || param == undefined) {
		return callback(false);
	}

	return callback(true);

};

var ParamIsVal = function(param,callback) {

	for(key in param) {
		if(param[key] == null || param[key] == "") {
			//console.log('null param : ', key);
			return callback(false,key);
			//return false;
		}
	}

	return callback(true);
}
*/
module.exports.ParamCheck = ParamCheck;

module.exports.ParamIsVal = ParamIsVal;
