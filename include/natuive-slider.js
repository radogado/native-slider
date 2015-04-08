/* natUIve Slider */
var new_event_support = 1;

try { // Android Browser etc?

    test_event = new Event('t');

} catch (err) {

    new_event_support = 0;

}

function sliderElement(e) {

    el = eventElement(e);

    if (hasClass(el, 'slider-container')) {

        return el.querySelector('.slider');

    } else {

        container = parentByClass(el, 'slider-container');
        return container && container.querySelector('.slider');

    }

}

/* Thanks to Pete & Eike Send for the swipe events – http://www.thepetedesign.com/demos/purejs_onepage_scroll_demo.html */

var last_animation = 0;

swipeEvents = function(el) {

    var startX, startY;

    el.addEventListener("touchstart", touchStart);

    function touchStart(e) {

        var touches = e.touches;
        if (touches && touches.length) {

            startX = touches[0].pageX;
            startY = touches[0].pageY;

            el.addEventListener("touchmove", touchMove);

        }

    }

    function touchMove(e) {

        var touches = e.touches;
        if (touches && touches.length) {

            var deltaX = startX - touches[0].pageX;
            var deltaY = startY - touches[0].pageY;
            delta = (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY;

            if ((hasClass(sliderElement(e), 'vertical') ? (Math.abs(deltaY) < Math.abs(deltaX)) : (Math.abs(deltaX) < Math.abs(deltaY))) && !q('.slider.lightbox')) {

                return;

            }

            e.preventDefault();

            if (Math.abs(delta) > 50) {

                if (new_event_support) {

                    var event = new Event((delta >= 50) ? 'swipeLeft' : 'swipeRight');
                    el.dispatchEvent(event);

                } else {

                    initScroll(e, -1 * delta);

                }

                el.removeEventListener('touchmove', touchMove);

            }

        }
    }

};

initScroll = function(event, delta) {

    deltaOfInterest = delta;
    timeNow = new Date().getTime();

    // Cancel scroll if currently animating or within quiet period
    if ((timeNow - last_animation) < 800) {

        event.preventDefault();
        return;

    }

    slide(sliderElement(event), (deltaOfInterest < 0) ? 'right' : 'left');

    last_animation = timeNow;

}

mouseWheelHandler = function(event) {

    deltaX = (event.deltaX * -10) || event.wheelDeltaX || -event.detail;
    deltaY = (event.deltaY * -10) || event.wheelDeltaY || -event.detail;

    if (Math.abs(hasClass(sliderElement(event), 'vertical') ? deltaY : deltaX) > 50) {

        event.preventDefault();
        initScroll(event, (Math.abs(deltaX) > Math.abs(deltaY)) ? deltaX : deltaY);

    }

}

function mouseEvents(el, toggle) {

    if (!('onwheel' in window)) return;

    if (toggle == 'off') {

        el.parentNode.removeEventListener('wheel', mouseWheelHandler);

    } else {

        el.parentNode.addEventListener('wheel', mouseWheelHandler);

    }

}

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichAnimationEvent(){

	el = document.createElement("fakeelement");
	
	var animations = {
	
		"animation"      : "animationend",
		"OAnimation"     : "oAnimationEnd",
		"MozAnimation"   : "animationend",
		"WebkitAnimation": "webkitAnimationEnd"
	
	}
	
	for (t in animations){
	
		if (el.style[t] !== undefined){

			return animations[t];

		}
	
	}

}

var animationEvent = whichAnimationEvent();
var	prefix = animationEvent == 'webkitAnimationEnd' ? '-webkit-' : ''; 
var slide_duration = 400;

function slide(el, method, index_number) {

    if (window.sliderTimeout) {

        clearTimeout(window.sliderTimeout);

    }

    var slider = parentByClass(el, 'slider-container').querySelector('.slider');

	index = old_index = thisIndex(slider.parentNode.querySelector('.slider-nav a.active'));

    if (method == 'index') {

        index = index_number || thisIndex(el);
    
    }

    if (method == 'right') {

        if (index == (slider.children.length - 1)) {

            index = 0;

        } else {
	        
	        index++; 
	        
        }
        
    }

    if (method == 'left') {

        if (index == 0) {

            index = slider.children.length-1;

        } else {
	        
	        index--;
	        
        }

    }

	if (!hasClass(slider, 'vertical')) {
		
		slider.style.cssText = 'height: ' + slider.offsetHeight + 'px !important';
	
	}

    removeClass(slider.parentNode.querySelector('.slider-nav .active'), 'active');
    addClass(slider.parentNode.querySelector('.slider-nav span').children[index], 'active');

    if (typeof document.body.style.transition == 'string') { // CSS transition-enabled browser...

	    direction = hasClass(slider, 'vertical') ? 'translateY' : 'translateX';
	    mouseEvents(el.parentNode, 'off');

		if (!index_number) {
	
			addClass(q('html'), 'disable-hover');
		
		}

		addClass(slider.children[index], 'visible');

	    i = Math.min(old_index, index) - 1;
	    while ( i++ < Math.abs(index-old_index) ) {
	
	        addClass(slider.children[i], 'visible');
	
	    }
		
		var styles = document.createElement('style');
		styles.innerHTML = '@' + prefix + 'keyframes slide-index { from { ' + prefix + 'transform: ' + direction + '(' + ((index<old_index) ? (index-old_index) : 0) + '00%); } to { ' + prefix + 'transform: ' + direction + '(' + ((index<old_index) ? 0 : (index-old_index)*-1) + '00%); }}';
		document.getElementsByTagName('head')[0].appendChild(styles);
		addClass(styles, 'slide-index-style');
		addClass(slider, 'slide-index');
	

        slider.addEventListener(animationEvent, function(e) {

            slider.removeEventListener(animationEvent, arguments.callee);

			forEach ( slider.querySelectorAll('.visible'), function (el) {
				
				removeClass(el, 'visible');
				
			});
			addClass(slider.children[index], 'visible');
			removeClass(slider,'slide-index');
			slider.style.cssText = prefix + 'transform: ' + direction + '(-' + index + '00%);';
			q('.slide-index-style').outerHTML = '';
			
        	removeClass(q('html'), 'disable-hover');
            
            if (hasClass(slider, 'lightbox')) {
				
				populateLightbox(slider, index);
	            
            }
			document.onkeyup = sliderKeyboard;
            mouseEvents(slider);

        }, false);

    } else { // ... or without animation on old browsers

		slider.style.cssText = (hasClass(slider, 'vertical') ? 'top' : 'left') + ': -' + index + '00%';

        if (hasClass(slider, 'lightbox')) {
			
			populateLightbox(slider, index);
            
        }

    }

}

function sliderKeyboard(e) {

    e = e || window.event;

    if (typeof e == 'undefined') {

        return;

    }

    el = e.target || e.srcElement;

    if (q('.slider')) {

        tag = el.tagName.toLowerCase();
        if (tag != 'input' && tag != 'textarea') {

            el = q('.slider.full-screen') || q('.slider.lightbox') || q('.slider');

            switch (e.which) {

                case 38:
                	if (!hasClass(el,'vertical')) {
	                	
	                	return;

                	}
                case 37:
                    slide(el, 'left');
                    break;
                case 40:
                	if (!hasClass(el,'vertical')) {
	                	
	                	return;

                	}
                case 39:
                    slide(el, 'right');
                    break;
                default:
                    return;

            }

        }

    }

};

function makeSlider(el, current_slide) {

    if (el.children.length < 2) {

        return el;

    }
    addClass(el, 'slider');
    el.insertAdjacentHTML('beforebegin', '<div class="slider-container"></div>'); // Create a container and move the slider in it
    container = el.previousSibling;

    transferClass(el, container, 'vertical');
    transferClass(el, container, 'full-screen');
    
    if (hasClass(el, 'full-screen')) {
	    
	    addClass(q('html'), 'nooverflow');

    }

    container.insertAdjacentHTML('afterbegin', '<a class="slider-arrow left"></a>' + el.outerHTML + '<a class="slider-arrow right"></a><div class="slider-nav"><div><span></span></div></div>');
    container.nextSibling.outerHTML = '';
    el = container.querySelector('.slider');

    // Generate controls

    for (var i = 0; i < el.children.length; i++) {

        /*
        		// IE8 counts comments as children and produces an empty slide.			
        		if ( el.children[i].nodeName == '#comment' ) {
        			
        		
        		}
        */

        if (el.children[i].querySelector('.thumbnail')) {

            slider_nav = el.parentNode.querySelector('.slider-nav');
            addClass(slider_nav, 'thumbnails');
            addClass(slider_nav.querySelector('span'), 'row');
            slider_nav.querySelector('span').insertAdjacentHTML('beforeend', (!i ? '<a class="active">' : '<a>') + el.children[i].querySelector('.thumbnail').innerHTML + '</a>');
            if (hasClass(el, 'vertical')) {
	            
	            addClass(el.parentNode, 'vertical-thumbnails');
	            
            }

        } else {

            container.querySelector('.slider-nav span').insertAdjacentHTML('beforeend', (!i ? '<a class="active">' : '<a>') + (i + 1) + '</a>');

        }

        container.querySelector('.slider-nav span').lastChild.onclick = function(e) {

            slide(eventElement(e), 'index');

        };

    }

    container.querySelector('.slider-arrow.left').onclick = function(e) {

        slide(eventElement(e), 'left');

    }

    container.querySelector('.slider-arrow.right').onclick = function(e) {

        slide(eventElement(e), 'right');

    }

    if (current_slide) {

		slide(el, 'index', current_slide);
		
    }

    document.onkeyup = sliderKeyboard;

    mouseEvents(el);

    if ('ontouchstart' in window) {

        swipeEvents(el.parentNode);

        el.parentNode.addEventListener("swipeLeft", function(event) {

            el = sliderElement(event);
            slide(el, 'right');

        });

        el.parentNode.addEventListener("swipeRight", function(event) {

            el = sliderElement(event);
            slide(el, 'left');

        });

    }

    if (el.getAttribute('data-autoslide')) { // auto slide

        function autoSlide() {

            slide(el, 'right');
            window.sliderTimeout = setTimeout(autoSlide, 1000 * el.getAttribute('data-autoslide'));

        }

        setTimeout(autoSlide, 1000 * el.getAttribute('data-autoslide'));

    }

    return el;

}

/* Start */

/* Initialise JS extras: create arrows/numbers navigation */
forEach('.slider', function(el) {

    makeSlider(el);

});
