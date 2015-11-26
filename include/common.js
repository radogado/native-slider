function addClass(el, className) {

    if (el.classList) {
		
        el.classList.add(className);

    } else {

        el.className += ' ' + className;

    }

}

function removeClass(el, className) {

    if (el.classList) {

        el.classList.remove(className);

    } else {

	    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    }

}

function hasClass(el, className) {
	
	if (el.classList) {
		
		return el.classList.contains(className);

	} else {
		
	    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			
	}
	
}

function toggleClass(el, className) {

    if (hasClass(el, className)) {

        removeClass(el, className);

    } else {

        addClass(el, className);

    }

}

function transferClass(el_origin, el_target, className) {

    if (hasClass(el_origin, className)) {

        addClass(el_target, className);

    }

}

function eventElement(e) {
	
	if (e) {
		
		return e.target;

	} else {
		
		return window.event.srcElement;
		
	}

}

parseHTML = function(str) {

    tmp = document.implementation.createHTMLDocument('Parsed');
    tmp.body.innerHTML = str;
    return tmp.body;

}

function forEach(selector, fn) { // Accepts both an array and a selector

    elements = (typeof selector == 'string') ? qa(selector) : selector;
    for (var i = 0; i < elements.length; i++) {

        fn(elements[i], i);

    }

}

function addEventHandler(el, eventType, handler) {

    if (el.addEventListener) {

        el.addEventListener(eventType, handler, false);

    } else {

        if (el.attachEvent) {

            el.attachEvent('on' + eventType, handler);

        }

    }

}

function removeEventHandler(el, eventType, handler) {

    if (el.removeEventListener) {

        el.removeEventListener(eventType, handler, false);

    } else {

        if (el.detachEvent) {

            el.detachEvent('on' + eventType, handler);

        }

    }

}

function stopEvent(e) {

    if (!e) {

        if (typeof window.event == 'undefined') {

            return;

        }

    }

	if ( typeof e == 'undefined' ) {
		
		return false;

	}

    //e.cancelBubble is supported by IE, this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if (e.stopPropagation) {

        e.stopPropagation();

    }

    if (e.preventDefault) {

        e.preventDefault();

    }

    return false;

}

function thisIndex(el) {

    if (!el) return;

    nodes = node = el.parentNode.childNodes;

    var i = count = 0;

    while ((node = nodes.item(i++)) && node != el) {

        if (node.nodeType == 1) {

            count++;

        }

    }

    return (count);

}

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function(el) {

        len = this.length >>> 0;

        from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === el)
                return from;
        }
        return -1;

    };

}

function q(selector) {
	
	return document.querySelector(selector);
	
}

function qa(selector) {
	
	return document.querySelectorAll(selector);
	
}

var wrap = function (toWrap, wrapper) { // Thanks yckart

    wrapper = wrapper || document.createElement('div');
    if (toWrap.nextSibling) {

        toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);

    } else {

        toWrap.parentNode.appendChild(wrapper);

    }

    return wrapper.appendChild(toWrap);

};

function childByClass (el, cl) {

	i = 0;
	while(i < el.children.length) {
		
		if (hasClass(el.children[i], cl)) {
			
			return el.children[i];

		}
		i++;
		
	}

	return false;
		
}

var getClosest = function (el, selector) { // Thanks http://gomakethings.com/ditching-jquery/

    var firstChar = selector.charAt(0);

    // Get closest match
    for ( ; el && el !== document; el = el.parentNode ) {

        // If selector is a class
        if ( firstChar === '.' ) {
            if ( hasClass(el, selector.substr(1) ) ) {
                return el;
            }
        }

        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( el.id === selector.substr(1) ) {
                return el;
            }
        } 

        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( el.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                return el;
            }
        }

        // If selector is a tag
        if ( el.tagName.toLowerCase() === selector ) {
            return el;
        }

    }

    return false;

};

temp = document.createElement('temp');

transitions = {

	'transition'		: 'transitionend',
	'OTransition'		: 'oTransitionEnd',
	'MozTransition'		: 'transitionend',
	'WebkitTransition'	: 'webkitTransitionEnd'

}

animations = {

// 	'animation'      	: 'animationend', // Disable IE because of a Slider glitch
	'OAnimation'     	: 'oAnimationEnd',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

}

for(var t in transitions){

    if (temp.style[t] !== undefined) {

        var transitionEvent = transitions[t];

    }

}

for(var t in animations){

    if (temp.style[t] !== undefined) {

        var animationEvent = animations[t];

    }

}

