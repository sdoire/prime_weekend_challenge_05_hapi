var Hapi = require('hapi');
//var index = require('./routes/index');
var Inert = require('inert');
var Path = require('path');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var mongoDB = mongoose.connect('mongodb://localhost/tasks').connection;
var Task = mongoose.model('task', {text: String, complete: Boolean});


var dbOpts = {
    "url": "mongodb://localhost/tasks",
    "settings": {
        "db": {
            "native_parser": false
        }
    }
};

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "public")
            }
        }
    }
});

server.connection({ port: 5000 });

server.start(function (err) {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});

server.register(Inert, function () {});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: "assets/views",
            index: true,
            listing: true
        }
    }
});

server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: function(request, reply) {
        reply.file('assets/' + request.params.param);
    }
});

server.route({
    method: 'GET',
    path: '/vendors/{param*}',
    handler: function(request, reply) {
        reply.file("vendors/" + request.params.param);
    }
});

server.route({
    method: 'GET',
    path: '/todos',
    handler: function(req, res, next) {
        return Task.find({}).exec(function (err, task) {
            if (err) throw new Error(err);
            res(JSON.stringify(task));
        });
    }
});

//successfully posts new task
server.route({
    method: 'POST',
    path: '/todos',
    handler: function(req, res) {
        var task = new Task({text: req.payload.text, complete: false});
        task.save(function(err){
            if(err) console.log('error ', err);
            res(task.toJSON());
        });
    }
});

//successfully deletes task
server.route({
    method: 'DELETE',
    path: '/todos/{id}',
    handler: function(req, res, next) {
        Task.findByIdAndRemove(req.params.id, req.body, function(err, task){
            return Task.find({}).exec(function(err, task){
                if(err) throw new Error(err);
                res(JSON.stringify(task));
            });
        });
    }
});

//the put call is still not working for updating database
server.route({
    method: 'PUT',
    path: '/todos/{id}',
    handler: function(req, res, next) {
        Task.findByIdAndUpdate(req.params.id, req.body, function(err, task){
            return Task.find({}).exec(function(err, task){
                if(err) throw new Error(err);
                res(JSON.stringify(task));
            });
        });
    }
});


//server.register({
//    register: require('hapi-mongodb'),
//    options: dbOpts
//}, function (err) {
//    if (err) {
//        console.error(err);
//        throw err;
//    }
//});

//server.route( {
//    "method"  : "GET",
//    "path"    : "/users/{id}",
//    "handler" : usersHandler
//});


//function usersHandler ( request ) {
//
//
//    var db = this.server.plugins['hapi-mongodb'].db;
//    var ObjectID = this.server.plugins['hapi-mongodb'].objectId;
//
//    db.collection('users').findOne({  "_id" : new ObjectID( request.params.id) }, function(err, result) {
//
//        if (err) return request.reply(Hapi.error.internal('Internal MongoDB error', err));
//
//        request.reply(result);
//
//    });
//
//};

mongoDB.on('error', function(err){
    if(err){
        console.log("MONGO ERROR: ", err);
    }
});

mongoDB.once('open', function(){
    console.log("YOU ARE CONNECTED TO MONGO!!");
});