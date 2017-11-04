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

  // Start chat.
  setTimeout(function() {
    var cookie = getCookie('returns');
    // Visitor was here before, change opening.
    if (cookie) {
      // Get a random response.
      chatAction(getRandomInt(1,1));
    }
    else {
      // Set a cookie to indicate visitor was here before and start with
      // opening.
      setCookie('returns', true, 60);
      chatAction(0);
    }
  }, defaultStringDelay);
}

/**
 * Callback for clicks on visitor action button.
 *
 * @param {Element} el
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
  if (currentActions.length > 0) {
    for (var i = 0, len = currentActions.length; i < len; i++) {
      currentActions[i].remove();
    }
  }

  chatAction(response);
}

/**
 * Handles logic with regard to selecting messages.
 *
 * @param {number|string} response
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
          if (message.actions) {
            // Display any actions that are available.
            for (var i = 0, len = message.actions.length; i < len; i++) {
              displayAction(message.actions[i].text, message.actions[i].key);
            }
          }
        }, stringDelay - defaultStringDelay);
      }
    }
  }
}

/**
 * Determines the delay for each character is typed.
 *
 * @param {string} text
 *   A string with characters.
 * @returns {number}
 *   Delay in milliseconds.
 */
function determineCharDelay(text) {
  if (text.length > 80) {
    return 10;
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
 * Display a message on the screen.
 *
 * @param {string} text
 *   The text to display.
 * @param {boolean} visitor
 *   Boolean indicating if the message is from the visitor or not.
 * @param {number} charDelay
 *   The delay in milliseconds before each character should be displayed.
 * @param {number} delay
 *   The delay in milliseconds before the next string should be shown.
 *
 * @todo Add ability to use emoji's.
 * @todo Add ability to use links.
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
 * Display an action in the chat.
 *
 * @param {string} text
 *   The text in the the action button.
 * @param {number|string} id
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
 * Adds a typewriter effect to a string of text.
 *
 * @param {Element} el
 *   The element to add the effect to.
 * @param {string} text
 *   The string that is to be typed.
 * @param {number} delay
 *   The delay in milliseconds before each character should be displayed.
 * @param {number} n
 *   The position of the character to display.
 *
 * @todo make it so that HTML tags do not interfere with typewriter text.
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
 * Retrieve a message by ID.
 *
 * @param {number|string} id
 *   The id of the message.
 */
function getMessageById(id) {
  var messages = getMessages();

  // If we have an ID and it is known in the messages, return it.
  if (id != null && (id in messages)) {
    return messages[id];
  }

  return null;
}

/**
 * Retrieves a bunch of messages and actions.
 *
 * @returns {Object}
 *   A list of messages and actions keyed by response ID.
 */
function getMessages() {
  var data = {
    0: {
      "messages": [
        "Hi! How are you?",
        "I’m Bram ten Hove, a web developer living in Hengelo, the Netherlands.",
        "Want to know more or get in touch?"
      ],
      "actions": [
        {"key": 2, "text": "Tell me more!"},
        {"key": 3, "text": "Get in touch!"}
      ]
    },
    1: {
      "messages": [
        "Nice to see you again!",
        "Do you still want to know some more? Or get in touch?"
      ],
      "actions": [
        {"key": 2, "text": "Tell me some more"},
        {"key": 4, "text": "Get in touch!"}
      ]
    },
    2: {
      "messages": [
        "Cool!", "I've been building websites since I was still quite young. I liked it so much that I went to the university to learn more.",
        "Now that I am a professional web developer I focus my work on making sites useful and user-friendly."
      ],
      "actions": [
        {"key": 3, "text": "Do you have some examples?"}
      ]
    },
    3: {
      "messages": [
        "But of course.",
        "- <strong><a href=\"https://greenwire.greenpeace.org\" rel=\"nofollow\">Greenpeace Greenwire</a></strong> is an award winning international, multi-language community platform<br>" +
        "- <strong><a href=\"https://www.ben.nl\" rel=\"nofollow\">Ben</a></strong> is a well-known telecom provider in The Netherlands for which I've done most of the architecture<br>" +
        "- <strong><a href=\"https://www.getopensocial.com\" rel=\"nofollow\">Open Social</a></strong> is open-source community software, I'm part of its core team"
      ],
      "actions": [
        {"key": 4, "text": "Now what?"}
      ]
    },
    4: {
      "messages": [
        "Ok, let's talk! Send me a message at <a>hello@bramtenhove.nl</a>.",
        "If you want, you can also check out my <a href=\"https://github.com/bramtenhove\">GitHub</a> page."
      ]
    }
  };

  return data;
}

/**
 * Function to check if an element has a class.
 *
 * @param {Element} el
 *   The element to check.
 * @param {string} className
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
 * @param {Element} el
 *   The element to add the class to.
 * @param {string} className
 *   The class name to add to the element.
 */
function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += ' ' + className;
}

/**
 * Get cookie.
 *
 * @param {string} name
 *   Name of the cookie
 * @returns {Object|null}
 */
function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min
 *   Min number in range.
 * @param {number} max
 *   Max number in range.
 * @return {int}
 *   A random integer.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Set a cookie.
 *
 * @param {string} name
 *   Name of the cookie.
 * @param {*} value
 *   Contents of the cookie.
 * @param {number} days
 *   Number of days to keep the cookie.
 */
function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

/**
 * Live event binder.
 *
 * @param {string} selector
 *   The element to bind the event to.
 * @param {string} eventType
 *   The type of event.
 * @param {string} callback
 *   Handler for the event.
 * @param {string} context
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