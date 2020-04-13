var nodemailer = require("nodemailer");

// SMTP CONFIG
// mulocdeep@gmail.com
// mulocdeep@2020
var config = {
	host: 'smtp.gmail.com',
	port: 465,
	auth: {
		user: 'mulocdeep@gmail.com',
		pass: 'mulocdeep@2020'
	}
};

module.exports = nodemailer.createTransport(config);