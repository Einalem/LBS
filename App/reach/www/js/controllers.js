angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player) {
        $scope.savePlayer = function (p) {
          if(p.radius==null) {
              p.radius = "3";
          }
          Player.setData(p.username, p.radius);
        }
    })
    .controller('GameCtrl', function($scope, $ionicLoading, Player, Location, Task){
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.player = Player.getData();

            document.getElementById("infotext").innerHTML = "";
            document.getElementById('mapDiv').innerHTML = "";
            document.getElementById('playTasks').style.display = 'none';

            $scope.positionMe = function() {
                //Positionsbestimmung mit Map-Ausgabe + Speichern der Spielerdaten als Callback
                Location.getPosition(Player.getData(), Player.setStartPosition);
            };

            $scope.tasks = function(){
                Task.newTasks(Player.getData());
            };
        });
    })
    .controller('TasksCtrl', function($scope, Player, Task, Location){
        $scope.$on('$ionicView.beforeEnter', function() {

            var id = Location.getActualWatchID();
            if(id!=null) {Location.clearWatchID(id);}

            $scope.player = Player.getData();
            $scope.tasks = Task.getTasks();

            $scope.play = function (taskID) {
                Task.setActualTask(taskID);
            }
        });
    })
    .controller('TaskCtrl', function($scope, Player, Task, Location){
        $scope.$on('$ionicView.beforeEnter', function() {
            var t = Task.getActualTask();
            $scope.task = t;

            Player.resetLastDist(t.distance);
            if(t.stateFinished==false){
                Location.watch(t, Player.getData(), Player.updatePlayer, Task.updateTasks);
                $scope.finished = "";
            }else{
                $scope.finished = "Sie haben dieses Ziel bereits erreicht!";
            }
        });
    })
    .controller('HighscoresCtrl', function($scope, Player) {
        $scope.$on('$ionicView.beforeEnter', function(){
            $scope.highscores = Player.getHighscores();
        });
    })
    .controller('CreditsCtrl', function($scope) {})
    .controller('AccountCtrl', function($scope, Player) {
        $scope.emptyHighscores = function(){
          Player.emptyHighscores();
        };
    });