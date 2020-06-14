/* -------------------------------------------------------------------------- */
/*                           Data Process Router Module                       */
/*								Author: Yifu Yao							  */
/*							Last Updated Date: 6/14/2020 					  */
/* -------------------------------------------------------------------------- */

/* ------------------------------- Parameters ------------------------------- */

var express = require("express");
var router = express.Router();

var userInfo = require("../models/userInfo");
var jobInfo = require("../models/jobInfo");

/* --------------------------------- Routers -------------------------------- */

// return user's location
router.get("/process/location/", function (req, res) {
    userInfo.find({}, function (err, docs) {
        if (err) return console.log(err);

        var data = [];
        if (docs != undefined) {
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].lat != undefined) {
                    var tmp = {
                        latitude: docs[i].lat,
                        longitude: docs[i].lon,
                        name: i,
                        fillKey: 'B'
                    }
                    data.push(tmp);
                }

            }
        }

        res.send(data);
    })
});

// return the number of users 
router.get("/process/statistic/users", function (req, res) {
    userInfo.countDocuments({}, function (err, count) {
        if (err) console.log(err);
        var data = {
            user: count
        }
        res.send(data);
    })
})

// return the number of querys
router.get("/process/statistic/querys", function (req, res) {
    userInfo.find({}, function (err, docs) {
        if (err) console.log(err);
        let count = 0;
        for (var i = 0; i < docs.length; i++){
            count += docs[i].query;
        }
        var data = {
            querys: count
        }
        res.send(data);
    })
})

// return the number of proteins
router.get("/process/statistic/proteins", function (req, res) {
    userInfo.find({}, function (err, docs) {
        if (err) console.log(err);
        let count = 0;
        for (var i = 0; i < docs.length; i++){
            count += docs[i].proteins;
        }
        var data = {
            proteins: count
        }
        res.send(data);
    })
})

module.exports = router;

