/* Common functions */
	
var requestAnimFrame = (function() {
	
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ) {
		window.setTimeout(callback, 1000 / 60); 
	};
	
})();

function addEventHandler( elem,eventType,handler ) {

	if (elem.addEventListener) {
	     elem.addEventListener (eventType,handler,false);
	} else {
		if (elem.attachEvent) {
	    	elem.attachEvent ('on'+eventType,handler);
		}
	}     

}

function forEach( selector, fn ) {

	elements = document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) {
		fn(elements[i], i);
	}

}

function stopEvent( e ) {
 
	if(!e) var e = window.event;
 
	//e.cancelBubble is supported by IE, this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = false;
 
	//e.stopPropagation works only in Firefox.
	if ( e.stopPropagation ) {
		e.stopPropagation();
	}
	if ( e.preventDefault ) {
		e.preventDefault();
	}
 
	return false;

}

function addClass ( el, className ) { // To do: fix unnecessary spaces

	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
  	
}

function removeClass ( el, className ) {

	if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
  	
}

function hasClass ( el, className ) {

	if (el.classList) {
		return el.classList.contains(className);
	} else {
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}

}

function thisIndex (elm) {
    var nodes = elm.parentNode.childNodes, node;
    var i = count = 0;
    while( (node=nodes.item(i++)) && node!=elm )
        if( node.nodeType==1 ) count++;
    return (count);
}

Math.easeInOutQuad = function ( t, b, c, d ) {

	t /= d/2;
	if (t < 1) {
		return c/2*t*t + b
	}
	t--;
	return -c/2 * (t*(t-2) - 1) + b;

};

/* natUIve by rado.bg */

var scrollTimer = null;
var slider;
var original_scroll = 0;
var slider_animation = 0;
var touchmovex = 0;
var current_scroll = 0;

var ua = navigator.userAgent.toLowerCase();
var is_android = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

function scrollSlider (e) {

	if ( slider_animation || is_android ) return;

	var event = e || window.event;
	el = event.target || event.srcElement;

	if ( slider != el ) { // on switching to another slider

		original_scroll = el.attributes['original_scroll'];

	}

	slider = el;

    clearTimeout(scrollTimer);
    current_scroll = slider.scrollLeft;
    scrollTimer = setTimeout(function() {
		
		if ( current_scroll == slider.scrollLeft ) { /* If all scroll, including inertia, has ended */
		
			slide (event, 'snap');
		
		}

    }, 50);

};

function moveIndex () {

	removeClass ( slider.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = Math.round( slider.scrollLeft / slider.offsetWidth ) + 1;

	if ( slider.parentNode.querySelector('.slider-nav').childNodes[index-1] ) {
		addClass( slider.parentNode.querySelector('.slider-nav').childNodes[index-1], 'active');
	}
	
}

function slideEnd () {

	el.attributes['original_scroll'] = original_scroll = slider.scrollLeft;

	moveIndex();

	slider_animation = 0;

	document.onkeyup = sliderKeyboard;

	forEach('.slider', function(el, i) {

		el.onscroll = scrollSlider;
		
	});
	
}

function slide ( e, target ) {

	if (slider_animation) return;

	slider_animation = 1;
	
	forEach('.slider', function(el, i) {

		el.onscroll = null;
		
	});
	
	var event = e || window.event; 

	if ( typeof event.srcElement == 'unknown' ) { return; } // IE8
	el = event.target || event.srcElement;

	stopEvent(event);

	var change = 0;

	if ( target == 'index' ) {
			
		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = thisIndex(el) * slider.offsetWidth - start;

	}
	
	if ( target == 'arrow') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		if ( hasClass(el, 'left') ) {
			change = slider.scrollLeft - slider.offsetWidth - start;

			if ( slider.scrollLeft % slider.offsetWidth ) { /* not snapped into position */

				change = -1 * (slider.scrollLeft % slider.offsetWidth);

			}

		} else {

			change = slider.scrollLeft + slider.offsetWidth - start;

			if ( slider.scrollLeft % slider.offsetWidth ) { /* not snapped into position */

				change -= slider.scrollLeft % slider.offsetWidth;

			}
		}

	}
	
	if ( target == 'snap') {

		slider = el;

		if (slider.scrollLeft > original_scroll) { 
			change = slider.offsetWidth - slider.scrollLeft % slider.offsetWidth;
		} else {
			change = slider.scrollLeft % slider.offsetWidth - slider.offsetWidth;
			change = -1 * (slider.offsetWidth + change);
		}
		
		if ( original_scroll == slider.scrollLeft ) change = 0;
				
		start = slider.scrollLeft;

	}

	if ( !change ) {
		slideEnd();
		return;
		}

	currentTime = 0,
	increment = 20;
	duration = 400;
	
	var animateScroll = function() {
		// increment the time
		currentTime += increment;
		// find the value with the quadratic in-out easing function
		var val = Math.easeInOutQuad(currentTime, start, change, duration);
		// slide
		slider.scrollLeft = val;
		// do the animation unless its over
		if( (currentTime < duration) ) {

			requestAnimFrame(animateScroll);

		} else {

			if (slideEnd && typeof(slideEnd) === 'function') { // the animation is done so let's callback

				slideEnd();

			}

		}
	};
	animateScroll();

}

