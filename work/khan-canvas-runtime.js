(function () {
    "use strict";

    var canvas;
    var context;
    var logicalWidth = 400;
    var logicalHeight = 400;
    var fillStyle = "rgb(255, 255, 255)";
    var strokeStyle = "rgb(0, 0, 0)";
    var fillEnabled = true;
    var strokeEnabled = true;
    var currentStrokeWeight = 1;
    var currentTextSize = 12;
    var cursorHidden = false;
    var pointerPressPending = false;
    var keyPressPending = false;
    var running = false;

    window.mouseX = 200;
    window.mouseY = 200;
    window.mouseIsPressed = false;
    window.keyIsPressed = false;
    window.key = "";
    window.keyCode = 0;

    function channel(value) {
        return Math.max(0, Math.min(255, Number(value) || 0));
    }

    function colorFromArguments(args) {
        var values = Array.prototype.slice.call(args);
        var red;
        var green;
        var blue;
        var alpha = 1;

        if (values.length === 1) {
            red = green = blue = channel(values[0]);
        } else if (values.length === 2) {
            red = green = blue = channel(values[0]);
            alpha = channel(values[1]) / 255;
        } else {
            red = channel(values[0]);
            green = channel(values[1]);
            blue = channel(values[2]);
            if (values.length > 3) {
                alpha = channel(values[3]) / 255;
            }
        }

        return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
    }

    function applyDrawingStyles() {
        context.fillStyle = fillStyle;
        context.strokeStyle = strokeStyle;
        context.lineWidth = currentStrokeWeight;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.font = currentTextSize + "px Geologica, sans-serif";
        context.textBaseline = "alphabetic";
    }

    function paintPath() {
        applyDrawingStyles();
        if (fillEnabled) {
            context.fill();
        }
        if (strokeEnabled) {
            context.stroke();
        }
    }

    function roundedRectPath(x, y, width, height, radius) {
        var safeRadius = Math.max(0, Math.min(Math.abs(radius || 0), Math.abs(width) / 2, Math.abs(height) / 2));
        var right = x + width;
        var bottom = y + height;

        context.beginPath();
        context.moveTo(x + safeRadius, y);
        context.lineTo(right - safeRadius, y);
        context.quadraticCurveTo(right, y, right, y + safeRadius);
        context.lineTo(right, bottom - safeRadius);
        context.quadraticCurveTo(right, bottom, right - safeRadius, bottom);
        context.lineTo(x + safeRadius, bottom);
        context.quadraticCurveTo(x, bottom, x, bottom - safeRadius);
        context.lineTo(x, y + safeRadius);
        context.quadraticCurveTo(x, y, x + safeRadius, y);
        context.closePath();
    }

    function updatePointer(event) {
        var bounds = canvas.getBoundingClientRect();
        window.mouseX = (event.clientX - bounds.left) * logicalWidth / bounds.width;
        window.mouseY = (event.clientY - bounds.top) * logicalHeight / bounds.height;
    }

    function queueKeyPress(value, code) {
        window.key = value;
        window.keyCode = code || value.toUpperCase().charCodeAt(0);
        keyPressPending = true;
        if (typeof window.keyPressed === "function") {
            window.keyPressed();
        }
    }

    function frame() {
        if (!running) {
            return;
        }

        window.mouseIsPressed = pointerPressPending;
        window.keyIsPressed = keyPressPending;
        pointerPressPending = false;
        keyPressPending = false;

        try {
            if (typeof window.draw === "function") {
                window.draw();
            }
        } catch (error) {
            running = false;
            console.error(error);
            document.dispatchEvent(new CustomEvent("khan-canvas-error", { detail: error }));
            return;
        }

        window.mouseIsPressed = false;
        window.keyIsPressed = false;
        window.requestAnimationFrame(frame);
    }

    window.random = function (minimum, maximum) {
        if (typeof maximum === "undefined") {
            maximum = minimum;
            minimum = 0;
        }
        return minimum + Math.random() * (maximum - minimum);
    };

    window.background = function () {
        context.save();
        context.fillStyle = colorFromArguments(arguments);
        context.fillRect(0, 0, logicalWidth, logicalHeight);
        context.restore();
    };

    window.fill = function () {
        fillStyle = colorFromArguments(arguments);
        fillEnabled = true;
    };

    window.noFill = function () {
        fillEnabled = false;
    };

    window.stroke = function () {
        strokeStyle = colorFromArguments(arguments);
        strokeEnabled = true;
    };

    window.noStroke = function () {
        strokeEnabled = false;
    };

    window.strokeWeight = function (weight) {
        currentStrokeWeight = Math.max(0, Number(weight) || 0);
    };

    window.textSize = function (size) {
        currentTextSize = Math.max(1, Number(size) || 12);
    };

    window.rect = function (x, y, width, height, radius) {
        roundedRectPath(x, y, width, height, radius);
        paintPath();
    };

    window.ellipse = function (x, y, width, height) {
        context.beginPath();
        context.ellipse(x, y, Math.abs(width) / 2, Math.abs(height) / 2, 0, 0, Math.PI * 2);
        context.closePath();
        paintPath();
    };

    window.line = function (x1, y1, x2, y2) {
        if (!strokeEnabled) {
            return;
        }
        applyDrawingStyles();
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    };

    window.triangle = function (x1, y1, x2, y2, x3, y3) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        paintPath();
    };

    window.text = function (value, x, y) {
        applyDrawingStyles();
        if (fillEnabled) {
            context.fillText(String(value), x, y);
        }
        if (strokeEnabled) {
            context.strokeText(String(value), x, y);
        }
    };

    window.noCursor = function () {
        cursorHidden = true;
        if (canvas) {
            canvas.style.cursor = "none";
        }
    };

    window.KhanCanvasRuntime = {
        start: function (target) {
            canvas = target;
            context = canvas.getContext("2d");
            logicalWidth = Number(canvas.dataset.logicalWidth) || 400;
            logicalHeight = Number(canvas.dataset.logicalHeight) || 400;
            context.setTransform(canvas.width / logicalWidth, 0, 0, canvas.height / logicalHeight, 0, 0);

            if (cursorHidden) {
                canvas.style.cursor = "none";
            }

            canvas.addEventListener("pointermove", updatePointer);
            canvas.addEventListener("pointerdown", function (event) {
                updatePointer(event);
                pointerPressPending = true;
                canvas.focus({ preventScroll: true });
                event.preventDefault();
            });

            window.addEventListener("keydown", function (event) {
                if (event.repeat) {
                    return;
                }
                if (event.key === "r" || event.key === "R" || event.key === "e" || event.key === "E") {
                    queueKeyPress(event.key, event.keyCode);
                    event.preventDefault();
                }
            });

            running = true;
            window.requestAnimationFrame(frame);

            return {
                pressKey: function (value) {
                    queueKeyPress(value, value.toUpperCase().charCodeAt(0));
                },
                stop: function () {
                    running = false;
                }
            };
        }
    };
}());
