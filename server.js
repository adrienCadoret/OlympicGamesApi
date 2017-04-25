const contactFile = process.env.npm_package_config_contacts;
var contacts = require(contactFile);
var commander = require('commander');
var shortid = require('shortid');
var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');


var express = require('express');
var app = express();

app.use(bodyParser.json()); // for parsing application/json


app.get('/health', function (req, res) {
    res.status(204).send('');
})

app.get('/contacts', function (req, res) {
    res.status(201).send(contacts);
})

app.post('/contacts', function (req, res) {
    contacts.push({
        id : shortid.generate(),
        lastName : req.body.lastName,
        firstName : req.body.firstName
    });
    jsonfile.writeFile(contactFile, contacts);
    res.status(200).send("Créé nickel man")
})

app.get('/contacts/:id', function (req, res) {
    var contact = contacts.find((c) => c.id === req.params.id);
    if(contact !== undefined){
        res.send(contact);
    }
    else{
        res.sendStatus(404);
    }
});

app.delete('/contacts/:id', function (req, res) {
    var contact = contacts.findIndex((c) => c.id === req.params.id);
    if(contact == undefined){
        res.status(404).send("Contact not found");
    }
    else{
        contacts.splice(contact, 1)
        jsonfile.writeFile(contactFile, contacts);
        res.status(200).send("Contact removed");

    }
});


commander
    .command('list')
    .option('List contacts')
    .action(function () {
        for (contact of contacts){
            console.log(contact.lastName.toUpperCase().concat(' ').concat(contact.firstName));
        }
    });

commander
    .command('add <firstName> <lastName>')
    .option('Add contact')
    .action(function (f,l) {
        contacts.push({
            id : shortid.generate(),
            lastName : l,
            firstName : f
        });
        jsonfile.writeFile(contactFile, contacts);
    });

commander
    .command('remove <id>')
    .option('Remove contact')
    .action(function (pId) {
        contacts.splice(contacts.findIndex((c) => c.id === pId), 1)
        jsonfile.writeFile(contactFile, contacts);
    });

commander
    .command('serve')
    .option('Launch server')
    .action(function () {
        app.listen(3000, function () {
            console.log('Server listening on port 3000!');
        });
    });

commander.parse(process.argv);

if(!commander.args.length){
    commander.help();
}
