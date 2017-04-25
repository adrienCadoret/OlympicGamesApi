const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const countriesPath = './countries.json';
const shortId = require('shortid');
const fs = require('fs');

var countries = require(countriesPath);
var app = express();
app.use(bodyParser.json());

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
            break;
        case "silver" :
            return country.nSilver;
            break;
        case "bronze" :
            return country.nBronze;
            break;
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

app.listen(8090, function(){
    console.log("Listening on port 8090");
})