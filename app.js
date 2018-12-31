var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const socketIO = require('socket.io');

var app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//socket setup
const io = socketIO.listen(app.listen(3009));
io.on('connection', socket => {
    //console.log('mirror connected')
    socket.on('gesture', (gesture) => {
        console.log('gesture: ', gesture)
        io.sockets.emit('gesture', gesture)
    })

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        //console.log('mirror disconnected')
    })
})

var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var commandRouter = require('./routes/command')(io);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/command', commandRouter);
app.use('/mirror', express.static('../mirror/build/'))

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
  res.render('error');
});

module.exports = app;
