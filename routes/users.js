var express         = require('express');
var firebase        = require('firebase');
var elasticsearch   = require('elasticsearch');

// initialize a new router
var router    = express.Router();

// initialize firebase
firebase.initializeApp({
  serviceAccount: {
    projectId: "project-3444843529926405572",
    clientEmail: "chat-buddies-firebase@project-3444843529926405572.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDA3WYTTAVUs4kE\n9+KYES5yQBb4mjrZVYqXWuvjA7WIpiO5EuXwt6a032nMYWC6H/zKY+xd4euz6DP0\nGVolCoG6PKtCxHtQ6vXA7ttlgKLVvx10JlI8ev9lT6aNk0fcOO7EcVaeMVMjjJ/g\n1KxeskCCstmr2oGSqTZWHr2E2aQn+AWib/nn+VhEWl/rlaqpgRhHr8yuD7i7RQpo\n/6usxYs584ago85Y/tVbTdg1EBWJFpRQy0xZkx4Ro7lW6YnLeb6gblj8ajo/N9wX\n0x3BieH536Ufs1sS8WKAnbqpv9hPB7UIZXHhzpugRFz+OQj/BSwwdpGVWS+rRIKY\ncOOtVrtfAgMBAAECggEAAwEv/ur3RkuJve8Ss6XI4HTJJtRYSFyBzTvYYvAC2v8j\nnVWDCY4C5dx5LHrz49JtwMVvwEKtxl6+uHXQprUUMk+Rp3eiKC+Q5pGSD3HCl6vj\njJSwQUr1QaHNCXWa7/5fEeZmIA7KqcoeD4WgrdT/FkotA/VigWNrekn+T9yIJys6\nEUdNqr8K7tc8v7RbSZ+xz03R/ttu2Xr9y2a17W5GBl2Ny9k9oTPRao7MazEunj/Z\nI/DCyCMaZsPk8MGjtycPlEZ2eivyiJqYvmc4+InutjU5oO5PlEQJdP7dn8eD+GTl\nE/o0l6O38TMhbxB5QAolRnVuUdIYjva/a45i/FcmIQKBgQDwhR09elEy1+MDVx19\nH0VHzQxFizi3ACTukjJA/nys07m+72ETSg62hvk6eDSIkqcBTPBK9ghkv9Hoj0gZ\nMCLWMTcIT143aurTz/hks7f2ivg0Rqi1Si1H1SrplTPMXiEVfSvTMWkJwcHZkSmB\nzvba8Kqp9RU9qsI8zVVSLPlpjwKBgQDNRxpVnV6CueaKOm3mVhXYQI+lDevkKn3Q\nhS/ffNbrx12YM+JUJWROX++Tdb/EREwferp6xRtDQbLMWqqZRyYU+x2NMdRr/+Vk\nTOCljniYZ6YKQh1TJeKDN8do3RmGEkhKk63RYFWgrtock3I9F6KsXXT0meSSNNXr\n9EbPQCSJMQKBgQDW4pbVLksNWcQAX/yApUeIdrHYECKDnSVh4Ev1tWg+IIt7AvOA\nAFJU0RIqIusMebmrd8nXryigmqA3XovTtSXqp927Fu3eJS/YPZ52mfpp0o8eZWKl\nVbhOzSyhtCOrGw4D3OkirqphhTJj50VmLDpwMUTIw6ZOihkvqWPpHzVWEQKBgCGP\n3Xtf9mLTOCEjenJtYrbvn0yyIP42AEoGbJRSmeUEvIW0/e0aC/NQdiAa4VaagAOp\nkjGeZl2xsST+MeRLoKtPfz5lhkB+Hygt9ZC74XWxhJEqzBabHBSuGvlHJPQpqw4e\nZQ3VfUp/LAP+C3B3m84onYWcX6WT4+HnF2itKQwRAoGAFvnG1fxplQ1BbvwuLnlv\nN4QaH1achiMrMXitlmkhw2JdFiy/k2fr9BIp9PiUYftzQeDHL9kHzQGdQWfmWFe7\n9bIKu2VfQkLthhCdfJt0o/H6QvwW8IMi7Q0MkG+491m3X8erEVG0AZTT87ayJiCT\ng16z+68/q0leSk3nRh2vooI=\n-----END PRIVATE KEY-----\n"
  },
  databaseURL: "https://project-3444843529926405572.firebaseio.com/"
});

var db = firebase.database();
var ref = db.ref("firebase/chatbuddies");

var usersRef = ref.child('users');
var chatsRef = ref.child('chats');

// Amazon ElasticSearch

var client = new elasticsearch.Client({
  host: 'http://search-chatbuddies-o3435trg4cn5bdaiqgizuel4bu.us-west-2.es.amazonaws.com/',
  info: 'info'
});

// routes

router.get('/:uid', function(req, res) {
  // retrieve user from database
  console.log("You are in the GET route");
  console.log(req.params.uid);

  var vm = this;

  vm.tempUser = {
      username: '',
      email: '',
      uid: '',
      photoURL: '',
      chats: ''
  };

  usersRef.child(req.params.uid).once('value')
  .then(function(snapshot) {
    console.log("Here is the user's username: ", snapshot.val().username);
    console.log("Here is the user's uid: ", req.params.uid);
    console.log("Here is the user's photoURL: ", snapshot.val().photoURL);
    console.log("Here is the user's email: ", snapshot.val().email);

    vm.tempUser.username = snapshot.val().username;
    vm.tempUser.photoURL = snapshot.val().photoURL;
    vm.tempUser.email    = snapshot.val().email;
    vm.tempUser.uid      = req.params.uid;
    vm.tempUser.chats    = snapshot.val().chats;

    console.log(vm.tempUser);
    res.json(vm.tempUser);
  })
  .catch(function(error){
    console.log("Something went wrong with the firebase DB.");
  });
});

router.post('/messages', function(req, res, next) {
  console.log("Made it to the POST message route.");
  // console.log(req.body);
  chatsRef.push({
    username: req.body.username,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    content: req.body.content
  })
  .then(function(response) {
    console.log("Successfully pushed data to Firebase.");
    res.json({content: "You are a great guy!"});
    // res.json(response.data);
  });
});

router.post('/search', function(req, res, next) {
  console.log("Made it to the search route.");
  console.log(req.body.term);
  // console.log(client);
  // var client = new elasticsearch.Client({
  //   host: 'http://search-chatbuddies-o3435trg4cn5bdaiqgizuel4bu.us-west-2.es.amazonaws.com/',
  //   log: 'info'
  // });

  client.search({
    index: 'firebase',
    type: 'users',
    body: {
      query: {
        match_phrase_prefix: {
          username: req.body.term
        }
      }
    }
  })
  .then(function(response) {
    var hits = response.body.hits;
    console.log(hits);
    res.json({content: "You got a search result dude!"});
  }, function(err){
    console.log("error message:", err);
  });
  console.log("hello");
});

router.post('/', function(req, res, next) {
  console.log("---------------------");
  console.log("You hit the users api");
  console.log(req.body);
  console.log("---------------------");

  // save user to database
  usersRef.child(req.body.uid).set({
      username:   req.body.username,
      email:      req.body.email,
      photoURL:   req.body.photoURL,
      uid:        req.body.uid,
      chats:      req.body.chats,
      createdAt:  firebase.database.ServerValue.TIMESTAMP,
      updatedAt:  firebase.database.ServerValue.TIMESTAMP
  })
  .then(function(){
    res.json({content: "Hello Nick"});
  })
});


module.exports = router;




