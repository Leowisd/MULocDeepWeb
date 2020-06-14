/* -------------------------------------------------------------------------- */
/*                            Result Router Module		                      */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Parameters ------------------------------- */

var express = require("express");
var router = express.Router();

var jobInfo = require("../models/jobInfo");
var userInfo = require("../models/userInfo");

/* --------------------------------- Routers -------------------------------- */

// Search Post with ID
router.post("/result/id", function (req, res) {
	var jobId = req.body.JobIDInput.trim();
	res.redirect("/jobs/:" + jobId);
});

// Search Post with nickname
router.post("/result/name", function (req, res) {
	var name = req.body.NicknameInput.trim();

	jobInfo.find({ 'nickName': { $regex: name }, 'ipAddress': get_client_ip(req) }, function (err, docs) {
		if (err)
			console.error(err);
		userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
			if (err)
				console.error(err);
			res.render("JOBSLIST", { docs: docs, ip: get_client_ip(req), capacity: doc.capacity });
		});
	});
});

// Search Post with sequence
router.post("/result/seq", function (req, res) {
	var seq = req.body.sequenceInput.trim();

	jobInfo.find({ 'sequence': seq, 'ipAddress': get_client_ip(req) }, function (err, docs) {
		if (err)
			console.error(err);
		userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
			if (err)
				console.error(err);
			res.render("JOBSLIST", { docs: docs, ip: get_client_ip(req), capacity: doc.capacity });
		});
	});
});

/**
 * Get cur user's IP address
 * @param {*} req 
 */
function get_client_ip(req) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	ipStr = ip.split(':');
	return ipStr[ipStr.length - 1];
};

module.exports = router;