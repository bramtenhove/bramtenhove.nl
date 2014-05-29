var app = {

  onReady: function() {
    $(function() {
      pull = $('#pull-menu');
      menu = $('#main-menu ul.menu');

      $(pull).on('click', function(e) {
        e.preventDefault();
        menu.stop().slideToggle(150);
      });
    });

    // Back to normal.
    $(window).resize(function(){
      if (pull.is(':hidden')) {
        menu.removeAttr('style');
      }
    });

    // Start the image slider.
    if ($.fn.owlCarousel) {
      $('.owl-carousel').owlCarousel({
        lazyLoad: true,
        singleItem: true,
        pagination: false,
        autoHeight: true,
        autoPlay: true,
        stopOnHover: true
      });
    }
  }

};

$(document).ready(
  app.onReady
);
