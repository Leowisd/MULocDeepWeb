/* -------------------------------------------------------------------------- */
/*                                Entrance File                               */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Parameters ------------------------------- */
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

var uploadsRoutes = require("./routes/uploads"),
	jobsRoutes = require("./routes/jobs"),
	resultsRoutes = require("./routes/results"),
	indexRoutes = require("./routes/index"),
	processRoutes = require("./routes/process");

var jobInfo = require("./models/jobInfo"),
	userInfo = require("./models/userInfo"),
	fs = require("fs");

/* -------------------------- mongoDB configuration ------------------------- */
// Docker
mongoose.connect("mongodb://mulocdeepdb:65521/mulocdeep");
// Local
// mongoose.connect("mongodb://localhost/mulocdeep");

/* -------------------------- Express configuration ------------------------- */
// app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('assets'))

/* --------------------------------- Routers -------------------------------- */
app.use(indexRoutes);
app.use(uploadsRoutes);
app.use(jobsRoutes);
app.use(processRoutes);
app.use(resultsRoutes);

// invalid router
app.get("*", function (req, res) {
	res.render("404");
});

app.listen(8082, process.env.IP, function () {
	console.log("The MULocDeep Server Has Started At: http://localhost:8082/ ...");
	//  When system's version updates, server deletes all invalid jobs records 
	jobInfo.find({}, function (err, docs) {
		if (docs != undefined) {
			asyncloopStartServer(0, docs, function () {
				console.log("Server has deleted all invalid jobs...");
			})
		}
	})
})

/* -------------------------------- Functions ------------------------------- */

/**
 * async loop to delete all invalid jobs
 * sync loop will cause problem when visiting db
 * @param {*} i: cur index in docs
 * @param {*} docs: results from finding
 * @param {*} callback: callback function
 */
function asyncloopStartServer(i, docs, callback) {
	if (i < docs.length) {
		let job = docs[i];
		if (job.status != 'Done') {
			deleteFolder('data/results/' + job.id);
			fs.unlink('data/upload/' + job.file, function (err) {
				if (err) console.error(err);
			});
			userInfo.findOne({ ipAddress: job.ipAddress }, function (err, doc) {
				let update = { $set: { capacity: doc.capacity - job.size } };
				userInfo.updateOne({ _id: doc.id }, update, function () {
					jobInfo.deleteOne({ _id: job.id }, function () {
						asyncloopStartServer(i + 1, docs, callback);
					})
				})
			});
		}
		else asyncloopStartServer(i + 1, docs, callback);
	}
	else callback();
}

/**
 * Delete cur folder and all items in it
 * @param {*} path: Deleted folder path
 */
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
		while (files.length != 0) {
			files = fs.readdirSync(path);
		}
		fs.rmdir(path, function (err) {
			if (err) console.error(err);
		});
	}
}