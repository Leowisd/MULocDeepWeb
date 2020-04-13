var express = require("express");
var router = express.Router();
var fs = require("fs");
var request = require("request");

var jobInfo = require("../models/jobInfo");
var userInfo = require("../models/userInfo");

// SEARCH: show the search page
router.get("/jobs", function (req, res) {
	res.render("SEARCH");
});

// JOBSLIST: show all jos
router.get("/jobs/all", function (req, res) {
	jobInfo.find({ 'ipAddress': get_client_ip(req) }, function (err, docs) {
		if (err)
			console.error(err);
		userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
			if (err)
				console.error(err);
			if (doc == undefined) {
				var user = new userInfo({
					ipAddress: get_client_ip(req),
					capacity: 0,
					query: 0
				});
				user.save(function (err, u) {
					if (err)
						console.error(err);
					else {
						console.log("Create a new user: " + get_client_ip(req));
						console.log("======================================");
					}
				})
				// ------------------
				// get user location
				// ------------------
				// var locURL = "/process/location/";
				// var locData = { ip: get_client_ip(req) };
				request("http://ip-api.com/json/" + get_client_ip(req) + "?lang=EN", { json: true }, (err, res, body) => {
					if (err) { return console.log(err); }
					var update = { $set: { lat: body.lat, lon: body.lon } };
					userInfo.updateOne({ 'ipAddress': body.query }, update, function (err, u) {
						if (err)
							console.log(err);
						else {
							console.log("User info was updated!");
							console.log("User location: " + body.lat + ", " + body.lon);
							console.log("======================================");
						}
					});
				});
				// $.post(locURL, locData, function (data, status) {
				// 	console.log("get user location");
				// });
				res.render("JOBSLIST", { docs: docs, ip: get_client_ip(req), capacity: 0 });
			}
			else res.render("JOBSLIST", { docs: docs, ip: get_client_ip(req), capacity: doc.capacity });
		});
	});
});

