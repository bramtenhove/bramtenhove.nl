/**
 * @file Manages the chat functionality for the site.
 * @author Bram ten Hove
 */

var textIndicatorTime = 500;
var defaultStringDelay = 750;

/**
 * Main function that gets fired upon successful loading of the DOM.
 */
function main() {
  // Bind an event handler to the action buttons for the visitor.
  addLiveEvent('#chat .responses a', 'click', function(event) {
    chatActionEvent(event.target);
  });

  setTimeout(function() {
    chatAction('response-y');
  }, defaultStringDelay);
}

/**
 * Callback for clicks on visitor action button.
 *
 * @param el
 *   The element that is clicked up on.
 */
function chatActionEvent(el) {
  var response = el.getAttribute('data-response');
  // If we don't have an actual response, stop.
  if (!response) {
    return;
  }

  // Display the CTA in the chat.
  displayMessage(el.innerText, true);

  // Remove all actions in this set.
  var currentActions = document.querySelectorAll('#chat .responses a');
  for (var i = 0, len = currentActions.length; i < len; i++) {
    currentActions[i].remove();
  }

  chatAction(response);
}

/**
 * Handles logic with regard to selecting messages.
 *
 * @param response
 *   The response code to match messages to.
 */
function chatAction(response) {
  // Find the message by the CTA key.
  var message = getMessageById(response);
  if (message) {
    var stringDelay = defaultStringDelay;
    // Display any messages we can find.
    for (var i = 0, len = message.messages.length; i < len; i++) {
      var string = message.messages[i];
      var charDelay = determineCharDelay(string);
      displayMessage(string, false, charDelay, stringDelay);

      // Update string delay.
      stringDelay += (message.messages[i].length * charDelay) + defaultStringDelay;

      // Show actions only after last string is displayed.
      if (i == (len - 1)) {
        setTimeout(function() {
          // Display any actions that are available.
          for (var i = 0, len = message.actions.length; i < len; i++) {
            displayAction(message.actions[i].text, message.actions[i].key);
          }
        }, stringDelay - defaultStringDelay);
      }
    }
  }
}

/**
 * Determines the delay for each character is typed.
 *
 * @param text
 *   A string with characters.
 * @returns {number}
 *   Delay in milliseconds.
 */
function determineCharDelay(text) {
  if (text.length > 80) {
    return 5;
  }
  else if (text.length > 50) {
    return 10;
  }
  else if (text.length > 30) {
    return 15;
  }
  else if (text.length > 15) {
    return 25;
  }
  else {
    return 40;
  }
}

/**
 * Retrieves a bunch of messages and actions.
 */
function getMessages() {
  var data = {
    0: {
      "messages": ["hello"],
      "actions": [
        {"key": "response-x", "text": "oll"},
        {"key": "response-y", "text": "loip"}
      ]
    },
    1: {
      "messages": ["bye"]
    },
    "response-x": {
      "messages": ["awesome"],
      "actions": [
        {"key": 1, "text": "biep"}
      ]
    },
    "response-y": {
      "messages": ["Hi! How are you?", "I’m Bram ten Hove, a web developer living in Hengelo, the Netherlands.", "blap"],
      "actions": [
        {"key": 0, "text": "bsas"},
        {"key": 1, "text": "oi oi"}
      ]
    }
  };

  return data;
}

/**
 * Retrieve a message by ID.
 *
 * @param id
 *   The id of the message.
 */
function getMessageById(id) {
  var messages = getMessages();

  // If we have an ID and it is known in the messages, return it.
  if (id && (id in messages)) {
    return messages[id];
  }

  return null;
}

/**
 * Display a message on the screen.
 *
 * @param text
 *   The text to display.
 * @param visitor
 *   Boolean indicating if the message is from the visitor or not.
 * @param charDelay
 *   The delay in milliseconds before each character should be displayed.
 * @param delay
 *   The delay in milliseconds before the next string should be shown.
 */
function displayMessage(text, visitor, charDelay, delay) {
  // Chat container.
  var chat = document.querySelector('#chat .messages');

  var classes = '';
  var displayText = '...';
  // Create the message object.
  var message = document.createElement('div');
  addClass(message, 'columns');

  // If it is an text by the visitor, add some more classes.
  if (visitor) {
    addClass(message, 'is-clearfix');
    classes = ' visitor is-pulled-right';
    displayText = text;
  }

  // The HTML containing the text to display.
  message.innerHTML = '<div class="column">' +
    '<article class="message' + classes + '">' +
    '<div class="message-body">' +
    displayText +
    '</div>' +
    '</article>' +
    '</div>';

  if (!visitor) {
    setTimeout(function () {
      chat.appendChild(message);
    }, delay - textIndicatorTime);

    setTimeout(function () {
      // Add typewriter effect on the body text.
      typeWriter(message.querySelector('.message-body'), text, charDelay, 0);
    }, delay);
  }
  else {
    chat.appendChild(message);
  }
}

/**
 * Adds a typewriter effect to a string of text.
 *
 * @param el
 *   The element to add the effect to.
 * @param text
 *   The string that is to be typed.
 * @param delay
 *   The delay in milliseconds before each character should be displayed.
 * @param n
 *   The position of the character to display.
 */
function typeWriter(el, text, delay, n) {
  if (n < (text.length)) {
    el.innerHTML = text.substring(0, n+1);
    n++;
    // Add the delay.
    setTimeout(function() {
      typeWriter(el, text, delay, n)
    }, delay);
  }
}

/**
 * Display an action in the chat.
 *
 * @param text
 *   The text in the the action button.
 * @param id
 *   The ID to add as data attribute.
 */
function displayAction(text, id) {
  // Chat responses container.
  var chat = document.querySelector('#chat .responses .column');

  // Create the action object.
  var action = document.createElement('a');
  action.innerHTML = text;
  addClass(action, 'button');
  addClass(action, 'is-primary');
  action.setAttribute('data-response', id);

  chat.appendChild(action);
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

// In case the document is already rendered.
if (document.readyState!='loading') main();
// For modern browsers.
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', main);
// IE <= 8.
else document.attachEvent('onreadystatechange', function(){
  if (document.readyState=='complete') main();
});