var express = require("express");
var router = express.Router({ mergeParams: true });
var sd = require("silly-datetime"),
	fs = require("fs"),
	archiver = require('archiver'),
	schedule = require("node-schedule"),
	moment = require("moment"),
	request = require("request");
exec = require('child_process').exec;

var jobInfo = require("../models/jobInfo");
var userInfo = require("../models/userInfo");
var transporter = require("../models/emailConfig");

// Set Process Count and Wailting List
taskList = [];
var curProcess = 0;

// INDEX: show the landing page
router.get("/", function (req, res) {
	// console.log(get_client_ip(req));
	res.render("UPLOAD");
});

router.get("/map", function (req, res) {
	res.render("MAP");
});

router.get("/contact", function (req, res) {
	res.render("CONTACT");
});

router.get("/tools", function (req, res) {
	res.render("TOOLS");
});

// Set a rule schedule to run tasks per 5s
var rule = new schedule.RecurrenceRule();
var ruleTime = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
rule.second = ruleTime;
schedule.scheduleJob(rule, function () {
	if (curProcess == 0 && taskList.length > 0) {
		curProcess = 1;
		console.log("Should run task");

		var curJob = taskList.shift();

		jobInfo.findById(curJob, function (err, job) {
			if (err)
				console.error(err);
			else {
				var updates = { $set: { status: 'Processing' } };
				jobInfo.updateOne({ _id: job.id }, updates, function (err, job) {
					if (err) {
						console.log(err);
					}
					else console.log("Job status changed...");
				});

				// --------------------------
				// Run the predict script
				// --------------------------
				// python predict.py -input ./wiki_seq.txt -output ./test --no-att
				var arg1 = 'data/upload/' + job.file;
				var arg2 = 'data/results/' + job.id + '/';
				var cmd = 'python MULocDeep/predict.py -input ' + arg1 + ' -output ' + arg2 + ' --no-att';
				var workprecessor = exec(cmd, function (error, stdout, stderr) {
					if (error) {
						console.info('stderr : ' + stderr);
						var updates = { $set: { status: 'error' } };
						jobInfo.updateOne({ _id: job.id }, updates, function (err, job) {
							if (err) {
								console.log(err);
							}
							else {
								console.log("SOMETHING WENT WRONG WHEN PREDICTING!");
								// console.log(job);
							}
						});
						// return;
					}

					curProcess = 0;
					var updates = { $set: { status: 'Done' } };
					jobInfo.updateOne({ _id: job.id }, updates, function (err, job) {
						if (err) {
							console.log(err);
						}
						else {
							console.log("Job was updated!");
							console.log("======================================");
							// console.log(job);
						}
					});

					// send success email 
					if (job.email !== "") {
						var mail = {
							from: 'MULocDeep<mulocdeep@gmail.com>',
							subject: 'MULocDeep: Job Infomation',
							to: job.email,
							text: 'Your job: ' + job.id + ' has completed!',
							html: '<h3>MULocDeep</h3><br><p> Your job :' + job.id + "has completed!</p>"
						};
						transporter.sendMail(mail, function (error, info) {
							if (error) return console.log(error);
							console.log('mail sent:', info.response);
						});
					}

					// -----------------------
					// Compress results data
					// -----------------------
					// create a file to stream archive data to.
					var output = fs.createWriteStream('data/results/' + job.id + '/' + job.id + '.zip');
					var archive = archiver('zip', {
						zlib: { level: 9 } // Sets the compression level.
					});

					// listen for all archive data to be written
					// 'close' event is fired only when a file descriptor is involved
					output.on('close', function () {
						console.log(archive.pointer() + ' total bytes');
						console.log('archiver has been finalized and the output file descriptor has closed.');
						console.log('=======================================================================');
					});

					// This event is fired when the data source is drained no matter what was the data source.
					// It is not part of this library but rather from the NodeJS Stream API.
					output.on('end', function () {
						console.log('Data has been drained');
					});

					// good practice to catch warnings (ie stat failures and other non-blocking errors)
					archive.on('warning', function (err) {
						if (err.code === 'ENOENT') {
							// log warning
						} else {
							// throw error
							throw err;
						}
					});

					// good practice to catch this error explicitly
					archive.on('error', function (err) {
						throw err;
					});

					// pipe archive data to the file
					archive.pipe(output);

					// append a file from stream
					var file1 = 'data/results/' + job.id + '/attention_weights.txt';
					archive.append(fs.createReadStream(file1), { name: 'attention_weights.txt' });
					var file2 = 'data/results/' + job.id + '/sub_cellular_prediction.txt';
					archive.append(fs.createReadStream(file2), { name: 'sub_cellular_prediction.txt' });
					var file3 = 'data/results/' + job.id + '/sub_organellar_prediction.txt';
					archive.append(fs.createReadStream(file3), { name: 'sub_organellar_prediction.txt' });

					// finalize the archive (ie we are done appending files but streams have to finish yet)
					// 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
					archive.finalize();
				});
			}
		});
	}
});

// clean data per day
// schedule.scheduleJob('0 * * * * *', function () {
schedule.scheduleJob('0 0 0 */3 * *', function () {
	console.log("Schedule jobs cleaning begins...");
	var curTime = moment().utcOffset("-06:00").format('YYYY-MM-DD HH:mm:ss');
	var curDay = parseInt(curTime.substring(8, 10));
	var curMonth = parseInt(curTime.substring(5, 7));
	var curYear = parseInt(curTime.substring(0, 4));
	curDay -= 4; //loose to 4 days
	if (curDay <= 0) {
		curDay = 30 + curDay;
		curMonth--;
		if (curMonth <= 0) {
			curMonth = 12 + curMonth;
			curYear--;
		}
	}
	var due = curYear + "-" + curMonth + "-" + curDay + " 00:00:00";
	// var due = '2020' + "-" + curMonth + "-" + curDay + " 00:00:00";

	jobInfo.find({ 'submittedTime': { $lte: due } }, function (err, docs) {
		if (err)
			return console.error(err);
		if (docs != undefined) {
			asyncLoop(0, docs, function(){
				jobInfo.deleteMany({ 'submittedTime': { $lte: due } }, function (err) {
					if (err)
						return console.error(err);
					return console.log("Clean Old Tasks Historys and Files at:" + curTime);
				});
			});
		}
	});
});

function deleteFolder(path) {
	let files = [];
	if (fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function (file, index) {
			let curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) {
				deleteFolder(curPath);
			} else {
				fs.unlink(curPath, function (err) {
					if (err) console.error(err);
				});
			}
		});
		files = fs.readdirSync(path);
		while(files.length != 0){
			files = fs.readdirSync(path);
		}
		fs.rmdir(path, function (err) {
			if (err) console.error(err);
		});
	}
}

function asyncLoop(i, docs, callback){
	if (i < docs.length){
		let dUser = docs[i].ipAddress;
		let fileSize = docs[i].size;
		let dFile = docs[i].file;
		let dID = docs[i].id;
		userInfo.findOne({ 'ipAddress': dUser }, function (err, user) {
			if (err) {
				console.error(err);
			}

			var update = { $set: { capacity: user.capacity - fileSize } };
			userInfo.updateOne({ 'ipAddress': dUser }, update, function (err, u) {
				if (err)
					console.error(err);
				deleteFolder('data/results/' + dID);
				fs.unlink('data/upload/' + dFile, function (err) {
					if (err) console.error(err);
				});
				asyncLoop(i + 1, docs, callback);
			});	
		});
	}
	else {
		callback();
	}
}

module.exports = router;