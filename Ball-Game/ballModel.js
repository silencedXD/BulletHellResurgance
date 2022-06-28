'use strict';

class ballModel {
    constructor(canvasLength) {
        this.holes = [  //Contains all hole coordinates
            2.5,2.5];  //The last pair are for the goal hole

        this.lines = [
            0, 5, 5, 5,
            5, 0, 5, 5,
            0, 0, 5, 0,
            0, 0, 0, 5,];  //Contains all the line coordinates

        if (isNaN(localStorage.finishTime)){
            localStorage.finishTime = 100;
            localStorage.ballScore = 0;
        }

        this.playerRadius = canvasLength / 50;
        this.playerStartX = this.playerRadius * 10;
        this.playerStartY = this.playerRadius * 10;
        this.playerX = this.playerStartX;
        this.playerY = this.playerStartY;
        this.playerRotation = 0;
        this.rotationFactor = 3;
        this.playerMomentum = 0;
        this.moveFactor = this.playerRadius /10;
        this.currentSpeed = 0;
        this.maxSpeed = Math.round(this.playerRadius * 0.4 * 1000)/1000; //Rounded to 4sf
        this.decayRate = this.playerRadius / 25;

        //The functions for turning and moving forwards and backwards have been decoupled from keyDown event handlers
        //This is so the same functions can be mapped to keys as well as to button presses to facilitate cross-platform support

        this.turnLeft = () => {
            if (this.playerRotation > this.rotationFactor)
            {
                this.playerRotation -= this.rotationFactor;
            }
            else {
                this.playerRotation = 360 + this.playerRotation - this.rotationFactor;
            }
            console.log("Rotation: "+this.playerRotation);
        };

        this.turnRight = () => {
            if (this.playerRotation < 360 - this.rotationFactor)
            {
                this.playerRotation += this.rotationFactor;
            }
            else {
                this.playerRotation = this.playerRotation + this.rotationFactor - 360;
            }
            console.log("Rotation: "+this.playerRotation);
        };

        this.pushUp = () => {
            this.playerMomentum = 1;
        };

        this.pushDown = () => {
            this.playerMomentum = -1;
        };


        this.handleKeyDown = (event) => {
            this.keys = (this.keys || []);
            this.keys[event.keyCode] = true;
        };
        this.handleKeyUp = (event) => {
            this.keys[event.keyCode] = false;
            if (event.keyCode === 87 || event.keyCode === 83){
                this.playerMomentum = 0;
            }
        };
        this.handleUp = () => {
            console.log("Up button Pressed!");
            this.pushUp();
        };
        this.handleDown = () => {
            console.log("Down button Pressed!");
            this.pushDown();
        };
        this.handleLeft = () => {
            console.log("Left button Pressed!");
            this.turnLeft();
        };
        this.handleRight = () => {
            console.log("Right button Pressed!");
            this.turnRight();
        };
        this.buttonReleaseX = () => {
            console.log("ButtonX released");
        };
        this.buttonReleaseY = () => {
            console.log("ButtonY released");
        };
    }

    getLines(){
        return this.lines;
    }

    getHoles(){
        return this.holes;
    }

    getBallX(){
        return this.playerX;
    }

    getBallY(){
        return this.playerY;
    }

    getBallR(){
        return this.playerRotation;
    }

    getSpeed(){
        return this.currentSpeed;
    }

    getMomentum(){
        return this.playerMomentum;
    }

    checkCollisions(view){
        //Two circles are intersecting if the distance between their centre points is less than the sum of their radii
        //I've reduced the hitbox size by using slightly less than the sum of the radii
        /*let distance_from_goal = Math.sqrt((this.playerX - view.getBlockUnit() * this.holes[this.holes.length-2]) * (this.playerX - view.getBlockUnit() * this.holes[this.holes.length-2]) + (this.playerY - view.getBlockUnit() * this.holes[this.holes.length-1]) * (this.playerY - view.getBlockUnit() * this.holes[this.holes.length-1]));
        if (distance_from_goal <= (this.playerRadius + view.getHoleRadius())) {
            let d = new Date();
            localStorage.finishTime = Math.round(d.getTime() / 1000) - this.startTime;

            if (localStorage.finishTime > 99){
                localStorage.ballScore = 0;
            }
            else if (localStorage.finishTime > 25){
                localStorage.ballScore = 25;
            }
            else if (localStorage.finishTime > 20){
                localStorage.ballScore = 50;
            }
            else if (localStorage.finishTime > 15){
                localStorage.ballScore = 75;
            }
            else if (localStorage.finishTime < 15){
                localStorage.ballScore = 100;
            }

            view.goTo("ballWin.html");
        }*/


        for (let i = 0; i < this.lines.length; i += 4) {
            if (this.checkWallCollision(this.lines[i] * view.getBlockUnit(), this.lines[i + 1] * view.getBlockUnit(), this.lines[i + 2] * view.getBlockUnit(), this.lines[i + 3] * view.getBlockUnit())) {
                let xDif = Math.abs(this.lines[i] - this.lines[i + 2]);
                let yDif = Math.abs(this.lines[i + 1] - this.lines[i + 3]);
                if (xDif < yDif) {
                    let test = this.lines[i];
                    let test1 = test * view.getBlockUnit();
                    if (test1 < this.playerX) {
                        this.playerX = this.playerRadius * 50 - this.playerRadius * 1.1;      //Moves car from left side to the right side
                    } else {
                        this.playerX = this.playerRadius * 1.1;                             //Moves car from right side to the left side
                    }
                } else {
                    if (this.lines[i + 1] * view.getBlockUnit() < this.playerY) {
                        this.playerY = this.playerRadius * 50 - this.playerRadius * 1.1;      //Moves car from top side to the bottom side
                    } else {
                        this.playerY = this.playerRadius * 1.1;                             //Moves car from bottom side to the top side
                    }
                }
            }
        }

        //Original source for checking if two circles intersect
        //http://jeffreythompson.org/collision-detection/circle-circle.php
        //This function has been derived from the sources mentioned above however the none maths bits are original

        for (let i = 0; i < this.holes.length-2; i += 2) {
            let holeX = this.holes[i] * view.getBlockUnit();
            let holeY = this.holes[i + 1] * view.getBlockUnit();
            let distance_between_centres = Math.sqrt((this.playerX - holeX) * (this.playerX - holeX) + (this.playerY - holeY) * (this.playerY - holeY));
            let sum_of_radii = this.playerRadius + view.getHoleRadius();
            if (distance_between_centres <= sum_of_radii) {
                view.goTo("ballGame.html");
            }
        }
    }

