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
      var player = {
        username: "",
        radius: 3,
        score: 0,
        startpositionLat: 0,
        startpositionLong: 0,
        lastDist: 100
      };

      return {
        setData: function(name,ra) {
          player.username = name;
          player.radius = ra;
        },
        getData: function() {
          return player;
        },
        getStartPosition: function(radius){
          $ionicLoading.show({
            showBackdrop: false
          });

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
              //setzen der Koordinaten
              var latitude = pos.coords.latitude;
              var longitude = pos.coords.longitude;
              document.getElementById("text").innerHTML = "Deine Position ist hier: [" + latitude + ", " + longitude + "]";
              document.getElementById('map').innerHTML = "";
              
              var map = L.map('map', {
                center: [latitude, longitude],
                zoom: 10
              });

              L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.mapquest.com/">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
              }).addTo(map);

              var marker = L.marker([latitude, longitude]).addTo(map);
              var circle = L.circle([latitude, longitude], radius*1000, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.3
              }).addTo(map);

              //speichern der Startposition
              player.startpositionLat = latitude;
              player.startpositionLong = longitude;

              //freigeben des Buttons
              document.getElementById('createTasks').style.display = 'block';

              $ionicLoading.hide();
            }, function(error) {
              document.getElementById("text").innerHTML = "Ihre Position kann leider nicht ermittelt werden.";
              console.log('Unable to get location. Error: ' + error.message);

              $ionicLoading.hide();
            }, {enableHighAccuracy: true, timeout: 30000, maximumAge:30000 });
          } else {
            document.getElementById("text").innerHTML = "Geolocation wird vom Browser nicht unterstützt.";
            console.log('Geolocation is not supported by the browser');

            $ionicLoading.hide();
          }
        }
      }
    })

    .factory('Game', function($ionicLoading) {

      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI / 180)
      }

      var taskCollection = [
        {
          id: 0,
          name: "Mannheim Hbf",
          difficulty: 0,
          taskPosLat: 49.479904895467314,
          taskPosLong: 8.470357013095054,
          points: 5
        },
        {
          id: 1,
          name: "Mannheim Universität",
          difficulty: 0,
          taskPosLat: 49.48373966279436,
          taskPosLong: 8.46222996711731,
          points: 5
        },
        {
          id: 2,
          name: "Mannheim Wasserturm",
          difficulty: 0,
          taskPosLat: 49.48336089947494,
          taskPosLong: 8.477369150878872,
          points: 5
        },
        {
          id: 3,
          name: "Mannheim Neckar",
          difficulty: 0,
          taskPosLat: 49.490776620594524,
          taskPosLong: 8.482561907531704,
          points: 5
        },
        {
          id: 4,
          name: "Mannheim Rhein",
          difficulty: 0,
          taskPosLat: 49.494403359335486,
          taskPosLong: 8.456469378234829,
          points: 5
        },
        {
          id: 5,
          name: "Mannheim Planetarium",
          difficulty: 0,
          taskPosLat: 49.47740881680398,
          taskPosLong: 8.492545089485134,
          points: 5
        },
        {
          id: 6,
          name: "Mannheim Neuostheim",
          difficulty: 0,
          taskPosLat: 49.477535848201974,
          taskPosLong: 8.523100018501282,
          points: 5
        },
        {
          id: 7,
          name: "DHBW Mannheim",
          difficulty: 0,
          taskPosLat: 49.47486305610966,
          taskPosLong: 8.534472537387046,
          points: 5
        },
        {
          id: 8,
          name: "SAP Arena",
          difficulty: 0,
          taskPosLat: 49.46291261860678,
          taskPosLong: 8.516823649406433,
          points: 5
        },
        {
          id: 9,
          name: "Frankfurt Hbf",
          difficulty: 0,
          taskPosLat: 50.10681977924821,
          taskPosLong: 8.662529288013502,
          points: 5
        },
        {
          id: 10,
          name: "Mannheim Schlossgarten",
          difficulty: 0,
          taskPosLat: 49.479352432064466,
          taskPosLong: 8.462160182345542,
          points: 5        },
        {
          id: 11,
          name: "Frankfurt Messe",
          difficulty: 0,
          taskPosLat: 50.114022,
          taskPosLong: 8.6445889,
          points: 5
        }
      ];

      var tasks = [];
      var actualTask = {};

      return {
        getTasks: function () {
          return tasks;
        },
        setActualTask: function (id) {
          for(var i=0; i<tasks.length; i++) {
            if(tasks[i].id == id){
              actualTask = tasks[i];
            }
          }
        },
        getActualTask: function () {
          return actualTask;
        },
        newTasks: function (player) {
          console.log("check all Tasks for match");
          $ionicLoading.show({
            showBackdrop: false
          });

          var radius = player.radius;
          tasks = [];

          for(var i=0; i<taskCollection.length; i++) {
            var distance = getDistanceFromLatLonInKm(player.startpositionLat, player.startpositionLong, taskCollection[i].taskPosLat, taskCollection[i].taskPosLong);
            if(distance<=radius) {
              console.log(i + ": im Rahmen = " + distance);
              tasks.push({
                id: tasks.length+1,
                name: taskCollection[i].name,
                distance: distance,
                points: taskCollection[i].points,
                taskPosLat: taskCollection[i].taskPosLat,
                taskPosLong: taskCollection[i].taskPosLong,
                stateFinished: false,
                stateIgnore: false
              });
            }else{
              console.log(i + ": nicht im Rahmen = " + distance);
            }
          }
//          console.log(JSON.stringify(tasks));
          $ionicLoading.hide();
        },
        ignoreTask: function(taskID){
          for(var i=0; i<tasks.length; i++) {
            if(tasks[i].id == taskID){
              tasks[i].stateIgnore = true;
            }
          }
        }
      }
    })

    .factory('Task', function() {

      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI / 180)
      }

      return {
        watch: function(task, player){
          var id;
          console.log("in Task: " + JSON.stringify(task));
          console.log("for Player: " + JSON.stringify(player));
          document.getElementById("Entfernung").innerHTML = "";

          if (navigator.geolocation) {
            id = navigator.geolocation.watchPosition(
                //Successfunktion
                function(pos) {
                //setzen der Koordinaten
                  var latitude = pos.coords.latitude.toString();
                  var longitude = pos.coords.longitude.toString();
                  var distance = getDistanceFromLatLonInKm(latitude, longitude, task.taskPosLat, task.taskPosLong);
                  document.getElementById("Entfernung").innerHTML =
                      document.getElementById("Entfernung").innerHTML + "<br\>" +
                      "neue Position: [" + latitude + ", " + longitude + "]" +
                      "<p align=right>Rest: " + distance + "</p>";

                  if(distance<=player.lastDist){
                    //Auf 5meter "genau"
                    if(distance<=0.005){
                      document.getElementById("color").innerHTML = '<center><img src="img/stern.png" alt="Ziel_erreicht"></center>';
                    }else{
                      document.getElementById("color").innerHTML = '<center><img src="img/daumen_hoch.jpg" alt="gut"></center>';
                    }
                  }else{
                    document.getElementById("color").innerHTML = '<center><img src="img/daumen_runter.jpg" alt="schlecht"></center>';
                  }

                  player.lastDist = distance;
                },
                //Errorfunktion
                function(error) {
//                  x.innerHTML = "Ihre Position kann leider nicht ermittelt werden.";
                  console.log('Unable to get location. Error: ' + error.message);
                },
                //options
                {enableHighAccuracy: true, timeout: 60000, maximumAge:30000 });
          } else {
//            x.innerHTML = "Geolocation wird vom Browser nicht unterstützt.";
            console.log('Geolocation is not supported by the browser');
          }
        }
      }
    });