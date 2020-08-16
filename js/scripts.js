class Tracker {
  /* 
  constructor queries DOM for areas that will have content dynaimcally generated,
  initilizes properties for game tracking, and adds event handlers
  */
  constructor() {
    this.door1 = document.querySelector("#door1");
    this.door2 = document.querySelector("#door2");
    this.door3 = document.querySelector("#door3");
    this.doorPrize_door1 = document.querySelector("#door-prize-door1");
    this.doorPrize_door2 = document.querySelector("#door-prize-door2");
    this.doorPrize_door3 = document.querySelector("#door-prize-door3");
    this.partTwoArea = document.querySelector("#part-two-area");
    this.resultText = document.querySelector("#result-text");
    this.resultsTable = document.querySelector("#results");
    this.moreInfo = document.querySelector("#more-info");
    this.gameButton = document.querySelector("#game-button");
    this.resultsButton = document.querySelector("#results-button");
    this.infoButton = document.querySelector("#icon");
    this.resultsOverlay = document.querySelector("#results-table-overlay");
    this.moreInfoOverlay = document.querySelector("#more-info-overlay");
    this.closeOverlayButton = document.querySelector("#close-overlay-button");
    this.statGamesWonStay = document.querySelector("#games-won-stay");
    this.statGamesStayAttempted = document.querySelector("#games-stay-attempted");
    this.statGamesStaySuccessRate = document.querySelector("#games-stay-success-rate");
    this.statGamesWonAltered = document.querySelector("#games-won-altered");
    this.statGamesAlteredAttempted = document.querySelector("#games-altered-attempted");
    this.statGamesAlteredSuccessRate = document.querySelector("#games-altered-success-rate");
    this.statTotalGames = document.querySelector("#total-games");
    this.statTotalWins = document.querySelector("#total-wins");
    this.statTotalLosses = document.querySelector("#total-losses");
    this.countGamesPlayed = 0;
    this.countWinsStay = 0;
    this.countStayAttempted = 0;
    this.countWinsAltered = 0;
    this.countAlteredAttempted = 0;
    this.countTotalWins = 0;
    this.countTotalLosses = 0;
    this.isAltered = false;
    this.gameSequence = 1;
    this.initialSelection = null;
    this.setWinningDoor();
    this.events();
    window.addEventListener("resize", this.hideResultsOverlayOnResize.bind(this));
  }

  //event handlers
  events() {
    this.door1.onclick = this.onDoorClick.bind(this);
    this.door2.onclick = this.onDoorClick.bind(this);
    this.door3.onclick = this.onDoorClick.bind(this);
    this.closeOverlayButton.onclick = this.onCloseOverlay.bind(this);
    this.resultsButton.onclick = this.showResultsMobile.bind(this);
    this.infoButton.onclick = this.showMoreInfo.bind(this);
  }

  //methods
  getRandomDoorId() {
    let min = 1;
    let max = 3;
    let myInt = Math.floor(Math.random() * (max - min + 1)) + min;
    let doorId = "door" + myInt.toString();
    return doorId;
  }

  setWinningDoor() {
    let losingDoors = ["door1", "door2", "door3"];
    let strWinningDoorId = this.getRandomDoorId();
    let winningIndex = losingDoors.indexOf(strWinningDoorId);
    losingDoors.splice(winningIndex, 1);
    this[strWinningDoorId].classList.add("winner");
    //this['doorPrize_' + strWinningDoorId].innerHTML = 'grade';
    this[losingDoors[0]].classList.add("loser");
    //this['doorPrize_' + losingDoors[0]].innerHTML = 'sentiment_very_dissatisfied';
    this[losingDoors[1]].classList.add("loser");
    //this['doorPrize_' + losingDoors[1]].innerHTML = 'sentiment_very_dissatisfied';
  }

  onDoorClick(event) {
    //initially remove selected class from doors
    this.door1.classList.remove("selected");
    this.door2.classList.remove("selected");
    this.door3.classList.remove("selected");
    //add selected class to clicked door
    let id = event.currentTarget.id;
    let selectedDoor = this[id];
    selectedDoor.classList.add("selected");
    if (this.gameSequence <= 1) {
      this.initialSelection = selectedDoor;
      let strDoor;
      switch (id) {
        case "door1":
          strDoor = "Door #1";
          break;
        case "door2":
          strDoor = "Door #2";
          break;
        case "door3":
          strDoor = "Door #3";
          break;
        default:
          strDoor = null;
          break;
      }
      this.removeLosingDoor();
      this.partTwoArea.innerHTML = `<p class="part-two-text">Your initial selection was <span class="highlight">${strDoor}.</span><br><br>
                                We have now elimated one of the losing doors!<br><br>
                                <span class="highlight">You may change your selection now if you choose.</span><br><br>
                                Confirm below when ready to submit.</p>`;
      this.partTwoArea.classList.remove("hide");
      this.gameSequence++;
      this.gameButton.classList.remove("hide");
      this.gameButton.onclick = this.onSubmit.bind(this);
    }

    if (selectedDoor.id !== this.initialSelection.id) {
      this.isAltered = true;
    } else {
      this.isAltered = false;
    }
  }

  onSubmit() {
    //need to 'deactivate' doors on result screen -- don't want to override stylings of elimiated door
    this.door1.onclick = null;
    if (!this.door1.classList.contains("eliminated")) this.door1.classList.add("deactivated");
    this.door2.onclick = null;
    if (!this.door2.classList.contains("eliminated")) this.door2.classList.add("deactivated");
    this.door3.onclick = null;
    if (!this.door3.classList.contains("eliminated")) this.door3.classList.add("deactivated");

    if (this.isAltered === true) {
      this.countAlteredAttempted++;
    } else {
      this.countStayAttempted++;
    }
    this.partTwoArea.innerHTML = "";
    this.evaluateGame();
    this.updateStats();
  }

  removeLosingDoor() {
    let bValidator = false;
    while (!bValidator) {
      let doorId = this.getRandomDoorId();
      if (!this[doorId].classList.contains("winner") && !this[doorId].classList.contains("selected")) {
        this[doorId].classList.add("eliminated");
        this[doorId].classList.remove("loser");
        this[doorId].onclick = null;
        bValidator = true;
      }
    }
  }

  evaluateGame() {
    let arrDoors = [this.door1, this.door2, this.door3];
    let winningDoor = arrDoors.filter(function (door) {
      return door.classList.contains("winner");
    })[0];
    this["doorPrize_" + winningDoor.id].innerHTML = "grade"; //adds star icon
    if (winningDoor.classList.contains("selected") && this.isAltered === true) {
      this.countTotalWins++;
      this.countWinsAltered++;
      this.displayResultText(true);
    } else if (winningDoor.classList.contains("selected")) {
      this.countTotalWins++;
      this.countWinsStay++;
      this.displayResultText(true);
    } else {
      this.countTotalLosses++;
      this.displayResultText(false);
    }
    this.countGamesPlayed++;
  }

  displayResultText(isWinner) {
    let htmlText;
    if (isWinner) {
      htmlText = "<h2>Winner Winner Chicken Dinner!</h2>";
      this.gameButton.innerHTML = "Play Again!";
    } else {
      htmlText = "<h2>Sorry, not a winner this time.</h2>";
      this.gameButton.innerHTML = "Try Again";
    }
    this.resultText.innerHTML = htmlText;
    this.partTwoArea.classList.add("hide");
    this.resultText.classList.remove("hide");
    this.gameButton.onclick = this.reinitializeGame.bind(this);
    //document.querySelector('.btn-play-again').onclick = this.reinitializeGame.bind(this);
  }

  updateStats() {
    let rate =
      this.countStayAttempted !== 0
        ? parseFloat((this.countWinsStay / this.countStayAttempted) * 100)
            .toFixed(2)
            .toString() + " %"
        : "0.00 %";
    this.statGamesWonStay.innerHTML = this.countWinsStay;
    this.statGamesStayAttempted.innerHTML = this.countStayAttempted;
    this.statGamesStaySuccessRate.innerHTML = rate;

    rate =
      this.countAlteredAttempted !== 0
        ? parseFloat((this.countWinsAltered / this.countAlteredAttempted) * 100)
            .toFixed(2)
            .toString() + " %"
        : "0.00 %";
    this.statGamesWonAltered.innerHTML = this.countWinsAltered;
    this.statGamesAlteredAttempted.innerHTML = this.countAlteredAttempted;
    this.statGamesAlteredSuccessRate.innerHTML = rate;

    this.statTotalGames.innerHTML = this.countGamesPlayed;
    this.statTotalWins.innerHTML = this.countTotalWins;
    this.statTotalLosses.innerHTML = this.countTotalLosses;
  }

  reinitializeGame() {
    this.door1.classList.remove("winner", "loser", "selected", "eliminated", "deactivated");
    this.door1.onclick = this.onDoorClick.bind(this);
    this.doorPrize_door1.innerHTML = "";
    this.door2.classList.remove("winner", "loser", "selected", "eliminated", "deactivated");
    this.door2.onclick = this.onDoorClick.bind(this);
    this.doorPrize_door2.innerHTML = "";
    this.door3.classList.remove("winner", "loser", "selected", "eliminated", "deactivated");
    this.door3.onclick = this.onDoorClick.bind(this);
    this.doorPrize_door3.innerHTML = "";
    this.isAltered = false;
    this.setWinningDoor();
    this.resultText.innerHTML = "";
    this.resultText.classList.add("hide");
    this.gameButton.classList.add("hide");
    this.gameButton.onClick = null;
    this.gameButton.innerHTML = "Submit Choice";
    this.gameSequence = 1;
  }

  showResultsMobile() {
    this.resultsOverlay.classList.add("results-overlay-open");
    this.resultsTable.classList.remove("results-hidden");
    this.resultsTable.classList.add("overlay-open");
    this.closeOverlayButton.classList.remove("hide");
    this.closeOverlayButton.classList.add("mobile-overlay-open");
  }

  showMoreInfo() {
    this.moreInfoOverlay.classList.remove("hide");
    this.moreInfoOverlay.classList.add("more-info-overlay-open");
    this.closeOverlayButton.classList.remove("hide");
  }

  onCloseOverlay() {
    this.closeOverlayButton.classList.add("hide");
    if (this.closeOverlayButton.classList.contains("mobile-overlay-open")) this.closeOverlayButton.classList.remove("mobile-overlay-open");
    if (this.resultsOverlay.classList.contains("results-overlay-open")) this.resultsOverlay.classList.remove("results-overlay-open");
    if (!this.resultsTable.classList.contains("results-hidden")) this.resultsTable.classList.add("results-hidden");
    if (this.resultsTable.classList.contains("overlay-open")) this.resultsTable.classList.remove("overlay-open");
    if (!this.moreInfoOverlay.classList.contains("hide")) this.moreInfoOverlay.classList.add("hide");
    if (this.moreInfo.classList.contains("more-info-overlay-open")) this.moreInfoOverlay.classList.add("more-info-overlay-open");
  }

  hideResultsOverlayOnResize() {
    let width = window.innerWidth;
    if (innerWidth > 1024 && this.resultsOverlay.classList.contains("results-overlay-open")) {
      this.onCloseOverlay();
    }
  }
}

var tracker = new Tracker();
