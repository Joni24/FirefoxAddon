var play_button = document.getElementById("play-button");
play_button.onclick = function() {
  self.port.emit("play");
}
 
var pause_button = document.getElementById("pause-button");
pause_button.onclick = function() {
  self.port.emit("pause");
}
 
var stop_button = document.getElementById("stop-button");
stop_button.onclick = function() {
  self.port.emit("stop");
}