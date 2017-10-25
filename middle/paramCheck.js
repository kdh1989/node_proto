var Promise = require('bluebird');

var CheckParam = function(param, CheckKey) {
	
	var objParam = typeof param === 'object' ? param : typeof param === 'undefined' ? null : JSON.parse(param);
	var checkKey = CheckKey;

	//키가 존재하는지 체크 
	function _isExits() {

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
	function _PromiseisExits() {
		return new Promise( function(resoleve, reject) {

			if(objParam === null)
				return reject("isExits Param ");

			if(_isExits())
			{
				return resoleve(true);
			}
			else {
				return reject("isExits Key : "+checkKey);
			}

		});
		
	}

	//값이 있는지 체크 
	function _isEmpty() {

		var isArray = typeof objParam[checkKey] === 'object' ? true : false; // 내부 값이 오브젝트 인지 체크 
		
		if(isArray) { //값이 오브젝트 형태이면 
			if(objParam[checkKey].length) { //길이값으로 존재하는지 체크 
				return true;
			} else {
				return false;
			}
		}
		else { //값이 단일 형태이면 
			if(objParam[checkKey] === null || objParam[checkKey] === "") { //값이 존재하는지 체크 
				return false;
			} else {
				return true;
			}
		}


	}

	//값이 있는지 체크 
	function _PromiseisEmpty() {
		return new Promise( function(resoleve, reject) {

			if(objParam === null)
				return reject("isExits Param ");

			if(_isExits()) { //키가 존재하는지 체크

				if(_isEmpty()) { //값이 존재하는지 체크 
					return resoleve(true);
				} else {
					return reject("isEmpty Key : "+checkKey);
				}

			} else { //키가 존재하지 않는다.
				return reject("isExits Key : "+checkKey);
			}
		});

	}

	function _isDuplicate() {

		var isArray = typeof objParam[checkKey] === 'object' ? true : false;

		if(isArray) { //오브젝트만 중복 체크 가능

			var uniq = objParam[checkKey].reduce(function(a,b) {
				if(a.indexOf(b) < 0)
					a.push(b);
				return a;
			},[]);

			//console.log(uniq.length != objParam[checkKey].length);

			if(uniq.length != objParam[checkKey].length) //중복 존재 
				return false;
			else
				return true;

		} else { //오브젝트가 아니기에 중복체크 못함
			return false;
		}

	}

	function _PromiseisDuplicate() {
		return new Promise( function(resoleve, reject) {

			if(objParam === null)
				return reject("isExits Param ");

			if(_isExits()) { //키가 존재하는지 체크

				if(_isDuplicate()) { //값이 존재하는지 체크 
					return resoleve(true);
				} else {
					return reject("isDuplicate Key : "+checkKey);
				}

			} else { //키가 존재하지 않는다.
				return reject("isExits Key : "+checkKey);
			}
		});

	}

	return {
		isExits:_PromiseisExits,
		isEmpty:_PromiseisEmpty,
		isDuplicate:_PromiseisDuplicate
	}

}

module.exports.CheckParam = CheckParam;
