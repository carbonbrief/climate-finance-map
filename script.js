var myMap = L.map('mapid', {zoomControl: false}).setView([20, 7], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/rospearce/cj3mua9b5000c2smnydyfiqj6/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 5,
		minZoom: 2,
    id: 'mapbox://styles/rospearce/cj3mua9b5000c2smnydyfiqj6',
    accessToken: 'pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA'
}).addTo(myMap);


$.ajaxSetup({
    scriptCharset: "utf-8",
    contentType: "application/json; charset=utf-8"
});

$.ajax({
      url: "climatefinance.geojson",
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: 'json',
      data: null,
      success:  function (data, textStatus, request) {
        addClusterLayer(data);
      },
});

function addClusterLayer (data) {
      var markers = L.markerClusterGroup({
        spiderLegPolylineOptions: {weight: 0},
        clockHelpingCircleOptions: {weight: .9, opacity: 1, color: '#939393', fillOpacity: 0, dashArray: '10 5'},
        showCoverageOnHover: false,

        elementsPlacementStrategy: 'one-circle',
        helpingCircles: true,

        spiderfyDistanceSurplus: 35,
        spiderfyDistanceMultiplier: 1,

        elementsMultiplier: 1.4,
        firstCircleElements: 6,
				
				maxClusterRadius: 4
	
				
      });
			
			markers.on('clusterclick', function (a) {
				
				a.layer.zoomToBounds({padding: [100, 100]});
				
			});
			
      
      var geoJsonLayer = L.geoJson(data, {
        onEachFeature: onEachFeature,
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }
      }).on('click', function (e) {
        myMap.setView(e.latlng, 5);
      });
      
      markers.addLayer(geoJsonLayer);
      
      myMap.addLayer(markers);
      console.log("markers")			
};

//add zoomhome controls

var zoomHome = L.Control.zoomHome();
zoomHome.addTo(myMap);

// function to link marker colour to data

function getColor(d) {
    return d > 100000000   ? '#FFFF00' :
					 d > 10000000   ? '#83FF00' :
                            '#00FFCE';
}


function style(feature) {
    return {
        fillColor: getColor(feature.properties['Funding']),
        weight: 0,
        fillOpacity: 0.85,
        color: 'white',
			  radius: 9
    };
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    //console.log(feature);
    
    if (feature.properties) {
        layer.bindPopup(
          '<h1>' + feature.properties['Project name'] + '</h1>' +
          '<b>' + feature.properties['Fund'] +  ' funding: </b>' + feature.properties['Funding label'] + '  <br />' +           
          '<b>Date approved: </b>' + feature.properties['Date approved'] + '</br>' + 
          '<b>Location: </b>' + feature.properties['Location'] + ' <br />' +
          '<b>Summary: </b>' + feature.properties['Details'] + ' <br />'
          // +  '<a target="_blank" href="' + feature.properties.Link + '">Link</a><br />'
          ,
          {closeButton: false, offset: L.point(0, -20)}
        );
        
        
        layer.on('mouseover', function() { layer.openPopup(); });
        layer.on('mouseout', function() { layer.closePopup(); });

    };
}


// make key visibility responsive

$(document).ready(function(){
			
			if ($(window).width() >= 650)
				
			{
				$("#Key2").show();
	      $("#Key1").show();
				$("#Total1").show();
			}
			
			else {
				$("#Key2").hide();
	      $("#Key1").show();
				$("#Total1").hide();
			}
			
			
 });
