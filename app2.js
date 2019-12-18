var createError = require('http-errors');
var express = require('express');
var path = require('path');
var parser = require('3dstojs');
const obj2gltf = require('obj2gltf');
var fs = require('fs');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//  next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
// });

var port = process.env.PORT || 8000;
app.listen(port, function () {
var data = parser.parseToJson("/home/user1/Downloads/BA_00002.3ds",{jsonPerItem : true,saveJson: false});
//var obj = JSON.parse(data);
fs.writeFile ("model1.json", JSON.stringify(data), function(err) {
   if (err) throw err;
   console.log('complete');
}
);
// console.log(data);
console.log("RateMe Server Starts running on: "+port);
});

module.exports = app;