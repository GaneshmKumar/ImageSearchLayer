'use strict';

var express = require('express');
var ImagesClient = require('google-images');
var util = require('util');
var jsonFile = require('jsonfile');
var client = new ImagesClient(process.env.GOOGLE_IMAGE_KEY, process.env.GOOGLE_IMAGE_SECRET);
var path= require('path');

var router = express.Router();

router.get('/', function (req, res) {
    res.set({'Content-Type': 'text/html'});
    res.sendFile(path.join(__dirname, '../views/index.html'));
});


router.get('/latest', function (req, res) {
    jsonFile.readFile(path.join(__dirname, '../history.json'), function (err, history) {
        console.log('history: ' + history);
        res.set({'Content-Type': 'application/json'});
        res.send(JSON.stringify(history, null, " "));
    });
});

router.get('/:query', function (req, res) {
    var query = req.params.query;
    var offset = req.query.offset;

    client.search(query, {page: offset}).then(function (images) {
        res.set({'Content-Type': 'application/json'});
        res.send(JSON.stringify(images, null, " "));
        jsonFile.readFile(path.join(__dirname, '../history.json'), function (err, history) {
            console.log('reading');
            console.log(history.length);
            if(history.length >= 0 && history.length < 10)
           {

               history.push({'term': query, 'when': new Date().toUTCString()});
           }
           else {
                history.shift();
           }
            console.log(history);
           jsonFile.writeFile('history.json', history, {spaces: 2}, function (err) {
              console.log(err);
               console.log('written');
           });
        });
    });
});

module.exports = router;