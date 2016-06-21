// required modules
var path            = require('path');
var favicon         = require('serve-favicon');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var lodash          = require('lodash');
var logger          = require('morgan');
var express         = require('express');
var firebase        = require('firebase');
var elasticsearch   = require('elasticsearch');

// routes
var homeRoutes = require('./routes/index');
var userRoutes = require('./routes/users');

//  setup app
var app = express();

// initialize firebase
// firebase.initializeApp({
//   serviceAccount: {
//     projectId: "project-3444843529926405572",
//     clientEmail: "chat-buddies-firebase@project-3444843529926405572.iam.gserviceaccount.com",
//     privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDA3WYTTAVUs4kE\n9+KYES5yQBb4mjrZVYqXWuvjA7WIpiO5EuXwt6a032nMYWC6H/zKY+xd4euz6DP0\nGVolCoG6PKtCxHtQ6vXA7ttlgKLVvx10JlI8ev9lT6aNk0fcOO7EcVaeMVMjjJ/g\n1KxeskCCstmr2oGSqTZWHr2E2aQn+AWib/nn+VhEWl/rlaqpgRhHr8yuD7i7RQpo\n/6usxYs584ago85Y/tVbTdg1EBWJFpRQy0xZkx4Ro7lW6YnLeb6gblj8ajo/N9wX\n0x3BieH536Ufs1sS8WKAnbqpv9hPB7UIZXHhzpugRFz+OQj/BSwwdpGVWS+rRIKY\ncOOtVrtfAgMBAAECggEAAwEv/ur3RkuJve8Ss6XI4HTJJtRYSFyBzTvYYvAC2v8j\nnVWDCY4C5dx5LHrz49JtwMVvwEKtxl6+uHXQprUUMk+Rp3eiKC+Q5pGSD3HCl6vj\njJSwQUr1QaHNCXWa7/5fEeZmIA7KqcoeD4WgrdT/FkotA/VigWNrekn+T9yIJys6\nEUdNqr8K7tc8v7RbSZ+xz03R/ttu2Xr9y2a17W5GBl2Ny9k9oTPRao7MazEunj/Z\nI/DCyCMaZsPk8MGjtycPlEZ2eivyiJqYvmc4+InutjU5oO5PlEQJdP7dn8eD+GTl\nE/o0l6O38TMhbxB5QAolRnVuUdIYjva/a45i/FcmIQKBgQDwhR09elEy1+MDVx19\nH0VHzQxFizi3ACTukjJA/nys07m+72ETSg62hvk6eDSIkqcBTPBK9ghkv9Hoj0gZ\nMCLWMTcIT143aurTz/hks7f2ivg0Rqi1Si1H1SrplTPMXiEVfSvTMWkJwcHZkSmB\nzvba8Kqp9RU9qsI8zVVSLPlpjwKBgQDNRxpVnV6CueaKOm3mVhXYQI+lDevkKn3Q\nhS/ffNbrx12YM+JUJWROX++Tdb/EREwferp6xRtDQbLMWqqZRyYU+x2NMdRr/+Vk\nTOCljniYZ6YKQh1TJeKDN8do3RmGEkhKk63RYFWgrtock3I9F6KsXXT0meSSNNXr\n9EbPQCSJMQKBgQDW4pbVLksNWcQAX/yApUeIdrHYECKDnSVh4Ev1tWg+IIt7AvOA\nAFJU0RIqIusMebmrd8nXryigmqA3XovTtSXqp927Fu3eJS/YPZ52mfpp0o8eZWKl\nVbhOzSyhtCOrGw4D3OkirqphhTJj50VmLDpwMUTIw6ZOihkvqWPpHzVWEQKBgCGP\n3Xtf9mLTOCEjenJtYrbvn0yyIP42AEoGbJRSmeUEvIW0/e0aC/NQdiAa4VaagAOp\nkjGeZl2xsST+MeRLoKtPfz5lhkB+Hygt9ZC74XWxhJEqzBabHBSuGvlHJPQpqw4e\nZQ3VfUp/LAP+C3B3m84onYWcX6WT4+HnF2itKQwRAoGAFvnG1fxplQ1BbvwuLnlv\nN4QaH1achiMrMXitlmkhw2JdFiy/k2fr9BIp9PiUYftzQeDHL9kHzQGdQWfmWFe7\n9bIKu2VfQkLthhCdfJt0o/H6QvwW8IMi7Q0MkG+491m3X8erEVG0AZTT87ayJiCT\ng16z+68/q0leSk3nRh2vooI=\n-----END PRIVATE KEY-----\n"
//   },
//   databaseURL: "https://project-3444843529926405572.firebaseio.com/"
// });

// app settings and middleware

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', homeRoutes);
app.use('/api/users', userRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Connect to this host using https, basic auth,
// a path prefix, and static query string values
var client = new elasticsearch.Client({
  host: 'http://search-chatbuddies-o3435trg4cn5bdaiqgizuel4bu.us-west-2.es.amazonaws.com/'
});

// Establish listening on service

function upsert(snapshot){
    client.index({
        index: 'firebase',
        type: 'users',
        id: snapshot.key,
        body: snapshot.val()
    }, function(err, response){
        if(err){
            console.log("Error indexing user : " + error);
        }
    })
}

function remove(snapshot){
    client.delete({
        index: 'firebase',
        type: 'users',
        id: snapshot.key
    }, function(error, response){
        if(error){
            console.log("Error deleting user : " + error);
        }
    });
}

var db = firebase.database();
var ref = db.ref("firebase/chatbuddies");

var usersRef = ref.child('users');

usersRef.on('child_added', upsert);
usersRef.on('child_changed', upsert);
usersRef.on('child_removed', remove);


module.exports = app;

