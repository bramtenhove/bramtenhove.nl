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
 * This function gets fired upon successful loading of the DOM.
 */
document.addEventListener("DOMContentLoaded", function() {
  getSentences();
  display('ola!');
  display('tell me more', true);
}, false);
