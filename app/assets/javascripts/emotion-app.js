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

        // Matching bear.
        bearImage = emotionApp.getBearByEmotion(emotion);

        // Return the emotion to the visitor.
        $('.results .scores', emotionApp.wrapper).append('<h3>Your emotion is <span style="color: #37373b">' + emotion + '</span>, just like this bear:</h3><img src="' + bearImage + '" width="100%" />');
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
  },

  getBearByEmotion: function(emotion) {
    var images;

    switch (emotion) {
      case 'anger':
        images = [
          '/public/images/bears/angry1.jpg',
          '/public/images/bears/angry2.jpg'
        ];
        break;

      case 'contempt':
        images = [
          '/public/images/bears/contempt1.jpg'
        ];
        break;

      case 'disgust':
        images = [
          '/public/images/bears/disgusted1.jpg'
        ];
        break;

      case 'fear':
        images = [
          '/public/images/bears/fear1.jpg',
          '/public/images/bears/fear2.jpg'
        ];
        break;

      case 'happiness':
        images = [
          '/public/images/bears/happy1.jpg',
          '/public/images/bears/happy2.jpg'
        ];
        break;

      case 'neutral':
        images = [
          '/public/images/bears/neutral1.jpg',
          '/public/images/bears/neutral2.jpg'
        ];
        break;

      case 'sadness':
        images = [
          '/public/images/bears/sad1.jpg',
          '/public/images/bears/sad2.jpg'
        ];
        break;

      case 'surprise':
        images = [
          '/public/images/bears/surprised1.jpg',
          '/public/images/bears/surprised2.jpg'
        ];
        break;

      default:
        images = [
          '/public/images/bears/default1.jpg',
          '/public/images/bears/default2.jpg'
        ];
    }

    return images[Math.floor(Math.random()*images.length)];
  }
};

$(document).ready(
  emotionApp.onReady
);
