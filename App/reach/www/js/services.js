(angular.module('starter.services', [])
    .factory('Player', function ($state) {
        var player = {};
        return {
            setData: function (username, radius) {
                var date = new Date();

                player.username = username;
                player.radius = radius;
                player.score = 0;
                player.startpositionLat = 0;
                player.startpositionLong = 0;
                player.lastDist = 100;
                player.dbID = -1;
                player.lastUpdate = date.getUTCDate()+"."+(date.getMonth()+1)+"."+date.getUTCFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

                if (sessionStorage) {
                    sessionStorage.removeItem('player');
                    sessionStorage.setItem('player', JSON.stringify(player));
                } else alert("sessionStorage not available!");
            },
            setStartPosition: function (latitude, longitude) {
                var date = new Date();
                if (sessionStorage && localStorage) {
                    var newDbID;
                    var a = JSON.parse(localStorage.getItem('playerArray'));
                    if (a == null) {
                        a = [];
                        newDbID = 0;
                    } else {
                        newDbID = a.length;
                    }

                    player = JSON.parse(sessionStorage.getItem('player'));
                    player.startpositionLat = latitude;
                    player.startpositionLong = longitude;
                    player.lastUpdate = date.getUTCDate()+"."+(date.getMonth()+1)+"."+date.getUTCFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                    if (player.dbID == -1) {
                        player.dbID = newDbID;
                        a.push(player);
                    }

                    sessionStorage.removeItem('player');
                    sessionStorage.setItem('player', JSON.stringify(player));

                    localStorage.removeItem('playerArray');
                    localStorage.setItem('playerArray', JSON.stringify(a));

                } else alert("sessionStorage or localStorage not available!");
            },
            resetLastDist: function (dist) {
                var date = new Date();
                if (sessionStorage) {
                    player = JSON.parse(sessionStorage.getItem('player'));
                    player.lastDist = dist;
                    player.lastUpdate = date.getUTCDate()+"."+(date.getMonth()+1)+"."+date.getUTCFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

                    sessionStorage.removeItem('player');
                    sessionStorage.setItem('player', JSON.stringify(player));
                } else alert("sessionStorage not available!");
            },
            updatePlayer: function (p) {
                if (sessionStorage && localStorage) {
                    //Aktualisieren der Punktzahl des Spielers über die Summe der einzelnen Aufgabenpunktzahlen
                    var tasks = JSON.parse(sessionStorage.getItem('tasks'));
                    p.score = 0;
                    for (var i = 0; i < tasks.length; i++) {
                        p.score += tasks[i].score;
                    }
                    sessionStorage.removeItem('player');
                    sessionStorage.setItem('player', JSON.stringify(p));

                    //Aktualiesierung Highscores
                    var a = JSON.parse(localStorage.getItem('playerArray'));
                    a[p.dbID] = p;

                    localStorage.removeItem('playerArray');
                    localStorage.setItem('playerArray', JSON.stringify(a));

                } else alert("sessionStorage not available!");
            },
            emptyHighscores: function () {
                if (localStorage && sessionStorage) {
                    localStorage.clear();
                    sessionStorage.clear();
                    alert('Highscores gelöscht');
                    $state.go('tab.play');
                } else {
                    alert("localStorage or sessionStorage not available!");
                }

            },
            getHighscores: function () {
                if (localStorage) {
                    var arr = JSON.parse(localStorage.getItem('playerArray'));
                    if (arr == null) {
                        arr = [];
                    }
                    return arr.sort(function compare(a, b) {
                        if (a.score < b.score)
                            return 1;
                        if (a.score > b.score)
                            return -1;
                        return 0;
                    });
                } else {
                    alert("localStorage not available!");
                    return null;
                }
            },
            getData: function () {
                if (sessionStorage) {
                    player = JSON.parse(sessionStorage.getItem('player'));
                    return player;
                } else  {
                    alert("sessionStorage not available!");
                    return null;
                }
            }
        }
    })
    .factory('Location', function ($ionicLoading) {
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
            getPosition: function (player, setStartPositionCallback) {
                $ionicLoading.show({
                    showBackdrop: false
                });

                //Initialisierungen
                var map = null;
                var latitude = 0;
                var longitude = 0;
                document.getElementById("infotext").innerHTML = "";
                document.getElementById('mapDiv').innerHTML = "";

                //getCurrentPosition
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        //setzen der Koordinaten
                        latitude = pos.coords.latitude;
                        longitude = pos.coords.longitude;
                        document.getElementById("infotext").innerHTML = "Deine Position ist hier: <br/>[" + latitude + ", " + longitude + "]";

                        //Initialisieren der Map auf diesen Punkt
                        document.getElementById('mapDiv').innerHTML = "<div id='map' style='height: 180px;'></div>";
                        map = L.map('map', {
                            center: [latitude, longitude],
                            zoom: 10
                        });
                        L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://www.mapquest.com/">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
                        }).addTo(map);

                        //Markieren des Punkts und des Radius
                        var marker = L.marker([latitude, longitude]).addTo(map);
                        var circle = L.circle([latitude, longitude], player.radius*1000, {
                            color: 'red',
                            fillColor: '#f03',
                            fillOpacity: 0.3
                        }).addTo(map);

                        //Speichern der Position
                        setStartPositionCallback(latitude, longitude);

                        //freigeben des Buttons ('Aufgaben spielen')
                        document.getElementById('playTasks').style.display = 'block';

                        $ionicLoading.hide();
                    }, function (error) {
                        document.getElementById("infotext").innerHTML = "Ihre Position kann leider nicht ermittelt werden. <br/>Aktivieren Sie bei der Nutzung dieser App immer die GPS-Funktion ihres Geräts.";
//                        alert(error.code + ': Unable to get location. Error: ' + error.message);
                        $ionicLoading.hide();
                    }, {enableHighAccuracy: true, timeout: 30000, maximumAge: 20000});
                } else {
                    document.getElementById("infotext").innerHTML = "Geolocation wird vom Browser nicht unterstützt.";
                    $ionicLoading.hide();
                }
            },
            getActualWatchID: function () {
                var ret = null;
                if (sessionStorage) {
                    ret = sessionStorage.getItem('watchID');
                } else {
                    alert("sessionStorage not available!");
                }
                return ret;
            },
            watch: function (task, player, updatePlayerCallback, updateTasksCallback) {
                $ionicLoading.show({
                    showBackdrop: false
                });

                //Initialisieren der zu befüllenden Felder
                document.getElementById("Verlauf").innerHTML = "";
                document.getElementById("distTitel").innerHTML = "";
                document.getElementById("distance").innerHTML = "";
                document.getElementById("color").innerHTML = "";
                document.getElementById("scores").innerHTML = "";

                if (navigator.geolocation) {
                    var id = navigator.geolocation.watchPosition(
                        //Successfunktion
                        function (pos) {
                            $ionicLoading.hide();
                            var date = new Date();

                            //speichern der watchID
                            if(sessionStorage){
                                sessionStorage.removeItem('watchID');
                                sessionStorage.setItem('watchID', id);
                            }else{alert("sessionStorage not available!");}

                            //setzen der Koordinaten
                            var latitude = pos.coords.latitude;
                            var longitude = pos.coords.longitude;
                            var distance = getDistanceFromLatLonInKm(latitude, longitude, task.taskPosLat, task.taskPosLong);
                            distance = distance.toFixed(3);

                            var diff = (task.distance - distance).toFixed(3);
/*                            document.getElementById("distTitel").innerHTML =
                                date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +
                                date.getMilliseconds() + " [" + latitude.toFixed(3) + "," + longitude.toFixed(3) + "]";
  */
                            document.getElementById("distTitel").innerHTML =
                                "Geschafft (" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" +
                                date.getMilliseconds() + ")";

                            document.getElementById("distance").innerHTML = diff + " km";
                            /*
                            document.getElementById("distance").innerHTML =
                                distance + " km<br/>Geschafft: " + diff + " Meter";
                            document.getElementById("Verlauf").innerHTML =
                                document.getElementById("Verlauf").innerHTML +
                                "<br/>alt:" + player.lastDist +", neu:" + distance + " --> Diff:" + (distance-player.lastDist).toFixed(2);
*/
                            if (distance <= 0.01) {
                                document.getElementById("color").innerHTML = "<center><img src='img/stern.png' alt='Ziel_erreicht'></center>";
                                //Bonus für das Erreichen der Zielkoordinaten (mit Abweichung von 10meter)
                                task.score = task.score + 10;
                                /*
                                 var myPopup = $ionicPopup.alert({
                                 title: "+10",
                                 template: "Spiel gewonnen"
                                 });
                                 $timeout(function() {
                                 myPopup.close();
                                 }, 900);
                                 */
                                task.stateFinished = true;
                                navigator.geolocation.clearWatch(id);
                            } else {
                                if (distance <= player.lastDist) {
                                    document.getElementById("color").innerHTML = "<h2>Restentfernung:</h2> <br/><center><h1 style='color: green;'>"+ distance + " km</h1></center>";
                                    //Bonus für korrekte Richtung
                                    task.score++;
                                    /*
                                     var myPopup = $ionicPopup.alert({
                                     title: "+1",
                                     template: ""
                                     });
                                     $timeout(function() {
                                     myPopup.close();
                                     }, 900);
                                     */
                                } else {
                                    document.getElementById("color").innerHTML = "<h2>Restentfernung:</h2> <br/><center><h1 style='color: red;'>"+ distance + " km</h1></center>";
                                    //Abzug für falsche Richtung
                                    task.score--;
                                    /*
                                     var myPopup = $ionicPopup.alert({
                                     title: "-1",
                                     template: ""
                                     });
                                     $timeout(function() {
                                     myPopup.close();
                                     }, 900);
                                     */
                                }
                            }
                            document.getElementById("scores").innerHTML = "<h3>Punkte für diese Aufgabe: " + task.score + "</h3>";

                            player.lastDist = distance;
                            player.lastUpdate =
                                date.getUTCDate()+"."+(date.getMonth()+1)+"."+date.getUTCFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();

                            //Reihenfolge Tasks vor Player !!! - Player-Score errechnet sich durch Summieren der Task-Scores
                            updateTasksCallback(task);
                            updatePlayerCallback(player);
                        },
                        //Errorfunktion
                        function (error) {
                            $ionicLoading.hide();
                            console.log('Unable to get location. Error: ' + error.message);
                        },
                        //options
                        {enableHighAccuracy: true, timeout: 60000, maximumAge: 30000});
                } else {
                    $ionicLoading.hide();
                    alert('Geolocation is not supported by the browser');
                }
            },
            clearWatchID: function(id){
                navigator.geolocation.clearWatch(id);
                if (sessionStorage) {
                    sessionStorage.removeItem('watchID');
                    sessionStorage.setItem('watchID', id);
                } else {
                    alert("sessionStorage not available!");
                }
            }
        }
    })
    .factory('Task', function ($ionicLoading) {
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
                //proven
                id: 0,
                name: "Mannheim Hbf",
                difficulty: 0,
                taskPosLat: 49.479904895467314,
                taskPosLong: 8.470357013095054
            },
            {
                id: 1,
                name: "Mannheim Universität",
                difficulty: 0,
                taskPosLat: 49.48373966279436,
                taskPosLong: 8.46222996711731
            },
            {
                id: 2,
                name: "Mannheim Wasserturm",
                difficulty: 0,
                taskPosLat: 49.48336089947494,
                taskPosLong: 8.477369150878872
            },
            {
                id: 3,
                name: "Mannheim Neckar",
                difficulty: 0,
                taskPosLat: 49.490776620594524,
                taskPosLong: 8.482561907531704
            },
            {
                id: 4,
                name: "Mannheim Rhein",
                difficulty: 0,
                taskPosLat: 49.494403359335486,
                taskPosLong: 8.456469378234829
            },
            {
                id: 5,
                name: "Mannheim Planetarium",
                difficulty: 0,
                taskPosLat: 49.47740881680398,
                taskPosLong: 8.492545089485134
            },
            {
                id: 6,
                name: "Mannheim Neuostheim",
                difficulty: 0,
                taskPosLat: 49.477535848201974,
                taskPosLong: 8.523100018501282
            },
            {
                id: 7,
                name: "DHBW Mannheim",
                difficulty: 0,
                taskPosLat: 49.47486305610966,
                taskPosLong: 8.534472537387046
            },
            {
                id: 8,
                name: "SAP Arena",
                difficulty: 0,
                taskPosLat: 49.46291261860678,
                taskPosLong: 8.516823649406433
            },
            {
                //proven
                id: 9,
                name: "Frankfurt Hbf",
                difficulty: 0,
                taskPosLat: 50.1054545,
                taskPosLong: 8.6602485
            },
            {
                id: 10,
                name: "Mannheim Schlossgarten",
                difficulty: 0,
                taskPosLat: 49.479352432064466,
                taskPosLong: 8.462160182345542
            },
            {
                //proven
                id: 11,
                name: "Frankfurt Messe",
                difficulty: 0,
                taskPosLat: 50.1115285,
                taskPosLong: 8.6437032
            },
            {
                id: 12,
                name: "Frankfurt Test 1",
                difficulty: 0,
                taskPosLat: 50.1146029,
                taskPosLong: 8.6391511
            },
            {
                id: 13,
                name: "Berlin Test 1",
                difficulty: 0,
                taskPosLat: 52.52029,
                taskPosLong: 13.40491511
            },
            {
                id: 14,
                name: "Dortmund Test 1",
                difficulty: 0,
                taskPosLat: 51.43029,
                taskPosLong: 7.661511
            },
            {
                id: 15,
                name: "Frankfurt Test 2",
                difficulty: 0,
                taskPosLat: 50.1246029,
                taskPosLong: 8.6391511
            },
            {
                id: 16,
                name: "Frankfurt Test 3",
                difficulty: 0,
                taskPosLat: 50.1156029,
                taskPosLong: 8.6431511
            },
            {
                id: 17,
                name: "Frankfurt Test 4",
                difficulty: 0,
                taskPosLat: 50.115111500,
                taskPosLong: 8.6387480
            }

        ];
        return {
            getTasks: function () {
                if (sessionStorage) {
                    return JSON.parse(sessionStorage.getItem('tasks'));
                } else {
                    alert("sessionStorage not available!");
                    return null;
                }
            },
            setActualTask: function (id) {
                if (sessionStorage) {
                    var tasks = JSON.parse(sessionStorage.getItem('tasks'));
                    for (var i = 0; i < tasks.length; i++) {
                        if (tasks[i].id == id) {
                            var actualTask = tasks[i];
                            if (sessionStorage) {
                                sessionStorage.removeItem('actualTask');
                                sessionStorage.setItem('actualTask', JSON.stringify(actualTask));
                            } else {
                                alert("sessionStorage not available!");
                            }
                        }
                    }
                }
            },
            updateTasks: function (t) {
                if (sessionStorage) {
                    var tasks = JSON.parse(sessionStorage.getItem('tasks'));
                    for (var i = 0; i < tasks.length; i++) {
                        if (tasks[i].id == t.id) {
                            tasks[i] = t;
                        }
                    }
                    sessionStorage.removeItem('tasks');
                    sessionStorage.setItem('tasks', JSON.stringify(tasks));
                } else {
                    alert("sessionStorage not available!");
                }
            },
            getActualTask: function () {
                if (sessionStorage) {
                    return JSON.parse(sessionStorage.getItem('actualTask'));
                } else {
                    alert("sessionStorage not available!");
                    return {};
                }
            },
            newTasks: function (player) {
                $ionicLoading.show({
                    showBackdrop: false
                });

                var radius = player.radius;
                var tasks = [];
                for (var i = 0; i < taskCollection.length; i++) {
                    var distance = getDistanceFromLatLonInKm(player.startpositionLat, player.startpositionLong, taskCollection[i].taskPosLat, taskCollection[i].taskPosLong);
                    if (distance <= radius) {
                        tasks.push({
                            id: tasks.length + 1,
                            name: taskCollection[i].name,
                            distance: distance.toFixed(4),
                            score: 0,
                            taskPosLat: taskCollection[i].taskPosLat,
                            taskPosLong: taskCollection[i].taskPosLong,
                            stateFinished: false,
                            stateIgnore: false
                        });
                    }
                }
                if (sessionStorage) {
                    sessionStorage.removeItem('tasks');
                    sessionStorage.setItem('tasks', JSON.stringify(tasks));
                } else {
                    alert("sessionStorage not available!");
                }

                $ionicLoading.hide();
            }
        }
    })
);