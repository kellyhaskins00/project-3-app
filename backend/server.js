const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jobRoutes = express.Router();
const PORT = process.env.PORT || 4000;


let Job = require('./job.model');

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/jobs', { useNewUrlParser: true});
const connection = mongoose.connection;

app.listen(process.env.PORT || 3000, function() {
    console.log('Express server is up and running!');
  });

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://user:test123@ds125048.mlab.com:25048/heroku_46nf6tgt');


connection.once('open', function() {
    console.log("MongoDB databse connection established successfully");
})

jobRoutes.route('/').get(function(req, res){
    Job.find(function(err, jobs){
        if(err) {
            console.log(err);
        } else {
            res.json(jobs);
        }
    });
});

jobRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Job.findById(id, function(err, job) {
        res.json(job);
    });
});

jobRoutes.route('/add').post(function(req, res){
    let job = new Job(req.body);
    job.save()
    .then(job => {
        res.status(200).json({'job': 'job added successfully'});
    })
    .catch(err => {
        res.status(400).send('adding new job failed');
    });
});

jobRoutes.route('/update/:id').post(function(req, res){
    
    console.log(req.params.id);

    Job.findById(req.params.id, function(err, job) {
        
        console.log(job);
        
        if (!job)
            res.status(404).send('data is not found');
        else
            job.job_description = req.body.job_description;
            job.job_responsible = req.body.job_responsible;
            job.job_priority = req.body.job_priority;
            job.job_completed = req.body.job_completed;

            job.save().then(job => {
                res.json('Job Updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.use('/jobs', jobRoutes);

app.listen(PORT, function(){
    console.log("Server is running on Port: " + PORT);
});

// app.listen(process.env.PORT || 4000, function() {
//     console.log('Express server is up and running!');
//   });