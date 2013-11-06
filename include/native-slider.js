var scrollTimer = -1;
	
function scrollslider() {
    if (scrollTimer != -1)
        clearTimeout(scrollTimer);

    scrollTimer = window.setTimeout("scrollFinished()", 50);
};

function scrollFinished() { // center the nearest scrolling item
	
	$('.slider').animate ( { 'scrollLeft': Math.round ( document.getElementById('slider').scrollLeft / document.getElementById('slider').offsetWidth ) * document.getElementById('slider').offsetWidth }, 100);

}
	
$(document).ready(function() {
	
	/* 		To do: Fix clicking the built-in scrollbar arrow in IE  */
	
	{ $('.slider').on('scroll', scrollslider ); }
	
	$(document).keyup(function(e){
		e.stopPropagation();
	
	    if (e.keyCode == 37) { // left
	    	
			$('.slider').stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $('.slider').scrollLeft() - $('.slider').width()}, 100, function () { 
				$('.slider').on('scroll', scrollslider ); 
			});
	       return false;
	    }
	    if (e.keyCode == 39) { // right
	
			$('.slider').stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $('.slider').scrollLeft() + $('.slider').width()}, 100, function () { 
				$('.slider').on('scroll', scrollslider ); 
			});
	       return false;
	    }
	});
	
	/* Initialise slider JS extras */
	
	$('.slider').before('<div class="slider-container"></div>').detach().appendTo('.slider-container').before('<a class="slider-arrow left">←</a>').after('<span class="slider-nav"></span>').after('<a class="slider-arrow right">→</a>');
	
	$('.slider > *').each ( function (n) {
	
		$('.slider-nav').append('<a>' + (n + 1) + '</a>');
		
	});
	
	$('.slider-arrow.left').click ( function (e) {  
	
		$('.slider').stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $('.slider').scrollLeft() - $('.slider').width()}, 100, function () { 
			$('.slider').on('scroll', scrollslider ); 
	
		});
	
	});
	
	$('.slider-arrow.right').click ( function (e) {  
	
		$('.slider').stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': $('.slider').scrollLeft() + $('.slider').width()}, 100, function () { 
			$('.slider').on('scroll', scrollslider ); 
		});
	
	});
	
	$('.slider-nav a').click ( function (e) {  
		var n = $(this).index();
		
		$('.slider').stop( true, true ).off('scroll', scrollslider ).animate ( { 'scrollLeft': n * $('.slider').width() }, 100, function () { 
			$('.slider').on('scroll', scrollslider ); 
		});
	
	});

});
