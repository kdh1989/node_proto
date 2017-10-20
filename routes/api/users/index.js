var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path+'/db/mysql_db').Pool; //DB Pool 객체 가져오기 

/* GET users listing. */
router.get('/', function(req, res, next) {

	var param = req.params; // Get, Delete 는 req.params에 전송값이 Post, Put은 req.body에 전송값이 존재
	console.log(param);

	pool.getConnection( function(err,connection) { // DB Pool 에서 컨넥션 가져오기 

		if(err) //에러가 있을 경우 에러문 전송
		{
			console.log(err);
			res.send(JSON.stringify(err));
		}

		//DB에 쿼리 전송 및 결과 가져오기
		connection.query('select * from test where id = ? or nick = ?', [param.id, param.nick], function (err, rows, field) { 

		if(err) 
		{
			connection.release(); //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
			res.send(JSON.stringify(err));
			
		}

		connection.release();
		res.send(JSON.stringify(rows));

		});


	});
	
	
});

// 예제 POST
router.post('/', function(req, res, next) {

	var param = req.body; // * Get, Delete 는 req.params에 전송값이 Post, Put은 req.body에 전송값이 존재
	console.log(param);

	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) // * 에러가 있을 경우 에러문 전송
		{
			console.log(err);
			res.send(JSON.stringify(err)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 
		}

		// * query 변수에 DB에 전송한 쿼리문이 들어간다.
		// * DB에 쿼리 전송 및 결과 가져오기
		var query = connection.query('CALL GetTest(?,?)', [param.id, param.nick], function (err, rows, field) { // 프로시저 SELECT 
		//var query = connection.query('CALL SetTest(?,?)', [param.id, param.nick], function (err, rows, field) { // 프로시져 INSERT 
		//var query = connection.query('insert into test SET ?', param, function (err, rows, field) { // Insert Into 방식 
		//var query = connection.query('select * from test where id = ? or nick = ?', [param.id, param.nick], function (err, rows, field) { // Select 방식

		/**
			콜백 정보
				err : 에러 정보
				rows : 결과 데이터 정보 ( 프로시저 내 결과가 SELECT 인 경우  로우 데이터와 프로시저 결과가 같이 나온다, rows[0] : 로우 데이터, rows[1] : 프로시저 결과)
				field : 결과 필드 정보
		**/

		if(err)
		{
			connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
			res.send(JSON.stringify(err)); 
			
		}

		connection.release();
		
		res.send(JSON.stringify(rows));
		//res.send(JSON.stringify(field));
		});


	});
	
});


router.get('/user', function(req, res, next) {
  res.send('user User Get');
});

module.exports = router;
