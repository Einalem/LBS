angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player) {
        $scope.saveUser = function (user) {
          if(user.radius==null) {
              user.radius = "3";
          }
          Player.setData(user.username, user.radius);
        }
    })

    .controller('GameCtrl', function($scope, $ionicLoading, Player, Location, Task){
        $scope.player = Player.getData();
        $scope.positionMe = function() {
            //Positionsbestimmung mit Map-Ausgabe + Speichern der Spielerdaten als Callback
            Location.getPosition(Player.setStartPosition);
        };

        $scope.tasks = function(){
            Task.newTasks(Player.getData());
        };
    })

    .controller('TasksCtrl', function($scope, Player, Task){
        $scope.tasks = Task.getTasks();
        $scope.player = Player.getData();
//        $scope.scores = "<h3>Punkte: " + Player.getData().score + "</h3>";

        $scope.play = function(taskID){
            Task.setActualTask(taskID);
        };

  /*      $scope.ignore = function(taskID){
            Task.ignoreTask(taskID);
        };
  */
    })

    .controller('TaskCtrl', function($scope, Player, Task, Location){
        Player.resetLastDist();

        var t = Task.getActualTask();
        var player = Player.getData();

        Location.watch(t, player, Player.updatePlayer);

        $scope.task = t;
        $scope.player = player;
    })

    .controller('HighscoresCtrl', function($scope, Player) {
        $scope.$on('$ionicView.beforeEnter', function(){
            $scope.highscores = Player.getHighscores();
        });
    })

    .controller('CreditsCtrl', function($scope) {})

    .controller('AccountCtrl', function($scope, Player) {
/*        $scope.settingList = [{ text: "Highscore aktivieren", checked: true }];
        $scope.pushNotificationChange = function() {
//            console.log('Push Notification Change', $scope.pushNotification.checked);
            if($scope.pushNotification.checked==true){
                document.getElementById('high').style.disabled = true;
            }else{
                document.getElementById('high').style.display = false;
            }
        };
        $scope.pushNotification = { checked: true };
*/
        $scope.emptyHighscores = function(){
          Player.emptyHighscores(function(){alert('Highscores gelöscht');});
        };
    });