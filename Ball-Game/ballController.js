'use strict';

/* global Model, View */

let model, view;

const initialise = evt => {

    let d = new Date();
    let startTime = Math.round(d.getTime() / 1000);

    view = new ballView();
    model = new ballModel(view.getCanvasLength());

    let currentPage = view.getCurrentPage().split('/');//This checks if the user is on the homepage
    let pageName = currentPage.pop();                         //Which only needs some buttons to be setup
    if (pageName === "ballGameHome.html") {
        view.setupButtonHandler('ballButton', () => {
            view.goTo("ballGame.html");
        });
    }
    else {
        view.setupButtonHandler('replayBallGame', () => {
            view.goTo("ballGame.html");
        });

        const displayTimeAndStats = function (startTime) {
            return function() {
                let d = new Date();
                view.setContent("onscreenconsole2","Time: " + (Math.round(d.getTime() / 1000) - startTime));
                view.setContent("statsScreen",
                    "X: " + model.getBallX()+ "   "+
                "Y: " + model.getBallY() + "<br>"+
                    "S X: " + model.getSpeedX() + "   " +
                    "S Y: " + model.getSpeedY() + "<br>"+
                    "A X: " + model.getAccelerationX() + "   " +
                    "A Y: " + model.getAccelerationY() + "<br>" +
                    "Momentum: " + model.getMomentum() + "   " +
                    "Rotation: " + model.getBallR()
                    );
            };
        };

        setInterval(displayTimeAndStats(startTime), 1);


        const gameLoop = function () {
            model.checkCollisions(view);
            model.checkKeyInputs();
            model.checkMovement();
            model.checkOutOfBounds();
            view.updateFrame(model.getBallX(), model.getBallY(), model.getBallR(), model.getLines(), model.getHoles());
        };

        view.setupEventHandler("keydown", model.handleKeyDown);
        view.setupEventHandler("keyup", model.handleKeyUp);


        view.setupButtonHandlerWithType("moveUpButton", "mousedown", model.handleUp);
        view.setupButtonHandlerWithType("moveUpButton", "touchstart", model.handleUp);
        view.setupButtonHandlerWithType("moveUpButton", "mouseup", model.buttonReleaseY);

        view.setupButtonHandlerWithType("moveDownButton", "mousedown", model.handleDown);
        view.setupButtonHandlerWithType("moveDownButton", "touchstart", model.handleDown);
        view.setupButtonHandlerWithType("moveDownButton", "mouseup", model.buttonReleaseY);

        view.setupButtonHandlerWithType("moveLeftButton", "mousedown", model.handleLeft);
        view.setupButtonHandlerWithType("moveLeftButton", "touchstart", model.handleLeft);
        view.setupButtonHandlerWithType("moveLeftButton", "mouseup", model.buttonReleaseX);

        view.setupButtonHandlerWithType("moveRightButton", "mousedown", model.handleRight);
        view.setupButtonHandlerWithType("moveRightButton", "touchstart", model.handleRight);
        view.setupButtonHandlerWithType("moveRightButton", "mouseup", model.buttonReleaseX);


        setInterval(gameLoop, 20);       //This checks for collisions and updates the screen at (roughly) 50 frames a second
    }
};

window.addEventListener("pageshow", initialise);

