// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
    var mapElem = document.getElementById('map');
    var center = {
        lat: 47.6,
        lng: -122.3
    };
    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();

    var trafficCams;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done (function(data) {
        trafficCams = data;
        data.forEach(function(trafficCam, itemIndex) {
            var marker = new google.maps.Marker ({
                position: {
                    lat: Number(trafficCam.location.latitude),
                    lng: Number(trafficCam.location.longitude)
                },
                map: map,
                name: trafficCam.cameralabel
            });
            markers.push(marker);
            google.maps.event.addListener(marker, 'click', function() {
                var position = this.getPosition();
                map.panTo(position);
                var html = '<h2>' + trafficCam.cameralabel + '</h2>';
                html += '<p>';
                html += '<img src="' + trafficCam.imageurl.url + '"  alt="picture of ' + trafficCam.cameralabel + '">';
                html += '</p>';
                infoWindow.setContent(html);
                infoWindow.open(map, this);
            });
        });
    })
        .fail (function(error) {
            console.log(error)
    })
        .always(function() {

        });

    $('#search').bind('search keyup', function() {
        var input = document.getElementById('search').value;
        input = input.toLowerCase();
        var idx;
        for (idx = 0; idx < markers.length; idx++) {
            var tempMarker = markers[idx];
            var trafficCamName = tempMarker.name.toLowerCase();
            if (!trafficCamName.contains(input)) {
                tempMarker.setMap(null);
            } else {
                tempMarker.setMap(map);
            }
        }
    })
});