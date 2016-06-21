var app = angular.module('chatBuddies', ['ui.router', 'firebase', 'ui.bootstrap']);



app.controller('authController', function($http, $state){
  console.log("authController is alive!");

  var vm = this;

  vm.photoLink = "https://firebasestorage.googleapis.com/v0/b/project-3444843529926405572.appspot.com/o/solid_gray_square.png?alt=media&token=988c7653-0619-41ed-b811-be57ca1a297a";

  vm.user = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  vm.newUser = {
    username: '',
    email: '',
    uid: '',
    photoURL: '',
    chats: ''
  };

  vm.confirmPassword = function() {
    return vm.user.password === vm.user.passwordConfirmation;
  }

  vm.signUp = function() {

    // first you want to confirm the password and password confirmation match
    if(vm.confirmPassword() /* check to see if the username is unique*/) {
      // if password and password confirmation match then
      // proceed to check if the username is unique

      // check for unique username
      // ::::::::::::::::DEVELOPER TODO::::::::::::::::

      // If the username is unique then proceed to create a new user
      firebase.auth().createUserWithEmailAndPassword(vm.user.email, vm.user.password)
      .then(function(confirmedUser){
        // build user object to pass to firebase DB
        console.log("Here is the confirmed user:");
        console.log(confirmedUser);
        vm.newUser.username = vm.user.username;
        vm.newUser.email    = confirmedUser.email;
        vm.newUser.uid      = confirmedUser.uid;
        vm.newUser.photoURL = vm.photoLink;
        vm.newUser.chats    = '';

        console.log("Here is the new user: ", vm.newUser);

        // now we want to store the newly created user in the database
        $http.post('/api/users', vm.newUser)
        .then(function() {
          console.log("Success!");
          // initialize listeners on user
          // ::::::::::::::::DEVELOPER TODO::::::::::::::::

          // redirect to user profile page
          $state.go('profile', {uid: vm.newUser.uid});
          // $state.go('profile', {uid: vm.firebase.database.currentUser.uid});
          })
        })
      .catch(function(error){
        // create an error message if something goes wrong
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + ": " + errorMessage);
      });
    } else {
      // if password and password confirmation don't match then
      // display an error message
      console.log("password and password confirmation don't match");
    }
  }

  vm.login = function() {

    firebase.auth().signInWithEmailAndPassword(vm.user.email, vm.user.password)
    .then(function(confirmedUser) {
      console.log("User has been confirmed!");
      console.log(confirmedUser);
      // redirect to user profile page (?)
      $state.go('profile', {uid: confirmedUser.uid});
    })
    .catch(function(error){
      // create an error message if something goes wrong
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + ": " + errorMessage);
    });
  }

});

app.controller('usersController', ["$http", "$state", "$scope", "$firebaseObject", "$firebaseArray", function($http, $state, $scope, $firebaseObject, $firebaseArray){
  console.log("usersController is alive!");

  var vm = this;

  vm.amazonlink = "http://search-chatbuddies-o3435trg4cn5bdaiqgizuel4bu.us-west-2.es.amazonaws.com/";

  vm.currentUser = {
    username: '',
    email: '',
    uid: firebase.auth().currentUser.uid,
    photoURL: ''
  }

  vm.newMessage = {
    username: '',
    content: ''
  };

  vm.searchTerm = {
    term: ''
  };

  // var client = new elasticsearch.Client({
  //   host: 'http://search-chatbuddies-o3435trg4cn5bdaiqgizuel4bu.us-west-2.es.amazonaws.com/'
  // });

  // Setting up listener on chat messages
  var db = firebase.database();
  var ref = db.ref("firebase/chatbuddies");
  var chatsRef = ref.child('chats');

  vm.messages = $firebaseArray(chatsRef);

  // Setting up path for uploading profile pictures
  var storage = firebase.storage();
  var ref = storage.ref();
  var picRef = ref.child('profilepictures');

  vm.searchForUsername = function() {
    console.log("...searching");
    console.log(vm.searchTerm);

    $http.post('/api/users/search', vm.searchTerm)
    // $http.get('/api/users/search')
    .then(function(response) {
      console.log(response.data);
    });

  }

  vm.getCurrentUserInfo = function() {
    console.log("Getting user info");
    vm.currentUser.uid = firebase.auth().currentUser.uid;

    $http
    .get('/api/users/' + vm.currentUser.uid)
    .then(function(response){

      vm.currentUser.username = response.data.username;
      vm.currentUser.email    = response.data.email;
      vm.currentUser.photoURL = response.data.photoURL;
    });

  }

  vm.sendMessage = function() {
    // build message to be sent to firebase DB
    vm.newMessage.username = vm.currentUser.username;


    // send message to server
    $http.post('/api/users/messages', vm.newMessage)
    .then(function(response) {
      console.log("Successfully sent a message to the server!");
      console.log(response.data);
      vm.resetForm();
    });

  }

  vm.resetForm = function() {
    vm.newMessage.content = '';
  }

  vm.uploadPicture = function() {
    console.log("You are hitting the uploadPicture method.");
  }

  vm.signOut = function() {
    firebase.auth().signOut()
    .then(function() {
      console.log("successfully signout!");
      $state.go('home');
    }, function(error) {
      console.log("Something bad happened during the signout process!");
    });
  }

  vm.getCurrentUserInfo();
}]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);

  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('signup', {
      url: "/signup",
      templateUrl: "views/signup.html",
      controller: "authController",
      controllerAs: "ctrl"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: "authController",
      controllerAs: "ctrl"
    })
    .state('profile', {
      url: "/users/:uid",
      templateUrl: "views/profile.html",
      controller: "usersController",
      controllerAs: "ctrl"
    })
    .state('picture', {
      url: "/users/:uid/picture",
      templateUrl: "views/picture.html",
      controller: "usersController",
      controllerAs: "ctrl"
    });
});
