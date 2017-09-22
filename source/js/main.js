/**
 * @file Manages the chat functionality for the site.
 * @author Bram ten Hove
 */

/**
 * Retrieves a bunch of sentences.
 */
function getSentences() {
  var sentences = {
    0: "hello",
    1: "bye",
    2: "awesome",
    3: "tralala"
  }
}

/**
 * Display a message on the screen.
 *
 * @param text
 *   The text to display.
 * @param visitor
 *   Boolean indicating if it is a message from the visitor.
 */
function display(text, visitor) {
  // Chat container.
  var chat = document.querySelectorAll('#chat .messages')[0];

  var classes = '';
  // Create the message object.
  var message = document.createElement('div');
  addClass(message, 'columns');

  // If it is an text by the visitor, add some more classes.
  if (visitor) {
    addClass(message, 'is-clearfix');
    classes = ' visitor is-pulled-right';
  }

  // The HTML containing the text to display.
  message.innerHTML = '<div class="column">' +
    '<article class="message' + classes + '">' +
    '<div class="message-body">' +
    text +
    '</div>' +
    '</article>' +
    '</div>';

  chat.appendChild(message);
}

/**
 * Function to check if an element has a class.
 *
 * @param el
 *   The element to check.
 * @param className
 *   The class name to check.
 *
 * @returns {boolean}
 *   Return true if the element has the class, otherwise false.
 */
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
}

/**
 * Adds a class to an element.
 *
 * @param el
 *   The element to add the class to.
 * @param className
 *   The classname to add to the element.
 */
function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += ' ' + className;
}

/**
 * Live event binder.
 *
 * @param selector
 *   The element to bind the event to.
 * @param eventType
 *   The type of event.
 * @param callback
 *   Handler for the event.
 * @param context
 *   Context for the event handler.
 */
function addLiveEvent(selector, eventType, callback, context) {
  (context || document).addEventListener(eventType, function(event) {
    var nodeList = document.querySelectorAll(selector);
    // Convert nodeList into matches array.
    var matches = [];
    for (var i = 0; i < nodeList.length; ++i) {
      matches.push(nodeList[i]);
    }
    // If there are matches.
    if (matches) {
      var element = event.target;
      var index   = -1;
      // Traverse up the DOM tree until element can't be found in matches array.
      while (element && (index = matches.indexOf(element) === -1)) {
        element = element.parentElement;
      }
      // When element matches the selector, apply the callback.
      if (index > -1) {
        callback.call(element, event);
      }
    }
  }, false);
}

/**
 * Callback for clicks on visitor action button.
 *
 * @param el
 *   The element that is clicked up on.
 */
function chatAction(el) {
  var response = el.getAttribute('data-response');
  // If we don't have an actual response, stop.
  if (!response) {
    return;
  }

  console.log(response);
  el.remove();
}

/**
 * Main function that gets fired upon successful loading of the DOM.
 */
function main() {
  getSentences();
  display('OK! So bla bla bla bla.');
  display('Bla bla bla, bla bla. Bla bla.');
  display('Very interesting', true);
  display('...');

  // Bind an event handler to the action buttons for the visitor.
  addLiveEvent('.responses a', 'click', function(event) {
    chatAction(event.target);
  });
}

// In case the document is already rendered.
if (document.readyState!='loading') main();
// For modern browsers.
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', main);
// IE <= 8.
else document.attachEvent('onreadystatechange', function(){
  if (document.readyState=='complete') main();
});