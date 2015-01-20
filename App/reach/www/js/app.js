// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ui.router', 'ngCordova'])

.run(function($ionicPlatform, $ionicPopup, $cordovaSplashscreen) {
//        $cordovaSplashscreen.show();
        $ionicPlatform.ready(function() {
//                $cordovaSplashscreen.hide();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
      // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }

              // Check for network connection
              if(window.Connection) {
                  if(navigator.connection.type == Connection.NONE) {
                      $ionicPopup.confirm({
                          title: 'No Internet Connection',
                          content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
                      })
                          .then(function(result) {
                              if(!result) {
                                  ionic.Platform.exitApp();
                              }
                          });
                  }
              }
          }
      );
    })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.play', {
    url: '/play',
    views: {
      'tab-play': {
        templateUrl: 'templates/tab-play.html',
        controller: 'PlayCtrl'
      }
    }
  })

      .state('tab.game', {
        url: '/play/:player',
        views: {
          'tab-play': {
            templateUrl: 'templates/tab-game.html',
            controller: 'GameCtrl'
          }
        }
      })

      .state('tab.task', {
        url: '/task/:taskName',
        views: {
          'tab-play': {
            templateUrl: 'templates/tab-task.html',
            controller: 'TaskCtrl'
          }
        }
      })

      .state('tab.tasks', {
        url: '/tasks',
        views: {
          'tab-play': {
            templateUrl: 'templates/tab-tasks.html',
            controller: 'TasksCtrl'
          }
        }
      })

      .state('tab.highscores', {
      url: '/highscores',
      views: {
        'tab-highscores': {
          templateUrl: 'templates/tab-highscores.html',
          controller: 'HighscoresCtrl'
        }
      }
    })

  .state('tab.credits', {
      url: '/credits',
      views: {
        'tab-credits': {
          templateUrl: 'templates/tab-credits.html',
          controller: 'CreditsCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/play');

});
