(function($) {
  if ($.browser.msie && $.browser.version < 10) {
    $("input,textarea").labelify({ text: "label" });
  }
})(jQuery);