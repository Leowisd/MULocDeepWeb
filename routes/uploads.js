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
var maxCapacity = 100 * 1024 * 1024; //100 MB


// JOBINFO: show the current job info
router.get("/upload/:id", function (req, res) {
	var jobId = req.params.id;
	jobId = jobId.substr(1); // delete the ':'

	var flag = 0;
	var number = taskList.length;
	jobInfo.find({ _id: jobId }, function (err, docs) {
		if (err) {
			console.error(err);
		}
		if (docs.length > 0)
			if (docs[0].status === 'Done') {
				flag = 1;
			}
			else if (docs[0].status === 'Processing') {
				flag = -1;
			}

		// =================================
		// Calculating estimated waiting time 
		// the estimated function is: totalSecs = 0.5 * totalSeqs + 27
		// =================================
		let numberOfSeq = 0;
		let timecal = "";

		// When the task is in the waiting queue
		if (flag == 0) {
			// only one task in the queue and no job is processing.
			if (taskList.length == 1 && curJobID == null) {
				jobInfo.findOne({ _id: taskList[0] }, function (err, doc) {
					numberOfSeq = doc.proteins;
					totalSec = numberOfSeq * 0.5 + 27;
					timecal = Math.floor(totalSec / 60) + 'mins ' + (totalSec % 60) + 's';
					res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: timecal });

				})
			}
			// only one task in the queue and a job is processing.
			else if (taskList.length == 1 && curJobID != null) {
				jobInfo.findOne({ _id: curJobID }, function (err, doc0) {
					numberOfSeq = doc0.proteins;
					jobInfo.findOne({ _id: taskList[0] }, function (err, doc1) {
						numberOfSeq = numberOfSeq + doc1.proteins;
						totalSec = numberOfSeq * 0.5 + 27;
						timecal = Math.floor(totalSec / 60) + 'mins ' + (totalSec % 60) + 's';
						res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: timecal });
					});
				})
			}
			// More than one tasks in the queue
			else if (taskList.length > 1 && curJobID != null) {
				jobInfo.findOne({ _id: curJobID }, function (err, doc) {
					numberOfSeq = doc.proteins;
					asyncloopCalculateTime(0, 0, function (temp) {
						numberOfSeq = numberOfSeq + temp;
						totalSec = numberOfSeq * 0.5 + 27
						timecal = Math.floor(totalSec / 60) + 'mins ' + (totalSec % 60) + 's';
						res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: timecal });
					});
				})
			}
			else res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: "loading" });// in case 
		}
		// When is task is processing
		else if (flag == -1 && curJobID != null) {
			jobInfo.findOne({ _id: curJobID }, function (err, doc) {
				numberOfSeq = doc.proteins;
				totalSec = numberOfSeq * 0.5 + 27;
				timecal = Math.floor(totalSec / 60) + 'mins ' + (totalSec % 60) + 's';
				res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: timecal });
			})
		}
		else res.render("JOBINFO", { jobId: jobId, flag: flag, number: number, time: "loading" }); // in case
	});
});

function asyncloopCalculateTime(i, temp, callback) {
	if (i < taskList.length) {
		jobInfo.findOne({ _id: taskList[i] }, function (err, doc) {
			temp = temp + doc.proteins;
			asyncloopCalculateTime(i + 1, temp, callback);
		})
	}
	else callback(temp);
}

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
		ipAddress: get_client_ip(req),
		size: 0,
		proteins: 0
	});
	job.file = job.id + '.fa';

	// Create a new file and write the sequence in
	console.log("Data written ready...");

	fs.writeFileSync('data/upload/' + job.file, format(sequence));
	console.log("Data written success!");
	console.log("======================================");

	// var fileSize = 0;
	var fileSize = fs.statSync('data/upload/' + job.file).size * 30;
	// fs.stat('data/upload/' + job.file, function (err, stats) {
	// 	if (err)
	// 		return console.error(err);
	// 	var fileSize = stats.size * 30;

	var isEnough = 1;
	userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
		if (err)
			console.error(err);
		if (doc == undefined) {
			var user = new userInfo({
				ipAddress: get_client_ip(req),
				capacity: fileSize,
				query: 0,
				proteins: 0
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

			job.proteins = getNumofProteins(sequence);
			job.size = fileSize;
			job.save(function (err, job) {
				if (err) {
					console.log("SOMETHING WENT WRONG!");
				}
				else {
					console.log("job size is :" + job.size);
					console.log("Job was saved!");
					console.log("======================================");
				}
			});

			// Update the number of querys of current user
			userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
				let update = { $set: { query: doc.query + 1, proteins: doc.proteins + getNumofProteins(sequence) } };
				userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
					if (err)
						console.log(err);
					else {
						console.log("User info was updated!");
						console.log("User query: " + (doc.query + 1));
						console.log("User Proteins: " + (doc.proteins + getNumofProteins(sequence)));
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
	// });
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
		ipAddress: get_client_ip(req),
		size: 0,
		proteins: 0
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

	var fileSize = fs.statSync('data/upload/' + job.file).size * 30;
	// fs.stat('data/upload/' + job.file, function (err, stats) {
	// 	if (err)
	// 		return console.error(err);
	// 	var fileSize = stats.size * 220;

	var isEnough = 1;
	userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
		if (err)
			console.error(err);
		if (doc == undefined) {
			var user = new userInfo({
				ipAddress: get_client_ip(req),
				capacity: fileSize,
				query: 0,
				proteins: 0
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

			job.proteins = getNumofProteins(data.toString());
			job.size = fileSize;
			job.save(function (err, job) {
				if (err) {
					console.log("SOMETHING WENT WRONG!");
				}
				else {
					console.log("Job was saved!");
					console.log("job size is :" + job.size);
					console.log("======================================");
				}
			});

			// Update the number of querys of current user
			userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
				let update = { $set: { query: doc.query + 1, proteins: doc.proteins + getNumofProteins(data.toString()) } };
				userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
					if (err)
						console.log(err);
					else {
						console.log("User info was updated!");
						console.log("User query: " + (doc.query + 1));
						console.log("User proteins: " + (doc.proteins + getNumofProteins(data.toString())));
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
	// });
});

function get_client_ip(req) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	ipStr = ip.split(':');
	return ipStr[ipStr.length - 1];
};

// Change mulit lines seq to one seq
function format(seq) {
	let data = seq.trim().split('>');
	var res = "";
	for (let i = 0; i < data.length; i++) {
		let fasta = data[i];

		if (!fasta) continue;
		let lines = fasta.split(/\r?\n/);
		res = res + '>' + lines[0] + '\n';
		lines.splice(0, 1);
		// join the array back into a single string without newlines and 
		// trailing or leading spaces
		fasta = lines.join('').trim();
		res = res + fasta + '\n';
	}
	// console.log(res);
	return res.trim();
}

function getNumofProteins(seq) {
	return seq.trim().split('>').length - 1;
}

module.exports = router;