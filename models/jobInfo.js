var mongoose = require("mongoose");

var jobInfoSchema = new mongoose.Schema({
	nickName: String,
	sequence: String,
	file: String,
	email: String,
	status: String,
	submittedTime: String,
	ipAddress: String,
	size: Number,
	proteins: Number
});

module.exports = mongoose.model("jobInfo", jobInfoSchema);