// SHOW: show result
router.get("/jobs/:id", function (req, res) {
	var jobId = req.params.id;
	if (jobId != "example")
		jobId = jobId.substr(1);

	fs.exists('data/results/' + jobId + '/attention_weights.txt', function (exists) {
		if (!exists) {
			res.render("404");
		}
		else {
			// ============================
			// analysis result data
			// ============================
			// -----------------
			// Seq name and seq
			// -----------------
			var names = [];
			var seq = [];
			var arr = fs.readFileSync('data/upload/' + jobId + '.fa').toString().replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '').split(/\r\n|\n\r|[\n\r]/);
			for (var i = 0; i < arr.length; i++)
				if (i % 2 == 0) {
					names.push(arr[i]);
				}
				else {
					seq.push(arr[i]);
				}

			// console.log(names);
			// console.log(seq);

			// --------
			// weights
			// --------
			var weights = [];
			var arr2 = fs.readFileSync('data/results/' + jobId + '/attention_weights.txt').toString().replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '').split(/\r\n|\n\r|[\n\r]/);
			for (var i = 0; i < arr2.length; i++) {
				if (i % 2 != 0) {
					let temp = [];
					let strarr = arr2[i].split(' ');
					for (var j = 0; j < strarr.length; j++) {
						temp.push(parseFloat(strarr[j]));
					}
					weights.push(temp);
				}
			}
			// console.log(weights);

			// ------------------------
			// sub_cellular_prediction
			// ------------------------
			var cellular = [];
			var arr3 = fs.readFileSync('data/results/' + jobId + '/sub_cellular_prediction.txt').toString().split('>');
			for (var i = 1; i < arr3.length; i++) {
				let strarr = arr3[i].replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '').replace('/\r\n|\n\r|[\n\r]/', '').split('\t');
				// console.log(strarr);
				let name = '>' + strarr[0].replace(':', '');
				
				let cur = {
					seqName: name,
					Nucleus: parseFloat(strarr[1].substring(strarr[1].indexOf(':') + 1)),
					Cytoplasm: parseFloat(strarr[2].substring(strarr[2].indexOf(':') + 1)),
					Secreted: parseFloat(strarr[3].substring(strarr[3].indexOf(':') + 1)),
					Mitochondrion: parseFloat(strarr[4].substring(strarr[4].indexOf(':') + 1)),
					Membrane: parseFloat(strarr[5].substring(strarr[5].indexOf(':') + 1)),
					Endoplasmic: parseFloat(strarr[6].substring(strarr[6].indexOf(':') + 1)),
					Plastid: parseFloat(strarr[7].substring(strarr[7].indexOf(':') + 1)),
					Golgi_apparatus: parseFloat(strarr[8].substring(strarr[8].indexOf(':') + 1)),
					Lysosome: parseFloat(strarr[9].substring(strarr[9].indexOf(':') + 1)),
					Peroxisome: parseFloat(strarr[10].substring(strarr[10].indexOf(':') + 1)),
					Predict: strarr[11].substring(strarr[11].indexOf(':') + 1)
				};
				cellular.push(cur);
			}
			// console.log(cellular);
			// console.log(arr3);

			// -------------------------
			// sub_organellar_prediction
			// -------------------------
			var organellar = [];
			var arr4 = fs.readFileSync('data/results/' + jobId + '/sub_organellar_prediction.txt').toString().split('>');
			for (var i = 1; i < arr4.length; i++) {
				let strarr = arr4[i].replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '').replace('/\r\n|\n\r|[\n\r]/', '').split('\t');
				// console.log(strarr);
				let name = '>' + strarr[0].replace(':', '');

				let cur = {
					Nucleus_nucleolus: parseFloat(strarr[1].substring(strarr[1].indexOf(':') + 1)),
					Nucleus_nucleoplasm: parseFloat(strarr[2].substring(strarr[2].indexOf(':') + 1)),
					Nucleus_membrane: parseFloat(strarr[3].substring(strarr[3].indexOf(':') + 1)),
					Nucleus_matrix: parseFloat(strarr[4].substring(strarr[4].indexOf(':') + 1)),
					Nucleus_speckle: parseFloat(strarr[5].substring(strarr[5].indexOf(':') + 1)),
					Nucleus_PML_body: parseFloat(strarr[6].substring(strarr[6].indexOf(':') + 1)),
					Nucleus_Cajal_body: parseFloat(strarr[7].substring(strarr[7].indexOf(':') + 1)),
					Chromosome: parseFloat(strarr[8].substring(strarr[8].indexOf(':') + 1)),
					Cytoplasmic_vesicle: parseFloat(strarr[9].substring(strarr[9].indexOf(':') + 1)),
					Cytoplasm_cytoskeleton: parseFloat(strarr[10].substring(strarr[10].indexOf(':') + 1)),
					Cytoplasm_myofibril: parseFloat(strarr[11].substring(strarr[11].indexOf(':') + 1)),
					Cytoplasm_cytosol: parseFloat(strarr[12].substring(strarr[12].indexOf(':') + 1)),
					Cytoplasm_perinuclear_region: parseFloat(strarr[13].substring(strarr[13].indexOf(':') + 1)),
					Cytoplasm_cell_cortex: parseFloat(strarr[14].substring(strarr[14].indexOf(':') + 1)),
					Cytoplasmic_granule: parseFloat(strarr[15].substring(strarr[15].indexOf(':') + 1)),
					Cytoplasm_P_body: parseFloat(strarr[16].substring(strarr[16].indexOf(':') + 1)),
					Secreted_exosome: parseFloat(strarr[17].substring(strarr[17].indexOf(':') + 1)),
					Secreted_extracellular_space: parseFloat(strarr[18].substring(strarr[18].indexOf(':') + 1)),
					Mitochondrion_inner_membrane: parseFloat(strarr[19].substring(strarr[19].indexOf(':') + 1)),
					Mitochondrion_intermembrane_space: parseFloat(strarr[20].substring(strarr[20].indexOf(':') + 1)),
					Mitochondrion_outer_membrane: parseFloat(strarr[21].substring(strarr[21].indexOf(':') + 1)),
					Mitochondrion_matrix: parseFloat(strarr[22].substring(strarr[22].indexOf(':') + 1)),
					Mitochondrion_membrane: parseFloat(strarr[23].substring(strarr[23].indexOf(':') + 1)),
					Membrane_clathrin_coated_pit: parseFloat(strarr[24].substring(strarr[24].indexOf(':') + 1)),
					Membrane_coated_pit: parseFloat(strarr[25].substring(strarr[25].indexOf(':') + 1)),
					Membrane_raft: parseFloat(strarr[26].substring(strarr[26].indexOf(':') + 1)),
					Membrane_caveola: parseFloat(strarr[27].substring(strarr[27].indexOf(':') + 1)),
					Cel_membrane: parseFloat(strarr[28].substring(strarr[28].indexOf(':') + 1)),
					Cell_surface: parseFloat(strarr[29].substring(strarr[29].indexOf(':') + 1)),
					Endoplasmic_reticulum_lumen: parseFloat(strarr[30].substring(strarr[30].indexOf(':') + 1)),
					Endoplasmic_reticulum_membrane: parseFloat(strarr[31].substring(strarr[31].indexOf(':') + 1)),
					Endoplasmic_reticulum_Golgi_intermediate_compartment: parseFloat(strarr[32].substring(strarr[32].indexOf(':') + 1)),
					Microsome: parseFloat(strarr[33].substring(strarr[33].indexOf(':') + 1)),
					Sarcoplasmic_reticulum: parseFloat(strarr[34].substring(strarr[34].indexOf(':') + 1)),
					Plastid_amyloplast: parseFloat(strarr[35].substring(strarr[35].indexOf(':') + 1)),
					Plastid_chloroplast_membrane: parseFloat(strarr[36].substring(strarr[36].indexOf(':') + 1)),
					Plastid_chloroplast_stroma: parseFloat(strarr[37].substring(strarr[37].indexOf(':') + 1)),
					Plastid_chloroplast_thylakoid_lumen: parseFloat(strarr[38].substring(strarr[38].indexOf(':') + 1)),
					Plastid_chloroplast_thylakoid_membrane: parseFloat(strarr[39].substring(strarr[39].indexOf(':') + 1)),
					Golgi_apparatus_trans_Golgi_network: parseFloat(strarr[40].substring(strarr[40].indexOf(':') + 1)),
					Golgi_apparatus_cis_Golgi_network: parseFloat(strarr[41].substring(strarr[41].indexOf(':') + 1)),
					Golgi_apparatus_membrane: parseFloat(strarr[42].substring(strarr[42].indexOf(':') + 1)),
					Golgi_apparatus_Golgi_stack_membrane: parseFloat(strarr[43].substring(strarr[43].indexOf(':') + 1)),
					Lysosome_membrane: parseFloat(strarr[44].substring(strarr[44].indexOf(':') + 1)),
					Peroxisome_membrane: parseFloat(strarr[45].substring(strarr[45].indexOf(':') + 1)),
					Prediction: strarr[46].substring(strarr[46].indexOf(':') + 1)
				}
				organellar.push(cur);
			}
			// console.log(organellar);

			if (jobId == "example")
				res.render("EXAMPLE", {names: names, seq: seq, weights: weights, cellular: cellular, organellar: organellar, jobId: jobId});
			else			
				res.render("SHOW", {names: names, seq: seq, weights: weights, cellular: cellular, organellar: organellar, jobId: jobId});
		}
	});
});

