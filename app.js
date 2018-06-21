var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const socketIO = require('socket.io');

var app = express();

//socket setup
const io = socketIO.listen(app.listen(3010));
io.on('connection', socket => {
    console.log('mirror connected')
    socket.on('gesture', (gesture) => {
        console.log('gesture: ', gesture)
        io.sockets.emit('gesture', gesture)
    })

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        console.log('mirror disconnected')
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
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/command', commandRouter);

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