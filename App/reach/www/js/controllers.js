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

        $scope.position = "kA";
        $scope.positionMe = function() {
            console.log("startPos controller");
            var p = Player.getMyPosition();
            console.log("set position variable to: " + p);
            $scope.position = p;
            console.log("endPos controller");
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