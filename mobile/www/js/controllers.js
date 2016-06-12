// Focus and blur input css change
function globalInputFocus(focus, id) {
   (focus) ? document.getElementById(id).style.color = "#77c4ed" : document.getElementById(id).style.color = "#abacb0";
}

// Initialize user data
userData = {};

//Default Avatar Picture
userData.avatar = "img/avatar.png";

/*** Controllers***/
angular.module('brandtreat.controllers', [])
// Main Controller
.controller('AppCtrl', ['$scope', '$state', 'localStorage', function ($scope, $state, localStorage) {
  // Get the data from the localStorage.
  var token = localStorage.getObject('token');
  var user = localStorage.getObject('user');

  // If the local storage has been set, then redirect to challengeMenu state.
  if (token && user) {
    $state.go('challengeMenu', {clearHistory: true});
  } else {
    $state.go('login', {clearHistory: true});
  }
}])

// Account Settings Controller
.controller('AccountSettingsCtrl', ['$scope', '$ionicHistory', function($scope, $ionicHistory) {

  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  // User Data Info
  $scope.userData = userData;

  // On input focus change icons color
  $scope.inputFocus = globalInputFocus;

  // Update Picture from phone gallery
  $scope.galleryPicture = function () {
    $cordovaImagePicker.getPictures(galleryOptions).then(function (picture) {
      $scope.userData.avatar = picture;
      console.log('Image URI: ' + picture);
    }, function(error) {
      console.log(err);
    });
    $scope.registerform.show();
  };

  $scope.countries = [
    { name: 'Argentina', id: 1},
    { name: 'Chile', id: 2},
    { name: 'Peru', id: 3},
    { name: 'Ecuador', id: 4},
    { name: 'Colombia', id: 5},
    { name: 'Brazil', id: 6}
  ];

}])

.controller('ChallengeDetailsCtrl', ['$scope', '$ionicHistory', '$stateParams', 'challengeFactory', function($scope, $ionicHistory, $stateParams, challengeFactory) {
  // User Data Info
  $scope.userData = userData;
  $scope.challenge = challengeFactory.getChallenge($stateParams.id);


  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

}])

// Challenge Menu Controller
.controller('ChallengeMenuCtrl', ['$scope', '$ionicHistory', '$stateParams', '$state', 'challengeFactory', 'localStorage', function($scope, $ionicHistory, $stateParams, $state, challengeFactory, localStorage) {
  // Clears the history if it comes from App Controller.
  if ($stateParams.clearHistory) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  }
  // Get the data from the localStorage.
  var token = localStorage.getObject('token');
  var user = localStorage.getObject('user');

  // If the local storage has not been set, then redirect to login state.
  if (!token || !user) {
      $state.go('login');
  } else {
    // User Data Info
    $scope.userData = user;
    $scope.challenges = challengeFactory.getChallenges();
  }
  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

}])

.controller('LoginCtrl', ['$scope', '$ionicHistory', '$stateParams', '$ionicLoading',
  '$cordovaToast', '$state', 'localStorage', 'loginFactory',
  function($scope, $ionicHistory, $stateParams, $ionicLoading, $cordovaToast, $state, localStorage, loginFactory) {
  // Clears the history if it comes from App Controller.
  if ($stateParams.clearHistory) {
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  }
  // Get the data from the localStorage.
  var token = localStorage.getObject('token');
  var user = localStorage.getObject('user');

  // On input focus change icons color
  $scope.inputFocus = globalInputFocus;
  // Form data for the login modal
  $scope.loginData = {
    username: '',
    password: ''
  };

  // If the local storage has been set, then redirect to challengeMenu state.
  if (token && user) {
      $state.go('challengeMenu');
  }

  // Do login
  $scope.doLogin = function () {
    var loginData = {
      password: $scope.loginData.password
    };
    if ($scope.loginData.username.indexOf('@') >= 0) {
      loginData.email = $scope.loginData.username;
    } else {
      loginData.username = $scope.loginData.username;
    }
    if (loginData.password && (loginData.email || loginData.username)) {
      $ionicLoading.show({
        templateUrl: 'templates/loading.html'
      });
      loginFactory.login(loginData, function(response, responseHeaders) {
        hideLoading();
        console.log(response);
        if (response.token && response.user) {
          localStorage.storeObject('token', response.token);
          localStorage.storeObject('user', response.user);
          $state.go('challengeMenu');
        } else {
          try {
            $cordovaToast.showShortCenter('No token has been provided by the server.');
          } catch (error) {
            console.log(error);
          }
        }
      }, function (error) {
        var message = error.status === 0 ? 'The server did not respond' : error.data && error.data.message || error.statusText;
        hideLoading();
        try {
          $cordovaToast.showShortCenter(message);
        } catch (error) {
          console.log(error, message);
        }
      });
    }
    // Hides the loading message
    function hideLoading() {
      $ionicLoading.hide();
    }
  }
}])

.controller('resetPasswordCtrl', ['$scope', '$ionicHistory', function($scope, $ionicHistory) {

  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  // On input focus change icons color
  $scope.inputFocus = globalInputFocus;

}])


.controller('SignUpCtrl', ['$scope', '$state', '$ionicHistory','$stateParams', '$ionicLoading',
  '$cordovaToast', '$cordovaImagePicker', 'registerFactory', 'baseURL', 'localStorage',
  function($scope, $state, $ionicHistory, $stateParams, $ionicLoading, $cordovaToast,
    $cordovaImagePicker, registerFactory, baseURL, localStorage) {
  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }

  //Register Form Data
  $scope.signUpData = {
    avatar: userData.avatar
  };

  // On input focus change icons color
  $scope.inputFocus = globalInputFocus;

  // User Avatar Selection from native photo gallery
  var galleryOptions = {
      maximumImagesCount: 1,
      width: 100,
      height: 100,
      quality: 50
  };
  $scope.galleryPicture = function () {
    $cordovaImagePicker.getPictures(galleryOptions).then(function (results) {
      if (results.length == 1) {
        $scope.signUpData.avatar = results[0];
      }
    }, function(error) {
      console.log('error', error);
    });
  };

  // Register a new user
  $scope.doSignUp = function () {
    $ionicLoading.show({
      templateUrl: 'templates/loading.html'
    });
    registerFactory.register($scope.signUpData, function(response, responseHeaders) {
      hideLoading();
      localStorage.storeObject('token', response.token);
      localStorage.storeObject('user', response.user);
      $state.go('challengeMenu');
    }, function (error) {
      var message = error.status === 0 ? 'The server did not respond' : error.data && error.data.message || error.statusText;
      hideLoading();
      try {
        $cordovaToast.showShortCenter(message);
      } catch (error) {
        console.log(error, message);
      }
    });
  }

  // Hides the loading message
  function hideLoading() {
    $ionicLoading.hide();
  }
}])

.controller('UserProfileCtrl', ['$scope', '$ionicHistory', function($scope, $ionicHistory) {
  
  // User Data Info
  $scope.userData = userData;

  // Back history button
  $scope.goBack = function() {
    $ionicHistory.goBack();
  }
}]);
