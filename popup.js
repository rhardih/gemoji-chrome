function create_emoji_div(image_name) {
  var image_node = document.createElement("img");
  image_node.src = "emoji/" + image_name;

  var div = document.createElement("div");
  div.className = "emoji";
  div.dataset.name = image_name.match(/(.*)\.[^.]+$/)[1];
  div.appendChild(image_node);

  var name_elm = document.getElementById("name");
  div.onmouseover = function() {
    name_elm.innerText = ":" + div.dataset.name + ":";
  }

  return div;
};

window.onload = function() {
  var emojis = document.getElementById("emojis");
  images.forEach(function(image) {
    emoji_div = create_emoji_div(image);
    emojis.appendChild(emoji_div);
  });

  var name = document.getElementById("name");

  var emoji_divs = emojis.getElementsByTagName("div");
  function filter_emojis(query) {
    console.log(query);
    var name, i, div;
    for (i = 0; i < emoji_divs.length; i++) {
      div = emoji_divs[i]; 
      name = div.dataset.name;
      if(name.indexOf(query.toLowerCase()) !== -1) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    }
  }

  var search = document.getElementById("search");
  search.onkeydown = function() {
    filter_emojis(search.value);
  };

  for (var i = 0; i < emoji_divs.length; i++) {
    emoji_divs[i].onclick = function() {
      var div = this;
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, { message: ":" + div.dataset.name + ":" });
      });
      self.close();
    }
  }

  search.onclick = function() {
    if(search.value === "") {
      filter_emojis("");
    }
  }
};

