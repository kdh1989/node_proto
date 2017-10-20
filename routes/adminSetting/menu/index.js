var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path + '/db/mysql_db').Pool; //DB Pool 객체 가져오기 
var ExcutePageQuery = require(path + '/db/mysql_db').ExcutePageQuery; //DB Pool 객체 가져오기 
var respone = require(path + '/middle/respone').respone();

// 예제 POST
router.post('/set', function(req, res, next) {

	var param = req.body.param; // * Get, Delete 는 req.params에 전송값이 Post, Put은 req.body에 전송값이 존재
	console.log(param);

	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			return;
		}

		connection.query(
			{
				sql : 	"INSERT INTO TB_MENU_INFO " + 
						"(MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU, REG_TIME) " +
						" VALUES (?, ?, ?, ?, ?, ?, NOW() )",
				values : [param.menu_seq, param.menu_name, param.url, param.depth, param.ord, param.prt_menu]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err) {
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
				respone.setRespone(1,err);
				
				res.send(respone.getRespone());
				return;
				
			}

			connection.release();
			
			respone.setRespone(0,err,rows.affectedRows);
			res.send(respone.getRespone());
			
		});


	});
	
});


router.post('/get', function(req, res, next) {
	var param = req.body.param;
	console.log(param);
	
	pool.getConnection( function(err,connection) {
		
		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());

			return;
		}

		connection.query(
			{
				sql : 	"SELECT MENU_NAME, URL FROM TB_MENU_INFO WHERE DEPTH = ? ORDER BY ORD",
				values : [param.depth]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err) {
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
				
			}

			connection.release();
			
			respone.setRespone(0,err,rows);
			res.send(respone.getRespone());
			
		});
	});
});

router.post('/list', function(req, res, next) {
	var param = req.body.param;
	console.log(param);
	
	//페이징 쿼리 limitQuery : 페이징 조건문 스트링, data 에 rows를 제외한 total, page, records 데이터 나옴 
	ExcutePageQuery("TB_MENU_INFO", req.body.param, function(err, limitQuery, data) {

		if(err) {
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			
			return;
		}

		pool.getConnection( function(err,connection) {

			if(err) // * 에러가 있을 경우 에러문 전송
			{
				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
			}

			var querySql;

			if(param.hasOwnProperty('menu_seq')) {
				if(param.menu_seq.length) {
					querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" WHERE MENU_SEQ IN ( ? ) " +
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery,
									values : param.menu_seq
								};
				} else {
					querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
								};
				}
			} else {
				querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
							};
			}

			connection.query( querySql, function (err, rows, field) { // 프로시저 SELECT 
				
				if(err)
				{
					connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

					respone.setRespone(1,err);
					res.send(respone.getRespone());

					return;
					
				}

				connection.release();
				
				data.rows = rows;

				respone.setRespone(0,err,data);
				res.send(respone.getRespone());

			});
		});
	});
});

router.post('/search', function(req, res, next) {
	var param = req.body.param;
	console.log(param);
	
	pool.getConnection( function(err,connection) {
		if(err) // * 에러가 있을 경우 에러문 전송
		{
			respone.setRespone(1,err);
			res.send(respone.getRespone());

			return;
		}

		var query = connection.query(
			{
				sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
						" WHERE MENU_NAME LIKE ? " +
						" ORDER BY DEPTH, PRT_MENU, ORD ",
				values : [param.menu_name]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err)
			{
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
				
				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
				
			}

			connection.release();
			
			respone.setRespone(0,err,rows);
			res.send(respone.getRespone());

		});
	});
});


router.post('/test', function(req, res, next) {
	var param = req.body.param;
	console.log(req.body.param);

	ExcutePageQuery("TB_MENU_INFO", req.body.param, function(err, limitQuery, data) {

		if(err) {

			respone.setRespone(1,err);
			res.send(respone.getRespone());

			return;
		}

		pool.getConnection( function(err,connection) {
			if(err) // * 에러가 있을 경우 에러문 전송
			{
				respone.setRespone(1,err);
				res.send(respone.getRespone());

				return;
			}
			
			//분기 쿼리 처리 
			var querySql = {};

			if(param.hasOwnProperty('menu_seq'))
			{
				if(param.menu_seq.length) {
					querySql = {
									sql : 	"SELECT MENU_SEQ, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" WHERE MENU_SEQ IN ( ? ) " +
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery,
									values : param.menu_seq
								};
				} else {
					querySql = {
									sql : 	"SELECT MENU_SEQ, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
								};
				}
			} else {
				querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
							};
			}

			var query = connection.query(
					querySql
				, function (err, rows, field) { // 프로시저 SELECT 
				
				if(err)
				{
					connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

					respone.setRespone(1,err);
					res.send(respone.getRespone());

					return;
					
				}

				connection.release();
				
				data.rows = rows;

				respone.setRespone(0, err, data);
				res.send(respone.getRespone());

			});
		});

	});

	
});

module.exports = router;
