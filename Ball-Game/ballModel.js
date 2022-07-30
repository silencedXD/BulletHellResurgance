'use strict';

class player{
    constructor(canvasLength) {
        this.playerLives = 3;
        this.canvasLength = canvasLength
        this.playerRadius = this.canvasLength / 100 * Math.sqrt(this.playerLives);
        this.playerStartX = this.playerRadius * 5;
        this.playerStartY = this.playerRadius * 5;
        this.playerX = this.playerStartX;
        this.playerY = this.playerStartY;
        this.playerRotation = 0;
        this.rotationFactor = 5;
        this.playerMomentum = 0;
        this.moveFactor = this.playerRadius / 10;
        this.currentSpeed = 0;
        this.maxSpeed = Math.round(this.playerRadius * 1000 / this.playerLives / 1.5)/1000; //Rounded to 4sf
        this.decayRate = this.playerRadius / 25;
        this.playerScore = 0;
        this.iFrames = 0;
        this.rotateFlag = 0;
        this.moveFlag = 0;
    }

    getLives(){return this.playerLives;}
    getX(){return this.playerX;}
    getY(){return this.playerY;}
    getRotation(){return this.playerRotation;}
    getRotationFactor(){return this.rotationFactor;}
    getMomentum(){return this.playerMomentum;}
    getMoveFactor(){return this.moveFactor;}
    getMaxSpeed(){return this.maxSpeed;}
    getDecayRate(){return this.decayRate;}
    getScore(){return this.playerScore;}
    getRadius(){return this.playerRadius;}
    isEnemy(){return false;}
    getSpeed(){return this.currentSpeed;}
    getMoveFlag(){return this.moveFlag;}
    getRotateFlag(){return this.rotateFlag;}

    setX(x){this.playerX = x;}
    setY(y){this.playerY = y;}
    setMomentum(m){this.playerMomentum = m;}
    takeDamage(){
        if(this.iFrames < 1){
            this.playerLives--;
            this.playerRadius = this.canvasLength / 100 * Math.sqrt(this.playerLives);
            this.maxSpeed = Math.round(this.playerRadius * 1000 / this.playerLives / 1.5) / 1000;  //Radius changes so speed changes
            this.iFrames = 15;
        }
    }
    move(){
        this.playerX += this.currentSpeed * Math.cos(Math.PI / 180 * (this.playerRotation - 90));
        this.playerY += this.currentSpeed * Math.sin(Math.PI / 180 * (this.playerRotation - 90));
    }
    decaySpeed(){
        if (this.currentSpeed > this.maxSpeed / 10) {
            this.currentSpeed -= this.decayRate;
        } else if (this.currentSpeed < -this.maxSpeed / 10){
            this.currentSpeed += this.decayRate;
        }
        else{
            this.currentSpeed = 0;
        }
    }
    updateSpeed(){
        this.currentSpeed += this.playerMomentum * this.moveFactor;
        if (this.currentSpeed > this.maxSpeed){
            this.currentSpeed = this.maxSpeed;
        }
        if (this.currentSpeed < -this.maxSpeed){
            this.currentSpeed = -this.maxSpeed;
        }
    }

    setSpeed(x){this.currentSpeed = x;}

    addPoint(){this.playerScore += 50 * this.playerLives;}

    rotateLeft(){
        if (this.playerRotation > this.rotationFactor)
        {
            this.playerRotation -= this.rotationFactor;
        }
        else {
            this.playerRotation = 360 + this.playerRotation - this.rotationFactor;
        }
    }

    rotateRight(){
        if (this.playerRotation < 360 - this.rotationFactor)
        {
            this.playerRotation += this.rotationFactor;
        }
        else {
            this.playerRotation = this.playerRotation + this.rotationFactor - 360;
        }
    }

    pushUp(){
        this.playerMomentum = 1;
    }

    pushDown(){
        this.playerMomentum = -1;
    }

    setMoveFlag(x){
        this.moveFlag = x;
    }

    setRotateFlag(x){
        this.rotateFlag = x;
    }
}


