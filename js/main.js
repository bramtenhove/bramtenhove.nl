(function($) {
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
    if(pull.is(':hidden')) {
      menu.removeAttr('style');
    }
  });

})(jQuery);
