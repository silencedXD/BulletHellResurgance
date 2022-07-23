'use strict';

const initialise = evt => {

    let view = new ballView();
    view.setupButtonHandler('replayBallGame', "click",() => {view.goTo("ballGame.html");});

    if (localStorage.playerCurrentScore >= localStorage.playerHighScore){
        localStorage.playerHighScore = localStorage.playerCurrentScore;
    }
    view.setContent("ballWinScreen",
        "Game Over <br>Your Highscore is: " + localStorage.playerHighScore+"<br>Your longest time is: " + localStorage.playerLongestTime);
};

window.addEventListener("pageshow", initialise);