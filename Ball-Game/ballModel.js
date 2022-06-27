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

        let d = new Date();
        this.startTime = Math.round(d.getTime() / 1000);
        this.ballRadius = canvasLength / 50;
        this.ballStartX = this.ballRadius * 10;
        this.ballStartY = this.ballRadius * 10;
        this.ballX = this.ballStartX;
        this.ballY = this.ballStartY;
        this.ballRotation = 0;
        this.rotationFactor = 3;
        this.ballMomentum = 0;
        this.maxAcceleration = this.ballRadius * 0.2;
        this.moveFactor = this.maxAcceleration * 0.2;
        this.currentSpeed = 0;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ballAccelerationX = 0;
        this.ballAccelerationY = 0;
        this.maxSpeed = this.ballRadius * 0.4;
        this.decayRate = this.maxAcceleration / 10;

        this.pushLeft = () => {
            if (this.ballRotation > this.rotationFactor)
            {
                this.ballRotation -= this.rotationFactor;
            }
            else {
                this.ballRotation = 360 + this.ballRotation - this.rotationFactor;
            }
            console.log("Rotation: "+this.ballRotation);
        };

        this.pushRight = () => {
            if (this.ballRotation < 360 - this.rotationFactor)
            {
                this.ballRotation += this.rotationFactor;
            }
            else {
                this.ballRotation = this.ballRotation + this.rotationFactor - 360;
            }
            console.log("Rotation: "+this.ballRotation);
        };

        this.pushUp = () => {
            this.ballMomentum = 1;
        };

        this.pushDown = () => {
            this.ballMomentum = -1;
        };


        this.handleKeyDown = (event) => {
            this.keys = (this.keys || []);
            this.keys[event.keyCode] = true;
        };
        this.handleKeyUp = (event) => {
            this.keys[event.keyCode] = false;
            if (event.keyCode === 87 || event.keyCode === 83){
                this.ballMomentum = 0;
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
            this.pushLeft();
        };
        this.handleRight = () => {
            console.log("Right button Pressed!");
            this.pushRight();
        };
        this.buttonReleaseX = () => {
            console.log("ButtonX released");
        };
        this.buttonReleaseY = () => {
            console.log("ButtonY released");
        };



/*        this.handleDeviceOrientation = function (event) {

            let b = event.beta,
                g = event.gamma;

            if (g > 0) {
                if (model.ballX <= canvasLength - model.ballRadius) {
                    if (model.ballAccelerationX < model.maxAcceleration) {
                        model.ballAccelerationX += model.moveFactor;
                    }
                }
            } else {
                if (model.ballX > model.ballRadius) {
                    if (model.ballAccelerationX > -model.maxAcceleration) {
                        model.ballAccelerationX -= model.moveFactor;
                    }
                }
            }


            if (b > 0) {
                if (model.ballY <= canvasLength - model.ballRadius) {
                    if (model.ballAccelerationY < model.maxAcceleration) {
                        model.ballAccelerationY += model.moveFactor;
                    }
                }
            } else {
                if (model.ballY > model.ballRadius) {
                    if (model.ballAccelerationY > -model.maxAcceleration) {
                        model.ballAccelerationY -= model.moveFactor;
                    }
                }
            }
        };*/
    }

    getLines(){
        return this.lines;
    }

    getHoles(){
        return this.holes;
    }

    getBallX(){
        return this.ballX;
    }

    getBallY(){
        return this.ballY;
    }

    getBallR(){
        return this.ballRotation;
    }

    getSpeedX(){
        return this.ballSpeedX;
    }

    getSpeedY(){
        return this.ballSpeedY;
    }

    getAccelerationX(){
        return this.ballAccelerationX;
    }

    getAccelerationY(){
        return this.ballAccelerationY;
    }

    getMomentum(){
        return this.ballMomentum;
    }

    checkCollisions(view){
        //Two circles are intersecting if the distance between their centre points is less than the sum of their radii
        //I've reduced the hitbox size by using slightly less than the sum of the radii
        let distance_from_goal = Math.sqrt((this.ballX - view.getBlockUnit() * this.holes[this.holes.length-2]) * (this.ballX - view.getBlockUnit() * this.holes[this.holes.length-2]) + (this.ballY - view.getBlockUnit() * this.holes[this.holes.length-1]) * (this.ballY - view.getBlockUnit() * this.holes[this.holes.length-1]));
        /*if (distance_from_goal <= (this.ballRadius + view.getHoleRadius())) {
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
                    if (test1 < this.ballX) {
                        this.ballX = this.ballRadius * 50 - this.ballRadius * 1.1;      //Moves car from left side to the right side
                    } else {
                        this.ballX = this.ballRadius * 1.1;                             //Moves car from right side to the left side
                    }
                } else {
                    if (this.lines[i + 1] * view.getBlockUnit() < this.ballY) {
                        this.ballY = this.ballRadius * 50 - this.ballRadius * 1.1;      //Moves car from top side to the bottom side
                    } else {
                        this.ballY = this.ballRadius * 1.1;                             //Moves car from bottom side to the top side
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
            let distance_between_centres = Math.sqrt((this.ballX - holeX) * (this.ballX - holeX) + (this.ballY - holeY) * (this.ballY - holeY));
            let sum_of_radii = this.ballRadius + view.getHoleRadius();
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


        if (this.distanceOf(this.ballX, this.ballY, x1, y1) <= this.ballRadius || this.distanceOf(this.ballX, this.ballY, x2, y2) <= this.ballRadius) {
            return true;
        }

        let lineLength = this.distanceOf(x1, y1, x2, y2);
        let dot = ((this.ballX - x1) * (x2 - x1) + (this.ballY - y1) * (y2 - y1)) / (lineLength * lineLength);

        let closestX = x1 + (dot * (x2 - x1));
        let closestY = y1 + (dot * (y2 - y1));
        let distAB = this.distanceOf(closestX, closestY, x1, y1);
        let distAC = this.distanceOf(closestX, closestY, x2, y2);

        if (!((distAB + distAC) >= lineLength - 0.1 && (distAB + distAC) <= lineLength + 0.1)) {
            return false;
        }

        let closestDistance = Math.sqrt((this.ballX - closestX) * (this.ballX - closestX) + (this.ballY - closestY) * (this.ballY - closestY));
        if (closestDistance <= this.ballRadius) {
            return true;
        } else {
            return false;
        }
    }

    distanceOf(x1, y1, x2, y2){
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    checkMovement(){
/*
        if (Math.abs(this.ballAccelerationX) < this.maxAcceleration){
            this.ballAccelerationX += this.ballMomentum * this.moveFactor * Math.cos(Math.PI / 180 * (this.ballRotation - 90));
            if (this.ballAccelerationX > this.maxAcceleration){
                this.ballAccelerationX = this.maxAcceleration;
            }
            if (this.ballAccelerationX < -this.maxAcceleration){
                this.ballAccelerationX = -this.maxAcceleration;
            }
        }
        if (Math.abs(this.ballAccelerationY) < this.maxAcceleration) {
            this.ballAccelerationY += this.ballMomentum * this.moveFactor * Math.sin(Math.PI / 180 * (this.ballRotation - 90));
            if (this.ballAccelerationY > this.maxAcceleration){
                this.ballAccelerationY = this.maxAcceleration;
            }
            if (this.ballAccelerationY < -this.maxAcceleration){
                this.ballAccelerationY = -this.maxAcceleration;
            }
        }
*/

        let zeroAtValue = 20;       //Value for determining when to turn tiny floating points to 0 to ensure car gets to an eventual stop

        // if (Math.abs(this.ballAccelerationX) >= this.maxAcceleration/zeroAtValue) {
            if (Math.abs(this.currentSpeed) < this.maxSpeed) {
                this.currentSpeed += this.ballMomentum * this.moveFactor;
                if (this.currentSpeed > this.maxSpeed){
                    this.currentSpeed = this.maxSpeed;
                }
                if (this.currentSpeed < -this.maxSpeed){
                    this.currentSpeed = -this.maxSpeed;
                }
            }
        //     if (this.ballAccelerationX > 0) {
        //         this.ballAccelerationX -= this.decayRate;
        //     } else {
        //         this.ballAccelerationX += this.decayRate;
        //     }
        // }
        // else{
        //     this.ballAccelerationX = 0;
        // }

        // if (Math.abs(this.ballSpeedX) >= this.maxSpeed/zeroAtValue) {
        //     this.ballX += this.ballSpeedX;
        //     if (this.ballSpeedX > 0) {
        //         this.ballSpeedX -= this.decayRate;
        //     } else {
        //         this.ballSpeedX += this.decayRate;
        //     }
        // }
        // else{
        //     this.ballSpeedX = 0;
        // }

        // if (Math.abs(this.ballAccelerationY) >= this.maxAcceleration/zeroAtValue) {
        //     if (Math.abs(this.ballSpeedY) < this.maxSpeed) {
        //         this.ballSpeedY += this.ballMomentum * this.moveFactor;
        //         if (this.ballSpeedY > this.maxSpeed){
        //             this.ballSpeedY = this.maxSpeed;
        //         }
        //         if (this.ballSpeedY < -this.maxSpeed){
        //             this.ballSpeedY = -this.maxSpeed;
        //         }
        //     }
        //     if (this.ballAccelerationY > 0) {
        //         this.ballAccelerationY -= this.decayRate;
        //     } else {
        //         this.ballAccelerationY += this.decayRate;
        //     }
        // }
        // else{
        //     this.ballAccelerationY = 0;
        // }
        if (Math.abs(this.currentSpeed) >= this.maxSpeed/zeroAtValue) {
            this.ballX += this.currentSpeed * Math.cos(Math.PI / 180 * (this.ballRotation - 90));
            this.ballY += this.currentSpeed * Math.sin(Math.PI / 180 * (this.ballRotation - 90));
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
            this.pushLeft();
        }
        if (this.keys && this.keys[68]) {
            console.log("D pressed!");
            this.pushRight();
        }
    }

    checkOutOfBounds(){
        if (this.ballX < -10){
            this.ballX = this.ballRadius * 50 - this.ballRadius * 1.1;
        }
        if (this.ballY < -10){
            this.ballY = this.ballRadius * 50 - this.ballRadius * 1.1;
        }
        if (this.ballX > view.getCanvasLength() + 10){
            this.ballX = this.ballRadius * 1.1;
        }
        if (this.ballY > view.getCanvasLength() + 10){
            this.ballY = this.ballRadius * 1.1;
        }
    }

    resetCar(){
        this.ballX = this.ballStartX;
        this.ballY = this.ballStartY;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.ballAccelerationX = 0;
        this.ballAccelerationY = 0;
        this.ballMomentum = 0;
    }
}
