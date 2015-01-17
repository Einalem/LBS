angular.module('starter.controllers', [])

    .controller('PlayCtrl', function($scope, Player, DataBase) {
        DataBase.openDataBase();
        DataBase.createHighscoreTable();

        $scope.saveUser = function (user) {
          if(user.radius==null) {
              user.radius = "3";
          }
          Player.setData(user.username, user.radius);
            DataBase.insertPlayerResult(Player.getData());
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

    .controller('TasksCtrl', function($scope, Player, Game){
        $scope.tasks = Game.getTasks();
        $scope.player = Player.getData();
        $scope.scores = "<h3>Punkte: " + Player.getData().score + "</h3>";

        $scope.play = function(taskID){
            Game.setActualTask(taskID);
        }

        $scope.ignore = function(taskID){
            Game.ignoreTask(taskID);
        }
    })

    .controller('TaskCtrl', function($scope, Player, Game){
        Player.resetLastDist();

        var t = Game.getActualTask();
        var player = Player.getData();

        Game.watch(t, player);

        $scope.task = t;
        $scope.player = player;
        $scope.scores = "<h3>Punkte: " + Player.getData().score + "</h3>";

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