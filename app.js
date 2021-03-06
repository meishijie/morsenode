var express = require('express'),
    exphbs  = require('express3-handlebars'),
    morse = require('morse');
var app = express();
var port = process.env.PORT || 5000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home');
});

var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port ' + port);

io.sockets.on('connection', function (socket) {
  socket.on('room', function(room) {
    socket.join(room);
  });
  socket.on('send', function (data) {
    data.message = '<span class="red">' + data.message + ':</span> ' + morse.encode(data.message).replace(/\.\.\.\.\.\.\./g, '   ');
    io.sockets.in(data.room).emit('message', data); // to other users + self
  });
  socket.on('beep', function(data) {
    socket.broadcast.to(data.room).emit('beep', data.len);
  });
});