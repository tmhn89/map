var map, heatmap, infoWindow, rectangle;
var station_markers = [];
var latlngs = [];
$(function() {
    initMap();
});
function initMap() {
    // read csv
    Papa.parse('gsmap_nrt.20160704.2200.02_AsiaSE.csv', {
        download: true,
    	complete: function(results) {
            // create grid from data
            map = new google.maps.Map(document.getElementById('map'), {
                // center: {lat: 15.776, lng: 108.335},
                center: {lat: 20.55, lng: 105.55},
                zoom: 9
            });
            infoWindow = new google.maps.InfoWindow();

            // center of Vietnam
            // area cover: 13~16.3 lat; 107.2~109.4 lng
            // var i = 68940;
            // while (i < 78171) {


            // test: Hanoi
            // area cover: 20.75~21.1 lat; 105.5~106.1 lng

            var i = 62489;
            while (i < 64901) {
            // while (i < 70000) {
                var lat = parseFloat(results.data[i][0]);
                // if (lat > 13) {
                if (lat > 20) {
                    // process
                    var lng = parseFloat(results.data[i][1]);
                    var rain = parseFloat(results.data[i][2]);

                    if (rain == 0) {
                        if (Math.random() > 0.8) {
                            rain = Math.random();
                        }
                    }

                    // var opacity = (rain * 20 < 1) ? rain * 20 : 1;

                    var opacity = (rain > 1) ? 1 : rain;

                    rectangle = new google.maps.Rectangle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0,
                        strokeWeight: 1,
                        fillColor: '#4c94dc',
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
