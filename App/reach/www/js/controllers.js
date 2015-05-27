//Melanie Hammerschmidt
angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player) {
        $scope.savePlayer = function (p) {
            Player.checkSave(p, Player.setData);
        }
    })
    .controller('GameCtrl', function($scope, $ionicLoading, Player, Location, Task){
        $scope.$on('$ionicView.beforeEnter', function() {
            //Initialisieren der HTML-Elemente
            document.getElementById("infotext").innerHTML = "";
            document.getElementById('mapDiv').innerHTML = "";
            document.getElementById('playTasks').style.display = 'none';

            $scope.player = Player.getData();
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
            if(id!=null) {
                Location.clearWatchID(id);
            }

            $scope.player = Player.getData();
            $scope.tasks = Task.getTasks();
            $scope.play = function (taskID) {
                Task.setActualTask(taskID);
            }
        });
    })
    .controller('TaskCtrl', function($scope, Player, Task, Location){
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.task = Task.getActualTask();

            Player.resetLastDist($scope.task.distance);

            if($scope.task.stateFinished==false){
                Location.watch($scope.task, Player.getData(), Player.updatePlayer, Task.updateTasks);
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