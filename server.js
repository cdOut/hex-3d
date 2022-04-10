const express = require('express');
const bodyParser = require('body-parser');
const datastore = require('nedb');
const path = require('path');
const app = express();
const port = 3000;

let levels = new datastore({
    filename: 'levels.db',
    autoload: true
});

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));

//============================================
// Redirections and routing to sites

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/index.html'));
});

app.get('/hex', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/hex.html'));
});

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/game.html'));
});

app.get('/player', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/player.html'));
});

app.get('/ally', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/ally.html'));
});

app.get('/allies', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/allies.html'));
});

app.get('/allymodel', function(req, res) {
    res.sendFile(path.join(__dirname + '/static/html/allymodel.html'));
});

//============================================
// Database level handling in NeDB

app.post('/get-levels', function(req, res) {
    let names = [];
    levels.find({}, function(err, docs) {
        docs.forEach(doc => {
            names.push(doc.name);
        });
        res.send(names);
        res.end();
    });
});

app.post('/save-level', function(req, res) {
    levels.remove({name: req.body.name}, {multi: true}, function(err) {
        levels.insert(req.body, function(err) { res.end(); });
    });
});

app.post('/load-level', function(req, res) {
    levels.findOne({name: req.body.name}, function(err, doc) {
        res.send(doc);
        res.end();
    });
});

//============================================
// Saving and loading one level to view in 3D

let selectedLevel;

app.post('/save-selected', function(req, res) {
    selectedLevel = req.body;
    res.end();
});

app.post('/load-selected', function(req, res) {
    res.send(selectedLevel);
    res.end();
});

app.listen(port, function() {
    console.log('Server is listening on port ' + port + '.');
});