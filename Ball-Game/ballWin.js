'use strict';

const initialise = evt => {

    let view = new ballView();
    view.setupButtonHandler('replayBallGame', "click",() => {view.goTo("ballGame.html");});
    view.setContent("ballWinScreen", "You win!<br>Your time was "+ localStorage.finishTime+"<br>Your score is "+localStorage.ballScore);
};

window.addEventListener("pageshow", initialise);