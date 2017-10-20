var respone = function() {
	var res = {};
	res.result = 0;
	res.msg = "";
	res.data = [];

	return {
		getRespone:function() {
			return JSON.stringify(res);
		},

		setResult:function(result) {
			res.result = result;
		},


		setMsg:function(msg) {
			res.msg = msg;
		},

		setData:function(data) {
			res.data = data;
		}
	}

}

module.exports = respone;
