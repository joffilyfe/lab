var circles = [],
    images = [],
    shadows = [],
    canvas,
    ctx,
    button,
    drawing = false,
    video,
    showVideo = false,
    photo;

var Circle = function() {
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.startAngle = 0;
    this.endAngle = Math.PI*2;
    this.anticlockwise = false;
}

var Image = function(x, y, src) {
    var el = document.createElement("img");
    this.x = x;
    this.y = y;
    this.src = src;
    el.src = src;

    this.get = function() { return el; }
    this.getW = function() { return el.width; }
    this.getH = function() { return el.height; }
    this.shadow = {x: x, y: y, w: 0, h: 0};
}

var Shadow = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
}

var addCircle = function(x, y, r) {
    var circle = new Circle;
    circle.x = x;
    circle.y = y;
    circle.radius = r;
    circles.push(circle);
}

var addImage = function(x, y, src) {
    var img = new Image(x, y, src);
    images.push(img);
}

var addShadow = function(x, y, w, h) {
    var shadow = new Shadow(x, y, w, h);
    console.log(shadow);
    shadows.push(shadow)
}


canvas = document.getElementById("canvas");
button = document.getElementById("save");
hat = document.getElementById("hat");
takePhoto = document.getElementById("takePhoto");
photo = document.getElementById("photo");
ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 500;

function drawImageShadow(shadow) {
    ctx.beginPath();
    ctx.arc(shadow.x, shadow.y , shadow.w * 0.3, 0, 7, false);
    ctx.closePath();
    ctx.fill();
}

function define(shape) {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.radius, 0, shape.endAngle, false);
    ctx.closePath(); 
}

function draw(shape) {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.radius, 0, shape.endAngle, false);
    ctx.closePath();    
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.stroke();
}

// Call all draw functions
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Video draw
    if (showVideo) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Circle draw
    for (var i = 0; i < circles.length; i++) {
        draw(circles[i]);
    }

    // Image draw
    for (var i = 0; i < images.length; i++) {
        var w = images[i].get().width * 0.7;
        var h = images[i].get().height * 0.7;
        images[i].shadow.w = w;
        images[i].shadow.h = h;
        drawImageShadow(images[i].shadow);
        ctx.drawImage(images[i].get(), images[i].x, images[i].y, w, h);
    }
}

// Canvas events
canvas.onmouseup = function(event) {
    event.preventDefault();
    drawing = false;
}

canvas.onmousedown = function(event) {
    event.preventDefault();
    drawing = true;  
}


// When the mouse move We update objects coordinates
canvas.onmousemove = function(event) {
    event.preventDefault();
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop + 25;

    // Redraw shapes
    for (var i = 0; i < circles.length; i++) {
        // Help to select the correct shape
        // Canvas just know last shape path
        define(circles[i]);
        if (ctx.isPointInPath(x, y) && drawing) {
            circles[i].x = x;
            circles[i].y = y;        
            drawAll();
        }
    }

    // Redraw Images
    for (var i = 0; i < images.length; i++) {
        // drawImageShadow(images[i].shadow);
        if (drawing) {
            images[i].x = x;
            images[i].y = y;
            images[i].shadow.x = x;
            images[i].shadow.y = y;
            drawAll();
        }
    }
    console.log(ctx.isPointInPath(x, y));

}

// Clear canvas
clear.onclick = function(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles = [];
    images = [];
    shadows = [];
}

// Add circle
button.onclick = function(event) {
    function xy() {
        return Math.random() * 200 + 50;
    }

    addCircle(xy(), xy(), Math.random() * 40 + 10);
    drawAll();
    console.log(circles);
}

// Add hat
hat.onclick = function(event) {
    event.preventDefault();
    addImage(0, 0, "hat.png");
    drawAll();
}


// Take photo
takePhoto.onclick = function(event) {
    event.preventDefault();
    photo.src = canvas.toDataURL();
}

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

video = document.createElement('video');
navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    showVideo = true;
}, function(e) {});


// Draw every sec
if (ctx) {
    setInterval(function() {
        drawAll();
    }, 100);
}