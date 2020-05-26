var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

var uploadsRoutes = require("./routes/uploads"),
	jobsRoutes = require("./routes/jobs"),
	resultsRoutes = require("./routes/results"),
	indexRoutes = require("./routes/index"),
	processRoutes = require("./routes/process");

var jobInfo = require("./models/jobInfo"),
	userInfo = require("./models/userInfo"),
	fs = require("fs");
// Docker
// mongoose.connect("mongodb://mulocdeepdb:65521/mulocdeep");
// Local
mongoose.connect("mongodb://localhost/mulocdeep");

// app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('assets'))

app.use(indexRoutes);
app.use(uploadsRoutes);
app.use(jobsRoutes);
app.use(processRoutes);
app.use(resultsRoutes);

app.get("*", function (req, res) {
	res.render("404");
});

app.listen(8082, process.env.IP, function () {
	console.log("The MULocDeep Server Has Started At: http://localhost:8082/");
	userInfo.find({}, function(err, docs){
		for (let i = 0; i < docs.length; i++){
			if (docs[i].proteins == undefined){
				let id = docs[i].id;
				let updates = {$set: {proteins: 0, capacity: 0}};
				userInfo.updateOne({_id: id}, updates, function(err, m){
				})
			}
			else{
				let id = docs[i].id;
				let updates = {$set: {capacity: 0}};
				userInfo.updateOne({_id: id}, updates, function(err, m){
				})
			}
		}
	})
	jobInfo.find({}, function(err, docs){
		for (let i = 0; i < docs.length; i++){
			deleteFolder('data/results/' + docs[i].id);
			fs.unlink('data/upload/' + docs[i].file, function (err) {
				if (err) console.error(err);
			});			
		}
		jobInfo.deleteMany({}, function (err) {
			if (err)
				return console.error(err);
			return console.log("Clean Old Tasks Historys and Files");
		});
	})
})

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