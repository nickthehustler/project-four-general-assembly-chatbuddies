angular.module('chatBuddies', ['ui.router']);

angular.module('chatBuddies')
.controller('AuthCtrl', function(){

});


angular.module('chatBuddies')
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);
});
