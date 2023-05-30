// Get DOM elements
const player1NameInput = document.getElementById("Player1");
const paddle1ColorSelect = document.getElementById("Paddle1-color");
const player2NameInput = document.getElementById("Player2");
const paddle2ColorSelect = document.getElementById("Paddle2-color");
const startButton = document.getElementById("start-button");
const back_button = document.getElementById("back-button");
// Add event listener to the "Next" button
startButton.addEventListener("click", () => {
  // Get player names and paddle colors
  const player1Name = player1NameInput.value;
  const paddle1Color = paddle1ColorSelect.value;
  const player2Name = player2NameInput.value;
  const paddle2Color = paddle2ColorSelect.value;

  // Save player names and paddle colors to local storage
  localStorage.setItem("player1Name", player1Name);
  localStorage.setItem("player1Color", paddle1Color);
  localStorage.setItem("player2Name", player2Name);
  localStorage.setItem("player2Color", paddle2Color);

  // Redirect to the game page
  window.location.href = "game.html";

});
back_button.addEventListener("click",()=>{
  // Redirect to the main menu page
  window.location.href = "index.html";
})