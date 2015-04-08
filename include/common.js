function addClass_classList(el, className) {

	el.classList.add(className);

}

function addClass_className(el, className) {

    el.className += ' ' + className;

}

function addClass(el, className) {

    if (el.classList) {
		
        el.classList.add(className);
        addClass = addClass_classList;

    } else {

        el.className += ' ' + className;
        addClass = addClass_className;

    }

}

function removeClass_classList(el, className) {

    el.classList.remove(className);

}

function removeClass_className(el, className) {

    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

}

function removeClass(el, className) {

    if (el.classList) {

        el.classList.remove(className);
        removeClass = removeClass_classList;

    } else {

        removeClass_className(el, className);
        removeClass = removeClass_className;

    }

}

function hasClass_classList(el, className) {

    return el.classList.contains(className);

}

function hasClass_className(el, className) {

    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

}

function hasClass(el, className) {
	
	if (el.classList) {
		
		hasClass = hasClass_classList;
		return el.classList.contains(className);

	} else {
		
		hasClass = hasClass_className;
		return hasClass_className(el, className);
			
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

function eventElement_e(e) {

    return e.target;

}

function eventElement_window(e) {

    return window.event.srcElement;

}

function eventElement(e) {
	
	if (e) {
		
		eventElement = eventElement_e;
		return e.target;

	} else {
		
		eventElement = eventElement_window;
		return window.event.srcElement;
		
	}

}

var parseHTML = function(str) {

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

    var nodes = el.parentNode.childNodes,
        node;
    var i = count = 0;

    while ((node = nodes.item(i++)) && node != el) {

        if (node.nodeType == 1) {

            count++;

        }

    }

    return (count);

}

function parentByClass(el, className) {

    while (el.parentNode && !hasClass(el, className)) {

        el = el.parentNode;

    }
	if (typeof el.tagName == 'undefined') {
		
		return false;

	}

    return hasClass(el, className) && el;

}

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function(elt) {

        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this && this[from] === elt)
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

