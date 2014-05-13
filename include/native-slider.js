/* natUIve by rado.bg */
/* To do: fix slider on mobile. Jumping back-forth (iPhone only on portrait orientation) – 4px inline-block bug? Very slow animation on Android. */

var scrollTimer = null;
var slider;
var scroll_start = 0;
var original_scroll = 0;
var height_scroll = 0;
	
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

function scrollSlider (e) {

	var event = e || window.event;
	s = event.target || event.srcElement;
	if ( s != slider ) {
		
		slider = s;
		original_scroll = slider.scrollLeft;
		
	}
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
		scroll_start = slider.scrollLeft;
        slide (event, 'snap');
    }, 50);

};

function moveIndex (el) {
	
	if (!el) {
		
		el = slider;
	
	}
	removeClass ( el.parentNode.querySelector('.slider-nav a.active'), 'active' );
	var index = Math.round( el.scrollLeft / el.offsetWidth ) + 1;

	addClass( el.parentNode.querySelector('.slider-nav').childNodes[index-1], 'active');
	
}

function slideEnd () {

	slider.onscroll = scrollSlider;
	clearTimeout(scrollTimer);
	removeClass( document.body, 'disable-hover' );
  	moveIndex();
  	original_scroll = slider.scrollLeft;
	document.onkeyup = sliderKeyboard;
	
}

/* Make slide universal with parameter specifying target scroll */

function slide ( e, target ) {

    clearTimeout(scrollTimer);
	var event = e || window.event; 
	if ( typeof event.srcElement == 'unknown' ) { return; } // IE8
	el = event.target || event.srcElement;
	slider = el;
	if (slider) {
	
		slider.onscroll = function () { return false; };

	}
	
	stopEvent(e);
	var change = 0;
	
	addClass( document.body, 'disable-hover');
	
	if (target == 'index') {

		slider = el.parentNode.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = thisIndex(el) * slider.offsetWidth - start;
		
	}
	
	if ( target == 'left') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = slider.scrollLeft - slider.offsetWidth - start;

	}
	
	if ( target == 'right') {

		slider = el.parentNode.querySelector('.slider');
		start = slider.scrollLeft;
		change = slider.scrollLeft + slider.offsetWidth - start;

	}
	
	if ( target == 'snap') {

/* 		console.log('From ' + original_scroll + ' to ' + slider.scrollLeft); */

		if (slider.scrollLeft > original_scroll) { 
			change = slider.offsetWidth - slider.scrollLeft % slider.offsetWidth;
		} else {
			change = slider.scrollLeft % slider.offsetWidth - slider.offsetWidth;
			change = -1 * (slider.offsetWidth + change);
		}
		
		start = slider.scrollLeft;
		console.log(start + ' ' + change); 

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
		if(currentTime < duration) {
			requestAnimFrame(animateScroll);
		} else {
			if (slideEnd && typeof(slideEnd) === 'function') { // the animation is done so lets callback
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

	el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
	container = el.previousSibling;
	container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left">←</a>' + el.outerHTML.replace( new RegExp( "\>[\n\t ]+\<" , "g" ) , "><" ) + '<a class="slider-arrow right">→</a><div class="slider-nav"></div>'); // 'replace' function removes spaces between slides to glue them together
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
/* 			container.style.height = (container.offsetHeight - height_scroll) + 'px'; */

		}
		
		container.querySelector('.slider-nav').lastChild.onclick = function (e) {
			slide(e, 'index');
		};

	}

	container.querySelector('.slider-arrow.left').onclick = function (e) {

		slide(e, 'left');

	}
	
	container.querySelector('.slider-arrow.right').onclick = function (e) {

		slide(e, 'right');

	}
	
	el.onscroll = scrollSlider;
	
/* 	el.style.width = el.offsetWidth + 'px'; // Chrome fix, now obsolete? */
	
}

addEventHandler ( window, 'load', function() {

	document.onkeyup = sliderKeyboard;
	
	/* Initialise JS extras: create arrows/numbers navigation */
	forEach('.slider', function(el, i) {

		if (!i) {
			slider = el;
		}
		
		makeSlider(el);
		
	});
	
	window.onresize = function () { 
		
		forEach('.slider', function (el,i) {
			el.scrollLeft = 0;
			moveIndex (el);
		});
		
	}
	
});
