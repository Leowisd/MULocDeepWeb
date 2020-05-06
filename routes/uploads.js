var express = require("express");
var router = express.Router({ mergeParams: true });
var sd = require("silly-datetime"),
	fs = require("fs"),
	moment = require("moment"),
	multer = require('multer');

const upload = multer({
	dest: 'data/upload'
});
router.use(upload.any());

var jobInfo = require("../models/jobInfo");
var userInfo = require("../models/userInfo");
var transporter = require("../models/emailConfig");

// max capacity for each user
var maxCapacity = 50 * 1024 * 1024; //50 MB


// JOBINFO: show the current job info
router.get("/upload/:id", function (req, res) {
	var jobId = req.params.id;
	jobId = jobId.substr(1); // delete the ':'

	var flag = 0;
	var number = taskList.length;
	jobInfo.find({ _id: jobId }, function (err, docs) {
		if (docs.length > 0)
			if (docs[0].status === 'Done') {
				flag = 1;
			}
			else if (docs[0].status === 'Processing') {
				flag = -1;
			}
		res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: Math.floor(number * 150 / 60) + 'mins ' + (number * 150 % 60) + 's'});
	});
});

// Add-on email submit on job info page
router.post("/upload/email", function (req, res) {
	let email = req.body.email.trim();
	let jobID = req.body.jobID.trim();
	jobInfo.findOne({ _id: jobID }, function (err, doc) {
		if (err) console.error(err);
		let update = { $set: { email: email } };
		jobInfo.updateOne({ _id: jobID }, update, function (err, u) {
			if (err)
				console.log(err);
			else {
				console.log("Job email was added!");
				console.log("Email: " + email + " of job:" + jobID);
				console.log("======================================");
			}
		});
	});
});

//Deal with sequence post
router.post("/upload/sequence", function (req, res) {
	var sequence = req.body.sequenceInput.trim();
	var email = req.body.emailInput1;
	var nickName = req.body.nickName1;

	var job = new jobInfo({
		nickName: nickName,
		sequence: sequence,
		email: email,
		status: "queued",
		// submittedTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
		submittedTime: moment().utcOffset("-06:00").format('YYYY-MM-DD HH:mm:ss'),
		ipAddress: get_client_ip(req)
	});
	job.file = job.id + '.fa';

	// Create a new file and write the sequence in
	console.log("Data written ready...");

	fs.writeFileSync('data/upload/' + job.file, format(sequence));
	console.log("Data written success!");
	console.log("======================================");

	// var fileSize = 0;
	fs.stat('data/upload/' + job.file, function (err, stats) {
		if (err)
			return console.error(err);
		var fileSize = stats.size * 220;

		var isEnough = 1;
		userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
			if (err)
				console.error(err);
			if (doc == undefined) {
				var user = new userInfo({
					ipAddress: get_client_ip(req),
					capacity: fileSize,
					query: 0
				});

				if (user.capacity > maxCapacity) {
					user.capacity = 0;
					isEnough = 0;
				}
				user.save(function (err, u) {
					if (err)
						console.error(err);
					else {
						console.log("Create a new user: " + get_client_ip(req));
						console.log("======================================");
					}
				})
				// ------------------
				// get user location
				// ------------------
				// var locURL = "/process/location/";
				// var locData = {ip: get_client_ip(req)};
				request("http://ip-api.com/json/" + get_client_ip(req) + "?lang=EN", { json: true }, (err, res, body) => {
					if (err) { return console.log(err); }
					var update = { $set: { lat: body.lat, lon: body.lon } };
					userInfo.updateOne({ 'ipAddress': body.query }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User location: " + body.lat + ", " + body.lon);
							console.log("======================================");
						}
					});
				});
			}
			else {
				if (doc.capacity + fileSize <= maxCapacity) {
					var update = { $set: { capacity: doc.capacity + fileSize } };
					userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User size: " + (doc.capacity + fileSize));
							console.log("======================================");
						}
					});
				}
				else isEnough = 0;
			}

			if (isEnough == 1) {

				taskList.push(job.id);

				job.save(function (err, job) {
					if (err) {
						console.log("SOMETHING WENT WRONG!");
					}
					else {
						console.log("Job was saved!");
						console.log("======================================");
					}
				});

				// Update the number of querys of current user
				userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
					let update = { $set: { query: doc.query + 1 } };
					userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User query: " + (doc.query + 1));
							console.log("======================================");
						}
					});
				});


				// send job ID email
				if (job.email !== "") {
					var mail = {
						from: 'MULocDeep<mulocdeep@gmail.com>',
						subject: 'MULocDeep: Job Infomation',
						to: email,
						text: 'Your job ID is:' + job.id,
						html: '<h3>MULocDeep</h3><br><p> Your job ID is:</p>' + job.id
					};
					transporter.sendMail(mail, function (error, info) {
						if (error) return console.log(error);
						console.log('mail sent:', info.response);
					});
				}

				res.redirect("/upload/:" + job.id);
			}
			else {
				fs.unlink('data/upload/' + job.file, function (err) {
					if (err) console.error(err);
				});
				res.render("OUTSPACE");
			}
		});
	});
});