class spawner{                                  //The spawner uses the blockUnit coordinate system, this splits the canvas into a 5x5 grid
    constructor(x,y,r,projList,canvasLength) {  //This makes it easy to place a spawner in a specific spot on the screen regardless of resolution
        this.xPos = x;                          //However projectiles will use the exact coordinates like the player due to their movement
        this.yPos = y;                          //So we need to convert the blockUnit of the spawner to exact when creating new projectiles
        this.radius = r;
        this.spawnCounter = 0;
        this.spawnDelay = 30;       //Delay for regulating how often it spawns projectiles
        this.patterns = [
                        [0,90,180,270],                                //4 points 90 degrees apart starting at 0
                        [45,135,225,315],                              //4 points 90 degrees apart starting at 45
                        [0,45,90,135,180,225,270,315],                 //8 points 45 degrees apart starting at 0
                        [22,112,202,292],                              //4 points 90 degrees apart starting at 22
                        [67,157,247,337],                              //4 points 90 degrees apart starting at 67
                        [22,67,112,157,202,247,292,337],               //8 points 45 degrees apart starting at 22
                        [355,0,5,40,45,50,85,90,95,130,135,140,175,180,185,220,225,230,265,270,275,310,315,320],
                        //Wave of 3 each 45 degrees apart starting at 0
                        [350,355,0,5,10,35,40,45,50,55,80,85,90,95,100,125,130,135,140,145,170,175,180,185,190,215,220,225,230,235,260,265,270,275,280,305,310,315,320,325],
                        //Wave of 5 each 45 degrees apart starting at 0
                        [17,22,27,62,67,72,107,112,117,152,157,162,197,202,207,242,247,252,287,292,297,332,337,342],
                        //Wave of 3 each 45 degrees apart starting at 22
                        [12,17,22,27,32,57,62,67,72,77,102,107,112,117,122,147,152,157,162,167,192,197,202,207,212,237,242,247,252,257,282,287,292,297,302,327,332,337,342,347]
                        //Wave of 5 each 45 degrees apart starting at 22
        ];
        this.rotation = 0;
        this.currentPattern = [];
        this.projectiles = projList;
        this.blockUnit = canvasLength / 5;
        this.pointRate = 10;
    }
    //patterns: wiggle, wave,

    getX(){return this.xPos;}
    getY(){return this.yPos;}
    getRadius(){return this.radius;}
    getSpawnCounter(){return this.spawnCounter;}
    getSpawnDelay(){return this.spawnDelay;}
    isEnemy(){return true;}

    setX(x){this.xPos = x;}
    setY(y){this.yPos = y;}
    setRadius(r){this.radius = r;}
    setSpawnDelay(x){this.spawnDelay = x;}

    incrementSpawnCounter(){
        this.spawnCounter++;
        //console.log("Spawn counter: " + this.spawnCounter)
    }

    spawn(){
        this.spawnCounter = 0;
        this.chooseNewPattern();
        this.rotation += Math.floor(Math.random() * 3 - 1) * 9; //Creates wiggle effect

        let pointWave = Math.floor(Math.random() * this.pointRate);
        for (let i = 0; i < this.currentPattern.length;i++){
            if (pointWave < 1){
                this.projectiles.push(new projectile(this.getX() * this.blockUnit,this.getY() * this.blockUnit,this.currentPattern[i] + this.rotation,this.getRadius()/2,true));
            }
            else{
                this.projectiles.push(new projectile(this.getX() * this.blockUnit,this.getY() * this.blockUnit,this.currentPattern[i] + this.rotation,this.getRadius()/2,false));
            }
        }
        this.incrementSpawnCounter();

        console.log("New wave spawned!");
    }

    chooseNewPattern(){
        this.currentPattern = [];
        let i = Math.floor(Math.random() * this.patterns.length);
        for (let j = 0; j < this.patterns[i].length; j++){
            this.currentPattern.push(this.patterns[i][j]);
        }
    }

}

class projectile{
    constructor(x,y,direction,r,isAPoint) {
        this.xPos = x;
        this.yPos = y;
        this.direction = direction;
        this.radius = r;
        this.isAPoint = isAPoint;
    }

    getX(){return this.xPos;}
    getY(){return this.yPos;}
    getRadius(){return this.radius;}
    isEnemy(){return true;}
    isPoint(){return this.isAPoint;}

