var http = require('http');
function setError(num, msg){
	var msg = msg || http.STATUS_CODES[num];
	var err = new Error(msg);
	err.status = num || 404;
	return err;
};
module.exports.setError = setError;