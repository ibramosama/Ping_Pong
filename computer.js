// This is the second page (Computer vs)
document.querySelector("#Player1").addEventListener("input", function(event) {
  localStorage.setItem("player1Name", event.target.value);
});

document.querySelector(".select").addEventListener("change", function(event) {
  localStorage.setItem("player1Color", event.target.value);
});

document.getElementById("back-button").addEventListener("click", function() {
  window.location.href = "index.html";
});

document.getElementById("start-button").addEventListener("click", function() {
  // Save the color before redirecting to the next page
  localStorage.setItem("player1Color", document.querySelector(".select").value);
  window.location.href = "game.html";
});
