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

module.exports.ParamCheck = ParamCheck;

module.exports.ParamIsVal = ParamIsVal;
