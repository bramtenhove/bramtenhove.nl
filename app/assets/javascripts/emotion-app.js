var emotionApp = {

  onReady: function() {
    var wrapper = '#emotion-app';

    // Detect the wrapper div we will place our content in.
    if ($(wrapper).length > 0) {
      var subscriptionKey = '5b7211ee8d554584b33ac05dad6d2e49';
      var params = {};
      var body = '{url: "http://petapixel.com/assets/uploads/2012/10/haunted-6.jpg"}';

      // Ajax request to the API.
      $.ajax({
        url: "https://api.projectoxford.ai/emotion/v1.0/recognize?" + $.param(params),
        beforeSend: function(xhrObj){
          // Request headers.
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body.
        data: body,
      })
      .done(function(data) {
        console.log(data);
      })
      .fail(function() {
        alert("error");
      });
    }
  }

};

$(document).ready(
  emotionApp.onReady
);
