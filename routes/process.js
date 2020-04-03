var express = require("express");
var router = express.Router();

var userInfo = require("../models/userInfo");
var jobInfo = require("../models/jobInfo");

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

router.get("/process/statistic/users", function (req, res) {
    userInfo.countDocuments({}, function (err, count) {
        if (err) console.log(err);
        var data = {
            user: count
        }
        res.send(data);
    })
})

router.get("/process/statistic/querys", function (req, res) {
    jobInfo.countDocuments({}, function (err, count) {
        if (err) console.log(err);
        var data = {
            querys: count
        }
        res.send(data);
    })
})

module.exports = router;

