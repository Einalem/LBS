angular.module('starter.services', [])

.factory('Highscores', function() {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var highscores = [{
    id: 0,
    username: 'Ben Sparrow',
    radius: '2',
    highscore: '100'
  }, {
    id: 1,
    username: 'Max Lynx',
    radius: '3',
    highscore: '30'
  }, {
    id: 2,
    username: 'Andrew Jostlin',
    radius: '4',
    highscore: '29'
  }];

  return {
    all: function() {
      return highscores;
    },
    remove: function(x) {
      highscores.splice(highscores.indexOf(x), 1);
    },
    get: function(highId) {
      for (var i = 0; i < highscores.length; i++) {
        if (highscores[i].id === parseInt(highId)) {
          return highscores[i];
        }
      }
      return null;
    }
  }
})

    .factory('Player', function($cordovaGeolocation) {
      // Might use a resource here that returns a JSON array
      // Some fake testing data
      var player = {username: "",
                    radius: "",
                    startpositionLat: "",
                    startpositionLong: ""};

      var position = "";

      return {
        setData: function(name,ra) {
          player.username = name;
          player.radius = ra;
        },
        getData: function() {
          return player;
        },
        getUsername: function() {
          return player.username;
        },
        getRadius: function() {
          return player.radius;
        },
        setStartpositionLat: function(p){
          player.startpositionLat = p;
        },
        setStartpositionLong: function(p){
          player.startpositionLong = p;
        },
        getStartpositionLat: function(){
          return player.startpositionLat;
        },
        getStartpositionLong: function(){
          return player.startpositionLong;
        },
        getMyPosition: function(){
          console.log("start");
          position = "";

          $cordovaGeolocation
              .getCurrentPosition()
              .then(function (p) {
                var lat  = p.coords.latitude
                var long = p.coords.longitude
                console.log(lat);
                console.log(long);
                position = "lat: " + lat + " long: " + long;
                alert(position);
                return position;
              }, function(err) {
                // error
                position = "kein Ergebnis!!";
                alert(position);
                return position;
              })
          }
      }
    })
