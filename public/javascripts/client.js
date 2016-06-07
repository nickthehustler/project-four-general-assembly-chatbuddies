angular.module('chatBuddies', ['ui.router']);

angular.module('chatBuddies')
.controller('signupCtrl', function(){
  console.log("signupCtrl is alive!");
});

angular.module('chatBuddies')
.controller('loginCtrl', function() {
  console.log("loginCtrl is alive!");
});


angular.module('chatBuddies')
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
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
      controller: "signupCtrl"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: "loginCtrl"
    });
});
