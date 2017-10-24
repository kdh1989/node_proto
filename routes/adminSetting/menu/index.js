var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path + '/db/mysql_db').Pool; //DB Pool 객체 가져오기 
var ExcutePageQuery = require(path + '/db/mysql_db').ExcutePageQuery; //DB 페이지 처리 쿼리 객체 가져오기
var respone = require(path + '/middle/respone').respone();

// 메뉴 등록
router.post('/set', function(req, res, next) {

	var param = req.body.param; // * Get, Delete 는 req.params 또는 req.query 에 전송값이 Post, Put은 req.body에 전송값이 존재
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
						"( MENU_NAME, URL, DEPTH, ORD, PRT_MENU, REG_TIME) " +
						" VALUES ( ?, ?, ?, ?, ?, NOW() )",
				values : [ param.menu_name, param.url, param.depth, param.ord, param.prt_menu]
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


// 메뉴 수정 
router.post('/update', function(req, res, next) {

	var param = req.body.param; 
	console.log(param);

	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) { // * 에러가 있을 경우 에러문 전송
			respone.setRespone(1,err);
			res.send(respone.getRespone());
			return;
		}

		connection.query( //sql : 쿼리문 , values : 맵핑할 데이터 배열값을 넣을시 자동으로 1,2 이런식으로 맵핑 
			{
				sql : 	"UPDATE TB_MENU_INFO SET " + 
						"MENU_NAME = ?, URL = ?, DEPTH = ?, ORD = ?, PRT_MENU = ? " +
						" WHERE MENU_SEQ = ? ",
						
				values : [ param.menu_name, param.url, param.depth, param.ord, param.prt_menu, param.menu_seq]
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

//특정 카테고리 메뉴정보 가져오기 
router.get('/get', function(req, res, next) {
	var param = JSON.parse(req.query.param); //일반적으로 사용되는 key에 값을 담아서 보내는 방식  URL?파마레터키=값 
	console.log(param.depth);
	
	pool.getConnection( function(err,connection) {
		
		if(err) { 
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
				connection.release();  

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

//메뉴 관리 전체 리스트 불러오기
router.get('/list', function(req, res, next) {
	var param = JSON.parse(req.query.param);
	console.log(param);
	
	//Count query를 만들어서 던지면 ExcutePageQuery내에서 해당 쿼리 결과를 records로 사용 ( 수정 이유  : Count마다 조건을 달리 줘야 되야되서 유연하게 사용하기 위해 )
	var query = {
					sql : "SELECT COUNT(*) as cnt FROM TB_MENU_INFO"
					
				};

	//페이징 쿼리 limitQuery : 페이징 조건문 스트링, data 에 rows를 제외한 total, page, records 데이터 나옴 
	ExcutePageQuery(query, param, function(err, limitQuery, data) {

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

			connection.query( {
				sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
											" ORDER BY DEPTH, PRT_MENU, ORD " +limitQuery
			}, function (err, rows, field) { 
				
				if(err)
				{
					connection.release();  

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

//메뉴 관리에서 메뉴 검색
router.get('/search', function(req, res, next) {
	var param = JSON.parse(req.query.param);
	console.log(param);
	
	//Count query에 파라메터도 추가해서 적용  ( LIKE에 % 사용하려면 values에 스트링 값을 넣을떄 %를 추가해준다.)
	var query = {
					sql : "SELECT COUNT(*) as cnt FROM TB_MENU_INFO WHERE MENU_NAME LIKE ? ",
					values :  ["%"+param.menu_name+"%"]
	};

	ExcutePageQuery(query, param, function(err, limitQuery, data) {

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

			connection.query( {
				sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
						" WHERE MENU_NAME LIKE ? " +
						" ORDER BY DEPTH, PRT_MENU, ORD " + limitQuery,
				values : ["%"+param.menu_name+"%"]
			}, function (err, rows, field) { 
				
				if(err)
				{
					connection.release();  

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


//특정 메뉴 정보만 가져오기 
router.get('/getMenu', function(req, res, next) {
	var param = JSON.parse(req.query.param); 
	console.log(param);
	
	pool.getConnection( function(err,connection) {
		
		if(err) { 
			respone.setRespone(1,err);
			res.send(respone.getRespone());

			return;
		}

		connection.query(
			{
				sql : 	"SELECT MENU_SEQ, MENU_NAME, URL, DEPTH, ORD, PRT_MENU FROM TB_MENU_INFO " + 
						" WHERE MENU_SEQ = ? ",
				values : [param.menu_seq]
			}, function (err, rows, field) {
			
			if(err) {
				connection.release(); 

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
