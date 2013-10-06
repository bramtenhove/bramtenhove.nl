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
    $(".image-slides").responsiveSlides({
      auto: true,
      speed: 500,
      timeout: 5000,
      pager: false,
      nav: false,
      pause: true
    });
  }

};

$(document).ready(
  app.onReady
);
