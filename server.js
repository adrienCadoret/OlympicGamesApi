const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const countriesPath = './countries.json';

var countries = require(countriesPath);
var app = express();
app.use(bodyParser.json());

app.get('/countries', function(req, res){
    res.send(countries);
});

app.get('/countries/:id', function(req, res){
    var country = countries.find((c) => c.id === req.params.id);
    if (!_.isNil(country)){
        res.send(country);
    } else {
        res.sendStatus(404);
    }
});

app.listen(8090, function(){
    console.log("Listening on port 8090");
})