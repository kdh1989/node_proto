function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable : true,
    });
}

// 메세지 결과값 
define("RESULT_TYPE", 
	{
		"SUCCESS": 0, 
		"ERROR":1, 
		"PARAM_ERROR":2
	}
);

define("LOG_TYPE",
	{
		"ACCOUNT":0,
		"AUTH":1,
		"MENU":2,
		"MAPPING":3
		
	}
)

