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
  for(var i = 0; i < images.length; i++) {
    if(images[i].name.indexOf(query.toLowerCase()) !== -1) {
      images[i].element.style.display = "block";
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

// GLOBAL VARS

var immediately_loaded = document.createElement("div");
immediately_loaded.className = "emojis";

var remaining = document.createElement("div");
remaining.className = "emojis";

// Fill only the first 100 images.
// This improves the load time of the popup
load_images(0, 100, immediately_loaded);

var current_index = undefined;
var emojis, shortcode_label, search;

// EVENT HANDLERS

window.onload = function() {
  emojis = document.getElementById("emojis");
  shortcode_label = document.getElementById("shortcode_label");

  // Add the 100 first images
  emojis.appendChild(immediately_loaded);

  // Add the rest of the images
  load_images(100, images.length - 100, remaining);
  emojis.appendChild(remaining);

  // Setup shortcode highlight on hover
  images.forEach(function(image) {
    image.element.onmouseover = function() {
      set_shortcode_label(image.name);
    }
  });

  // Setup search
  search = document.getElementById("search");
  search.onkeyup = function() {
    filter_emojis(search.value);
  };

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

  function move_highlight(i) {
    if (current_index === undefined) {
      current_index = 0;
    } else {
      images[current_index].element.className = "emoji";
      current_index += i;
    }

    if (current_index < 0) {
      current_index = 0;
    }

    if (current_index > images.length - 1) {
      current_index = images.length - 1;
    }

    images[current_index].element.className = "emoji highlight";
    set_shortcode_label(images[current_index].name);
  }

  document.onkeydown = function(e) {
    if (e.keyCode == 13) { // enter
      select_and_close(images[current_index]);
    }

    if (e.keyCode == 37) { // left arrow
      move_highlight(-1);
    }

    if (e.keyCode == 38) { // up arrow
      move_highlight(-10);
    }

    if (e.keyCode == 39) { // right arrow
      move_highlight(1);
    }

    if (e.keyCode == 40) { // down arrow
      move_highlight(10);
    }
  }
};
