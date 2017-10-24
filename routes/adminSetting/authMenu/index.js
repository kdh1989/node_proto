var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path+'/db/mysql_db').Pool; //DB Pool 객체 가져오기 
var ExcutePageQuery = require(path + '/db/mysql_db').ExcutePageQuery; //DB Pool 객체 가져오기 
var respone = require(path + '/middle/respone').respone();

/* GET users listing. */

router.get('/getMenu', function(req, res, next) {
	var param = JSON.parse(req.query.param);
	
	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			return;
		}

		var query = connection.query(
			{
				sql : 	" SELECT A.MENU_SEQ, A.MENU_NAME, A.URL, A.DEPTH, A.ORD, A.PRT_MENU " + 
						" FROM TB_MENU_INFO A " +
						" INNER JOIN TB_AUTHMENU_MAPP B " +
						" ON A.MENU_SEQ = B.MENU_SEQ " +
						" WHERE B.AUTH_SEQ = ? "+
						" ORDER BY A.DEPTH, A.PRT_MENU, A.ORD ",
				values : [param.auth_seq]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err) {
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
			}

			connection.release();
			
			respone.setRespone(0, err, rows);
			res.send(respone.getRespone());
			
		});

	});
	
});

// 예제 POST
router.post('/getMenu', function(req, res, next) {

	var param = req.body.param; // * Get, Delete 는 req.params에 전송값이 Post, Put은 req.body에 전송값이 존재
	
	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			return;
		}

		var query = connection.query(
			{
				sql : 	" SELECT A.MENU_SEQ, A.MENU_NAME, A.URL, A.DEPTH, A.ORD, A.PRT_MENU " + 
						" FROM TB_MENU_INFO A " +
						" INNER JOIN TB_AUTHMENU_MAPP B " +
						" ON A.MENU_SEQ = B.MENU_SEQ " +
						" WHERE B.AUTH_SEQ = ? "+
						" ORDER BY A.DEPTH, A.PRT_MENU, A.ORD ",
				values : [param.auth_seq]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err) {
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
			}

			connection.release();
			
			respone.setRespone(0, err, rows);
			res.send(respone.getRespone());
			
		});

	});
	
});


// 권한별 맵핑 리스트 내려주기 
router.get('/list', function(req, res, next) {

	var param = JSON.parse(req.query.param);
	
	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			return;
		}

		var query = connection.query(
			{
				sql : 	" SELECT A.MENU_SEQ, A.MENU_NAME, A.DEPTH, A.ORD, A.PRT_MENU, IFNULL(B.AUTH_SEQ, 0) AS isMenu " + 
						" FROM TB_MENU_INFO A " +
						" LEFT JOIN TB_AUTHMENU_MAPP B " +
						" ON A.MENU_SEQ = B.MENU_SEQ AND B.AUTH_SEQ = ? " +
						" ORDER BY A.DEPTH, A.PRT_MENU, A.ORD ",
				values : [param.auth_seq]
			}, function (err, rows, field) {
			
			if(err) {
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
			}

			connection.release();
			
			respone.setRespone(0, err, rows);
			res.send(respone.getRespone());
			
		});

	});
	
});

module.exports = router;