// DOWNLOAD: download the result file
router.get("/jobs/download/:id", function (req, res) {
	var id = req.params.id.substr(1);
	res.download("data/results/" + id + '/' + id + '.zip');
});

// DELETE: delete the selected job
router.post("/jobs/delete/:id", function (req, res) {
	var job = req.params.id.substr(1);
	// console.log(job);

	// update user capacity
	var fileSize = 0;
	fs.stat('data/upload/' + job + '.fa', function (err, stats) {
		if (err)
			return console.error(err);
		fileSize = stats.size;
	});
	userInfo.findOne({ 'ipAddress': get_client_ip(req) }, function (err, doc) {
		if (err)
			console.error(err);
		if (doc != undefined) {
			// var update = { $set: { capacity: 0 } };
			var update = { $set: { capacity: doc.capacity - fileSize } };
			userInfo.updateOne({ 'ipAddress': get_client_ip(req) }, update, function (err, u) {
				if (err)
					console.log(err);
				else {
					console.log("User info was updated!");
					console.log("User Size: " + (doc.capacity - fileSize));
				}
			});
		}
	});

	// delete jobs
	jobInfo.findOne({ _id: job }, function (err, doc) {
		if (err)
			return console.error(err);
		if (doc != undefined) {
			var dFile = doc.file;
			deleteFolder('data/results/' + doc.id);
			fs.unlink('data/upload/' + dFile, function (err) {
				if (err) console.error(err);
			});
		}
		return console.log("Delete files of the job: " + job);
	});
	jobInfo.deleteOne({ _id: job }, function (err) {
		if (err)
			return console.error(err);
		console.log("Delete log of the job:" + job);
		return console.log("======================================");
	});
});

function get_client_ip(req) {
	var ipStr = req.ip.split(':');
	return ipStr[ipStr.length - 1];
};


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
		fs.rmdir(path, function (err) {
			if (err) console.error(err);
		});
	}
}

module.exports = router;