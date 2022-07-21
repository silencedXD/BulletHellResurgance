'use strict';

/* global Model, View */

let model, view;

const initialise = evt => {

    let d = new Date();
    let startTime = Math.round(d.getTime() / 1000);         //Logs time at page load (converted from milliseconds to seconds)

    view = new ballView();
    model = new ballModel(view.getCanvasLength());              //The model object needs the view to be instantiated first as
                                                                //the view stores the canvas. The model needs to know the canvas size
                                                                //as it is used as a reference point for its calculations

    let currentPage = view.getCurrentPage().split('/');//This checks if the user is on the homepage
    let pageName = currentPage.pop();                         //Which only needs some buttons to be setup
    if (pageName === "ballGameHome.html") {
        view.setupButtonHandler('ballButton',"click", () => {
            view.goTo("ballGame.html");
        });
    }
    else {                                                      //Otherwise the game page is setup
        view.setupButtonHandler('replayBallGame',"click", () => {
            view.goTo("ballGame.html");
        });

        const displayTimeAndStats = function (startTime) {      //Dev tool which displays stats in realtime for debugging
            return function() {
                let d = new Date();
                let player1 = model.getPlayer();
                view.setContent("onscreenconsole2","Time: " + (Math.round(d.getTime() / 1000) - startTime)
                                    + "        Score: " + player1.getScore() + "     Lives: " + player1.getLives());
                view.setContent("statsScreen",
                    "X: " + player1.getX()+ "   "+
                    "Y: " + player1.getY() + "<br>"+
                    "Speed: " + player1.getSpeed() + "   " +
                    "Momentum: " + player1.getMomentum() + "   " +
                    "Rotation: " + player1.getRotation() + "   " +
                    "Max Speed: " + player1.getMaxSpeed()
                    );
            };
        };

        setInterval(displayTimeAndStats(startTime), 1);


        const gameLoop = function () {
            model.checkKeyInputs();
            model.checkMovement(model.getPlayer());
            model.checkSpawners();
            model.checkProjectiles();
            model.checkCollisions(view);
            view.updateFrame(model.getPlayer(), model.getLines(), model.getSpawners(), model.getProjectiles());
        };

        view.setupEventHandler("keydown", model.handleKeyDown);
        view.setupEventHandler("keyup", model.handleKeyUp);


        view.setupButtonHandler("moveUpButton", "mousedown", model.handleUp);
        view.setupButtonHandler("moveUpButton", "touchstart", model.handleUp);
        view.setupButtonHandler("moveUpButton", "mouseup", model.buttonReleaseY);

        view.setupButtonHandler("moveDownButton", "mousedown", model.handleDown);
        view.setupButtonHandler("moveDownButton", "touchstart", model.handleDown);
        view.setupButtonHandler("moveDownButton", "mouseup", model.buttonReleaseY);

        view.setupButtonHandler("moveLeftButton", "mousedown", model.handleLeft);
        view.setupButtonHandler("moveLeftButton", "touchstart", model.handleLeft);
        view.setupButtonHandler("moveLeftButton", "mouseup", model.buttonReleaseX);

        view.setupButtonHandler("moveRightButton", "mousedown", model.handleRight);
        view.setupButtonHandler("moveRightButton", "touchstart", model.handleRight);
        view.setupButtonHandler("moveRightButton", "mouseup", model.buttonReleaseX);


        setInterval(gameLoop, 20);       //This checks for collisions and updates the screen at (roughly) 50 frames a second
    }
};

window.addEventListener("pageshow", initialise);

