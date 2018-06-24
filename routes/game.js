var express = require('express');
var router = express.Router();
var Raven = require('raven');
var RateLimit = require('express-rate-limit');
var cache = require('memory-cache');
var screen = require('screen-init')();

var postconfe = new RateLimit({
	 windowMs: 5*60*1000,
   delayAfter: 1,
   delayMs: 3*1000,
   max: 1,
   message: "Rate Limit"
});

router.get('/:id', function(req, res) {
	try {

	} catch (e) {

	} finally {

	}
});

router.post('/', function(req, res) {
	ip  = req.headers['x-real-ip'] || req.connection.remoteAddress;
	// Vacio
	if(Object.keys(req.body).length === 0 || !req.body.titulo || !req.body.confesion) {
  	res.send(JSON.stringify({"status": 500, "error": "Sin datos", "response": null}));
		return false;
	}
	try{
		screen.exec();
		res.send(JSON.stringify({"status": 200, "error": null, "response": 1}));
	}catch (e) {
		Raven.captureException(e)
    res.send(JSON.stringify({"status": 500, "error": e, "response": null}));
  }
});

module.exports = router;
