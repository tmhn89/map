var map, heatmap, infoWindow, rectangle;
var station_markers = [];
var latlngs = [];
$(function() {
    initMap();
});
function initMap() {
    // read csv
    Papa.parse('gsmap_nrt.20160921.1700.02_AsiaSE.csv', {
        download: true,
    	complete: function(results) {
            // create grid from data
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 15.776, lng: 108.335},
                // center: {lat: 20.55, lng: 105.55},
                zoom: 9
            });
            infoWindow = new google.maps.InfoWindow();

            // VGTB
            // area cover: 15.00~16.20, 107.25~108.80

            var i = 69339;
            while (i < 75602) {
            // while (i < 70000) {
                var lat = parseFloat(results.data[i][0]);
                // if (lat > 13) {
                if (lat > 15) {
                    // process
                    var lng = parseFloat(results.data[i][1]);
                    var rain = parseFloat(results.data[i][2]);

                    // todo: remove in production. just for testing since current rainfall is 0 in the whole area
                    var opacity = 0.5;
                    var fillColor = 'transparent';

                    // if (rain == 0) {
                    //     rain = parseFloat(Math.random()).toFixed(2);
                    //
                    //
                    // } else {
                    //     fillColor = '#3498db';
                    // }
                    if (rain < 0.05) {
                        // opacity = (rain > 1) ? 1 : rain;
                        // fillColor = '#4c94dc';
                        fillColor = '#c0392b';
                    } else if (rain < 0.1) {
                        fillColor = '#e74c3c';
                    } else if (rain < 0.2) {
                        fillColor = '#e67e22';
                    } else if (rain < 0.3) {
                        fillColor = '#f39c12';
                    }

                    // end testing

                    rectangle = new google.maps.Rectangle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0,
                        strokeWeight: 1,
                        fillColor: fillColor,
                        fillOpacity: opacity,
                        map: map,
                        bounds: {
                            north: lat,
                            south: lat+0.1,
                            east: lng + 0.1,
                            west: lng
                        },
                        rain: rain
                    });

                    rectangle.setMap(map);
                    rectangle.addListener('click', function(rectObj) {
                        infoWindow.setContent(
                            '<p>Location: ' + this.getBounds().getNorthEast().lat() + ', ' + this.getBounds().getNorthEast().lng() + '</p>' +
                            '<p>Rainfall: ' + this.rain + 'mm' + '</p>'
                        );
                        infoWindow.setPosition(rectObj.latLng);

                        infoWindow.open(map);
                    });

                    i++;
                } else {
                    // jump
                    // i+= 365;
                    i+=388;
                }
            }
    	}
    });
}
