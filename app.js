var express = require('express');
var app = express();
var path = require('path');
var socket = require('socket.io');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var session = require('express-session');

var server = app.listen('8080', function(){
	console.log('server is running');
});

//static file
app.use(express.static(__dirname + '/public'));

//template engine
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//helper
var blocks = {};

hbs.registerHelper('extend', function(name, context){
	var block = blocks[name];
	if(!block){
		block = blocks[name] = [];
	}
	block.push(context.fn(this));
});

hbs.registerHelper('block', function(name, context){
	var val = (blocks[name] || []).join('\n');

	//clear the block
	blocks[name] = [];
	return val;
});

hbs.registerPartials(__dirname + '/views/partials');

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//session
app.use(session({
	secret : 'secret',
	resave : true,
	saveUninitialized : true
}));

//socket setup
var io = socket(server);

//socket connection
io.on('connection', function(socket) {
	console.log('socket is running');

	socket.on('chat', function(data){
		io.sockets.emit('chat', data);
	});
});

app.get('/', function(req, res, next){
	res.render('login', {
		layout : 'layout/login'
	});
});

app.post('/do_login', function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var img_profile = '';

	if (username == 'John') {
		img_profile = 'man.svg';
	} else{
		img_profile = 'girl.svg';
	}
	//created session
	req.session.logedin = true;
	req.session.username = username;
	req.session.img_profile = img_profile;
	
	res.redirect('/home');
});

app.get('/home', function(req, res, next){
	if(req.session.logedin == true){
		res.render('chatContent',{
			layout : 'layout/index',
			username : req.session.username,
			img_profile : req.session.img_profile
		});
	} else {
		res.redirect('/');
	}
});