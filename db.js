const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/rateMe',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Connected to database!');
    }).catch(error => {
        console.log('Connection failed!');
        console.log(error);
    }); 
