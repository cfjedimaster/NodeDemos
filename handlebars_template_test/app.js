var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);

var exphbs = require('express-handlebars');


app.engine('handlebars', exphbs({
	defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
	res.render('test', {
		title:'Welcome to Snowball'
	});
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('error');
});

app.listen(app.get('port'), function() {
	console.log('Express running on http://localhost:' + app.get('port'));
});