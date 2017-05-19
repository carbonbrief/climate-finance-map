var myMap = L.map('mapid').setView([31.505, 7], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/rospearce/ciwgju4yv00cy2pmqeggx1mx8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox://styles/rospearce/ciwgju4yv00cy2pmqeggx1mx8',
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
        success:  function(data, textStatus, request) {
				  var allProjects = L.geoJson(data, {
				 					  pointToLayer: function (feature, latlng) {
				 					      return L.circleMarker(latlng);
				 					  },
				 						onEachFeature: onEachFeature,
				 						style: style
				 				});
				 				allProjects.addTo(myMap);

				}
});


 			

function style(feature) {
    return {
        fillColor: '#2F8FCE',
        weight: 1.4,
        opacity: 0.85,
        color: 'white',
        fillOpacity: 0.85,
			  radius: 12,
    };
}

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties) {
        layer.bindPopup('<h1>'+feature.properties.name+'</h1>Distance retreated: <b>'+feature.properties.change+'m</b><br />Period: <b>'+feature.properties.period+'</b>', {closeButton: false, offset: L.point(0, -20)});
                layer.on('mouseover', function() { layer.openPopup(); });
                layer.on('mouseout', function() { layer.closePopup(); });
    };
}



// var dataLayer = $.getJSON("climatefinance.geojson");
// dataLayer.then(function(data) {
// 	var allProjects = L.geoJson(data, {
// 	  pointToLayer: function (feature, latlng) {
// 	      return L.circleMarker(latlng);
// 	  },
// 		onEachFeature: onEachFeature,
// 		style: style
// 	});
// 	allProjects.addTo(myMap);
// });