    setX(x){this.xPos = x;}
    setY(y){this.yPos = y;}
    move(){
        this.xPos += this.radius/3 * Math.cos(Math.PI / 180 * (this.direction - 90));
        this.yPos += this.radius/3 * Math.sin(Math.PI / 180 * (this.direction - 90));
    }
}

class ballModel {
    constructor(canvasLength) {
        this.projectiles = [];
        //new projectile(50,50,90,canvasLength/40, 0)
        this.spawners = [  //Contains all spawner objects
            new spawner(2.5,2.5,canvasLength / 100, this.projectiles, canvasLength)];

        this.lines = [
            0, 5, 5, 5,
            5, 0, 5, 5,
            0, 0, 5, 0,
            0, 0, 0, 5,];  //Contains all the line coordinates

        if (isNaN(localStorage.playerHighScore)){
            localStorage.playerHighScore = 0;
        }
        localStorage.playerCurrentScore = 0;

        this.player1 = new player(canvasLength);

        //The functions for turning and moving forwards and backwards have been decoupled from keyDown event handlers
        //This is so the same functions can be mapped to keys as well as to button presses to facilitate cross-platform support

        this.turnLeft = (player) => {
            player.setRotateFlag(-1);
            //console.log("Rotation: "+player.getRotation());
        };

        this.turnRight = (player) => {
            player.setRotateFlag(1);
            //console.log("Rotation: "+player.getRotation());
        };

        this.pushUp = (player) => {
            player.setMoveFlag(1);
        };

        this.pushDown = (player) => {
            player.setMoveFlag(-1);
        };


        this.handleKeyDown = (event) => {
            this.keys = (this.keys || []);
            this.keys[event.keyCode] = true;
        };
        this.handleKeyUp = (event) => {
            this.keys[event.keyCode] = false;
            if (event.keyCode === 87 || event.keyCode === 83){
                this.player1.setMomentum(0);
                this.player1.setMoveFlag(0);
            }
            if (event.keyCode === 68 || event.keyCode === 65){
                this.player1.setRotateFlag(0);
            }
        };
        this.handleUp = () => {
            console.log("Up button Pressed!");
            this.pushUp(this.player1);
        };
        this.handleDown = () => {
            console.log("Down button Pressed!");
            this.pushDown(this.player1);
        };
        this.handleMoveStop = () => {
            console.log("Move released!");
            this.player1.setMoveFlag(0);
        }

        this.handleLeft = () => {
            console.log("Left button Pressed!");
            this.turnLeft(this.player1);
        };
        this.handleRight = () => {
            console.log("Right button Pressed!");
            this.turnRight(this.player1);
        };
        this.handleRotateStop = () => {
            console.log("Rotate released!");
            this.player1.setRotateFlag(0);
        }

    }

    getLines(){
        return this.lines;
    }

    getSpawners(){
        return this.spawners;
    }

    getPlayer(){
        return this.player1;
    }

    getProjectiles(){
        return this.projectiles;
    }

    checkCollisions(view){
        //Two circles are intersecting if the distance between their centre points is less than the sum of their radii

        //Original source for checking if two circles intersect
        //http://jeffreythompson.org/collision-detection/circle-circle.php

        //This function has been derived from the sources mentioned above however none of the maths bits are original
        //This checks if the player has collided with a spawner

        for (let i = 0; i < this.spawners.length; i++) {
            let holeX = this.spawners[i].getX() * view.getBlockUnit();
            let holeY = this.spawners[i].getY() * view.getBlockUnit();
            let distance_between_centres = Math.sqrt((this.player1.getX() - holeX) * (this.player1.getX() - holeX) + (this.player1.getY() - holeY) * (this.player1.getY()- holeY));
            let sum_of_radii = this.player1.getRadius() + this.spawners[i].getRadius();
            if (distance_between_centres <= sum_of_radii) {
                if (this.player1.getLives() > 1){this.player1.takeDamage();}
                else{
                    localStorage.playerCurrentScore = this.player1.getScore();

                    view.goTo("ballWin.html");
                }
            }
        }

        //It then checks for if the player has collided with a projectile, if so, the player loses health and the projectile is destroyed

        for (let i = 0; i < this.projectiles.length; i++){
            let proj = this.projectiles[i];
            let distance_between_centres = Math.sqrt((this.player1.getX() - proj.getX()) * (this.player1.getX() - proj.getX()) + (this.player1.getY() - proj.getY()) * (this.player1.getY() - proj.getY()));
            let sum_of_radii = this.player1.getRadius() + proj.getRadius();
            if (distance_between_centres <= sum_of_radii) {
                if (proj.isPoint()) {
                    this.player1.addPoint();
                    delete this.projectiles[i];
                    this.projectiles.splice(i, 1);
                    i--;
                } else {
                    if (this.player1.getLives() > 1) {
                        this.player1.takeDamage();
                        delete this.projectiles[i];
                        this.projectiles.splice(i, 1);
                        i--;
                    } else {
                        localStorage.playerCurrentScore = this.player1.getScore();

                        view.goTo("ballWin.html");
                    }
                }
            }
        }
    }

