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

function slide(e, current_slider, direction ) {

	e.stopPropagation();
    clearTimeout(scrollTimer);

	$(current_slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $(current_slider).scrollLeft() + direction * $(current_slider).width() }, 100, function () { 
		$(current_slider).on('scroll', scrollslider ); 
	});
	
}

$(document).ready(function() {
	
	slider = $('.slider');

	/*	To do: Fix clicking the built-in scrollbar arrow in IE  */
	
	$(slider).on('scroll', scrollslider );
	
	$(document).keyup(function(e){
		/* To do: detect nearest/focused slider and control that one */
	    if (e.keyCode == 37) { // left
	    	
			slide(e, $('.slider'), -1);
	    }
	    if (e.keyCode == 39) { // right
	
			slide(e, $('.slider'), 1);
			
	    }
	});
	
	/* Initialise slider JS extras: arrow and numbers nav */

	$('.slider').each ( function (n) {
		
		$(this).before('<div class="slider-container"></div>').appendTo( $(this).prev() );
		
		$(this).parent().prepend('<a class="slider-arrow left">←</a>').append('<a class="slider-arrow right">→</a>').append('<div class="slider-nav"></div>');
		
		$(this).children().each ( function (n) {
		
			$(this).parent().parent().find('.slider-nav').append('<a>' + (n + 1) + '</a>');
			
		});
		
		$('.slider-arrow.left').click ( function (e) {  
			
			slide(e, $(this).siblings('.slider'), -1);
				
		});
		
		$('.slider-arrow.right').click ( function (e) {
			
			slide(e, $(this).siblings('.slider'), 1);	
		});
		
		$('.slider-nav a').click ( function (e) {  
			var n = $(this).index();
			var this_slider = $(this).parent().siblings('.slider');
			
			$(this_slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': n * $(this_slider).width() }, 100, function () { 
				$(this_slider).on('scroll', scrollslider );
			});
		
		});
		
	});

});
