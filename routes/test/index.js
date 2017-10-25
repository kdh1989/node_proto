var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path + '/db/mysql_db').Pool; //DB Pool 객체 가져오기 
var ExcutePageQuery = require(path + '/db/mysql_db').ExcutePageQuery; //DB 페이지 처리 쿼리 객체 가져오기
var respone = require(path + '/middle/respone').respone();
var paramCheck = require(path + '/middle/paramCheck');

var Promise = require('bluebird');

//유효성 검사 테스트 라우터 
router.get('/check', function(req, res, next) {

	Promise.all([ //유효성 체크 ( 배열 형태로 여러개를 걸 수 있다.)
		paramCheck.PromiseCheckParam(req.query,'param').isExits(), //키 존재 체크 
		paramCheck.PromiseCheckParam(req.query.param,'depth').isEmpty() //키와 값 존재 체크 
	]).then(function(result) { //유효성 체크 통과 
		//여기에 다음 로직을 작성해야 함 
		return new Promise( function(resoleve, reject) { //로직내에서 error 발생시 catch로 보내기 위해 프로미스 함수 형태로 만듬 

			var param = JSON.parse(req.query.param); 
			
			pool.getConnection( function(err,connection) {
				
				if(err) { 
					
					return reject(err); //err를 catch로 넘겨준다 
				}

				connection.query(
					{
						sql : 	"SELECT MENU_NAME, URL FROM TB_MENU_INFO WHERE DEPTH = ? ORDER BY ORD",
						values : [param.depth]
					}, function (err, rows, field) {
					
					if(err) {
						connection.release();  

						return reject(err); //err를 catch로 넘겨준다 
						
					}

					connection.release();
					
					respone.setRespone(0,err,rows);
					res.send(respone.getRespone());
					
				});
			});

		});

	}).catch(function(err) { //유효성 체크 에러 
		console.log(err);
		respone.setRespone(1,err);
		res.send(respone.getRespone());
	});

});

module.exports = router;