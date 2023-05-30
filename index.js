// This is the index page
document.getElementById("ComputerVs").addEventListener("click", function() {
    localStorage.setItem("gameMode", "computer");
  });
  
  document.getElementById("UserVs").addEventListener("click", function() {
    localStorage.setItem("gameMode", "user");
  });
  
  document.getElementById("game-log").addEventListener("click", function() {
    window.location.href = "game-log.html";
  });
  