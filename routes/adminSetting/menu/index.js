var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path + '/db/mysql_db').Pool; //DB Pool 객체 가져오기 
var ExcutePageQuery = require(path + '/db/mysql_db').ExcutePageQuery; //DB 페이지 처리 쿼리 객체 가져오기
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

		connection.query( //sql : 쿼리문 , values : 맵핑할 데이터 배열값을 넣을시 자동으로 1,2 이런식으로 맵핑 
			{
				sql : 	"INSERT INTO TB_MENU_INFO " + 
						"(MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU, REG_TIME) " +
						" VALUES (?, ?, ?, ?, ?, ?, NOW() )",
				values : [param.menu_seq, param.menu_name, param.url, param.depth, param.ord, param.prt_menu]
			}, function (err, rows, field) { 
			
			if(err) { //쿼리를 날렸을 경우 에러가 나왔을 시
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
				respone.setRespone(1,err);
				
				res.send(respone.getRespone());
				return;
				
			}

			connection.release();
			
			respone.setRespone(0,err,rows.affectedRows); //view에 보낼 데이터 세팅
			res.send(respone.getRespone()); //뷰에 데이터 보내기 
			
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
			}, function (err, rows, field) {
			
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

			//분기 처리 방식
			if(param.hasOwnProperty('menu_seq')) { //param 객체에 menu_seq 키가 있는지 체크 
				if(param.menu_seq.length) { //menu_seq에 데이터가 있는지 체크 
					querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" WHERE MENU_SEQ IN ( ? ) " +
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery,
									values : param.menu_seq
								};
				} else { //menu_seq에 데이터가 없다면 
					querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
								};
				}
			} else { //menu_seq 키가 존재 하지 않는 다면 
				querySql = {
									sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
									
							};
			}

			connection.query( querySql, function (err, rows, field) { // 위에서 세팅한 쿼리 json 객체를 1번쨰 파라메터로 넘긴다.
				
				if(err)
				{
					connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.

					respone.setRespone(1,err);
					res.send(respone.getRespone());

					return;
					
				}

				connection.release();
				
				data.rows = rows; // 페이징 결과를 rows라는 키에 담겨야 하기에 결과값을 data.rows에 담아둔다.

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
			}, function (err, rows, field) {
			
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

module.exports = router;