    checkMovement(player){
        let zeroAtValue = 20;       //Value for determining when to turn tiny floating points to 0 to ensure car gets to an eventual stop

        if (Math.abs(player.getSpeed()) < player.getMaxSpeed()) {
            player.updateSpeed();
        }

        if (Math.abs(player.getSpeed()) >= player.getMaxSpeed()/zeroAtValue) {
            player.move();
            player.decaySpeed();
        }
        else{
            player.setSpeed(0);
        }
        this.checkOutOfBounds(player, 0)
    }

    checkOutOfBounds(obj, index){
        if (obj.isEnemy()){     //Object is an enemy
            let deleteThis = false;
            if (obj.getX() < -10) {
                deleteThis = true;
            }
            if (obj.getY() < -10) {
                deleteThis = true;
            }
            if (obj.getX() > view.getCanvasLength() + 10) {
                deleteThis = true;
            }
            if (obj.getY() > view.getCanvasLength() + 10) {
                deleteThis = true;
            }
            if (deleteThis){
                this.projectiles.splice(index,1);
            }
        }


        else {  //Object is a player
            if (obj.getX() < 0) {
                obj.setX(view.getCanvasLength() - obj.getRadius() * 1.1);
            }
            if (obj.getY() < 0) {
                obj.setY(view.getCanvasLength() - obj.getRadius() * 1.1);
            }
            if (obj.getX() > view.getCanvasLength()) {
                obj.setX(obj.getRadius() * 1.1);
            }
            if (obj.getY() > view.getCanvasLength()) {
                obj.setY(obj.getRadius() * 1.1);
            }
        }
    }

    checkKeyInputs(){
        if (this.keys && this.keys[87]) {   //Checking for key inputs
            console.log("W pressed!");
            this.pushUp(this.player1);
        }
        if (this.keys && this.keys[83]) {
            console.log("S pressed!");
            this.pushDown(this.player1);
        }
        if (this.keys && this.keys[65]) {
            console.log("A pressed!");
            this.turnLeft(this.player1);
        }
        if (this.keys && this.keys[68]) {
            console.log("D pressed!");
            this.turnRight(this.player1);
        }


        if (this.player1.getMoveFlag() === -1){     //Checking for button inputs
            this.player1.pushDown();
        }
        if (this.player1.getMoveFlag() === 1){
            this.player1.pushUp();
        }
        if (this.player1.getMoveFlag() === 0){
            this.player1.setMomentum(0);
        }
        if (this.player1.getRotateFlag() === -1){
            this.player1.rotateLeft();
        }
        if (this.player1.getRotateFlag() === 1){
            this.player1.rotateRight();
        }

    }

    checkSpawners(){
        for (let i = 0; i < this.spawners.length;i++){
            let temp = this.spawners[i];
            if (temp.getSpawnCounter() > temp.getSpawnDelay()){
                temp.spawn()
            }
            else{
                temp.incrementSpawnCounter();
            }
        }
    }

    checkProjectiles(){
        this.projectiles.forEach((projectile, index) => {
            projectile.move();
            this.checkOutOfBounds(projectile, index)
        });
    }

    checkPlayerStatus(){
        if (this.player1.iFrames > 0){
            this.player1.iFrames--;
        }
    }
}
