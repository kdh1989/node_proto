var Promise = require('bluebird');

var PromiseCheckParam = function(param, CheckKey) {
	
	var objParam = typeof param === 'object' ? param : typeof param === 'undefined' ? null : JSON.parse(param);
	var checkKey = CheckKey;

	//키가 존재하는지 체크 
	function isExits() {

			if(objParam === null)
				return false;

			var key = Object.keys(objParam).filter(function(value){
				return value == checkKey;
			});

			if(key.length) {
				return true;
			}
			else {
				return false;
			}
		
	}

	//키가 존재하는지 체크 
	function PromiseisExits() {
		return new Promise( function(resoleve, reject) {

			if(objParam === null)
				return reject("isExits Param ");

			var key = Object.keys(objParam).filter(function(value){
				return value == checkKey;
			});

			if(key.length) {
				return resoleve(true);
			}
			else {
				return reject("isExits Key : "+checkKey);
			}
		});
		
	}

	//값이 있는지 체크 
	function isEmpty() {

		if(objParam === null)
				return false;

		if(isExits()) { //키가 존재하는지 체크

			if(objParam[checkKey] === null || objParam[checkKey] === "") { //값이 존재하는지 체크 
				return false;
			} else {
				return true;
			}

		} else { //키가 존재하지 않는다.
			return false;
		}

	}

	//값이 있는지 체크 
	function PromiseisEmpty() {
		return new Promise( function(resoleve, reject) {

			if(objParam === null)
				return reject("isExits Param ");

			if(isExits()) { //키가 존재하는지 체크

				if(objParam[checkKey] === null || objParam[checkKey] === "") { //값이 존재하는지 체크 
					return reject("isEmpty Key : "+checkKey);
				} else {
					return resoleve(true);
				}

			} else { //키가 존재하지 않는다.
				return reject("isExits Key : "+checkKey);
			}
		});

	}

	return {
		isExits:PromiseisExits,
		isEmpty:PromiseisEmpty
	}

}

module.exports.PromiseCheckParam = PromiseCheckParam;
