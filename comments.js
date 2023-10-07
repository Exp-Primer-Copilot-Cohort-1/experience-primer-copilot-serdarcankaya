//Create web server
var express = require('express');
var app = express();
var path = require('path');
//Create database
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/'; //db name: comments
var db;
//Connect to database
mongo.connect(url, function(err, client){
    if (err) throw err;
    db = client.db('comments');
});
//Create server
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Get comments
app.get('/getComments', function(req, res){
    var cursor = db.collection('comments').find().toArray(function(err, results){
        if (err) throw err;
        res.json(results);
    });
});

//Add comment
app.get('/addComment', function(req, res){
    var name = req.query.name;
    var comment = req.query.comment;
    var date = new Date();
    var newComment = {name: name, comment: comment, date: date};
    db.collection('comments').insertOne(newComment, function(err, result){
        if (err) throw err;
        res.redirect('/');
    });
});

//Delete comment
app.get('/deleteComment', function(req, res){
    var query = {comment: req.query.comment};
    db.collection('comments').deleteOne(query, function(err, result){
        if (err) throw err;
        res.redirect('/');
    });
});
