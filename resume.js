var className = document.location.pathname.split("/")[1];
var lessonId = document.location.search.split("=")[1];
var videos = document.getElementsByTagName("video");


var updateOffset = function(port, video) {
  var offset = video.currentTime;
  port.postMessage({
      "type": "update",
      "className": className,
      "lessonId": lessonId,
      "offset": offset});
}


var updatePlayer = function(video, offset) {
  setTimeout(function() { video.currentTime = offset; }, 0);
};


var init = function(video) {
  var port = chrome.runtime.connect({name: "coursera_resume"});

  port.onMessage.addListener(function(msg) {
    if (msg["offset"]) {
      updatePlayer(video, msg["offset"]);
    }
  });

  video.addEventListener("seeked", function(e) {
      updateOffset(port, video);
  });

  video.addEventListener("loadedmetadata", function(e) {
      // request offset from background page
      port.postMessage({
          "type": "data",
          "className": className,
          "lessonId": lessonId});

      // start checking video tag for updates and save new offsets
      setInterval(function() { updateOffset(port, video); }, 5000);
  });
};


if (videos.length > 0) {
  init(videos[0]);
}
