/**
 * @file Manages the chat functionality for the site.
 * @author Bram ten Hove
 */

/**
 * Main function that gets fired upon successful loading of the DOM.
 */
function main() {
  // Bind an event handler to the action buttons for the visitor.
  addLiveEvent('#chat .responses a', 'click', function(event) {
    chatAction(event.target);
  });
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

  // Display the CTA in the chat.
  displayMessage(el.innerText, true);

  // Remove all actions in this set.
  var currentActions = document.querySelectorAll('#chat .responses a');
  for (var i = 0, len = currentActions.length; i < len; i++) {
    currentActions[i].remove();
  }

  // Find the message by the CTA key.
  var message = getMessageById(response);
  if (message) {
    // Display any messages we can find.
    for (var i = 0, len = message.messages.length; i < len; i++) {
      displayMessage(message.messages[i]);
    }

    // Display any actions that are available.
    for (var i = 0, len = message.actions.length; i < len; i++) {
      displayAction(message.actions[i].text, message.actions[i].key);
    }
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
      "messages": ["tralla", "blaaaat", "blap"],
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
 *   Boolean indicating if it is a message from the visitor.
 */
function displayMessage(text, visitor) {
  // Chat container.
  var chat = document.querySelector('#chat .messages');

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