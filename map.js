var map;
var markers = [];
var options = [];
var styles = [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];
/**
* @description This function is used to initialize markers once the map is initialized
*/
function initMarkers()
    {
    for(var i=0;i<locations.length;i++)
        {

  if(i%2==1)
            {
              var icon = {

    url: "gmark.png", // url
    scaledSize: new google.maps.Size(30, 40)
};
}
            else
            {
               var icon = {
    url: "graymark.png", // url
    scaledSize: new google.maps.Size(30, 40)
};
            }
            var position = locations[i].location();
            var name = locations[i].name;
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: name,
                icon: icon,
                animation: google.maps.Animation.DROP

            });
            options.push(name);
            markers.push(marker);
            marker.addListener('click', function(){
              toggleBounce(this, markers);
              populateInfoWindow(this);
         });
        }
      }
/**
* @description This function is called as part of google maps url and used to initiate the map instance
*/
function initMap()
	{
    if(!map)
    {
		map = new google.maps.Map(document.getElementById('map'),{
			center: {lat: -38.1732, lng: 144.8731},
			styles: styles,
			zoom: 9
		});
  }


		largeInfoWindow = new google.maps.InfoWindow({maxWidth: 320,minHeight: 125} );
      initMarkers();
		$(window).resize(function () {
    var h = $(window).height(),
        offsetTop = 50; // Calculate the top offset
    var w = $(window).width(),
        offsetLeft = 100;
    $('#map').css({'height':(h - offsetTop)});
}).resize();


		}
/**
* @description This function is used to display a info window once a marker is clicked/ when a list item is chosen
* @param {Object} marker - The marker item for which the info window to be displayed.
*/
function populateInfoWindow(marker) {
        // Check to make sure the largeInfoWindow is not already opened on this marker.
        if (largeInfoWindow.marker != marker) {
          // Clear the largeInfoWindow content to give the streetview time to load.
          largeInfoWindow.setContent('');
          largeInfoWindow.marker = marker;
          // To Make sure the marker property is cleared if the largeInfoWindow is closed.
          largeInfoWindow.addListener('closeclick', function() {
            largeInfoWindow.marker = null;
          });
          var streetViewService = new google.maps.StreetViewService();
          var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status,wikiURL) {
            if (status == google.maps.StreetViewStatus.OK) {
              var nearStreetViewLocation = data.location.latLng;
              var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
                largeInfoWindow.setContent(
                	'<h3><center>' + marker.title + '</center></h3><div style="width: 320px; height: 100px" id="pano"></div>'
                  +'<hr/><div id ="wikielem"></div>'
                	);
                var panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 2
                  }
                };
              var panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
              setWikiText(marker.title);
            } else {
              largeInfoWindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
            }
          }


          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the largeInfoWindow on the correct marker.
          largeInfoWindow.open(map, marker);

        }
      }
/**
* @description Once the infoWindow is open, this function is called to display information about the place
* @param {string} title - The name of the location
*/
function setWikiText(title)
  {
            var qry = title.replace(/ /g,"%20");
              var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+qry+"&format=json";
              var wikiRequestTimeout = setTimeout(function(){
              document.getElementById('wikielem').innerHTML="Failed to get resources"},4000);
              $.ajax({
              type: "GET",
              url: wikiURL,
              dataType: "jsonp",
              success: function (data) {
                clearTimeout(wikiRequestTimeout);
                document.getElementById('wikielem').innerHTML = data[2];
                }
    });

  }

/**
* @description This function is used to create a bounce effect once the marker is clicked
* @param {Object} marker - The marker which needs to be bounced.
*/

function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
        	for(var i=0;i<markers.length;i++)
        	{
        		markers[i].setAnimation(null);
        	}
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }


