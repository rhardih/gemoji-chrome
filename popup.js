// UTILITY FUNCTIONS

/**
 * Loads <count> images from the global images
 * array, starting at <offset> and inserts them
 * into the <target> element.
 */
function load_images(offset, count, target) {
  for(var i = offset; i < count + offset; i++) {
    var image_node = document.createElement("img");
    var name = images[i].name;
    image_node.src = "emoji/" + name + ".png";
    image_node.className = "emoji";

    images[i].element = image_node;
    target.appendChild(image_node);
  };
};

/**
 * Runs through all the emoji and filters
 * out those that do not match <query>.
 */
function filter_emojis(query) {
  filtered_images = [];
  for(var i = 0; i < images.length; i++) {
    if(images[i].name.indexOf(query.toLowerCase()) !== -1) {
      images[i].element.style.display = "block";
      filtered_images.push(images[i]);
    } else {
      images[i].element.style.display = "none";
    }
  };
};

/**
 * Signals the content script that <image>
 * has been selected and closes the popup.
 */
function select_and_close(image) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { message: ":" + image.name + ":" });
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
  if (image) {
    image.element.className = "emoji highlight";
    set_shortcode_label(image.name);
  }
}

/**
 * Removes the class "highlight" from the dom
 * element of <image>.
 */
function unhighlight(image) {
  if (image) {
    image.element.className = "emoji";
  }
}

// GLOBAL VARS

var immediately_loaded = document.createElement("div");
immediately_loaded.className = "emojis";

var remaining = document.createElement("div");
remaining.className = "emojis";

// Fill only the first 100 images.
// This improves the load time of the popup
load_images(0, 100, immediately_loaded);

var emojis, shortcode_label, search;

var filtered_images = images;

var currently_highlighted = undefined;
var keyboard_navigation_enabled = false;
var mouseover_enabled = true;

// EVENT HANDLERS

window.onload = function() {
  emojis = document.getElementById("emojis");
  shortcode_label = document.getElementById("shortcode_label");

  // Add the 100 first images
  emojis.appendChild(immediately_loaded);

  // Add the rest of the images
  load_images(100, images.length - 100, remaining);
  emojis.appendChild(remaining);

  // Setup setting of shortcode_label on hover
  images.forEach(function(image) {
    image.element.onmouseover = function() {
      if (mouseover_enabled) {
        move_highlight_to(image);
      }
    }
  });

  // Setup search
  search = document.getElementById("search");
  search.onkeyup = function(e) {
    filter_emojis(search.value);
  };

  search.onblur = function(e) {
    keyboard_navigation_enabled = true;
    move_highlight_to(filtered_images[0]);
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

  // Setup handler for clicking on emojis
  images.forEach(function(image) {
    image.element.onclick = function() {
      select_and_close(image);
    }
  });
}

document.onkeydown = function(e) {
  if (keyboard_navigation_enabled) {
    var currently_highlighted_index = filtered_images.indexOf(currently_highlighted);
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

    if (new_index > filtered_images.length - 1) {
      new_index = filtered_images.length - 1;
    }

    var image = filtered_images[new_index];
    move_highlight_to(image);

    // If the mouse pointer is hovered over the popup when
    // scrollIntoView is called, an undesired mouseover event
    // is fired, which negates the scroll.
    //
    // Setting mouseover_enabled to false until next mouse movement
    // solves this problem.
    mouseover_enabled = false;
    image.element.scrollIntoView(false);

    // Prevents undesired arrow key scrolling when tabbing
    // out of the search input onto the first image.
    e.preventDefault();
  }
}

document.onmousemove = function() {
  keyboard_navigation_enabled = true;
  mouseover_enabled = true;
}
