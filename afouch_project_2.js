/*******************************************************************************
	Author: Austin Fouch
	Date: 11/08/2017
		This script creates map using the Google Maps API. The map is initially
		centered on The Ramapo College of New Jersey. The application takes in user 
		input with the address box and, using jQuery, sends an AJAX request via the 
		$.getJSON() function. Based off the the return object of the call, the map
		is centered on a specific latitude and longitude. The user's input is also
		displayed as a list on the right side of the map. Each row of the list is
		clickable, and each click will center the map on the clicked location.
*******************************************************************************/
var map;
var zoom = 7;
var rcnjLat = 41.0815079;
var rcnjLng = -74.1746234;
var locList = [];
var adrsCount = 0;

// called once the HTML document has finished loading
$(document).ready(function() {
	
	//initMap();
	map = new google.maps.Map(document.getElementById('mapCanvas'), {
		center: {lat: rcnjLat, lng: rcnjLng}, 
		zoom: zoom
	});

	// on click functionality for the only button, 'add'
	$('button').on("click", function() {
		var adrs = $(this).siblings('input').val();
		addLocation(adrs);
	});

	// on click functionality for the address list elements
	$('#adrsList').on("click", "#adrs", function() {
		var index = $(this).attr('name');
		var lat = locList[index].lat;
		var lng = locList[index].lng;
		map.setCenter({ lat: lat, lng: lng });
	});
});

// creates Google Map object and centers on The Ramapo College of New Jersey
function initMap() {
	map = new google.maps.Map(document.getElementById('mapCanvas'), {
		center: {lat: rcnjLat, lng: rcnjLng}, 
		zoom: zoom
	});
}

// makes an AJAX call based on user input and populates address list with result
function addLocation(adrs) {
	$.getJSON({
		url: 'https://maps.googleapis.com/maps/api/geocode/json',
		data: {
			address : adrs
		},
		success : function( data, textStatus ) {
			// calling geometry will result in a TypeError when input was invalid
			try {
				var lat = data.results[0].geometry.location.lat;
				var lng = data.results[0].geometry.location.lng;
			} catch(e) {
				if(e.name == "TypeError")
					alert("Invalid input. Please enter a human readable address.");
				else 
					alert("Error: "+e.name);
				return;
			}
			
			map.setCenter({lat: lat, lng: lng});
			map.setZoom(zoom);
			
			var loc = { lat: lat, lng: lng};
			var marker = new google.maps.Marker({
				position: loc,
				map: map,
			});

			locList.push(loc);	
			marker.setMap(map);

			// add address to list, set name  = adrsCount for location referencing
			$('<li/>')
				.text(adrs)
				.attr("name", adrsCount)
				.attr("id", 'adrs')
				.appendTo('ul');
			adrsCount++;
		},
		error: function() {
			alert("Invalid input. Please enter a human readable address.");
		}
	});
}