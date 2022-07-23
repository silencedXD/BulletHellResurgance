'use strict';

const initialise = evt => {

    let view = new ballView();
    view.setupButtonHandler('replayBallGame', "click",() => {view.goTo("ballGame.html");});

    if (parseInt(localStorage.playerCurrentScore) >= parseInt(localStorage.playerHighScore)){
        localStorage.playerHighScore = localStorage.playerCurrentScore;
    }
    view.setContent("ballWinScreen",
        "Game Over <br>Your Highscore is: " + localStorage.playerHighScore+"<br>Your current is: " + localStorage.playerCurrentScore);
};

window.addEventListener("pageshow", initialise);