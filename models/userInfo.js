/* -------------------------------------------------------------------------- */
/*                       Users Schema Configuration File                      */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

var mongoose = require("mongoose");

var userInfoSchema = new mongoose.Schema({
	ipAddress: String,
	capacity: Number,
	lat: Number,
	lon: Number,
	query: Number,
	proteins: Number
});

module.exports = mongoose.model("userInfo", userInfoSchema);