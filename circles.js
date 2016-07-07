// TODO: load google map api here
var map, heatmap, info_window;
var station_markers = [];
var latlngs = [];
$(function() {
    initMap();
});
function initMap() {
    // put pins here
    $.get('data.json', function(data) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 15.776, lng: 108.335},
            zoom: 10
        });

        for (var i = 0; i < data.length; i++) {
            var pos = new google.maps.LatLng(parseFloat(data[i].lat), parseFloat(data[i].lng));

            var info_data = {
                name: data[i].name,
                spi: data[i].spi,
                range: data[i].range
            };
            addMarkerWithTimeout(pos, info_data, i * 100);
        }
    });
}

function addMarkerWithTimeout(position, info_data, timeout) {
    window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            icon: getMarkerIcon(info_data.range, info_data.spi),
        });

        var info_window = new google.maps.InfoWindow({
            content: '<p><b>' + info_data.name + '</b></p><p>SPI: ' + info_data.spi + '</p>'
        });

        marker.addListener('click', function() {
            console.log(this);
            info_window.open(map, marker);
        });
    }, timeout);
}

function getMarkerIcon(range, spi) {
    // -2 and less	extremely dry
    var fill_color = '#c0392b';
    if (spi > 2) {
        // 2.0+	extremely wet
        fill_color = '#8e44ad';
    } else if (spi > 1.5) {
        //   1.5 to 1.99	very wet
        fill_color = '#9b59b6';
    } else if (spi > 1) {
        // 1.0 to 1.49	moderately wet
        fill_color = '#27ae60';
    } else if (spi > -0.99) {
        // -.99 to .99 near normal
        fill_color = '#2ecc71';
    } else if (spi > -1.49) {
        // -1.0 to -1.49	moderately dry
        fill_color = '#f39c12';
    } else if (spi > -1.99) {
        // -1.5 to -1.99	severely dry
        fill_color = '#e74c3c';
    }

    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillOpacity: 0.8,
        fillColor: fill_color,
        strokeOpacity: 1.0,
        strokeColor: '#ffffff',
        strokeWeight: 1.0,
        scale: 5 * range
    };
}
