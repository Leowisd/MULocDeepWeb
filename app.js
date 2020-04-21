var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

var uploadsRoutes = require("./routes/uploads"),
	jobsRoutes = require("./routes/jobs"),
	resultsRoutes = require("./routes/results"),
	indexRoutes = require("./routes/index"),
	processRoutes = require("./routes/process");
// Docker
mongoose.connect("mongodb://mulocdeepdb:65521/mulocdeep");
// Local
// mongoose.connect("mongodb://localhost/mulocdeep");

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
	console.log("");
})