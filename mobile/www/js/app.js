// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('brandtreat',['ionic', 'ngCordova', 'brandtreat.controllers', 'brandtreat.services'])

.directive('blur', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('focus', function() {
                element.parent().children()[0].style.color="#000 !important";
                // element.parent().children().removeClass('clicked');
                // element.addClass('clicked');
            })
        },
    }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('accountSettings', {
    url: '/settings',
    templateUrl: 'templates/accountSettings.html',
    controller: 'AccountSettingsCtrl'
  })

  .state('challengeDetails', {
    url: '/challengedetails/:id',
    templateUrl: 'templates/challengeDetails.html',
    controller: 'ChallengeDetailsCtrl'
  })

  .state('app', {
      url: '/app',
      controller: 'AppCtrl'
  })

  .state('challengeMenu', {
    url: '/challengemenu',
    templateUrl: 'templates/challengeMenu.html',
    controller: 'ChallengeMenuCtrl',
    params: {
      clearHistory: false
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    params: {
      clearHistory: false
    }
  })

  .state('resetPassword', {
    url: '/resetpassword',
    templateUrl: 'templates/resetPassword.html',
    controller: 'resetPasswordCtrl'
  })

  .state('signUp', {
    url: '/signup',
    templateUrl: 'templates/signUp.html',
    controller: 'SignUpCtrl'
  })

  .state('userProfile', {
    url: '/profile',
    templateUrl: 'templates/userProfile.html',
    controller: 'UserProfileCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});
