var scrollTimer;
var slider;
	
function scrollslider() {

    if (scrollTimer != -1)
        clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 50);

};

function move_index() {

	$(slider).parent().find('.slider-nav a.active').removeClass();
	var index = $(slider).scrollLeft() / $(slider).width() + 1;
	if ( index > $(slider).parent().find('.slider-nav a').length ) { index = $(slider).parent().find('.slider-nav a').length; }
	$(slider).parent().find('.slider-nav a:nth-child(' + index + ')').addClass('active');
	
}

function scrollFinished() { // center the nearest scrolling item

	$(slider).animate ( { 'scrollLeft': Math.round ( $(slider).scrollLeft() / $(slider).width() ) * $(slider).width() }, 100, function () {
		move_index();
	});

}

function slide(e, current_slider, direction ) {
	slider = current_slider;
	
	e.stopPropagation();
    clearTimeout(scrollTimer);
	
	$(slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $(slider).scrollLeft() + direction * $(slider).width() }, 'fast', function () { 
		$(slider).on('scroll', scrollslider ); 
		move_index();
	});
	
	// Set active index button
}

$(document).ready(function() {
	
	/*	To do: Fix clicking the built-in scrollbar arrow in IE  */
	
	$('.slider').on('scroll', function () { slider = $(this); scrollslider(); } );
	
	$(document).keyup(function(e){
		/* To do: detect nearest/focused slider and control that one */
	    if (e.keyCode == 37) { // left
	    	
			slide(e, $('.slider-container:first-of-type .slider'), -1);
	    }
	    if (e.keyCode == 39) { // right
	
			slide(e, $('.slider-container:first-of-type .slider'), 1);
			
	    }
	});
	
	/* Initialise JS extras: arrows/numbers navigation */

	$('.slider').each ( function (n) {
		
		$(this).before('<div class="slider-container"></div>').appendTo( $(this).prev() );
		
		$(this).parent().prepend('<a class="slider-arrow left">←</a>').append('<a class="slider-arrow right">→</a>').append('<div class="slider-nav"></div>');
		
		$(this).children().each ( function (n) {
		
			$(this).parent().parent().find('.slider-nav').append('<a>' + (n + 1) + '</a>');
			
		});
		
		$(this).parent().find('.slider-nav a:first-child').addClass('active');

		$(this).siblings('.slider-arrow.left').click ( function (e) {  
			
			slide(e, $(this).siblings('.slider'), -1);
				
		});
		
		$(this).siblings('.slider-arrow.right').click ( function (e) {
			
			slide(e, $(this).siblings('.slider'), 1);	
		});
		
		$(this).siblings('.slider-nav').children('a').click ( function (e) {  

			e.stopPropagation();
			var n = $(this).index();
			$(this).siblings('a.active').removeClass();
			$(this).addClass('active');
			slider = $(this).parent().siblings('.slider');
						
			$(slider).stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': n * $(slider).width() }, 'fast', function () { 
				$(slider).on('scroll', scrollslider );
			});
		
		});
		
	});
	
});

$(window).load(function() {
	
	// Get scrollbar width and hide it by reducing the .slider-container height proportiobally

	$('.slider').css('overflow-x', 'hidden');
	var height_scroll = $('.slider').height();
	$('.slider').css('overflow-x', 'scroll');
	height_scroll = $('.slider').height() - height_scroll;
	
	$('.slider-container').each ( function () { 

		$(this).height( $(this).height() - height_scroll );
		
	});

});

