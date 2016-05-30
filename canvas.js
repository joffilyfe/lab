(function() {

    var App = function(canvas) {
        this.canvas = canvas;
        canvas.width = window.screen.width;
        canvas.height = window.screen.height;
    }

    var Canvas = function(canvas) {
        this.canvas = canvas;
        this.ctx;
        this.fillStyle = "red"
        this.circles = [];

        this.rect = function(x, y, w, h) {
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fillRect(x, y, w, h);
        }

        this.circle = function(x, y) {
            this.ctx.beginPath();
            var arc = this.ctx.arc(x, y, 20, 0, Math.PI*2, true);
            this.ctx.fillStyle = this.fillStyle;
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.clear = function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    var canvas = document.getElementById('canvas'),
        app = new App(canvas),
        c = new Canvas(canvas) || window;

    if (canvas.getContext) {
        app.ctx = canvas.getContext('2d');
        c.ctx = app.ctx;
    }

    // Eventos
    if (c.ctx) {
        c.canvas.addEventListener('mousemove', function(event) {
            // c.rect(event.clientX - 50, event.clientY - 20, 30, 30);
            c.circle(event.clientX-20, event.clientY);
        }, false);

        c.canvas.addEventListener('click', function(event) {
            var color = function() {
                return Math.floor((Math.random() * 255) + 1);
            }
            c.fillStyle = "rgba("+ color() + "," + color() + "," + color() + ","+ Math.random()+")";
        }, false);
   }

   var button = document.getElementById("clear");

   button.addEventListener("click", function() {
    c.clear();
   }, false);

})();

