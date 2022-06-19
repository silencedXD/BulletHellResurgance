'use strict';

const initialise = evt => {

    let view = new ballView();
    view.setupButtonHandler('homeButton', () => {view.goTo("../../index.html");});
    view.setupButtonHandler('replayBallGame', () => {view.goTo("ballGame.html");});
    view.setContent("ballWinScreen", "You win!<br>Your time was "+ localStorage.finishTime+"<br>Your score is "+localStorage.ballScore);
};

window.addEventListener("pageshow", initialise);