/*******************************************************************************
	Author: Austin Fouch
	Date: 2017-11-15
		JavaScript file for CMPS 369 project 2.This script creates map using 
		the Google Maps API to mark and center a map based on user input. The 
		map is initially centered on The Ramapo College of New Jersey. The 
		application takes in user input with the address box and, using jQuery,
		sends an AJAX request via the $.getJSON() function. Based off the the 
		return object of the call, the map is centered on a specific latitude 
		and longitude. The user's input is also displayed as a list on the 
		right side of the map. Each row of the list is clickable, and each 
		click will center the map on the clicked location.
*******************************************************************************/
var map;
var zoom = 7;
var rcnjLat = 41.0815079;
var rcnjLng = -74.1746234;

// called once the HTML document has finished loading
$(document).ready(function() {
	
	initMap();
	// on click functionality for the only button, 'add'
	$('button').on("click", function() {
		var adrs = $(this).siblings('input').val();
		$(this).siblings('input').val('');
		addLocation(adrs);
	});

	// on click functionality for the address list elements
	$('#adrsList').on("click", "#adrs", function() {
		var geocode = $(this).data();
		map.setCenter({ 
			lat: parseFloat(geocode.lat), 
			lng: parseFloat(geocode.lng)
		});
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
			if(data.results.length < 1){
				alert("No location returned. Please enter a human readable address.");
				return;
			}

			var lat = data.results[0].geometry.location.lat;
			var lng = data.results[0].geometry.location.lng;
			var marker = new google.maps.Marker({
				position: { lat: lat, lng: lng},
				map: map,
			});
			
			map.setCenter({
				lat: lat, 
				lng: lng
			});
			map.setZoom(zoom);				
			marker.setMap(map);

			// add address to list, set name attr is used for locating index in locList
			$('<li/>')
				.text(adrs)
				.data("lat", lat)
				.data("lng", lng)
				.attr("id", 'adrs')
				.appendTo('ul');
		}
	});
}