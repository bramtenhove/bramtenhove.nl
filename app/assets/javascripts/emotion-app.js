var emotionApp = {
  // Wrapper div.
  wrapper: '#emotion-app',

  // The main function that gets called.
  onReady: function() {
    // Detect the wrapper div we will place our content in.
    if ($(emotionApp.wrapper).length > 0) {
      $('form', emotionApp.wrapper).submit(function(e) {
        e.preventDefault();

        $('.message', emotionApp.wrapper).remove();

        var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
        if (pattern.test($('input[name=image]').val())) {
          console.log(e);
          emotionApp.getEmotionByImage($('input[name=image]').val());
        }
        else {
          $('.results', emotionApp.wrapper).prepend('<div class="message error">Please provide a valid image URL.</div>');
        }
      });
    }
  },

  // Processes the imageUrl and submits it to Microsoft.
  getEmotionByImage: function(imageUrl) {
    var subscriptionKey = '5b7211ee8d554584b33ac05dad6d2e49';
    var params = {};
    var body = '{url: "' + imageUrl + '"}';

    // Ajax request to the API.
    $.ajax({
      url: "https://api.projectoxford.ai/emotion/v1.0/recognize?" + $.param(params),
      beforeSend: function(xhrObj){
        // Request headers.
        xhrObj.setRequestHeader("Content-Type", "application/json");
        xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

        // Indicate loading.
        $('.results', emotionApp.wrapper).html('Calculating emotion...');
      },
      type: "POST",
      // Request body.
      data: body,
    })
    .done(function(data) {
      // If we have data to work with, go show it.
      if (data.length > 0) {
        // Show the input image.
        $('.results', emotionApp.wrapper).html('<p><img src="' + imageUrl + '" width="100%" /></p><div class="scores"></div>');

        // For now we just use the first object we get back to determine the
        // emotion.
        emotion = Object.keys(data[0].scores).reduce(function(a, b){ return data[0].scores[a] > data[0].scores[b] ? a : b });

        // Return the emotion to the visitor.
        $('.results .scores', emotionApp.wrapper).append('<div class="face">Your emotion is <strong>' + emotion + '</strong>.</div>');
      }
      else {
        // If we haven't had any good results back, throw an error.
        $('.results', emotionApp.wrapper).html('');
        $('.results', emotionApp.wrapper).prepend('<div class="message error">The provided image could not processed, please try again with a different image.</div>');
      }
    })
    .fail(function() {
      // If a bad request was sent, rate limit was reached, or anything else,
      // we throw an error.
      $('.results', emotionApp.wrapper).html('');
      $('.results', emotionApp.wrapper).prepend('<div class="message error">The provided image could not processed, please try again with a different image.</div>');
    });
  }
};

$(document).ready(
  emotionApp.onReady
);
