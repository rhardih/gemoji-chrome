function insertTextIntoTextfield(string) {
  var textfield = document.activeElement;

  var caret_position = textfield.selectionStart;
  var new_caret_position = caret_position + string.length;
  var value = textfield.value;
  var value_before_caret = value.substring(0, caret_position);
  var value_after_caret = value.substring(caret_position, value.length);

  var new_value = value_before_caret + string + value_after_caret;
  textfield.value = new_value;

  textfield.selectionStart = new_caret_position;
  textfield.selectionEnd = new_caret_position;
  textfield.focus();
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    insertTextIntoTextfield(request.message);
  }
);
