//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 30) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $(".navbar-brand").css('font-size', '35px')
        $(".navbar-brand").css('float', 'left')
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $(".navbar-brand").css('font-size', '66px')
        $(".navbar-brand").css('float', 'none')
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
