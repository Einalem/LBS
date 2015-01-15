angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player) {

      $scope.saveUser = function (user) {
        if(user.radius==null) {
          user.radius = "3";
        }
        Player.setData(user.username, user.radius);
      }

    })

    .controller('GameCtrl', function($scope, $ionicLoading, Player, Game){
        $scope.player = Player.getData();
        $scope.positionMe = function() {
            Player.getStartPosition($scope.player.radius);
        };

        $scope.tasks = function(){
            Game.newTasks($scope.player);
        };
    })

    .controller('TasksCtrl', function($scope, Game){
        $scope.tasks = Game.getTasks();
        $scope.play = function(taskID){
            Game.setActualTask(taskID);
        }
        $scope.ignore = function(taskID){
            Game.ignoreTask(taskID);
        }
    })

    .controller('TaskCtrl', function($scope, Player, Game, Task){
        var t = Game.getActualTask();
        var player = Player.getData();

        $scope.task = t;
        $scope.player = player;

        Task.watch(t, player);
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