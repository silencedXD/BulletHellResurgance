'use strict';

class ballView {
    constructor() {
        let currentPage = this.getCurrentPage().split('/');//This checks if the user is on the homepage
        let pageName = currentPage.pop();                         //Which only needs some buttons to be setup
        if (pageName === "ballGame.html") {
            this.canvas = document.getElementById("gameCanvas");
            this.canvasLength = 0;  //This value is used for calculating how big everything should appear on the screen
            if (window.innerWidth > window.innerHeight) {
                this.canvasLength = window.innerHeight;
            } else {
                this.canvasLength = window.innerWidth;
            }
            this.canvasLength *= 0.9;
            this.canvas.width = this.canvasLength;
            this.canvas.height = this.canvasLength;
            this.context = this.canvas.getContext("2d");
            this.context.lineWidth = 4;
            this.blockUnit = this.canvasLength / 5;
            this.holeRadius = this.canvasLength / 37;

        }
    }

    getCanvasLength(){
        return this.canvasLength;
    }

    getBlockUnit(){
        return this.blockUnit;
    }

    getHoleRadius(){
        return this.holeRadius;
    }

    setupButtonHandler(id, handler) {
        document.getElementById(id).addEventListener("click", handler);
    }

    setupButtonHandlerWithType(id, type, handler){
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

    updateFrame(ballX, ballY, ballRadius, lines, holes){
        this.context.clearRect(0, 0, this.canvasLength, this.canvasLength);        //This clears the canvas
        this.drawNewFrame(ballX, ballY, ballRadius, lines, holes);
    }

    drawNewFrame(x, y, r, lines, holes){
        this.drawBackground(lines, holes);
        this.context.fillStyle = "#00FF00";
        this.context.beginPath();
        this.context.arc(x, y, r, 0, 2 * Math.PI);   //Draws ball
        this.context.fill();
        this.context.strokeStyle = "#33DD33";
        this.context.stroke();
        let car = new Image();
        car.src="car.png";
        this.context.drawImage(car, x, y);
    }

    drawBackground(lines, holes){
        //All the walls are stored in an array as 4 coordinates, this adds all of them to the canvas
        for (let i = 0; i < lines.length; i += 4) {
            this.drawLine(lines[i], lines[i + 1], lines[i + 2], lines[i + 3]);
        }

        this.context.strokeStyle = "#3fc1c9";
        this.context.stroke();

        this.context.fillStyle = "#b1184c";
        this.context.strokeStyle = "#7e1236";


        //All of the trap holes are stored in an array as 2 coordinates as they all have the same radius
        for (let i = 0; i < holes.length-2; i += 2) {    //This adds the trap holes
            this.drawHole(holes[i], holes[i + 1]);
        }

        this.context.fillStyle = "#CCCCCC";
        this.context.strokeStyle = "#888888";
        this.drawHole(holes[holes.length-2], holes[holes.length-1]);                       //This adds the goal hole
    }

    drawLine(x1, y1, x2, y2){
        this.context.moveTo(this.blockUnit * x1, this.blockUnit * y1);
        this.context.lineTo(this.blockUnit * x2, this.blockUnit * y2);
    }

    drawHole(x, y){
        this.context.beginPath();
        this.context.arc(this.blockUnit * x, this.blockUnit * y, this.holeRadius, 0, Math.PI * 2);
        this.context.fill();
        this.context.stroke();
    }
}
