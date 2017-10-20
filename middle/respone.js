var respone = function() {
	var res = {};
	res.result = 0; // 0 : 정상 , 1 : 에러
	res.msg = ""; //에러 메시지
	res.data = []; //보낼 데이터 값

	//클로저에 추가했기에 위 변수는 private 아래가 public
	return {
		getRespone:function() { //뷰에 보낼 결과 값 json text로 return
			return JSON.stringify(res);
		},

		setRespone:function(result,msg,data) { //결과값 한번에 set ( 일반적으로 이 부분을 사용 )
			res.result = result;
			res.msg = msg;
			res.data = data;
		}
	}

}

module.exports.respone = respone;
