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

    .controller('GameCtrl', function($scope, $cordovaGeolocation, Player){
        $scope.player = Player.getData();

        $scope.position = "kA";
        $scope.positionMe = function() {
            console.log("positionMe");
            var position = {};
            $cordovaGeolocation
                .getCurrentPosition()
                .then(function (p) {
                    var lat  = p.coords.latitude.toString();
                    var long = p.coords.longitude.toString();
                    var p = {
                        lat: lat,
                        long: long
                    }
                    window.localStorage["position"] = JSON.stringify(p);
                    console.log(lat);
                    console.log(long);
                    position.lat = lat;
                    position.long = long;
                    $scope.position = position;
                }, function(err) {
                    // error
                    position = "kein Ergebnis!!";
                    $scope.position = position;
                })
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