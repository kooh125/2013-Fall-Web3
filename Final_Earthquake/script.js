// !---------- local variables -------------!
var geocoder;
var map;
var marker1;
var marker2;
var rectangle;	

// !---------- initializing default map -------------!
function init(){
	//initializing google map's geocoder
	geocoder = new google.maps.Geocoder();
	//setting default view of the map to latlng, zoom level to 8, and displaying ROADMAP view (can be SATELLITE and something else)
	var options = {
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	//initializing google map and appending it to div that has id of map_canvas in EarthQuake.html 
	map = new google.maps.Map(document.getElementById("map_canvas"), options);
}

function getlatlong(){
	//calls init() method
	init();
	var address = "";
	if( document.getElementById('addressText').value != "" ) {
		address = document.getElementById('addressText').value;
	} else {
		address = localStorage.getItem('addressVal')
	}
	geocoder.geocode({ 'address': address}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			var locat = results[0].geometry.location;
			map.setCenter(locat);				
			// !------------ coordinates ------------------!
			var northeast = results[0].geometry.viewport.getNorthEast();
			var southwest = results[0].geometry.viewport.getSouthWest();
			var north = northeast.lat();
			var south = southwest.lat();
			var east = northeast.lng();
			var west = southwest.lng();				
			
			// !---------- bounding box -----------!
			map.fitBounds(results[0].geometry.viewport);
			
			var boundingBoxPoints = [
				northeast, new google.maps.LatLng(north, west),
				southwest, new google.maps.LatLng(south, east), northeast
			];
			
			var boundingBox = new google.maps.Polyline({
				path: boundingBoxPoints,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			boundingBox.setMap(map);
			// !---------- bounding box ends ----------!

			// !---------- calling web service -----------!
			var jsonObject;
			var url = 'http://api.geonames.org/earthquakesJSON?north=' + north + '&south=' + south + '&east=' + east + '&west=' + west + '&username=me';
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.onreadystatechange = function(oEvent){
				if(request.readyState === 4){ // web service is succesfully called (connected)
					if(request.status === 200){
						// !------ converting json object to javascript text ---------!
						jsonObject = eval("(" + request.responseText + ")");							
						var lat = [];
						var lng = [];
						var id = [];
						var mag = [];
						var date = [];
						var depth = [];
						var i=0;
						for(i=0; i<jsonObject.earthquakes.length; i++){
							lat[i] = jsonObject.earthquakes[i].lat;
							lng[i] = jsonObject.earthquakes[i].lng;
							id[i] = jsonObject.earthquakes[i].eqid;
							mag[i] = jsonObject.earthquakes[i].magnitude;
							date[i] = jsonObject.earthquakes[i].datetime;
							depth[i] = jsonObject.earthquakes[i].depth;
						}
						
						// !--------------- plotting points ---------------!
						var infowindow = new google.maps.InfoWindow();
						var markers, j;
						for(j=0; j<jsonObject.earthquakes.length; j++){
							markers = new google.maps.Marker({
								map: map,
								position: new google.maps.LatLng(lat[j], lng[j])
							});
							google.maps.event.addListener(markers, 'click', (function(markers, j) {
								return function(){
									var content = "ID: " + id[j] + "<br />Magnitude: " + mag[j] +
										"<br />Date/Time: " + date[j] + "<br />Depth: " + depth[j];
									infowindow.setContent(content);
									infowindow.open(map, markers);
								}
							})(markers, j));
						}
						// !--------------- plotting ends ------------------!
						
					} else {
						alert("Error", request.statusText);
					}
				}
			};
			request.send(null);

		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}