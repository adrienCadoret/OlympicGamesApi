const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const countriesPath = './countries.json';
const shortId = require('shortid');
const fs = require('fs');
const basicAuth = require('express-basic-auth');

var countries = require(countriesPath);
var app = express();
app.use(bodyParser.json());
app.use(basicAuth({
    users: {
        'Adrien': 'Cadoret',
        'Thomas': 'Senez',
        'Paul': 'Defois'
    }
}));

var addCountry = function(countryName, goldMed, silverMed, bronzeMed){
    const newId = shortId.generate();
    const newCountry = {
        id : newId,
        name : countryName,
        nGold : goldMed || 0,
        nSilver : silverMed || 0,
        nBronze : bronzeMed || 0
    }
    countries.push(newCountry);
    const newJson = JSON.stringify(countries);
    fs.writeFile(countriesPath, newJson);
    return newCountry.id;
}



var getCountry = function(id){
    return _.filter(countries, {id : id})[0];
}

var getMedal = function(countryId, medalType){
    const country = getCountry(countryId);
    switch (medalType){
        case "gold" :
            return country.nGold;
        case "silver" :
            return country.nSilver;
        case "bronze" :
            return country.nBronze;
        default :
            return undefined;
    }
}

app.get('/countries', function(req, res){
    res.send(countries);
});

app.get('/countries/:id', function(req, res){
    var country = getCountry(req.params.id);
    if (!_.isNil(country)){
        res.send(country);
    } else {
        res.sendStatus(404);
    }
});

app.get('/countries/:id/:medalType', function(req, res){
    var medal = getMedal(req.params.id, req.params.medalType);
    if (!_.isNil(medal)){
        res.send(req.params.medalType + " medals : " + medal.toString());
    } else {
        res.sendStatus(404);
    }
})

app.post('/countries', function(req, res){
    var id = addCountry(req.body.name, req.body.nGold, req.body.nSilver, req.body.nBronze);
    res.location('/countries/' + id);
    res.status(201).send('/countries/' + id);
})

app.delete('/countries/:id', function(req, res){
    countries.splice(countries.findIndex(function (country) {
        return country.id === req.params.id;
    }), 1);
    const newJson = JSON.stringify(countries);
    fs.writeFile(countriesPath, newJson);
    res.sendStatus(204)
})

app.patch('/countries/:id', function(req, res){
    if (!_.isNil(req.params.id)){
        var country = getCountry(req.params.id);
        countries.splice(countries.findIndex(function (country) {
            return country.id === req.params.id;
        }), 1);
        if(req.body.hasOwnProperty('name')){
            country.name = req.body.name
        }
        if(req.body.hasOwnProperty('nGold')){
            country.nGold = req.body.nGold
        }
        if(req.body.hasOwnProperty('nSilver')){
            country.nSilver = req.body.nSilver
        }
        if(req.body.hasOwnProperty('nBronze')) {
            country.nBronze = req.body.nBronze
        }
        countries.push(country)
        const newJson = JSON.stringify(countries);
        fs.writeFile(countriesPath, newJson);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

app.listen(8090, function(){
    console.log("Listening on port 8090");
})

