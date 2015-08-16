//not actually being used. For simplicty's sake, put all routes in app.js file
var hapi = require('hapi');
var path = require('path');
var mongoose = require('mongoose');

var Task = mongoose.model('task', {text: String, complete: Boolean});

router.get('/todos', function(req, res, next){
    return Task.find({}).exec(function(err, task){
        if(err) throw new Error(err);
        res.send(JSON.stringify(task));
    });
});

router.post('/todos', function(req, res, next){
    var task = new Task({text: req.body.text, complete: false});
    task.save(function(err){
        if(err) console.log('error ', err);
        res.send(task.toJSON());
    });
});

router.put('/todos/:id', function(req, res, next){
    Task.findByIdAndUpdate(req.params.id, req.body, function(err, task){
        return Task.find({}).exec(function(err, task){
            if(err) throw new Error(err);
            res.send(JSON.stringify(task));
        });
    });
});

router.delete("/todos/:id", function(req, res, next){
    Task.findByIdAndRemove(req.params.id, req.body, function(err, task){
        return Task.find({}).exec(function(err, task){
            if(err) throw new Error(err);
            res.send(JSON.stringify(task));
        });
    });
});

router.get("/*", function(req, res, next){
    var file = req.params[0] || '/assets/views/index.html';
    res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;