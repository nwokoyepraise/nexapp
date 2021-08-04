require('dotenv').config();

const mongoose = require('mongoose');

//initialize connection to mongo db
mongoose.connect('mongodb://localhost:27017/nexappdb', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    function (err, res) {
        if (!err) {
            console.log('connected to mongo!');
        } else {
            console.log(err);
        }
    });

module.exports = mongoose;