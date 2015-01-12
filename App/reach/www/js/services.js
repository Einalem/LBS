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

    .factory('Player', function($ionicLoading) {
      // Might use a resource here that returns a JSON array
      // Some fake testing data
      var player = {username: "",
                    radius: "",
                    startpositionLat: "",
                    startpositionLong: ""};

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
        getStartPosition: function(radius){
          $ionicLoading.show({
            showBackdrop: false
          });

          var x = document.getElementById("pic");
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              //setzen der Koordinaten
              var latitude = pos.coords.latitude.toString();
              var longitude = pos.coords.longitude.toString();
              console.log("Position: lat: " + latitude + " long: " + longitude);

              //Map Einstellungen
              var myCenter=new google.maps.LatLng(latitude,longitude);
                var mapProp = {
                  center:myCenter,
                  zoom:12,
                  mapTypeId:google.maps.MapTypeId.ROADMAP
                };

              //Setzen der Startposition
              var map=new google.maps.Map(document.getElementById("pic"), mapProp);
              var marker=new google.maps.Marker({
                position:myCenter
              });
              marker.setMap(map);

              //Markierung der Gesamtfläche entsprechend gewähltem Radius
              var area = new google.maps.Circle({
                center:myCenter,
                radius:radius*1000,   //Angabe in Metern gefordert (radius in km uebergeben)
                strokeColor:"#0000FF",
                strokeOpacity:0.3,
                strokeWeight:2,
                fillColor:"#0000FF",
                fillOpacity:0.2
              });
              area.setMap(map);

              $ionicLoading.hide();
            }, function(error) {
              x.innerHTML = "Ihre Position kann leider nicht ermittelt werden.";
              console.log('Unable to get location. Error: ' + error.message);

              $ionicLoading.hide();
            }, {enableHighAccuracy: true, timeout: 30000, maximumAge:30000 });
          } else {
            x.innerHTML = "Geolocation wird vom Browser nicht unterstützt.";
            console.log('Geolocation is not supported by the browser');

            $ionicLoading.hide();
          }
        }
      }
    });
