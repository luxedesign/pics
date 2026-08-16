/******************************************************************************************************************/
// MAP
/******************************************************************************************************************/

function render_map( $el ) {

	var $markers = $el.find('.marker');

	if ($el.attr('data-gray')) {

		var styles = [
			{
				stylers: [
					{ saturation: -100 }
				]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [
					{ lightness: 100 },
					{ visibility: 'simplified' }
				]
			}
		];

	}
	else {
		var styles = [

		];
	}

	if ($el.attr('data-scrollwheel')) datascroll = true;
	else datascroll = false;

	styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' });

	var args = {
		zoom				: 16,
		panControl			: false,
		disableDefaultUI	: true,
		zoomControl			: true,
		scrollwheel			: datascroll,
		center				: new google.maps.LatLng(0, 0),
		mapTypeId			: google.maps.MapTypeId.ROADMAP
	};

	// create map
	var map = new google.maps.Map( $el[0], args);

	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	// wrap zoom controls for modify thier position
	google.maps.event.addDomListener(map, 'tilesloaded', function(){
	    $('div.gmnoprint').last().parent().wrap('<div id="custom-zoom" />');
	});

	// add a markers reference
	map.markers = [];

	// add markers
	$markers.each(function(){

    	add_marker( $(this), map );

	});

	// center map
	center_map( map );

}

function add_marker($marker, map ){

	// var
	var latlng = new google.maps.LatLng( $marker.attr('data-lat'), $marker.attr('data-lng') );
	var myicon = $marker.attr('data-icon');

	if (myicon) {
		// create marker with custom icon
		var marker = new google.maps.Marker({
			position	: latlng,
			icon		: myicon,
			map			: map
		});
	}
	else {
		// create marker
		var marker = new google.maps.Marker({
			position	: latlng,
			map			: map
		});
	}


	// add to array
	map.markers.push( marker );

	// if marker contains HTML, add it to an infoWindow
	if( $marker.html() )
	{
		// create info window
		var infowindow = new google.maps.InfoWindow({
			content		: $marker.html()
		});

		// show info window when marker is clicked
		google.maps.event.addListener(marker, 'click', function() {

			infowindow.open( map, marker );

		});
	}

}

function center_map(map){

	// vars
	var bounds = new google.maps.LatLngBounds();

	// loop through all markers and create bounds
	$.each( map.markers, function( i, marker ){

		var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );

		bounds.extend( latlng );

	});

	// only 1 marker?
	if( map.markers.length == 1 )
	{
		// set center of map
	    map.setCenter( bounds.getCenter() );
	    map.setZoom( 16 );
	}
	else
	{
		// fit to bounds
		map.fitBounds( bounds );
	}

}

function handleMap(){

	// render maps
	$('.map').each(function(){
		render_map( $(this) );
	});

}

function handleMyie() {

	var ua = window.navigator.userAgent
	var msie = ua.indexOf ( "MSIE " )
	var cur_ver = parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));

	if (cur_ver == 8 ) {
		$(".the-menu-block li:even").css({
			 "float":"right",
			 "text-align":"right",
			 "padding":"30px 20px 10px 100px"
		});
		$(".the-menu-block li:odd").css({
			 "float":"left",
			 "padding":"30px 100px 10px 20px"
		});
	}

}

/******************************************************************************************************************/
// on load...
/******************************************************************************************************************/

$(function(){

	//	Preload
	$('body').waitForImages({
	    waitForAll: false,
	    finished: function() {

		    // after loading
		    $('html, body').animate({ scrollTop: 0 }, 100);

	    	setTimeout(function(){
	    		$('body').removeClass('init');
	    	}, 100);

			// slider
			$('.slidein-slider').slick({
				autoplay: true,
				autoplaySpeed: 4500,
				dots:false,
			});

			$('.fadin-slider').slick({
				autoplay: true,
				autoplaySpeed: 4500,
				dots:false,
				fade: true,
				cssEase: 'linear',
			});

			// carousel
			$('.carousel-multi-item').slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 5000,
				dots:true,
				arrows:false,
				speed: 1200,
			});

			// carousel
			$('.carousel').slick({
				autoplay: true,
				autoplaySpeed: 5000,
				dots:true,
				arrows:false,
				speed: 1200,
			});

	    }
	});

	//	Google Map
	handleMap();

	//	IE Additional Scripts
	handleMyie();

	//	Fancybox
	$('a[rel=gal], a.fancybox').fancybox({
		padding: 20,
		helpers: {
			overlay: {
				locked: false
			}
		}
	});

    //	AddClass on Scroll
  //   $(window).scroll(function() {
	//     var scroll = $(window).scrollTop();
  //
	//     if (scroll >= 500) {
	//         $("#head").addClass("sticky");
	//     } else {
	//         $("#head").removeClass("sticky");
	//     }
	// });


    //	SplitColor Write
    function wrapString(str) {
	  var output = [];
	  str.split('').forEach(function(letter) {
	    var wrapper = document.createElement('span');
	    wrapper.dataset.content = wrapper.innerHTML = letter;
	    output.push(wrapper.outerHTML);
	  });

	  return output.join('');
	}

	window.onload = function() {
	    var el  = document.querySelector('.split-color'),
	        txt = el.innerHTML;

	    el.innerHTML = wrapString(txt);
	}

	//	CountTo
	$('.timer').each(count);

	function count(options) {
		var $this = $(this);
		options = $.extend({}, options || {}, $this.data('countToOptions') || {});
		$this.countTo(options);
	}

	//	PieChart
	$('.chart').easyPieChart({
		animate: 4500,
		barColor: '#cfa670',
		scaleColor: false,
		lineWidth: 20,
		size: 300,
    });

});



// Toggle Class Body 4 Mobile SideNavBar
$(document).on('click','.navbar-toggle', function(event) {
	event.preventDefault();
	$('body').toggleClass('toggled');
});

// Toggle SideBar
$(document).on('click', '.tgl-sidebar', function(event) {
	event.preventDefault();
	$(this).toggleClass('open');
	$('aside.sidebar').toggleClass('open');
});
