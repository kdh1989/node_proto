var express = require('express');
var router = express.Router();
var path = process.cwd();
var pool = require(path+'/db/mysql_db').Pool; //DB Pool 객체 가져오기 

/* GET users listing. */

// 예제 POST
router.post('/set', function(req, res, next) {

	var param = req.body.param; // * Get, Delete 는 req.params에 전송값이 Post, Put은 req.body에 전송값이 존재
	console.log(param);

	var respone = {};
	respone.result = 0;
	respone.msg = "";

	/*
	for(key in param) {
		if(param[key] == null || param[key] == "")
		{
			console.log('null param : ', key);
			//return false;
		}
	}


	param.use_yn = 0;
	param.oper_id = "admin";

	var respone = {};
	respone.result = 0;
	respone.msg = "";

	res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 

	return;
	*/

	res.send(JSON.stringify(respone));
	return;

	pool.getConnection( function(err,connection) {  // * DB Pool 에서 컨넥션 가져오기 

		if(err) // * 에러가 있을 경우 에러문 전송
		{
			respone.result = 0;
			respone.msg = err;
			console.log(respone);
			res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 
		}

		var query = connection.query(
			{
				sql : 	"INSERT INTO TB_FLD_BOOST " + 
						"(NAME, ST_TIME, ED_TIME, WORLD_NUM, BOOST_TYPE, WEIGHTING, MSG, ROLL_CNT, USE_YN, OPER_ID, REG_TIME) " +
						" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() )",
				values : [param.name, param.st_time, param.ed_time, param.world_num_array[0], param.boost_type, param.weighting, param.msg, param.roll_cnt, param.use_yn, param.oper_id]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err)
			{
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
				respone.result = 0;
				respone.msg = err;
				console.log(respone);
				res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 
				
			}

			connection.release();
			
			respone.result = 0;
			respone.msg = err;
			respone.data = rows;
			//console.log(respone);
			res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 

			//res.send(JSON.stringify(rows););
			
		});


	});
	
});


router.post('/get', function(req, res, next) {
	var param = req.body.param;
	console.log(param);
	
	var respone = {};
	respone.result = 0;
	respone.msg = "";

	pool.getConnection( function(err,connection) {
		if(err) // * 에러가 있을 경우 에러문 전송
		{
			respone.result = 0;
			respone.msg = err;
			console.log(respone);
			res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 
		}

		var query = connection.query(
			{
				sql : 	"SELECT NAME, ST_TIME, ED_TIME, WORLD_NUM, BOOST_TYPE, WEIGHTING, MSG, ROLL_CNT, USE_YN  FROM TB_FLD_BOOST WHERE FLD_BOOST_SEQ = ?",
				values : [param.fld_boost_seq]
			}, function (err, rows, field) { // 프로시저 SELECT 
			
			if(err)
			{
				connection.release();  //Pool 방식을 사용 중이기에 꼭 release를 해서 Pool에 컨넥션을 돌려줘야 한다.
				respone.result = 0;
				respone.msg = err;
				console.log(respone);
				res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 
				
			}

			connection.release();
			
			respone.result = 0;
			respone.msg = err;
			respone.data = rows;
			//console.log(respone);
			res.send(JSON.stringify(respone)); // * JSON.stringify은 array를 json 형식으로 바꿔주는 함수 

			//res.send(JSON.stringify(rows););
			
		});
	});
});

module.exports = router;
