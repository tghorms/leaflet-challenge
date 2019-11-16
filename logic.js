var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

function markerSize(mag) {
    return mag * 15000;
}

console.log("Tommy");

function markerColor(mag) {
    if (mag <= 1) {
        return "#39DD39";
    } else if (mag <= 2) {
        return "#00FF00";
    } else if (mag <= 3) {
        return "#FFD801";
    } else if (mag <= 4) {
        return "#FFB600";
    } else if (mag <= 5) {
        return "#D24F4F";
    } else {
        return "#D22929";
    };
}

console.log("Tommy2");

d3.json(link, function (data) {

    createFeatures(data.features);
});

console.log("Tommy3");

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {

        onEachFeature: function (feature, layer) {

            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 1,
                stroke: false,
                })
        }

    });
    createMap(earthquakes);
}

console.log("Tommy4");

function createMap(earthquakes) {

    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satelite Map": satelitemap,
        "Dark Map": dark
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [31.57853542647338, -99.580078125],
        zoom: 3,
        layers: [satelitemap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var ledgend = L.control({position: 'bottomright'});

    ledgend.onAdd = function() {

        var div = L.DomUtil.create('div', 'info ledgend'),
            magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(magnitudes[i]+1) + '"></i> ' + 
                + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i+1] + '<br>' : ' + ');       
        }

        return div;

    };
    ledgend.addTo(myMap);
}