    checkWallCollision(x1, y1, x2, y2){
        //Original sources for point/line intersection, point/circle intersection and line/circle intersection
        //https://www.jeffreythompson.org/collision-detection/line-point.php
        //https://www.jeffreythompson.org/collision-detection/line-circle.php
        //https://www.jeffreythompson.org/collision-detection/line-circle.php
        //This function has been derived from the sources mentioned above


        if (this.distanceOf(this.playerX, this.playerY, x1, y1) <= this.playerRadius || this.distanceOf(this.playerX, this.playerY, x2, y2) <= this.playerRadius) {
            return true;
        }

        let lineLength = this.distanceOf(x1, y1, x2, y2);
        let dot = ((this.playerX - x1) * (x2 - x1) + (this.playerY - y1) * (y2 - y1)) / (lineLength * lineLength);

        let closestX = x1 + (dot * (x2 - x1));
        let closestY = y1 + (dot * (y2 - y1));
        let distAB = this.distanceOf(closestX, closestY, x1, y1);
        let distAC = this.distanceOf(closestX, closestY, x2, y2);

        if (!((distAB + distAC) >= lineLength - 0.1 && (distAB + distAC) <= lineLength + 0.1)) {
            return false;
        }

        let closestDistance = Math.sqrt((this.playerX - closestX) * (this.playerX - closestX) + (this.playerY - closestY) * (this.playerY - closestY));
        if (closestDistance <= this.playerRadius) {
            return true;
        } else {
            return false;
        }
    }

    distanceOf(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    checkMovement(){
        let zeroAtValue = 20;       //Value for determining when to turn tiny floating points to 0 to ensure car gets to an eventual stop

        if (Math.abs(this.currentSpeed) < this.maxSpeed) {
            this.currentSpeed += this.playerMomentum * this.moveFactor;
            if (this.currentSpeed > this.maxSpeed){
                this.currentSpeed = this.maxSpeed;
            }
            if (this.currentSpeed < -this.maxSpeed){
                this.currentSpeed = -this.maxSpeed;
            }
        }

        if (Math.abs(this.currentSpeed) >= this.maxSpeed/zeroAtValue) {
            this.playerX += this.currentSpeed * Math.cos(Math.PI / 180 * (this.playerRotation - 90));
            this.playerY += this.currentSpeed * Math.sin(Math.PI / 180 * (this.playerRotation - 90));
            if (this.currentSpeed > 0) {
                this.currentSpeed -= this.decayRate;
            } else {
                this.currentSpeed += this.decayRate;
            }
        }
        else{
            this.currentSpeed = 0;
        }
    }

    checkKeyInputs(){
        if (this.keys && this.keys[87]) {
            console.log("W pressed!");
            this.pushUp();
        }
        if (this.keys && this.keys[83]) {
            console.log("S pressed!");
            this.pushDown();
        }
        if (this.keys && this.keys[65]) {
            console.log("A pressed!");
            this.turnLeft();
        }
        if (this.keys && this.keys[68]) {
            console.log("D pressed!");
            this.turnRight();
        }
    }

    checkOutOfBounds(){
        if (this.playerX < -10){
            this.playerX = this.playerRadius * 50 - this.playerRadius * 1.1;
        }
        if (this.playerY < -10){
            this.playerY = this.playerRadius * 50 - this.playerRadius * 1.1;
        }
        if (this.playerX > view.getCanvasLength() + 10){
            this.playerX = this.playerRadius * 1.1;
        }
        if (this.playerY > view.getCanvasLength() + 10){
            this.playerY = this.playerRadius * 1.1;
        }
    }
}
