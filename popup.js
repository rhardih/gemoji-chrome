// UTILITY FUNCTIONS

/**
 * Creates dom nodes with required classes
 * for all emojis in the sprite sheet.
 */
function add_dom_nodes(target) {
  var node;

  emojis.forEach(function(emoji) {
    node = document.createElement("div");
    node.className = "emoji emoji-" + emoji.name;
    emoji.element = node;

    attach_listeners(emoji);

    target.appendChild(node);
  });
};

function attach_listeners(emoji) {
  // Setup setting of shortcode_label on hover
  // as well as highlight
  emoji.element.onmouseover = function() {
    if (mouseover_enabled) {
      move_highlight_to(emoji);
    }
  }

  // Setup handler for clicking on emojis
  emoji.element.onclick = function() {
    select_and_close(emoji);
  }
};

/**
 * Runs through all the emoji and filters
 * out those that do not match <query>.
 */
function filter_emojis(query) {
  filtered_emojis = [];
  emojis.forEach(function(emoji) {
    var name = emoji_name_map[emoji.name] || emoji.name;
    if(name.indexOf(query.toLowerCase()) !== -1) {
      emoji.element.style.display = "block";
      filtered_emojis.push(emoji);
    } else {
      emoji.element.style.display = "none";
    }
  });
};

/**
 * Signals the content script that <image>
 * has been selected and closes the popup.
 */
function select_and_close(image) {
  var name = emoji_name_map[image.name] || image.name;
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { message: ":" + name + ":" });
  });
  self.close();
}

/**
 * Updates the content of the shortcode
 * label to <name>
 */
function set_shortcode_label(name) {
  shortcode_label.innerText = ":" + name + ":";
}

/**
 * Removes highlight from previously highlighted emoji
 * and adds it to the one present at <image>
 */
function move_highlight_to(image) {
  unhighlight(currently_highlighted);
  currently_highlighted = image;
  highlight(image);
}

/**
 * Adds the class "highlight" to the dom element
 * of <image>.
 *
 * Also updates the shortcode label with the
 * name of the image.
 */
function highlight(image) {
  var cn, name;
  if (image) {
    cn = ["emoji", "emoji-" + image.name, "highlight"].join(" ");
    image.element.className = cn;
    name = emoji_name_map[image.name] || image.name;
    set_shortcode_label(name);
  }
}

/**
 * Removes the class "highlight" from the dom
 * element of <image>.
 */
function unhighlight(image) {
  var cn;
  if (image) {
    cn = ["emoji", "emoji-" + image.name].join(" ");
    image.element.className = cn;
  }
}

// GLOBAL VARS
var emojis, shortcode_label, search;

var filtered_emojis = emojis;

var currently_highlighted = undefined;
var keyboard_navigation_enabled = false;
var mouseover_enabled = true;

var emoji_name_map = {
  "plusone": "+1",
  "minusone": "-1",
  "onehundred": "100",
  "onetwothreefour": "1234",
  "eightball": "8ball"
}

// EVENT HANDLERS

window.onload = function() {
  emojis = document.getElementById("emojis");
  shortcode_label = document.getElementById("shortcode_label");

  // Setup search
  search = document.getElementById("search");
  search.onkeyup = function(e) {
    filter_emojis(search.value);
  };

  search.onblur = function(e) {
    keyboard_navigation_enabled = true;
    move_highlight_to(filtered_emojis[0]);
  }

  search.onfocus = function() {
    keyboard_navigation_enabled = false;
    unhighlight(currently_highlighted);
  }

  // Handle clicking the "x" to cancel current search
  search.onclick = function() {
    if(search.value === "") {
      filter_emojis("");
    }
  }

  var emojis = document.createElement("div");
  emojis.id = "emojis";

  add_dom_nodes(emojis);

  var body = document.querySelector("body");
  body.style.width = 300 + getScrollbarWidth() + "px";

  body.appendChild(emojis);
}

function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.body.appendChild(outer);

  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  var widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}

document.onkeydown = function(e) {
  if (keyboard_navigation_enabled) {
    var currently_highlighted_index = filtered_emojis.indexOf(currently_highlighted);
    var offset;

    switch(e.keyCode) {
      case 13: // enter
        select_and_close(currently_highlighted);
        break;
      case 37: // left arrow
        offset = -1;
        break;
      case 38: // up arrow
        offset = -10;
        break;
      case 39: // right arrow
        offset = 1;
        break;
      case 40: // down arrow
        offset = 10;
        break;
      default:
        return;
    }

    var new_index = currently_highlighted_index + offset;

    if (new_index < 0) {
      new_index = 0;
    }

    if (new_index > filtered_emojis.length - 1) {
      new_index = filtered_emojis.length - 1;
    }

    var image = filtered_emojis[new_index];
    move_highlight_to(image);

    // If the mouse pointer is hovered over the popup when
    // scrollIntoView is called, an undesired mouseover event
    // is fired, which negates the scroll.
    //
    // Setting mouseover_enabled to false until next mouse movement
    // solves this problem.
    mouseover_enabled = false;

    // Webkit specific. Works like scrollIntoView, with the important
    // difference of not realigning if already inside current viewport.
    image.element.scrollIntoViewIfNeeded(false);

    // Prevents undesired arrow key scrolling when tabbing
    // out of the search input onto the first image.
    e.preventDefault();
  }
}

document.onmousemove = function() {
  keyboard_navigation_enabled = true;
  mouseover_enabled = true;
}
