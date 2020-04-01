var nodemailer = require("nodemailer");

// SMTP CONFIG
// deepdom.service@gamil.com
// deepdom@2019
var config = {
	host: 'smtp.gmail.com',
	port: 465,
	auth: {
		user: 'deepdom.service@gmail.com',
		pass: 'deepdom@2019'
	}
};

module.exports = nodemailer.createTransport(config);