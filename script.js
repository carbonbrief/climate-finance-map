var myMap = L.map('mapid', {zoomControl: false}).setView([20, 7], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/rospearce/cj3mua9b5000c2smnydyfiqj6/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 6,
    minZoom: 2,
    id: 'mapbox://styles/rospearce/cj3mua9b5000c2smnydyfiqj6',
    accessToken: 'pk.eyJ1Ijoicm9zcGVhcmNlIiwiYSI6ImNpdm1sczJsZjAwOGMyeW1xNHc4ejJ0N28ifQ.4B24e0_HgfJj4sgqimETqA'
}).addTo(myMap);

myMap.scrollWheelZoom.disable();	

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
        spiderLegPolylineOptions: {weight: 0.35, color: '#f3f3f3'},
        clockHelpingCircleOptions: {weight: .9, opacity: 1, color: '#f3f3f3', fillOpacity: 0, dashArray: '10 5'},
        showCoverageOnHover: false,

        elementsPlacementStrategy: 'spiral',
        helpingCircles: true,

        spiderfyDistanceSurplus: 35,
        spiderfyDistanceMultiplier: 1,

        elementsMultiplier: 1.5,
        firstCircleElements: 7,
				
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
        myMap.setView(e.latlng, 6);
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

        var myPopup = layer.bindPopup(
          '<h1>' + feature.properties['Project name'] + '</h1>' +
          '<b>' + feature.properties['Fund'] +  ' funding: </b>' + feature.properties['Funding label'] + '  <br />' +           
          '<b>Year approved: </b>' + feature.properties['Date approved'] + '</br>' + 
          '<b>Location: </b>' + feature.properties['Location'] + ' <br />' +
          '<b>Summary: </b>' + feature.properties['Details'] + ' <br />'
          // +  '<a target="_blank" href="' + feature.properties.Link + '">Link</a><br />'
          ,
          {closeButton: true, offset: L.point(0, -20)}
        );

        
        
        // layer.on('dblclick', function() { 
        //   console.log("dbclick");
        //   layer.openPopup();
        //   layer.on("mouseout", null);
        //   layer.on("mouseover", null);
        //   // $( layer ).off( "mouseout", feature);
        //   // $( layer ).off( "mouseover", feature);
        //   // // layer.addEventListener("mouseover", mouseover, false);
        //   // // layer.addEventListener("mouseout",mouseout, false);
        //   // // layer.addEventListener("click", function () {
        //   // //   this.removeEventListener("mouseover", mouseover);
        //   // //   this.removeEventListener("mouseout", mouseover)
        //   // // })

        //   layer.addEventListener("click", function () {
        //     layer.closePopup();
        //     layer.on( "mouseout", mouseover);
        //     layer.on( "mouseover", mouseout);
        //     })
          
        // });
        // layer.on('mouseclick', function() { 
        //   console.log("clickout");
        //   layer.closePopup();
        //   // $( document ).on( "mouseout", layer);
        //   // $( document ).on( "mouseover", layer);
        // });

        // layer.on('mouseover', function mouseover () { layer.openPopup(); });
        // layer.on('mouseout', function mouseout () { layer.closePopup(); }); 

        layer.on('mouseover', function(){
          layer.openPopup();
          start = new Date().getTime();
          autoClosePopup();
        });        
      
        layer.on('mouseout', function(){  
            var end = new Date().getTime();
            var time = end - start;
            console.log('Execution time: ' + time);
            if(time > 800){
            layer.closePopup();
        }});

        var mouseOverPopup = false;

        // try to set a way for it to close after a while

        function autoClosePopup () {


          setTimeout(function() {
            if (mouseOverPopup = false) {
              layer.closePopup();
              console.log("auto close popup");
            }          
          }, 3000);

          

        }

        // trying to add bit so that stays open for longer when you hover over the popup. Not currently working I think because position of popup is not where I think it is

        $(myPopup, "<p>").on("mouseover", function () {
          mouseOverPopup = true; 
          layer.openPopup();
          start2 = new Date().getTime();
          console.log("html mouseover");
        });

        $(myPopup, "<p>").on("mouseout", function () {
          mouseOverPopup = false;
          var end2 = new Date().getTime();
          var time2 = end2 - start2;
          console.log('Execution time2: ' + time2);
          if(time2 > 800){
          layer.closePopup(); 
          console.log("html mouseout");
        }});



        // $(".leaflet-popup-content").on('mouseover', function () { 
        //   layer.openPopup(); 
        //   console.log("wrapper mouseover");
        // });
        // $(".leaflet-popup-content").on('mouseout', function () { layer.closePopup(); });


        

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
