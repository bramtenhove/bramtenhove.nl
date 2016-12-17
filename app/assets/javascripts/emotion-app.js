var emotionApp = {
  wrapper: '#emotion-app',

  onReady: function() {
    // Detect the wrapper div we will place our content in.
    if ($(emotionApp.wrapper).length > 0) {
      $('form', emotionApp.wrapper).submit(function(e) {
        e.preventDefault();

        $('.message', emotionApp.wrapper).remove();

        var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
        if (pattern.test($('input[name=image]').val())) {
          console.log(e);
          emotionApp.submitForm($('input[name=image]').val());
        }
        else {
          $('.results', emotionApp.wrapper).prepend('<div class="message error">Please provide a valid URL.</div>');
        }
      });
    }
  },

  submitForm: function(imageUrl) {
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
      console.log(data);

      // If we have data to work with, go show it.
      if (data.length > 0) {
        $('.results', emotionApp.wrapper).html('<p><img src="' + imageUrl + '" width="100%" /></p><div class="scores"></div>');

        $.each(data, function(index, face) {
          var output = '<div class="face"><ul>';

          $.each(face.scores, function(emotion, score) {
            output += '<li>' + emotion + ': ' + score + '</li>';
          });

          output += '</ul></div> <br /><br />';

          $('.results .scores', emotionApp.wrapper).append(output);
        });
      }
      else {
        $('.results', emotionApp.wrapper).html('');
        $('.results', emotionApp.wrapper).prepend('<div class="message error">The provided image could not processed, please try again with a different image.</div>');
      }
    })
    .fail(function() {
      $('.results', emotionApp.wrapper).html('');
      $('.results', emotionApp.wrapper).prepend('<div class="message error">The provided image could not processed, please try again with a different image.</div>');
    });
  },

};

$(document).ready(
  emotionApp.onReady
);
