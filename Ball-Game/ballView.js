'use strict';

class ballView {
    constructor() {
        let currentPage = this.getCurrentPage().split('/');//This checks if the user is on the homepage
        let pageName = currentPage.pop();                         //Which only needs some buttons to be setup
        if (pageName === "ballGame.html") {
            this.canvas = document.getElementById("gameCanvas");
            this.canvasLength = 0;                                  //This value is used for calculating how big everything should appear on the screen
            if (window.innerWidth > window.innerHeight) {
                this.canvasLength = window.innerHeight;
                document.getElementById("horizontalCSS").media = '';    //If the phone is held horizontally, a different stylesheet is used to optimise space
                this.canvasLength *= 0.75;
            } else {
                this.canvasLength = window.innerWidth;
                document.getElementById("horizontalCSS").media = 'none';
                this.canvasLength *= 0.9;                               //This ensures the whole canvas fits onscreen (phone cameras ect)
            }
            this.canvas.width = this.canvasLength;
            this.canvas.height = this.canvasLength;
            this.context = this.canvas.getContext("2d");
            this.context.lineWidth = 4;
            this.blockUnit = this.canvasLength / 5;                 //This is a unit that divides the canvas into 5, used for custom coordinates for drawing

        }
    }

    getCanvasLength(){
        return this.canvasLength;
    }

    getBlockUnit(){
        return this.blockUnit;
    }

    setupButtonHandler(id, type, handler){
        document.getElementById(id).addEventListener(type, handler);
    }

    setupEventHandler(type, handler){
        window.addEventListener(type, handler);
    }

    setContent(id, content){
        document.getElementById(id).innerHTML = content;
    }

    goTo(id){
        window.location.href=id;
    }

    getCurrentPage(){
        return window.location.pathname;
    }

    updateFrame(player1, lines, spawners, projectiles){
        this.context.clearRect(0, 0, this.canvasLength, this.canvasLength);        //This clears the canvas
        this.drawNewFrame(player1, lines, spawners, projectiles);
    }

    drawNewFrame(player1, lines, spawners, projectiles){



        let car = new Image();
        car.src="car.png";

        let carSF = player1.getRadius() / 10;   //Player size scales with how many lives they have

        let centreX = car.width/2;
        let centreY = car.height/2;

        this.context.save();                                                    //Default is saved
        this.context.translate(player1.getX(), player1.getY());                 //Canvas is moved to player position
        this.context.rotate(Math.PI/180 * player1.getRotation());               //Canvas is rotated
        this.context.scale(carSF,carSF);                                        //Canvas is scaled to size of the player
        this.context.drawImage(car, -centreX, -centreY, car.width, car.height);
        this.context.restore();                                                 //Transformations are reset to default

/*        this.context.fillStyle = "#00FF00";
        this.context.beginPath();
        this.context.arc(player1.getX(), player1.getY(), player1.getRadius(), 0, 2 * Math.PI);   //Draws ball
        this.context.fill();
        this.context.strokeStyle = "#33DD33";
        this.context.stroke();*/        //This draws a ball using the player's radius, displays player hitbox which is useful for testing

        this.drawEnemies(spawners, projectiles)

        this.drawBackground(lines);
    }

    drawEnemies(spawners, projectiles){
        this.context.fillStyle = "#771877";
        this.context.strokeStyle = "#661266";


        //All of the projectile spawners are stored in an array of spawner objects, the same is true for projectiles

        for (let i = 0; i < spawners.length; i++) {       //This draws the projectile spawners
            this.drawHole(spawners[i].getX(), spawners[i].getY(), spawners[i].getRadius());
        }



        for (let i = 0; i < projectiles.length; i++) {    //This draws the projectiles
            if (projectiles[i].isPoint()){
                this.context.fillStyle = "#22AA22";
                this.context.strokeStyle = "#009900";
            }
            else{
                this.context.fillStyle = "#aa1144";
                this.context.strokeStyle = "#bb0022";
            }
            this.drawHole(projectiles[i].getX()/this.blockUnit, projectiles[i].getY()/this.blockUnit, projectiles[i].getRadius());
        }
        /*        this.context.fillStyle = "#CCCCCC";
                this.context.strokeStyle = "#888888";
                this.drawHole(spawners[spawners.length-2], spawners[spawners.length-1]);    */                   //This adds the goal hole
    }

    drawBackground(lines){
        //All the walls are stored in an array as 4 coordinates, this adds all of them to the canvas
        for (let i = 0; i < lines.length; i += 4) {
            this.drawLine(lines[i], lines[i + 1], lines[i + 2], lines[i + 3]);
        }

        this.context.strokeStyle = "#3fc1c9";
        this.context.stroke();
    }

    drawLine(x1, y1, x2, y2){
        this.context.moveTo(this.blockUnit * x1, this.blockUnit * y1);
        this.context.lineTo(this.blockUnit * x2, this.blockUnit * y2);
    }

    drawHole(x, y, r){
        this.context.beginPath();
        this.context.arc(this.blockUnit * x, this.blockUnit * y, r, 0, Math.PI * 2);
        this.context.fill();
        this.context.stroke();
    }

    pauseGame(){
        document.getElementById("pauseScreen").style.display = 'inline';
    }

    resumeGame(){
        document.getElementById("pauseScreen").style.display = 'none';
    }
}
