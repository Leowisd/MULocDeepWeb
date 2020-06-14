/* -------------------------------------------------------------------------- */
/*                           Email Configuration File                         */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

var nodemailer = require("nodemailer");

/** SMTP CONFIG
 * account: mulocdeep@gmail.com
 * password: mulocdeep@2020
*/
var config = {
	host: 'smtp.gmail.com',
	port: 465,
	auth: {
		user: 'mulocdeep@gmail.com',
		pass: 'mulocdeep@2020'
	}
};

module.exports = nodemailer.createTransport(config);