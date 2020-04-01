var mongoose = require("mongoose");

var jobInfoSchema = new mongoose.Schema({
	nickName: String,
	sequence: String,
	file: String,
	email: String,
	status: String,
	submittedTime: String,
	ipAddress: String
});

module.exports = mongoose.model("jobInfo", jobInfoSchema);