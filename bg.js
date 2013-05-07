var extension_name = "coursera_resume";

if (!chrome.storage.local[extension_name]) {
  chrome.storage.local[extension_name] = {};
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == extension_name);
  port.onMessage.addListener(function(msg) {
    if (!chrome.storage.local[extension_name]) {
      chrome.storage.local[extension_name] = {};
    }
    if (!chrome.storage.local[extension_name][msg.className]) {
      chrome.storage.local[extension_name][msg.className] = {};
    }
    var store = chrome.storage.local[extension_name][msg.className];
    if (msg["type"] == "data") {
      port.postMessage({
          "offset": store[msg.lessonId]});
    } else {
      store[msg.lessonId] = msg.offset;
    }
  });
});
