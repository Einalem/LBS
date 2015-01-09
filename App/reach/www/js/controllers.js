angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player) {

      $scope.saveUser = function (user) {
        if(user.radius==null)
        {
          user.radius = "3";
        }
        Player.setData(user.username, user.radius);
      }
    })

    .controller('GameCtrl', function($scope, Player){
        $scope.player = Player.getData();

        $scope.positionMe = function() {
//            $scope.here = Player.getMyPosition();
            console.log("set here variable to: " + Player.getMyPosition());
        }
    })

    .controller('HighscoresCtrl', function($scope, Highscores) {
      $scope.highscores = Highscores.all();

      $scope.remove = function(highscores) {
          Highscores.remove(highscores);
      }
    })

    .controller('CreditsCtrl', function($scope) {})

    .controller('AccountCtrl', function($scope) {
      $scope.settings = {
        enableFriends: true
      };
    })