//Deal with file post
router.post("/upload/file", function (req, res) {

	var email = req.body.emailInput2;
	var nickName = req.body.nickName2;
	// if (email !== undefined)
	// 	console.log('email: ' + email);

	var job = new jobInfo({
		nickName: nickName,
		email: email,
		status: "queued",
		// submittedTime: sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
		submittedTime: moment().utcOffset("-06:00").format('YYYY-MM-DD HH:mm:ss'),
		ipAddress: get_client_ip(req)
	});
	job.file = job.id + '.fa';

	var data = fs.readFileSync(req.files[0].path);
	fs.writeFileSync('data/upload/' + job.file, format(data.toString()));
	console.log('File: ' + req.files[0].originalname + ' uploaded successfully');
	console.log("======================================");

	fs.unlink(req.files[0].path, function (err) {
		if (err)
			console.error(err);
	}); //delete the original file

	// var fileSize = 0;
	fs.stat('data/upload/' + job.file, function (err, stats) {
		if (err)
			return console.error(err);
		var fileSize = stats.size * 220;

		var isEnough = 1;
		userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
			if (err)
				console.error(err);
			if (doc == undefined) {
				var user = new userInfo({
					ipAddress: get_client_ip(req),
					capacity: fileSize,
					query: 0
				});
				if (user.capacity > maxCapacity) {
					user.capacity = 0;
					isEnough = 0;
				}
				user.save(function (err, u) {
					if (err)
						console.error(err);
					else {
						console.log("Create a new user: " + get_client_ip(req));
						console.log("======================================");
					}
				})
				// ------------------
				// get user location
				// ------------------
				// var locURL = "/process/location/";
				// var locData = {ip: get_client_ip(req)};
				request("http://ip-api.com/json/" + get_client_ip(req) + "?lang=EN", { json: true }, (err, res, body) => {
					if (err) { return console.log(err); }
					var update = { $set: { lat: body.lat, lon: body.lon } };
					userInfo.updateOne({ 'ipAddress': body.query }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User location: " + body.lat + ", " + body.lon);
							console.log("======================================");
						}
					});
				});
			}
			else {
				if (doc.capacity + fileSize <= maxCapacity) {
					var update = { $set: { capacity: doc.capacity + fileSize } };
					userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User size: " + (doc.capacity + fileSize));
							console.log("======================================");
						}
					});
				}
				else isEnough = 0;
			}

			if (isEnough == 1) {

				taskList.push(job.id);

				job.save(function (err, job) {
					if (err) {
						console.log("SOMETHING WENT WRONG!");
					}
					else {
						console.log("Job was saved!");
						console.log("======================================");
					}
				});

				// Update the number of querys of current user
				userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
					let update = { $set: { query: doc.query + 1 } };
					userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User query: " + (doc.query + 1));
							console.log("======================================");
						}
					});
				});

				// send job ID email
				if (job.email !== "") {
					var mail = {
						from: 'MULocDeep<mulocdeep@gmail.com>',
						subject: 'MULocDeep: Job Infomation',
						to: email,
						text: 'Your job ID is:' + job.id,
						html: '<h3>MULocDeep</h3><br><p> Your job ID is:</p>' + job.id
					};
					transporter.sendMail(mail, function (error, info) {
						if (error) return console.log(error);
						console.log('mail sent:', info.response);
					});
				}

				res.redirect("/upload/:" + job.id);
			}
			else {
				fs.unlink('data/upload/' + job.file, function (err) {
					if (err) console.error(err);
				});
				res.render("OUTSPACE");
			}
		});
	});
});

function get_client_ip(req) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	ipStr = ip.split(':');
	return ipStr[ipStr.length - 1];
};

// Change mulit lines seq to one seq
function format(seq){
	let data = seq.trim().split('>');
	var res = "";
    for (let i = 0; i < data.length; i++) {
        let fasta = data[i];

        if (!fasta) continue;
		let lines = fasta.split(/\r?\n/);
		res = res + '>' + lines[0].replace(/;/, ':') + '\n';
        lines.splice(0, 1);
		// join the array back into a single string without newlines and 
        // trailing or leading spaces
		fasta = lines.join('').trim();
		res = res + fasta + '\n';
	}
	// console.log(res);
	return res.trim();
}

module.exports = router;