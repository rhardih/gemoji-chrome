/**
 * Loads <count> images from the globale images
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

var immediately_loaded = document.createElement("div");
immediately_loaded.className = "emojis";

var remaining = document.createElement("div");
remaining.className = "emojis";

// Fill only the first 100 images.
// This improves the load time of the popup
load_images(0, 100, immediately_loaded);

window.onload = function() {
  var emojis = document.getElementById("emojis");
  var highlight = document.getElementById("highlight");

  // Add the 100 first images
  emojis.appendChild(immediately_loaded);

  // Add the rest of the images
  load_images(100, images.length - 100, remaining);
  emojis.appendChild(remaining);

  // Setup shortcode highlight on hover
  images.forEach(function(image) {
    image.element.onmouseover = function() {
      highlight.innerText = ":" + image.name + ":";
    }
  });

  // Setup search
  var search = document.getElementById("search");
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
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, { message: ":" + image.name + ":" });
      });
      self.close();
    }
  });
};

