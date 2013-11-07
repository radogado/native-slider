var scrollTimer = -1;
var slider;
	
function scrollslider() {
    if (scrollTimer != -1)
        clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 50);
};

function scrollFinished() { // center the nearest scrolling item

	$(slider).animate ( { 'scrollLeft': Math.round ( $(slider).scrollLeft() / $(slider).width() ) * $(slider).width() }, 100);

}

function slide(e, direction ) {

	e.stopPropagation();
    clearTimeout(scrollTimer);

	$(slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $(slider).scrollLeft() + direction * $(slider).width() }, 100, function () { 
		$(slider).on('scroll', scrollslider ); 
	});
	
}

$(document).ready(function() {
	
	slider = $('.slider');

	/*	To do: Fix clicking the built-in scrollbar arrow in IE  */
	
	$(slider).on('scroll', scrollslider );
	
	$(document).keyup(function(e){
		
	    if (e.keyCode == 37) { // left
	    	
			slide(e, -1);
	    }
	    if (e.keyCode == 39) { // right
	
			slide(e, 1);
			
	    }
	});
	
	/* Initialise slider JS extras: arrow and numbers nav */

	$('.slider').each ( function (n) {
		
		$(this).before('<div class="slider-container"></div>').detach().appendTo('.slider-container').before('<a class="slider-arrow left">←</a>').after('<div class="slider-nav"></div>').after('<a class="slider-arrow right">→</a>');
		
		$(this).children().each ( function (n) {
		
			$('.slider-nav').append('<a>' + (n + 1) + '</a>');
			
		});
		
		$(this).find('.slider-arrow.left').click ( function (e) {  
			
			slide(e, -1);
				
		});
		
		$(this).find('.slider-arrow.right').click ( function (e) {
			
			slide(e, 1);	
		});
		
		var this_slider = this;
		
		$(this).find('.slider-nav a').click ( function (e) {  
			var n = $(this).index();
			
			$(this_slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': n * $(this_slider).width() }, 100, function () { 
				$(this_slider).on('scroll', scrollslider );
			});
		
		});
		
	});

});
