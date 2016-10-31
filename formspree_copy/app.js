
var express = require('express');
var app = express();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    port:1025,
    ignoreTLS:true
});

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
app.use(require('body-parser').urlencoded({extended:true}));

/*
app.get(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i, function(req,res) {
    res.send(req.params);
});
*/

app.post(/.+@.+/,function(req,res) {
    /*
    begin by getting the email. 
    req.originalUrl is /X, and we want X
    */
    var email = req.originalUrl.substr(1);

    /*
    now, create a simple text email of form key/value pairs
    */
    var emailBody = 'Form submission received at '+(new Date()) + '\n';
    emailBody += '-----------------------------------\n\n';

    var from = 'noone@raymondcamden.com';
    var subject = 'Form Submission';
    var next = '/thankyou.html';

    for(var key in req.body) {
        /*
        A few fields are special: _from and _subject
        */
        if(key === '_from') {
            from = req.body['_from'];
        } else if(key === '_subject') {
            subject = req.body['_subject'];
        } else if(key === '_next') {
            next = req.body['_next'];
        } else {
            emailBody += key + '='+req.body[key]+'\n';
        }
    }
    emailBody += '\n-----------------------------------\n';
    console.log(emailBody);

    /*
    now set up the mail options
    */
    var mailOptions = {
        from:from,
        to:email,
        subject:subject,
        text:emailBody
    };

    transporter.sendMail(mailOptions, function(error, info ) {
        if(error) {
            console.log('Error sending email: '+error);
            //should redirect to an error page
        } else {
            console.log('Email sent ' + info.response);
            res.redirect(next);
        }
    });
    
});

app.listen(app.get('port'), function() {
    console.log('Express running on http://localhost:' + app.get('port'));
});