function sliderKeyboard (e) {

/*
	slider = document.querySelector('.slider'); // Move slider #1; to do: select nearest slider
	
	var event = e || window.event;
	stopEvent(event);
    if (event.keyCode == 37) { // left
    	
	document.onkeyup = function (e) { return false; };
		slide(e, 'left');

    }
    if (event.keyCode == 39) { // right

	document.onkeyup = function (e) { return false; };
		slide(e, 'right');
		
    }
*/

};

function makeSlider (el) {
	
	addClass (el, 'slider');
	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML/* .replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) */ + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>');
	container.nextSibling.outerHTML = '';
	el = container.querySelector('.slider');
	
	// Get scrollbar width and hide it by reducing the .slider-container height proportionally

	el.style.overflowX = 'hidden';
	height_scroll = el.offsetHeight;
	el.style.overflowX = 'scroll';
	height_scroll = el.offsetHeight - height_scroll;
	
	// Generate controls

	for (var i = 0; i < el.children.length; i++) {
		
		if ( el.children[i].querySelector('.thumbnail') ) {

			slider_nav = el.parentNode.querySelector('.slider-nav');
			addClass( slider_nav, 'thumbnails' );
			addClass( slider_nav, 'row' );
			slider_nav.insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + el.children[i].querySelector('.thumbnail').innerHTML + '</a>' );
			slider_nav.style.marginTop = (-1 * height_scroll) + 'px';
			
		} else {
			
			container.querySelector('.slider-nav').insertAdjacentHTML('beforeend', ( !i ? '<a class="active">' : '<a>' ) + (i + 1) + '</a>');

 			if (!i) {
 				
 				container.style.height = (container.offsetHeight - height_scroll) + 'px';
 			}

		}
		
		container.querySelector('.slider-nav').lastChild.onclick = function (e) {

			slide(e, 'index');

		};

	}

	container.querySelector('.slider-arrow.left').onclick = container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'arrow');

	}
	
	el.onscroll = scrollSlider;
	
	el.attributes['original_scroll'] = 0;
	
	return el;
	
}

addEventHandler ( window, 'load', function() {

	document.onkeyup = sliderKeyboard;
	
	/* Initialise JS extras: create arrows/numbers navigation */
	forEach('.slider', function(el, i) {

		makeSlider(el);
		
	});
	
	slider = document.querySelector('.slider');
	
	window.onresize = function () { 
		
		forEach('.slider', function (el,i) {
			el.scrollLeft = 0;
			moveIndex ();
		});
		
	}
	
});
