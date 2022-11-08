var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars')

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

const multer = require('multer')
var db = require('./config/connection')

var app = express();
var session = require('express-session');

const router = require('./routes/admin');
//const userHelpers = require('./helpers/userHelpers');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))
app.engine('hbs',hbs.engine({helpers:{increment:function(value,options){return parseInt(value)+1;},
eqPacked: (status)=>{
  return status==='packed'? true : false
},

eqShipped: (status)=>{
  return status==='Shipped'? true : false
},

eqPlaced: (status)=>{
  return status==='placed'? true : false
},

eqDelivered: (status)=>{
  return status==='Delivered'? true : false
},
eqPending: (status)=>{
  return status==='pending'? true : false
},
isoToDate:(date)=>{
  return date.toDateString()
},
multiply:(num1,num2)=>num1*num2,
Subtraction:(n1,n2)=>n1-n2}, extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true,},})); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));

app.use('/',usersRouter)
app.use('/admin',adminRouter)
const upload = multer({ dest:'./public/Admin/uploadedImage'})
//const upload = multer({ dest:'/Admin/uploadedImage'})
//------------connecting to database----------------
db.connect((err)=>{
    if(err)
      console.log("Connection Error"+err);
    else
      console.log("Database Connected to PORT 27017");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('adminpages/adminError')
  //res.render('error');
});
module.exports = app;
