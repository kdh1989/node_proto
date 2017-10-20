var mysql = require('mysql');
var dbconfig   = require('../config/mysql_config');
//console.log(dbconfig);
var pool = mysql.createPool(
	dbconfig
);

//페이징할 테이블의 카운트 쿼리
var CountQuery = function (table, callback ) {

	const query = "SELECT COUNT(*) AS cnt FROM " + table;

	pool.getConnection( function(err, connection) {

		if(err) {
			console.log(err);
			return callback(err);
		}

		connection.query(query, function (err, rows) {

			if(err) {
				connection.release();
				return callback(err);
				
			}

			connection.release();
			return callback(err, rows[0].cnt);

		});


	});
};

//페이징 쿼리 만드는 작업
var PageQuery = function ( param, callBack ) {
	var result = {};

	if(param.page < 1)  param.page = 1;
	if(param.pageSize < 1) param.pageSize = 10;

	const first = ( param.page - 1 ) * param.pageSize;
	var query = " LIMIT " + first + ", " + param.pageSize;

	result.total = 0;
	result.page = param.page;
	result.records = param.cnt;

	if( result.records > 0 ) {
		if(result.records % param.pageSize==0) {
			result.total = result.records / param.pageSize;
		}
		else {
			result.total = (result.records / param.pageSize) + 1;
		}
	}
	else {
		result.total = 0;
	}

	//소숫점 자르기
	result.total = parseInt(result.total);

	return callBack(query,result);

};

//페이징 쿼리 실행
var ExcutePageQuery = function (table, param, callBack) {

	CountQuery(table, function(err,count) {

		if(err) {
			return callBack(err);
			
		}

		param.cnt = count;

		PageQuery(param,function(query, result) {

			return callBack(null, query, result);

		});

	});

};

module.exports.Pool = pool;

module.exports.ExcutePageQuery = ExcutePageQuery;