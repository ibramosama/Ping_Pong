// This is the game log page

document.querySelector(".button").addEventListener("click", function() {
    window.location.href = "index.html";
  });
  
  // Retrieve data from local storage and display it
  window.addEventListener("DOMContentLoaded", function() {
    const gameLogContainer = document.createElement("div");
    gameLogContainer.classList.add("game-log-container");
    document.body.appendChild(gameLogContainer);
    
    const totalWinnings = JSON.parse(localStorage.getItem("totalWinnings"));
    
    if (totalWinnings) {
      const totalWinningsHeading = document.createElement("h2");
      totalWinningsHeading.textContent = "Total number of winnings";
      gameLogContainer.appendChild(totalWinningsHeading);
      
      Object.keys(totalWinnings).forEach(function(playerName) {
        const playerScore = totalWinnings[playerName];
        const playerScoreParagraph = document.createElement("p");
        playerScoreParagraph.textContent = playerName + ": " + playerScore;
        gameLogContainer.appendChild(playerScoreParagraph);
      });
    }
  });
  