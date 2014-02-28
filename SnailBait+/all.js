Stopwatch = function () {
    this.startTime = 0;
    this.running = false;
    this.elapsed = undefined;
    this.paused = false;
    this.startPause = 0;
    this.totalPausedTime = 0
};
Stopwatch.prototype = {
    start: function () {
        this.startTime = +new Date();
        this.elapsedTime = undefined;
        this.running = true;
        this.totalPausedTime = 0;
        this.startPause = 0
    },
    stop: function () {
        if (this.paused) {
            this.unpause()
        }
        this.elapsed = (+new Date()) - this.startTime - this.totalPausedTime;
        this.running = false
    },
    pause: function () {
        this.startPause = +new Date();
        this.paused = true
    },
    unpause: function () {
        if (!this.paused) {
            return
        }
        this.totalPausedTime += (+new Date()) - this.startPause;
        this.startPause = 0;
        this.paused = false
    },
    getElapsedTime: function () {
        if (this.running) {
            return (+new Date()) - this.startTime - this.totalPausedTime
        } else {
            return this.elapsed
        }
    },
    isPaused: function () {
        return this.paused
    },
    isRunning: function () {
        return this.running
    },
    reset: function () {
        this.elapsed = 0;
        this.startTime = +new Date();
        this.elapsedTime = undefined;
        this.running = false;
        this.totalPausedTime = 0;
        this.startPause = 0
    }
};
AnimationTimer = function (a, b) {
    this.timeWarp = b;
    if (a !== undefined) {
        this.duration = a
    } else {
        this.duration = 1000
    }
    this.stopwatch = new Stopwatch()
};
AnimationTimer.prototype = {
    start: function () {
        this.stopwatch.start()
    },
    stop: function () {
        this.stopwatch.stop()
    },
    pause: function () {
        this.stopwatch.pause()
    },
    unpause: function () {
        this.stopwatch.unpause()
    },
    isPaused: function () {
        return this.stopwatch.isPaused()
    },
    getRealElapsedTime: function () {
        return this.stopwatch.getElapsedTime()
    },
    getElapsedTime: function () {
        var a = this.stopwatch.getElapsedTime(),
            b = a / this.duration,
            c = a * (this.timeWarp(b) / b);
        if (this.timeWarp == undefined) {
            return a
        }
        if (b === 0 || b >= 1) {
            return a
        }
        return a * (this.timeWarp(b) / b)
    },
    isRunning: function () {
        return this.stopwatch.running
    },
    isOver: function () {
        return this.stopwatch.getElapsedTime() > this.duration
    },
    reset: function () {
        this.stopwatch.reset()
    }
};
AnimationTimer.makeEaseOut = function (a) {
    return function (b) {
        return 1 - Math.pow(1 - b, a * 2)
    }
};
AnimationTimer.makeEaseIn = function (a) {
    return function (b) {
        return Math.pow(b, a * 2)
    }
};
AnimationTimer.makeEaseInOut = function () {
    return function (a) {
        return a - Math.sin(a * 2 * Math.PI) / (2 * Math.PI)
    }
};
AnimationTimer.makeElastic = function (a) {
    a = a || 3;
    return function (b) {
        return ((1 - Math.cos(b * Math.PI * a)) * (1 - b)) + b
    }
};
AnimationTimer.makeBounce = function (a) {
    var b = AnimationTimer.makeElastic(a);
    return function (c) {
        c = b(c);
        return c <= 1 ? c : 2 - c
    }
};
AnimationTimer.makeLinear = function () {
    return function (a) {
        return a
    }
};
var ImagePainter = function (a) {
    this.image = new Image;
    this.image.src = a
};
ImagePainter.prototype = {
    image: undefined,
    paint: function (b, a) {
        if (this.image !== undefined) {
            if (!this.image.complete) {
                this.image.onload = function (c) {
                    b.width = this.width;
                    b.height = this.height;
                    a.drawImage(this, b.left, b.top, b.width, b.height)
                }
            } else {
                a.drawImage(this.image, b.left, b.top, b.width, b.height)
            }
        }
    }
};
SpriteSheetPainter = function (b, a) {
    this.cells = a;
    this.spritesheet = b;
    this.cellIndex = 0
};
SpriteSheetPainter.prototype = {
    advance: function () {
        if (this.cellIndex == this.cells.length - 1) {
            this.cellIndex = 0
        } else {
            this.cellIndex++
        }
    },
    paint: function (c, b) {
        var a = this.cells[this.cellIndex];
        c.width = a.width;
        c.height = a.height;
        b.drawImage(this.spritesheet, a.left, a.top, a.width, a.height, c.left, c.top, a.width, a.height)
    }
};
var SpriteAnimator = function (a, b, c) {
    this.cells = a;
    this.duration = b || 1000;
    this.callback = c
};
SpriteAnimator.prototype = {
    start: function (c, b) {
        var e = c.painter.cells,
            d = c.painter.cellIndex,
            a = this;
        c.painter.cells = this.cells;
        c.painter.cellIndex = 0;
        setTimeout(function () {
            c.painter.cells = e;
            c.painter.cellIndex = d;
            c.visible = b;
            if (a.callback) {
                a.callback(c, a)
            }
        }, this.duration)
    },
};
var Sprite = function (c, b, a) {
    this.type = c || "";
    this.painter = b;
    this.behaviors = a || [];
    this.left = 0;
    this.top = 0;
    this.width = 10;
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.opacity = 1;
    this.visible = true;
    return this
};
Sprite.prototype = {
    paint: function (a) {
        a.save();
        a.globalAlpha = this.opacity;
        if (this.painter !== undefined && this.visible) {
            this.painter.paint(this, a)
        }
        a.restore()
    },
    update: function (c, b) {
        for (var a = this.behaviors.length; a > 0; --a) {
            if (this.behaviors[a - 1] === undefined) {
                return
            }
            this.behaviors[a - 1].execute(this, c, b)
        }
    }
};
var BUBBLE_LIFETIME = 8000,
    BUBBLE_EXPANSION_RATE = 8,
    BUBBLE_FILL_STYLE = "rgb(220,220,220)",
    BUBBLE_SLOW_EXPANSION_RATE = 4,
    BUBBLE_X_SPEED_FACTOR = 15,
    BUBBLE_Y_SPEED_FACTOR = 10,
    FULLY_OPAQUE = 1,
    FULLY_TRANSPARENT = 0,
    TWO_PI = Math.PI * 2;
var SmokeBubble = function (f, e, b, c, a) {
    var d = this;
    this.sprite = new Sprite("smoking hole", {
        paint: function (h, g) {
            if (!h.timer.isRunning()) {
                h.timer.start();
                h.opacity = FULLY_OPAQUE;
                return
            }
            if (h.timer.isOver()) {
                h.timer.stop();
                h.timer.reset();
                h.opacity = FULLY_TRANSPARENT;
                h.left = h.originalLeft;
                h.top = h.originalTop;
                h.radius = h.originalRadius;
                h.velocityX = Math.random() * BUBBLE_X_SPEED_FACTOR;
                h.velocityY = Math.random() * BUBBLE_Y_SPEED_FACTOR
            } else {
                g.beginPath();
                g.fillStyle = h.fillStyle;
                g.arc(h.left, h.top, h.radius, 0, TWO_PI, false);
                g.fill()
            }
        }
    }, [{
        execute: function (h, g, j) {
            var i = h.timer.getElapsedTime() / h.timer.duration;
            h.left += h.velocityX * (1 / fps);
            h.top -= h.velocityY * (1 / fps);
            h.opacity = FULLY_OPAQUE - i;
            if (h.expandsSlowly) {
                h.radius += BUBBLE_SLOW_EXPANSION_RATE / fps
            } else {
                h.radius += BUBBLE_EXPANSION_RATE / fps
            }
        }
    }]);
    this.sprite.opacity = FULLY_OPAQUE;
    this.sprite.fillStyle = BUBBLE_FILL_STYLE;
    this.sprite.left = f;
    this.sprite.top = e;
    this.sprite.originalLeft = f;
    this.sprite.originalTop = e;
    this.sprite.radius = b;
    this.sprite.originalRadius = b;
    this.sprite.velocityX = c;
    this.sprite.velocityY = a;
    this.sprite.timer = new AnimationTimer(BUBBLE_LIFETIME, AnimationTimer.makeEaseOut(1))
};
SmokeBubble.prototype = {
    update: function (a, b) {
        this.sprite.update(a, b)
    },
    paint: function (a) {
        this.sprite.paint(a)
    }
};
var FireParticle = function (f, e, a) {
    var c = this,
        d = 200,
        b = "rgba(255,255,0,0.9)";
    this.left = f;
    this.top = e;
    this.radius = a;
    this.originalRadius = a;
    this.lastFlicker = 0;
    this.sprite = new Sprite("fire particle", {
        paint: function (i, h) {
            var g = +new Date();
            h.save();
            h.fillStyle = i.fillStyle;
            h.globalAlpha = Math.random();
            h.beginPath();
            if (g - c.lastFlicker > d) {
                c.lastFlicker = g;
                h.fillStyle = "rgba(255,255,0,0.9)";
                h.arc(i.left, i.top, i.radius * 1.5, 0, Math.PI * 2, false)
            } else {
                h.fillStyle = c.sprite.fillStyle;
                h.arc(i.left, i.top, i.radius, 0, Math.PI * 2, false)
            }
            h.fill();
            h.restore()
        }
    });
    this.sprite.left = f;
    this.sprite.top = e;
    this.sprite.radius = a;
    this.sprite.fillStyle = "rgba(255,165,0," + Math.random() + ");";
    this.sprite.visible = true;
    this.sprite.velocityX = 0;
    this.sprite.velocityY = 0;
    this.visible = true
};
FireParticle.prototype = {
    update: function (a, b) {
        this.sprite.update(a, b)
    },
    paint: function (a) {
        this.sprite.opacity = Math.random() * 255;
        this.sprite.paint(a)
    }
};
var SmokingHole = function (e, d, b, g, a) {
    var j, f, c, h = this;
    this.smokeBubbles = [];
    this.fireParticles = [];
    for (c = 0; c < e; ++c) {
        j = new SmokeBubble(b, g, Math.random() + 3, Math.random() * 15, Math.random() * 15);
        if (c < 5) {
            j.sprite.expandsSlowly = true;
            j.sprite.radius = 3
        }
        if (c === 4) {
            j.sprite.fillStyle = "rgb(255,255,0)"
        }
        if (c === 3) {
            j.sprite.fillStyle = "rgb(255,255,0)"
        }
        if (c === 0 || c === 1) {
            j.sprite.fillStyle = "rgb(0,0,0)"
        }
        if (c === 2) {
            j.sprite.fillStyle = "rgba(0,0,0," + Math.random() + ")"
        }
        this.smokeBubbles.push(j)
    }
    for (c = 0; c < d; ++c) {
        if (c % 2 === 0) {
            f = new FireParticle(b + Math.random() * 5, g - Math.random() * 2, Math.random() * 2, "rgba(255,255,0,0.3)")
        }
        f = new FireParticle(b + Math.random() * 5, g - Math.random() * 2, Math.random() * 3, "rgba(255,104,31,0.2)");
        this.fireParticles.push(f)
    }
    this.top = g;
    this.left = b;
    this.width = a;
    this.behaviors = [];
    this.visible = true;
    this.type = "smoking hole";
    this.cursor = 0;
    this.firstSmokeBubbleTimer = this.smokeBubbles[0].sprite.timer;
    setTimeout(function () {
        h.firstSmokeBubbleTimer.start()
    }, Math.random() * 5000);
    this.inactivityTimer = new AnimationTimer(2000, AnimationTimer.makeLinear())
};
SmokingHole.prototype = {
    pause: function () {
        if (this.firstSmokeBubbleTimer.isRunning() && !this.firstSmokeBubbleTimer.isOver) {
            this.firstSmokeBubbleTimer.pause()
        }
        for (var a = 0; a < this.smokeBubbles.length; ++a) {
            this.smokeBubbles[a].sprite.timer.pause()
        }
    },
    unpause: function () {
        this.firstSmokeBubbleTimer.unpause();
        for (var a = 0; a < this.smokeBubbles.length; ++a) {
            this.smokeBubbles[a].sprite.timer.unpause()
        }
    },
    revealFire: function () {
        for (var a = 0; a < this.fireParticles.length; ++a) {
            this.fireParticles[a].visible = true
        }
    },
    hideFire: function () {
        for (var a = 0; a < this.fireParticles.length; ++a) {
            this.fireParticles[a].visible = false
        }
    },
    advanceCursor: function () {
        if (this.cursor < this.smokeBubbles.length - 1) {
            ++this.cursor
        } else {
            this.cursor = 0
        }
    },
    revealNextParticle: function () {
        if (this.firstSmokeBubbleTimer.isRunning()) {
            this.advanceCursor();
            this.smokeBubbles[this.cursor].visible = true
        }
    },
    isActive: function () {
        return !this.inactivityTimer.isRunning()
    },
    hasFirstBubbleDisappeared: function () {
        return this.firstSmokeBubbleTimer.isOver()
    },
    updateInactivityTimer: function () {
        var a;
        if (this.inactivityTimer.isRunning()) {
            a = this.inactivityTimer.getElapsedTime();
            if (this.inactivityTimer.isOver()) {
                this.inactivityTimer.stop();
                this.inactivityTimer.reset()
            } else {
                if (a / this.inactivityTimer.duration > 0.5) {
                    this.revealFire()
                }
            }
        }
    },
    update: function (b, d) {
        var c;
        if (!this.isActive()) {
            this.updateInactivityTimer();
            return
        }
        if (this.hasFirstBubbleDisappeared()) {
            this.inactivityTimer.duration = Math.random() * 6000;
            this.inactivityTimer.start();
            return
        }
        c = this.firstSmokeBubbleTimer.getElapsedTime();
        if (this.firstSmokeBubbleTimer.isRunning()) {
            if (c / this.firstSmokeBubbleTimer.duration > 0.6) {
                this.hideFire()
            }
        }
        for (var a = 0; a < this.smokeBubbles.length; ++a) {
            if (this.smokeBubbles[a].visible) {
                this.smokeBubbles[a].sprite.update(b, d)
            }
        }
        for (var a = 0; a < this.fireParticles.length; ++a) {
            if (this.fireParticles[a].visible) {
                this.fireParticles[a].sprite.update(b, d)
            }
        }
    },
    paintFire: function (b) {
        for (var a = 0; a < this.fireParticles.length; ++a) {
            if (this.fireParticles[a].visible) {
                this.fireParticles[a].sprite.paint(b)
            }
        }
    },
    paintSmoke: function (b) {
        for (var a = 0; a < this.smokeBubbles.length; ++a) {
            if (this.smokeBubbles[a].visible) {
                this.smokeBubbles[a].sprite.paint(b)
            }
        }
    },
    paint: function (a) {
        if (!this.isActive()) {
            this.paintFire(a);
            return
        }
        this.revealNextParticle();
        this.paintFire(a);
        this.paintSmoke(a)
    },
};
window.requestNextAnimationFrame = (function () {
    var c = undefined,
        g = undefined,
        f = undefined,
        e = 0,
        d = navigator.userAgent,
        b = 0,
        a = this;
    if (window.webkitRequestAnimationFrame) {
        g = function (h) {
            if (h === undefined) {
                h = +new Date()
            }
            a.callback(h)
        };
        c = window.webkitRequestAnimationFrame;
        window.webkitRequestAnimationFrame = function (i, h) {
            a.callback = i;
            c(g, h)
        }
    }
    if (window.mozRequestAnimationFrame) {
        b = d.indexOf("rv:");
        if (d.indexOf("Gecko") != -1) {
            e = d.substr(b + 3, 3);
            if (e === "2.0") {
                window.mozRequestAnimationFrame = undefined
            }
        }
    }
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (k, i) {
        var j, h;
        window.setTimeout(function () {
            j = +new Date();
            k(j);
            h = +new Date();
            a.timeout = 1000 / 60 - (h - j)
        }, a.timeout)
    }
})();
Bounce = function (b, a, c) {
    this.riseTime = b || 800;
    this.fallTime = a || 800;
    this.distance = c || 30;
    this.riseTimer = new AnimationTimer(this.riseTime, AnimationTimer.makeEaseOut(1));
    this.fallTimer = new AnimationTimer(this.fallTime, AnimationTimer.makeEaseIn(1));
    this.paused = false
};
Bounce.prototype = {
    pause: function () {
        if (!this.riseTimer.isPaused()) {
            this.riseTimer.pause()
        }
        if (!this.fallTimer.isPaused()) {
            this.fallTimer.pause()
        }
        this.paused = true
    },
    unpause: function () {
        if (this.riseTimer.isPaused()) {
            this.riseTimer.unpause()
        }
        if (this.fallTimer.isPaused()) {
            this.fallTimer.unpause()
        }
        this.paused = false
    },
    startRising: function (a) {
        this.baseline = a.top;
        this.bounceStart = a.top;
        this.riseTimer.start()
    },
    rise: function (b) {
        var a = this.riseTimer.getElapsedTime();
        b.top = this.baseline - parseFloat((a / this.riseTime) * this.distance)
    },
    finishRising: function (a) {
        this.riseTimer.stop();
        this.baseline = a.top;
        this.fallTimer.start()
    },
    isFalling: function () {
        return this.fallTimer.isRunning()
    },
    isRising: function () {
        return this.riseTimer.isRunning()
    },
    fall: function (b) {
        var a = this.fallTimer.getElapsedTime();
        b.top = this.baseline + parseFloat((a / this.fallTime) * this.distance)
    },
    finishFalling: function (a) {
        this.fallTimer.stop();
        a.top = this.bounceStart;
        this.startRising(a)
    },
    execute: function (a, c, b) {
        if (this.paused || !this.isRising() && !this.isFalling()) {
            this.startRising(a);
            return
        }
        if (this.isRising()) {
            if (!this.riseTimer.isOver()) {
                this.rise(a)
            } else {
                this.finishRising(a)
            }
        } else {
            if (this.isFalling()) {
                if (!this.fallTimer.isOver()) {
                    this.fall(a)
                } else {
                    this.finishFalling(a)
                }
            }
        }
    }
};
Cycle = function (a, b) {
    this.interval = a || 0;
    this.delay = b || 0;
    this.lastAdvance = 0
};
Cycle.prototype = {
    execute: function (a, c, b) {
        if (this.lastAdvance === 0) {
            this.lastAdvance = c
        }
        if (this.delay && a.painter.cellIndex === 0) {
            if (c - this.lastAdvance > this.delay) {
                a.painter.advance();
                this.lastAdvance = c
            }
        } else {
            if (c - this.lastAdvance > this.interval) {
                a.painter.advance();
                this.lastAdvance = c
            }
        }
    }
};
Pulse = function (c, b, a) {
    this.time = c || 1000;
    this.holdTime = b || 0;
    this.brightTimer = new AnimationTimer(this.time, AnimationTimer.makeEaseIn(1));
    this.dimTimer = new AnimationTimer(this.time, AnimationTimer.makeEaseOut(1));
    this.opacityThreshold = a
}, Pulse.prototype = {
    startDimming: function (a) {
        this.dimTimer.start()
    },
    dim: function (a) {
        elapsedTime = this.dimTimer.getElapsedTime();
        a.opacity = 1 - ((1 - this.opacityThreshold) * (parseFloat(elapsedTime) / this.time))
    },
    finishDimming: function (b) {
        var a = this;
        this.dimTimer.stop();
        setTimeout(function (c) {
            a.brightTimer.start()
        }, 100)
    },
    isBrightening: function () {
        return this.brightTimer.isRunning()
    },
    isDimming: function () {
        return this.dimTimer.isRunning()
    },
    brighten: function (a) {
        elapsedTime = this.brightTimer.getElapsedTime();
        a.opacity += (1 - this.opacityThreshold) * parseFloat(elapsedTime) / this.time
    },
    finishBrightening: function (b) {
        var a = this;
        this.brightTimer.stop();
        setTimeout(function (c) {
            a.dimTimer.start()
        }, 100)
    },
    execute: function (b, d, c) {
        var a;
        if (!this.isDimming() && !this.isBrightening()) {
            this.startDimming(b);
            return
        }
        if (this.isDimming()) {
            if (!this.dimTimer.isOver()) {
                this.dim(b)
            } else {
                this.finishDimming(b)
            }
        } else {
            if (this.isBrightening()) {
                if (!this.brightTimer.isOver()) {
                    this.brighten(b)
                } else {
                    this.finishBrightening(b)
                }
            }
        }
    }
};
var canvas = document.getElementById("game-canvas"),
    context = canvas.getContext("2d"),
    LEFT = 1,
    RIGHT = 2,
    BACKGROUND_VELOCITY = 32,
    BAT_CELLS_HEIGHT = 34,
    BAT_FAST_FLAP_DURATION = 50,
    BAT_SLOW_FLAP_DURATION = 100,
    BEE_CELLS_WIDTH = 50,
    BEE_CELLS_HEIGHT = 50,
    BRIGHT = 1,
    BUTTON_CELLS_HEIGHT = 22,
    BUTTON_CELLS_WIDTH = 30,
    BUTTON_PACE_VELOCITY = 50,
    COIN_CELLS_HEIGHT = 28,
    COIN_CELLS_WIDTH = 28,
    CREDITS_DISPLAY_TIME = 10000,
    CREDITS_OPACITY = 0.9,
    DEFAULT_TOAST_TIME = 3000,
    DIM = 0.6,
    INSTRUCTIONS_DIMMING_DELAY = 50,
    INSTRUCTIONS_DIM_OPACITY = 0.6,
    EXPLOSION_CELLS_HEIGHT = 62,
    EXPLOSION_DURATION = 1000,
    FPS_SLOW_CHECK_DELAY = 1000,
    FPS_SPEED_THRESHOLD = 40,
    GAME_CANVAS_DIM_OPACITY = 0.01,
    GAME_HEIGHT_IN_METERS = 5,
    GAME_HEIGHT_IN_PIXELS = 400,
    GAME_OVER_VELOCITY = 8,
    GAME_OVER_PAUSE_DURATION = 2000,
    GRAVITY_FORCE = 9.81,
    LEVEL_ADVANCE_DELAY = 2000,
    LEVEL_COMPLETE_CONGRATULATIONS = "Level complete. Nice job!",
    PAUSE_DELAY = 500,
    PIXELS_PER_METER = GAME_HEIGHT_IN_PIXELS / GAME_HEIGHT_IN_METERS,
    PLATFORM_HEIGHT = 8,
    PLATFORM_STROKE_WIDTH = 2,
    PLATFORM_STROKE_STYLE = "rgb(0,0,0)",
    PLATFORM_VELOCITY_MULTIPLIER = 5.5,
    RUBY_CELLS_HEIGHT = 32,
    RUBY_CELLS_WIDTH = 32,
    RUNNER_CELLS_HEIGHT = 60,
    RUNNER_PAGE_FLIP_INTERVAL = 32,
    RUNNER_JUMP_DURATION = 1000,
    RUNNER_JUMP_HEIGHT = 120,
    SAPPHIRE_CELLS_HEIGHT = 32,
    SAPPHIRE_CELLS_WIDTH = 32,
    SILENT = true,
    SNAIL_BOMB_VELOCITY = 800,
    SNAIL_BOMB_CELLS_HEIGHT = 20,
    SNAIL_CELLS_WIDTH = 64,
    SNAIL_CELLS_HEIGHT = 34,
    START_GAME_MESSAGE = "<p>Good Luck!</p>",
    STARTING_BACKGROUND_VELOCITY = 0,
    STARTING_PLATFORM_OFFSET = 0,
    STARTING_BACKGROUND_OFFSET = 0,
    STARTING_RUNNER_LEFT = 50,
    STARTING_RUNNER_TRACK = 1,
    STARTING_RUNNER_VELOCITY = 0,
    STARTING_PAGEFLIP_INTERVAL = -1,
    TWEET_PREAMBLE = "https://twitter.com/intent/tweet?text=I scored ",
    TWEET_PROLOGUE = " playing this HTML5 Canvas platformer: http://bit.ly/NDV761 &hashtags=html5",
    slowFlags = 0,
    firstSlowFlagTime = 0,
    lastSlowWarningTime = 0,
    showSlowWarning = true,
    runnerHasMoved = false,
    COIN_VOLUME = 1,
    SOUNDTRACK_VOLUME = 0.12,
    JUMP_WHISTLE_VOLUME = 0.05,
    LANDING_VOLUME = 0.2,
    FALLING_WHISTLE_VOLUME = 0.1,
    EXPLOSION_VOLUME = 0.25,
    SECONDARY_EXPLOSION_VOLUME = 0.25,
    CHIMES_VOLUME = 1,
    TRACK_1_BASELINE = 323,
    TRACK_2_BASELINE = 223,
    TRACK_3_BASELINE = 123,
    BAT_SCORE = 20,
    BEE_SCORE = 30,
    COIN_SCORE = 25,
    RUBY_SCORE = 100,
    SAPPHIRE_SCORE = 250,
    soundOn = true,
    audioTracks = [new Audio(), new Audio(), new Audio(), new Audio(), new Audio(), new Audio(), new Audio(), new Audio()],
    copyright = document.getElementById("copyright"),
    soundtrack = document.getElementById("soundtrack"),
    runningSlowly = document.getElementById("running-slowly"),
    slowlyOkay = document.getElementById("slowly-okay"),
    slowlyDontShow = document.getElementById("slowly-dont-show"),
    chimesSound = document.getElementById("chimes-sound"),
    explosionSound = document.getElementById("explosion-sound"),
    fallingWhistleSound = document.getElementById("whistle-down-sound"),
    coinSound = document.getElementById("coin-sound"),
    jumpWhistleSound = document.getElementById("jump-sound"),
    landingSound = document.getElementById("thud-sound"),
    toast = document.getElementById("toast"),
    soundAndMusic = document.getElementById("sound-and-music"),
    instructions = document.getElementById("instructions"),
    scoreElement = document.getElementById("score"),
    tweetElement = document.getElementById("tweet"),
    lifeIconLeft = document.getElementById("life-icon-left"),
    lifeIconMiddle = document.getElementById("life-icon-middle"),
    lifeIconRight = document.getElementById("life-icon-right"),
    creditsElement = document.getElementById("credits"),
    newGameLink = document.getElementById("new-game-link"),
    soundCheckbox = document.getElementById("sound-checkbox"),
    musicCheckbox = document.getElementById("music-checkbox"),
    fpsToast = document.getElementById("fps"),
    leftControl = document.getElementById("left-control-div"),
    rightControl = document.getElementById("right-control-div"),
    runnerPageflipInterval = STARTING_PAGEFLIP_INTERVAL,
    score = 0,
    lives = 3,
    paused = false,
    pauseStart = 0,
    totalTimePaused = 0,
    countingDown = false,
    transitioning = false,
    background = new Image(),
    spritesheet = new Image(),
    lastAnimationFrameTime = 0,
    fps = 60,
    touchTime = 0,
    backgroundOffset = STARTING_BACKGROUND_OFFSET,
    platformOffset = STARTING_PLATFORM_OFFSET,
    bgVelocity = STARTING_BACKGROUND_VELOCITY,
    platformVelocity, platformData = [{
        left: 10,
        width: 230,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(150,190,255)",
        opacity: 1,
        track: 1,
        pulsate: false,
    }, {
        left: 250,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(150,190,255)",
        opacity: 1,
        track: 2,
        pulsate: false,
    }, {
        left: 400,
        width: 125,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(250,0,0)",
        opacity: 1,
        track: 3,
        pulsate: false
    }, {
        left: 633,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(80,140,230)",
        opacity: 1,
        track: 1,
        pulsate: false,
    }, {
        left: 810,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(200,200,0)",
        opacity: 1,
        track: 2,
        pulsate: false
    }, {
        left: 1025,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(80,140,230)",
        opacity: 1,
        track: 2,
        pulsate: false
    }, {
        left: 1200,
        width: 125,
        height: PLATFORM_HEIGHT,
        fillStyle: "aqua",
        opacity: 1,
        track: 3,
        pulsate: false
    }, {
        left: 1400,
        width: 180,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(80,140,230)",
        opacity: 1,
        track: 1,
        pulsate: false,
    }, {
        left: 1625,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(200,200,0)",
        opacity: 1,
        track: 2,
        pulsate: false
    }, {
        left: 1800,
        width: 250,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(80,140,230)",
        opacity: 1,
        track: 1,
        pulsate: false
    }, {
        left: 2000,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "rgb(200,200,80)",
        opacity: 1,
        track: 2,
        pulsate: false
    }, {
        left: 2100,
        width: 100,
        height: PLATFORM_HEIGHT,
        fillStyle: "aqua",
        opacity: 1,
        track: 3,
    }, {
        left: 2269,
        width: 200,
        height: PLATFORM_HEIGHT,
        fillStyle: "gold",
        opacity: 1,
        track: 1,
    }, {
        left: 2500,
        width: 200,
        height: PLATFORM_HEIGHT,
        fillStyle: "#2b950a",
        opacity: 1,
        track: 2,
        snail: true
    }, ],
    batData = [{
        left: 1150,
        top: TRACK_2_BASELINE - BAT_CELLS_HEIGHT
    }, {
        left: 1720,
        top: TRACK_2_BASELINE - 2 * BAT_CELLS_HEIGHT
    }, {
        left: 2000,
        top: TRACK_3_BASELINE
    }, {
        left: 2200,
        top: TRACK_3_BASELINE - BAT_CELLS_HEIGHT
    }, {
        left: 2400,
        top: TRACK_3_BASELINE - 2 * BAT_CELLS_HEIGHT
    }, ],
    beeData = [{
        left: 500,
        top: 64
    }, {
        left: 944,
        top: TRACK_2_BASELINE - BEE_CELLS_HEIGHT - 30
    }, {
        left: 1600,
        top: 125
    }, {
        left: 2225,
        top: 125
    }, {
        left: 2295,
        top: 275
    }, {
        left: 2450,
        top: 275
    }, ],
    buttonData = [{
        platformIndex: 7
    }, {
        platformIndex: 12
    }, ],
    coinData = [{
        left: 303,
        top: TRACK_2_BASELINE - COIN_CELLS_HEIGHT
    }, {
        left: 469,
        top: TRACK_3_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 600,
        top: TRACK_1_BASELINE - COIN_CELLS_HEIGHT
    }, {
        left: 833,
        top: TRACK_2_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 1050,
        top: TRACK_2_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 1500,
        top: TRACK_1_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 1670,
        top: TRACK_2_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 1870,
        top: TRACK_1_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 1930,
        top: TRACK_1_BASELINE - 2 * COIN_CELLS_HEIGHT
    }, {
        left: 2200,
        top: TRACK_3_BASELINE - 3 * COIN_CELLS_HEIGHT
    }, ],
    rubyData = [{
        left: 200,
        top: TRACK_1_BASELINE - RUBY_CELLS_HEIGHT
    }, {
        left: 880,
        top: TRACK_2_BASELINE - RUBY_CELLS_HEIGHT
    }, {
        left: 1100,
        top: TRACK_2_BASELINE - 2 * SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 1475,
        top: TRACK_1_BASELINE - RUBY_CELLS_HEIGHT
    }, ],
    sapphireData = [{
        left: 680,
        top: TRACK_1_BASELINE - SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 1700,
        top: TRACK_2_BASELINE - SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 2056,
        top: TRACK_2_BASELINE - 3 * SAPPHIRE_CELLS_HEIGHT / 2
    }, {
        left: 2333,
        top: TRACK_2_BASELINE - SAPPHIRE_CELLS_HEIGHT
    }, ],
    smokingHoleData = [{
        left: 248,
        top: TRACK_2_BASELINE - 22
    }, {
        left: 850,
        top: TRACK_1_BASELINE - 122
    }, ],
    snailData = [{
        platformIndex: 13
    }, ],
    snailBombData = [{
        left: 2585,
        top: TRACK_2_BASELINE - SNAIL_CELLS_HEIGHT + SNAIL_BOMB_CELLS_HEIGHT / 2
    }],
    batCells = [{
        left: 1,
        top: 0,
        width: 32,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 38,
        top: 0,
        width: 46,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 90,
        top: 0,
        width: 32,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 129,
        top: 0,
        width: 46,
        height: BAT_CELLS_HEIGHT
    }, ],
    batRedEyeCells = [{
        left: 185,
        top: 0,
        width: 32,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 222,
        top: 0,
        width: 46,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 273,
        top: 0,
        width: 32,
        height: BAT_CELLS_HEIGHT
    }, {
        left: 313,
        top: 0,
        width: 46,
        height: BAT_CELLS_HEIGHT
    }, ],
    beeCells = [{
        left: 5,
        top: 234,
        width: BEE_CELLS_WIDTH,
        height: BEE_CELLS_HEIGHT
    }, {
        left: 75,
        top: 234,
        width: BEE_CELLS_WIDTH,
        height: BEE_CELLS_HEIGHT
    }, {
        left: 145,
        top: 234,
        width: BEE_CELLS_WIDTH,
        height: BEE_CELLS_HEIGHT
    }],
    buttonCells = [{
        left: 2,
        top: 190,
        width: BUTTON_CELLS_WIDTH,
        height: BUTTON_CELLS_HEIGHT
    }, {
        left: 45,
        top: 190,
        width: BUTTON_CELLS_WIDTH,
        height: BUTTON_CELLS_HEIGHT
    }],
    coinCells = [{
        left: 2,
        top: 540,
        width: COIN_CELLS_WIDTH,
        height: COIN_CELLS_HEIGHT
    }],
    explosionCells = [{
        left: 1,
        top: 48,
        width: 50,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 60,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 143,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 230,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 305,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 389,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }, {
        left: 470,
        top: 48,
        width: 68,
        height: EXPLOSION_CELLS_HEIGHT
    }],
    goldButtonCells = [{
        left: 88,
        top: 190,
        width: BUTTON_CELLS_WIDTH,
        height: BUTTON_CELLS_HEIGHT
    }, {
        left: 130,
        top: 190,
        width: BUTTON_CELLS_WIDTH,
        height: BUTTON_CELLS_HEIGHT
    }],
    rubyCells = [{
        left: 3,
        top: 135,
        width: RUBY_CELLS_WIDTH,
        height: RUBY_CELLS_HEIGHT
    }, {
        left: 39,
        top: 135,
        width: RUBY_CELLS_WIDTH,
        height: RUBY_CELLS_HEIGHT
    }, {
        left: 76,
        top: 135,
        width: RUBY_CELLS_WIDTH,
        height: RUBY_CELLS_HEIGHT
    }, {
        left: 112,
        top: 135,
        width: RUBY_CELLS_WIDTH,
        height: RUBY_CELLS_HEIGHT
    }, {
        left: 148,
        top: 135,
        width: RUBY_CELLS_WIDTH,
        height: RUBY_CELLS_HEIGHT
    }],
    runnerCellsRight = [{
        left: 414,
        top: 375,
        width: 47,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 362,
        top: 375,
        width: 44,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 314,
        top: 375,
        width: 39,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 265,
        top: 375,
        width: 46,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 205,
        top: 375,
        width: 49,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 150,
        top: 375,
        width: 46,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 96,
        top: 375,
        width: 42,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 45,
        top: 375,
        width: 35,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 0,
        top: 375,
        width: 35,
        height: RUNNER_CELLS_HEIGHT
    }],
    runnerCellsLeft = [{
        left: 0,
        top: 295,
        width: 47,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 55,
        top: 295,
        width: 44,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 107,
        top: 295,
        width: 39,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 152,
        top: 295,
        width: 46,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 208,
        top: 295,
        width: 49,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 265,
        top: 295,
        width: 46,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 320,
        top: 295,
        width: 42,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 380,
        top: 295,
        width: 35,
        height: RUNNER_CELLS_HEIGHT
    }, {
        left: 425,
        top: 295,
        width: 35,
        height: RUNNER_CELLS_HEIGHT
    }, ],
    sapphireCells = [{
        left: 185,
        top: 135,
        width: SAPPHIRE_CELLS_WIDTH,
        height: SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 220,
        top: 135,
        width: SAPPHIRE_CELLS_WIDTH,
        height: SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 258,
        top: 135,
        width: SAPPHIRE_CELLS_WIDTH,
        height: SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 294,
        top: 135,
        width: SAPPHIRE_CELLS_WIDTH,
        height: SAPPHIRE_CELLS_HEIGHT
    }, {
        left: 331,
        top: 135,
        width: SAPPHIRE_CELLS_WIDTH,
        height: SAPPHIRE_CELLS_HEIGHT
    }],
    snailBombCells = [{
        left: 2,
        top: 512,
        width: 30,
        height: 20
    }],
    snailCells = [{
        left: 142,
        top: 466,
        width: SNAIL_CELLS_WIDTH,
        height: SNAIL_CELLS_HEIGHT
    }, {
        left: 75,
        top: 466,
        width: SNAIL_CELLS_WIDTH,
        height: SNAIL_CELLS_HEIGHT
    }, {
        left: 2,
        top: 466,
        width: SNAIL_CELLS_WIDTH,
        height: SNAIL_CELLS_HEIGHT
    }, ],
    explosionAnimator = new SpriteAnimator(explosionCells, EXPLOSION_DURATION, function (b, a) {
        b.exploding = false
    }),
    gameTimer = new AnimationTimer(1, AnimationTimer.makeLinear(1)),
    runInPlace = {
        lastAdvanceTime: 0,
        execute: function (a, c, b) {
            if (a.jumping || a.falling || runnerPageflipInterval === -1) {
                return
            }
            if (this.lastAdvanceTime === 0) {
                this.lastAdvanceTime = c
            } else {
                if (c - this.lastAdvanceTime > runnerPageflipInterval) {
                    a.painter.advance();
                    this.lastAdvanceTime = c
                }
            }
        }
    }, moveLaterally = {
        lastMove: 0,
        execute: function (b, d, c) {
            var a = d - this.lastMove;
            if (this.lastMove !== 0) {
                b.left += (a / 1000) * b.velocityX;
                this.lastMove = d
            }
            this.lastMove = d
        }
    }, jump = {
        pause: function () {
            if (!runner.jumpAscendTimer.isPaused()) {
                runner.jumpAscendTimer.pause()
            }
            if (!runner.jumpDescendTimer.isPaused()) {
                runner.jumpDescendTimer.pause()
            }
        },
        unpause: function () {
            if (runner.jumpAscendTimer.isPaused()) {
                runner.jumpAscendTimer.unpause()
            }
            if (runner.jumpDescendTimer.isPaused()) {
                runner.jumpDescendTimer.unpause()
            }
        },
        jumpIsOver: function (a) {
            return !a.jumpAscendTimer.isRunning() && !a.jumpDescendTimer.isRunning()
        },
        finishJump: function (a) {
            a.jumping = false
        },
        landOnPlatform: function (c, b) {
            var a = platforms[b],
                d;
            if (a.track === 2) {
                d = TRACK_2_BASELINE
            } else {
                if (a.track === 3) {
                    d = TRACK_3_BASELINE
                }
            }
            c.top = d - c.height - PLATFORM_STROKE_WIDTH
        },
        isAscending: function (a) {
            return a.jumpAscendTimer.isRunning()
        },
        ascend: function (d) {
            var c = d.jumpAscendTimer.getElapsedTime(),
                b = c / (d.JUMP_DURATION / 2),
                a = b * d.JUMP_HEIGHT_IN_PIXELS;
            d.top = d.startJumpTop - a
        },
        finishAscent: function (b) {
            var a = onPlatform(b, b.track + 1);
            b.dropHeight = b.startJumpTop - b.top;
            b.jumpAscendTimer.stop();
            if (a !== -1) {
                b.track++;
                this.landOnPlatform(b, a);
                this.finishJump(b)
            } else {
                b.jumpDescendTimer.start()
            }
        },
        isDoneAscending: function (a) {
            return a.jumpAscendTimer.isOver()
        },
        descend: function (a) {
            elapsedTime = a.jumpDescendTimer.getElapsedTime();
            elapsedPercent = elapsedTime / (a.JUMP_DURATION / 2);
            height = elapsedPercent * a.dropHeight;
            a.top = a.startJumpTop - a.dropHeight + height
        },
        isDescending: function (a) {
            return a.jumpDescendTimer.isRunning()
        },
        isDoneDescending: function (a) {
            return a.jumpDescendTimer.isOver()
        },
        finishDescent: function (c) {
            var b = onPlatform(c),
                d, a;
            if (b === -1) {
                a = GRAVITY_FORCE * (c.jumpDescendTimer.getElapsedTime() / 1000) * PIXELS_PER_METER;
                c.fall(a)
            } else {
                c.top = c.startJumpTop;
                playSound(landingSound)
            }
            c.jumpDescendTimer.stop();
            c.jumping = false
        },
        execute: function (a, c, b) {
            if (!a.jumping) {
                return
            }
            if (this.jumpIsOver(a)) {
                this.finishJump(a);
                return
            }
            if (this.isAscending(a)) {
                if (!this.isDoneAscending(a)) {
                    this.ascend(a)
                } else {
                    this.finishAscent(a)
                }
            } else {
                if (this.isDescending(a)) {
                    if (!this.isDoneDescending(a)) {
                        this.descend(a)
                    } else {
                        this.finishDescent(a)
                    }
                }
            }
        }
    }, fall = {
        pause: function () {
            if (!runner.fallTimer.isPaused()) {
                runner.fallTimer.pause()
            }
        },
        unpause: function () {
            if (runner.fallTimer.isPaused()) {
                runner.fallTimer.unpause()
            }
        },
        handleButtonCollision: function (e, d) {
            var f = e.left + e.width,
                c = e.left + e.width / 2,
                b = e.left,
                g = d.left - d.offset,
                a = g + d.width;
            if ((b > g && b < a) || (c > g && c < a) || (f > g && f < a)) {
                d.painter.advance();
                if (d.painter.cells === goldButtonCells) {
                    increaseScore(500)
                }
                explode(bees[2]);
                explode(bats[1]);
                setTimeout(function (h) {
                    bees[2].visible = true
                }, 1500);
                setTimeout(function (h) {
                    bats[1].visible = true
                }, 2000)
            }
        },
        landOnPlatform: function (b, c) {
            b.top = c - b.height - PLATFORM_STROKE_WIDTH;
            for (var a = 0; a < buttons.length; ++a) {
                this.handleButtonCollision(b, buttons[a])
            }
            playSound(landingSound)
        },
        stopFalling: function (a) {
            a.falling = false;
            a.fallTimer.stop()
        },
        execute: function (c, g, f) {
            var b = onPlatform(c),
                d, a, e;
            if (c.jumping) {
                return
            }
            if (c.falling) {
                if (c.top > TRACK_1_BASELINE) {
                    playSound(fallingWhistleSound)
                }
                if (c.top < canvas.height) {
                    e = calculatePlatformTop(c.track);
                    d = c.fallTimer.getElapsedTime();
                    c.velocityY = c.initialVelocityY + GRAVITY_FORCE * (d / 1000) * PIXELS_PER_METER;
                    a = c.velocityY / f;
                    if (c.top + c.height + a > e) {
                        if (b !== -1) {
                            this.landOnPlatform(c, e);
                            this.stopFalling(c);
                            if (b === platforms.length - 2) {
                                advanceToNextLevel()
                            }
                            return
                        }
                        c.track--
                    }
                    c.top += a
                } else {
                    c.visible = false;
                    this.stopFalling(c);
                    loseLife();
                    return
                }
            }
            if (!c.falling && b === -1) {
                c.fall()
            }
        }
    }, runnerCollide = {
        didCollide: function (b, g) {
            var f = b.left + b.width / 2,
                d = b.top + b.height / 2,
                a = b.top + b.height,
                e = g.left - g.offset,
                c = false;
            if (f > e && f < e + g.width) {
                c = (d > g.top && d < g.top + g.height) || (a > g.top && a < g.top + g.height)
            }
            return c
        },
        execute: function (b, e, d) {
            var c, f;
            for (var a = 0; a < sprites.length; ++a) {
                f = sprites[a];
                if ("runner" === f.type || "platform" === f.type || "button" === f.type || "bomb" === f.type || !f.visible || f.exploding) {
                    continue
                }
                if (this.didCollide(b, f)) {
                    if ("bat" === f.type) {
                        decreaseScore(BAT_SCORE)
                    } else {
                        if ("bee" === f.type) {
                            decreaseScore(BEE_SCORE)
                        } else {
                            if ("coin" === f.type) {
                                increaseScore(COIN_SCORE)
                            } else {
                                if ("sapphire" === f.type) {
                                    increaseScore(SAPPHIRE_SCORE)
                                } else {
                                    if ("ruby" === f.type) {
                                        increaseScore(RUBY_SCORE)
                                    }
                                }
                            }
                        }
                    } if ("bat" === f.type || "bee" === f.type || "snail" === f.type) {
                        explodeAndLoseLife(b);
                        shake();
                        break
                    }
                    if ("coin" === f.type || "ruby" === f.type || "sapphire" === f.type) {
                        temporarilyHide(f, 2000);
                        if ("coin" === f.type) {
                            playSound(coinSound)
                        } else {
                            playSound(chimesSound)
                        }
                    }
                }
            }
        }
    }, pace = {
        execute: function (b, e, d) {
            var c = b.left + b.width,
                f = b.platform.left + b.platform.width,
                a = b.velocityX / d;
            if (b.direction === undefined) {
                b.direction = RIGHT
            }
            if (b.velocityX === 0) {
                b.velocityX = BUTTON_PACE_VELOCITY
            }
            if (c > f && b.direction === RIGHT) {
                b.direction = LEFT
            } else {
                if (b.left < b.platform.left && b.direction === LEFT) {
                    b.direction = RIGHT
                }
            } if (b.direction === RIGHT) {
                b.left += a
            } else {
                b.left -= a
            }
        }
    }, snailBombShoot = {
        execute: function (a, d, c) {
            var b = a.bomb;
            if (!spriteInView(a)) {
                return
            }
            if (!b.visible && a.painter.cellIndex === 2) {
                b.left = a.left;
                b.visible = true
            }
        }
    }, snailBombCollide = {
        execute: function (h, d, c) {
            var i = h.left - h.offset + h.width,
                f = h.left - h.offset + h.width / 2,
                g = h.left,
                b = runner.left,
                e = b + runner.width,
                a = false;
            if (runner.exploding || transitioning) {
                return
            }
            if ((i > b && i < e) || (f > b && f < e) || (i > b && i < e)) {
                if ((h.top + h.width / 2) > runner.top && (h.top + h.width / 2) < runner.top + runner.height) {
                    explodeAndLoseLife(runner);
                    shake()
                }
            }
        }
    }, snailBombMove = {
        execute: function (a, c, b) {
            if (a.visible && spriteInView(a)) {
                a.left -= SNAIL_BOMB_VELOCITY / b
            } else {
                if (a.visible && !spriteInView(a)) {
                    a.visible = false
                }
            }
        }
    }, runnerPainter = new SpriteSheetPainter(spritesheet, runnerCellsRight),
    platformPainter = {
        paint: function (b, a) {
            var c;
            a.save();
            a.translate(-platformOffset, 0);
            c = calculatePlatformTop(b.track);
            a.lineWidth = PLATFORM_STROKE_WIDTH;
            a.strokeStyle = PLATFORM_STROKE_STYLE;
            a.fillStyle = b.fillStyle;
            a.strokeRect(b.left, c, b.width, b.height);
            a.fillRect(b.left, c, b.width, b.height);
            a.restore()
        }
    }, bats = [],
    bees = [],
    buttons = [],
    coins = [],
    platforms = [],
    rubies = [],
    sapphires = [],
    smokingHoles = [],
    snails = [],
    snailBombs = [],
    runner = new Sprite("runner", runnerPainter),
    sprites = [runner];

function draw(a) {
    setPlatformVelocity();
    setTranslationOffsets();
    drawBackground();
    updateSprites(a);
    paintSprites()
}

function setPlatformVelocity() {
    platformVelocity = bgVelocity * PLATFORM_VELOCITY_MULTIPLIER
}

function setTranslationOffsets() {
    setBackgroundTranslationOffset();
    setPlatformTranslationOffset();
    setSpriteTranslationOffsets()
}

function setBackgroundTranslationOffset() {
    var a = backgroundOffset + bgVelocity / fps;
    if (a > 0 && a < background.width) {
        backgroundOffset = a
    } else {
        backgroundOffset = 0
    }
}

function setPlatformTranslationOffset() {
    platformOffset += platformVelocity / fps
}

function setSpriteTranslationOffsets() {
    var b, a;
    for (b = 0; b < sprites.length; ++b) {
        a = sprites[b];
        if ("runner" !== a.type && "smoking hole" !== a.type) {
            a.offset = platformOffset
        } else {
            if ("smoking hole" === a.type) {
                a.offset = backgroundOffset
            }
        }
    }
}

function drawBackground() {
    context.save();
    context.globalAlpha = 1;
    context.translate(-backgroundOffset, 0);
    context.drawImage(background, 0, 0, background.width, background.height);
    context.drawImage(background, background.width, 0, background.width + 1, background.height);
    context.restore()
}

function soundIsPlaying(a) {
    return !a.ended && a.currentTime > 0
}

function playSound(c) {
    var a, b;
    if (soundOn) {
        if (!soundIsPlaying(c)) {
            c.play()
        } else {
            for (b = 0; b < audioTracks.length; ++b) {
                a = audioTracks[b];
                if (!soundIsPlaying(a)) {
                    a.src = c.currentSrc;
                    a.load();
                    a.volume = c.volume;
                    a.play();
                    break
                }
            }
        }
    }
}

function checkFps(a, b) {
    if (a > FPS_SLOW_CHECK_DELAY) {
        if (b < FPS_SPEED_THRESHOLD) {
            if (slowFlags === 0) {
                firstSlowFlagTime = a
            }
            slowFlags++;
            if (slowFlags >= 5 && a - firstSlowFlagTime < 1000) {
                if (a - lastSlowWarningTime > 5000) {
                    runningSlowly.style.display = "block";
                    runningSlowly.style.opacity = 1;
                    lastSlowWarningTime = a
                }
                slowFlags = 0;
                firstSlowFlagTime = 0
            }
        }
    }
}

function calculateFps(a) {
    var b = 1000 / (a - lastAnimationFrameTime);
    if (showSlowWarning && !transitioning & !paused) {
        checkFps(a, b)
    }
    lastAnimationFrameTime = a;
    return b
}

function setSpriteProperties() {
    var b, a;
    equipRunner();
    setInitialSpriteSize(bats, batCells);
    setInitialSpriteSize(bees, beeCells);
    setInitialSpriteSize(buttons, buttonCells);
    setInitialSpriteSize(coins, coinCells);
    setInitialSpriteSize(rubies, rubyCells);
    setInitialSpriteSize(sapphires, sapphireCells);
    setInitialSpriteSize(snails, snailCells);
    positionSprites(bats, batData);
    positionSprites(bees, beeData);
    positionSprites(buttons, buttonData);
    positionSprites(coins, coinData);
    positionSprites(rubies, rubyData);
    positionSprites(sapphires, sapphireData);
    positionSprites(snails, snailData);
    positionSprites(snailBombs, snailBombData);
    setInitialSpriteVisibility();
    for (var b = 0; b < sprites.length; ++b) {
        a = sprites[b];
        if (a.painter && a.painter.cellIndex) {
            a.painter.cellIndex = 0
        }
    }
}

function resetBehaviors() {
    var c, a, d;
    for (c = 0; c < sprites.length; ++c) {
        for (a = 0; a < sprites[c].behaviors.length; ++a) {
            d = sprites[c].behaviors[a];
            if (d.lastAdvance) {
                d.lastAdvance = 0
            }
        }
    }
}

function reset() {
    var c, b;
    if (musicCheckbox.checked) {
        soundtrack.play()
    }
    setSpriteProperties();
    resetBehaviors();
    runInPlace.lastAdvanceTime = 0;
    canvas.style.opacity = GAME_CANVAS_DIM_OPACITY;
    this.lastMove = 0;
    runnerPageflipInterval = STARTING_PAGEFLIP_INTERVAL;
    bgVelocity = STARTING_BACKGROUND_VELOCITY;
    backgroundOffset = STARTING_BACKGROUND_OFFSET;
    platformOffset = STARTING_PLATFORM_OFFSET;
    for (var a = 0; a < buttonData.length; ++a) {
        c = buttons[a];
        c.platform = platforms[buttonData[a].platformIndex];
        c.top = c.platform.top - BUTTON_CELLS_HEIGHT;
        c.left = c.platform.left
    }
    setTimeout(function (d) {
        canvas.style.opacity = 1;
        scoreElement.innerHTML = score;
        transitioning = false
    }, 500)
}

function calculatePlatformTop(a) {
    var b;
    if (a === 1) {
        b = TRACK_1_BASELINE
    } else {
        if (a === 2) {
            b = TRACK_2_BASELINE
        } else {
            if (a === 3) {
                b = TRACK_3_BASELINE
            }
        }
    }
    return b
}

function createBatSprites() {
    var b;
    for (var a = 0; a < batData.length; ++a) {
        if (a % 2 === 0) {
            b = new Sprite("bat", new SpriteSheetPainter(spritesheet, batCells), [new Cycle(BAT_SLOW_FLAP_DURATION)])
        } else {
            b = new Sprite("bat", new SpriteSheetPainter(spritesheet, batRedEyeCells), [new Cycle(BAT_FAST_FLAP_DURATION)])
        }
        bats.push(b)
    }
}

function createBeeSprites() {
    var b;
    for (var a = 0; a < beeData.length; ++a) {
        b = new Sprite("bee", new SpriteSheetPainter(spritesheet, beeCells), [new Cycle(50)]);
        if (a === beeData.length - 2) {
            b.behaviors.push(new Bounce(500, 500, 60))
        } else {
            if (a === beeData.length - 1) {
                b.behaviors.push(new Bounce(1200, 1200, 150))
            }
        }
        bees.push(b)
    }
}

function createButtonSprites() {
    var b;
    for (var a = 0; a < buttonData.length; ++a) {
        if (a === buttonData.length - 1) {
            b = new Sprite("button", new SpriteSheetPainter(spritesheet, goldButtonCells), [pace])
        } else {
            b = new Sprite("button", new SpriteSheetPainter(spritesheet, buttonCells), [pace])
        }
        buttons.push(b)
    }
}

function createCoinSprites() {
    var b, c = new SpriteSheetPainter(spritesheet, coinCells);
    for (var a = 0; a < coinData.length; ++a) {
        if (a % 2 === 0) {
            b = new Sprite("coin", c)
        } else {
            b = new Sprite("coin", c)
        } if (a < 3) {
            if (a !== 1) {
                b.behaviors.push(new Bounce(2000, 2000, 60))
            }
            if (a === 2) {
                b.platform = platforms[3];
                b.behaviors.push(pace)
            }
            if (a === 4) {
                b.platform = platforms[7];
                b.behaviors.push(pace)
            }
        }
        if (a === 1) {
            b.platform = platforms[2];
            b.behaviors.push(pace)
        }
        coins.push(b)
    }
}

function createPlatformSprites() {
    var c, a;
    for (var b = 0; b < platformData.length; ++b) {
        a = platformData[b];
        c = new Sprite("platform-" + b, platformPainter);
        c.left = a.left;
        c.width = a.width;
        c.height = a.height;
        c.fillStyle = a.fillStyle;
        c.opacity = a.opacity;
        c.track = a.track;
        c.button = a.button;
        c.pulsate = a.pulsate;
        c.power = a.power;
        c.top = calculatePlatformTop(a.track);
        if (c.pulsate) {
            c.behaviors = [new Pulse(1000, 100, 0.2)]
        }
        if (b === platformData.length - 2) {
            c.behaviors = [new Pulse(500, 50, 0.3)]
        }
        platforms.push(c)
    }
}

function createSapphireSprites() {
    var b;
    for (var a = 0; a < sapphireData.length; ++a) {
        if (a === 1) {
            b = new Sprite("sapphire", new SpriteSheetPainter(spritesheet, sapphireCells), [new Cycle(60), new Bounce(800, 800, 100)])
        } else {
            b = new Sprite("sapphire", new SpriteSheetPainter(spritesheet, sapphireCells), [new Cycle(80), new Bounce(1800, 1800, 50)])
        }
        sapphires.push(b)
    }
}

function createSmokingHoles() {
    var c, a;
    for (var b = 0; b < smokingHoleData.length; ++b) {
        c = smokingHoleData[b];
        smokingHoles.push(new SmokingHole(20, 2, c.left, c.top, 20))
    }
}

function createRubySprites() {
    var a;
    for (var b = 0; b < rubyData.length; ++b) {
        if (b % 2 === 0) {
            a = new Sprite("ruby", new SpriteSheetPainter(spritesheet, rubyCells), [new Cycle(100), new Bounce(2000, 2000, 100)])
        } else {
            a = new Sprite("ruby", new SpriteSheetPainter(spritesheet, rubyCells), [new Cycle(50), new Bounce(1000, 1000, 100)])
        }
        rubies.push(a)
    }
}

function createSnailSprites() {
    var b;
    for (var a = 0; a < snailData.length; ++a) {
        b = new Sprite("snail", new SpriteSheetPainter(spritesheet, snailCells), [snailBombShoot, new Cycle(200, 2000), pace]);
        b.bomb = new Sprite("snailBomb", new SpriteSheetPainter(spritesheet, snailBombCells), [snailBombMove, snailBombCollide]);
        b.bomb.snail = b;
        snails.push(b);
        snailBombs.push(b.bomb)
    }
}

function updateSprites(a) {
    var c;
    for (var b = 0; b < platforms.length; ++b) {
        platforms[b].update(a, fps)
    }
    for (var b = 0; b < sprites.length; ++b) {
        c = sprites[b];
        if (c.type === "snailBomb" || c.type === "smoking hole" || (c.visible && spriteInView(c))) {
            c.update(a, fps)
        }
    }
}

function paintSprites() {
    var b;
    for (var a = 0; a < sprites.length; ++a) {
        b = sprites[a];
        if (b.type === "smoking hole" || (b.visible && spriteInView(b))) {
            context.translate(-b.offset, 0);
            b.paint(context);
            context.translate(b.offset, 0)
        }
    }
    for (var a = 0; a < platforms.length; ++a) {
        platforms[a].paint(context)
    }
}

function spriteInView(a) {
    return a === runner || (a.left + a.width > platformOffset && a.left < platformOffset + canvas.width)
}

function temporarilyHide(b, a) {
    b.visible = false;
    setTimeout(function (c) {
        b.visible = true
    }, a)
}

function explode(b, a) {
    if (!a) {
        playSound(explosionSound)
    }
    b.exploding = true;
    explosionAnimator.start(b, false)
}

function explodeAndLoseLife(b) {
    var a = this;
    b.behaviors = [runInPlace];
    b.jumping = false;
    b.falling = false;
    explode(b);
    setTimeout(function (c) {
        loseLife()
    }, 3000)
}

function putSpriteOnPlatform(a, b) {
    a.top = b.top - a.height;
    a.left = b.left;
    a.platform = b
}

function setInitialSpriteVisibility() {
    var b;
    for (var a = 0; a < sprites.length; ++a) {
        b = sprites[a];
        b.visibility = b.type !== "snailBomb"
    }
}

function setInitialSpriteSize(d, a) {
    var c;
    for (var b = 0; b < d.length; ++b) {
        c = d[b];
        c.width = a[0].width;
        c.height = a[0].height
    }
}

function positionSprites(d, c) {
    var b;
    for (var a = 0; a < d.length; ++a) {
        b = d[a];
        if (c[a].platformIndex) {
            putSpriteOnPlatform(b, platforms[c[a].platformIndex])
        } else {
            b.top = c[a].top;
            b.left = c[a].left
        }
    }
}

function onPlatform(d, a) {
    var f, e, b = -1;
    if (a === undefined) {
        a = d.track
    }
    for (var c = 0; c < platforms.length; ++c) {
        f = platforms[c];
        e = f.left - platformOffset;
        if (a === f.track) {
            if (d.left + d.width > e && d.left + d.width < (e + f.width) || (d.left > e && d.left < (e + f.width))) {
                b = c;
                break
            }
        }
    }
    return b
}

function turnLeft(a) {
    bgVelocity = -BACKGROUND_VELOCITY;
    runnerPageflipInterval = RUNNER_PAGE_FLIP_INTERVAL;
    runnerPainter.cells = runnerCellsLeft;
    runner.direction = LEFT
}

function turnRight(a) {
    bgVelocity = BACKGROUND_VELOCITY;
    runnerPageflipInterval = RUNNER_PAGE_FLIP_INTERVAL;
    runnerPainter.cells = runnerCellsRight;
    runner.direction = RIGHT
}

function animate() {
    var a = gameTimer.getElapsedTime();
    if (!paused) {
        fps = calculateFps(a);
        draw(a)
    }
    requestNextAnimationFrame(animate)
}

function updateScoreElement() {
    scoreElement.innerHTML = score
}

function increaseScore(a) {
    score += a;
    updateScoreElement()
}

function decreaseScore(a) {
    score -= a;
    updateScoreElement()
}

function tapLeft() {
    if (runner.exploding) {
        return
    }
    if (runner.direction === RIGHT) {
        turnLeft(runner)
    } else {
        if (runner.direction === LEFT) {
            turnRight(runner)
        }
    }
}

function tapRight() {
    if (runner.exploding) {
        return
    }
    runner.jump()
}

function shake() {
    var a = bgVelocity;
    bgVelocity = -BACKGROUND_VELOCITY;
    setTimeout(function (b) {
        bgVelocity = BACKGROUND_VELOCITY;
        setTimeout(function (c) {
            bgVelocity = -BACKGROUND_VELOCITY;
            setTimeout(function (d) {
                bgVelocity = BACKGROUND_VELOCITY;
                setTimeout(function (f) {
                    bgVelocity = -BACKGROUND_VELOCITY;
                    setTimeout(function (g) {
                        bgVelocity = BACKGROUND_VELOCITY;
                        setTimeout(function (h) {
                            bgVelocity = -BACKGROUND_VELOCITY;
                            setTimeout(function (i) {
                                bgVelocity = BACKGROUND_VELOCITY;
                                setTimeout(function (j) {
                                    bgVelocity = -BACKGROUND_VELOCITY;
                                    setTimeout(function (k) {
                                        bgVelocity = BACKGROUND_VELOCITY;
                                        setTimeout(function (l) {
                                            bgVelocity = BACKGROUND_VELOCITY;
                                            setTimeout(function (m) {
                                                bgVelocity = a
                                            }, 80)
                                        }, 80)
                                    }, 80)
                                }, 80)
                            }, 80)
                        }, 80)
                    }, 80)
                }, 80)
            }, 80)
        }, 80)
    }, 80)
}

function splashToast(b, a) {
    a = a || DEFAULT_TOAST_TIME;
    toast.style.opacity = 0;
    toast.style.display = "block";
    setTimeout(function (c) {
        toast.style.opacity = 1;
        toast.innerHTML = b
    }, 50);
    setTimeout(function (c) {
        toast.style.opacity = 0
    }, a)
}

function updateLivesElement() {
    if (lives === 3) {
        lifeIconLeft.style.opacity = 1;
        lifeIconMiddle.style.opacity = 1;
        lifeIconRight.style.opacity = 1
    } else {
        if (lives === 2) {
            lifeIconLeft.style.opacity = 1;
            lifeIconMiddle.style.opacity = 1;
            lifeIconRight.style.opacity = 0
        } else {
            if (lives === 1) {
                lifeIconLeft.style.opacity = 1;
                lifeIconMiddle.style.opacity = 0;
                lifeIconRight.style.opacity = 0
            } else {
                if (lives === 0) {
                    lifeIconLeft.style.opacity = 0;
                    lifeIconMiddle.style.opacity = 0;
                    lifeIconRight.style.opacity = 0
                }
            }
        }
    }
}

function loseLife() {
    lives--;
    updateLivesElement();
    if (lives === 0) {
        gameOver()
    } else {
        reset()
    }
}

function showCredits() {
    creditsElement.style.display = "block";
    setTimeout(function (a) {
        creditsElement.style.opacity = CREDITS_OPACITY
    }, 50);
    tweetElement.href = TWEET_PREAMBLE + score + TWEET_PROLOGUE
}

function advanceToNextLevel() {
    bgVelocity = -bgVelocity / 4;
    runnerPageflipInterval = STARTING_PAGEFLIP_INTERVAL;
    runner.behaviors = [];
    if (musicCheckbox.checked) {
        soundtrack.pause()
    }
    transitioning = true;
    splashToast(LEVEL_COMPLETE_CONGRATULATIONS);
    setTimeout(function (a) {
        gameOver()
    }, LEVEL_ADVANCE_DELAY)
}

function freezeRunner() {
    runner.falling = false;
    runner.jumping = false;
    runner.fallTimer.stop();
    runner.behaviors = [];
    runnerHasMoved = false
}

function resetLivesAndScore() {
    showCredits();
    lives = 0;
    score = 0;
    updateLivesElement()
}

function gameOver() {
    transitioning = true;
    soundAndMusic.style.opacity = 1;
    instructions.style.opacity = 1;
    copyright.style.opacity = 1;
    freezeRunner();
    splashToast("Score: " + score);
    bgVelocity = -GAME_OVER_VELOCITY;
    if (musicCheckbox.checked) {
        soundtrack.pause()
    }
    setTimeout(function (a) {
        transitioning = true;
        resetLivesAndScore()
    }, GAME_OVER_PAUSE_DURATION);
    setTimeout(function (b) {
        var a = instructions;
        if (navigator && navigator.userAgent.match(/iPad/i) != null) {
            a = ipadInstructions
        }
        a.style.opacity = 1;
        setTimeout(function (c) {
            a.style.opacity = INSTRUCTIONS_DIM_OPACITY
        }, INSTRUCTIONS_DIMMING_DELAY)
    }, 50)
}

function togglePausedStateOfAllBehaviors() {
    for (var b = 0; b < sprites.length; ++b) {
        sprite = sprites[b];
        if (sprite.type === "smoking hole") {
            if (paused) {
                sprite.pause()
            } else {
                sprite.unpause()
            }
        } else {
            for (var a = 0; a < sprite.behaviors.length; ++a) {
                behavior = sprite.behaviors[a];
                if (paused) {
                    if (behavior.pause) {
                        behavior.pause()
                    }
                } else {
                    if (behavior.unpause) {
                        behavior.unpause()
                    }
                }
            }
        }
    }
}

function togglePaused() {
    var a = +new Date();
    paused = !paused;
    togglePausedStateOfAllBehaviors();
    if (paused) {
        gameTimer.pause();
        if (musicCheckbox.checked) {
            soundtrack.pause()
        }
    } else {
        gameTimer.unpause();
        if (musicCheckbox.checked) {
            soundtrack.play()
        }
    }
}
rightControl.ontouchstart = function (a) {
    a.preventDefault();
    touchTime = +new Date()
};
leftControl.ontouchstart = function (a) {
    a.preventDefault();
    touchTime = +new Date()
};
leftControl.ontouchend = function (a) {
    a.preventDefault();
    tapLeft()
};
rightControl.ontouchend = function (a) {
    a.preventDefault();
    tapRight()
};
slowlyDontShow.onclick = function (a) {
    runningSlowly.style.opacity = 0;
    showSlowWarning = false
};
slowlyOkay.onclick = function (a) {
    runningSlowly.style.opacity = 0
};
newGameLink.onclick = function (a) {
    creditsElement.style.opacity = 0;
    creditsElement.style.display = "none";
    lives = 3;
    updateLivesElement();
    gameTimer.stop();
    gameTimer.reset();
    gameTimer.start();
    lastAnimationFrameTime = 0;
    reset()
};
window.onblur = function (a) {
    if (countingDown) {
        countingDown = false
    }
    if (!paused) {
        togglePaused()
    }
};
window.onfocus = function (b) {
    var a = toast.style.fontSize;
    if (paused) {
        if (transitioning) {
            togglePaused();
            toast.opacity = 0;
            setTimeout(function (c) {
                toast.style.fontSize = a
            }, 2000)
        } else {
            toast.style.font = "128px fantasy";
            transitioning = true;
            splashToast("3", 1000);
            setTimeout(function (c) {
                splashToast("2", 1000);
                setTimeout(function (d) {
                    splashToast("1", 1000);
                    setTimeout(function (f) {
                        if (countingDown) {
                            togglePaused()
                        }
                        transitioning = false;
                        setTimeout(function (g) {
                            toast.style.fontSize = a
                        }, 2000)
                    }, 1000)
                }, 1050)
            }, 1050)
        }
    }
};
window.onkeydown = function (b) {
    var a = b.keyCode;
    if (!runnerHasMoved) {
        if (a === 68 || a === 37 || a === 75 || a === 39) {
            runnerHasMoved = true;
            dimInstructions();
            dimCopyright()
        }
    }
    if (transitioning || runner.exploding) {
        return
    }
    if (a === 80 || (paused && a !== 80)) {
        togglePaused()
    }
    if (a === 68 || a === 37) {
        turnLeft(runner)
    } else {
        if (a === 75 || a === 39) {
            turnRight(runner)
        } else {
            if (a === 70 || a === 74) {
                if (!runner.falling) {
                    runner.jump()
                }
            }
        }
    }
};
soundCheckbox.onchange = function (a) {
    soundOn = soundCheckbox.checked
};
musicCheckbox.onchange = function (a) {
    if (soundtrack.paused) {
        soundtrack.play()
    } else {
        soundtrack.pause()
    }
};

function initializeImages() {
    background.src = "images/background_noise_light.png";
    spritesheet.src = "images/spritesheet.png";
    background.onload = function (a) {
        startGame()
    }
}
context.font = "48px Helvetica";

function createSprites() {
    createPlatformSprites();
    createBatSprites();
    createBeeSprites();
    createButtonSprites();
    createCoinSprites();
    createRubySprites();
    createSapphireSprites();
    createSnailSprites()
}

function equipRunner() {
    runner.track = STARTING_RUNNER_TRACK;
    runner.falling = false;
    runner.jumping = false;
    runner.visible = true;
    runner.JUMP_DURATION = RUNNER_JUMP_DURATION;
    runner.JUMP_HEIGHT_IN_PIXELS = RUNNER_JUMP_HEIGHT;
    runner.direction = LEFT;
    runner.velocityX = STARTING_RUNNER_VELOCITY;
    runner.left = STARTING_RUNNER_LEFT;
    runner.top = calculatePlatformTop(runner.track) - RUNNER_CELLS_HEIGHT - PLATFORM_STROKE_WIDTH;
    runner.painter.cells = runnerCellsRight;
    runner.behaviors = [runInPlace, moveLaterally, jump, fall, runnerCollide];
    runner.jumpAscendTimer = new AnimationTimer(runner.JUMP_DURATION / 2, AnimationTimer.makeEaseOut(1));
    runner.jumpDescendTimer = new AnimationTimer(runner.JUMP_DURATION / 2, AnimationTimer.makeEaseIn(1));
    runner.fallTimer = new AnimationTimer(runner.JUMP_DURATION, AnimationTimer.makeLinear(1));
    runner.jump = function () {
        if (!this.jumping) {
            this.jumping = true;
            this.startJumpTop = this.top;
            this.jumpAscendTimer.start();
            playSound(jumpWhistleSound)
        }
    };
    runner.fall = function (a) {
        this.velocityY = a || 0;
        this.initialVelocityY = a || 0;
        this.fallTimer.start();
        this.falling = true;
        this.track--
    }
}

function addSpritesToSpriteArray() {
    for (var a = 0; a < bats.length; ++a) {
        sprites.push(bats[a])
    }
    for (var a = 0; a < bees.length; ++a) {
        sprites.push(bees[a])
    }
    for (var a = 0; a < buttons.length; ++a) {
        sprites.push(buttons[a])
    }
    for (var a = 0; a < coins.length; ++a) {
        sprites.push(coins[a])
    }
    for (var a = 0; a < rubies.length; ++a) {
        sprites.push(rubies[a])
    }
    for (var a = 0; a < sapphires.length; ++a) {
        sprites.push(sapphires[a])
    }
    for (var a = 0; a < smokingHoles.length; ++a) {
        sprites.push(smokingHoles[a])
    }
    for (var a = 0; a < snails.length; ++a) {
        sprites.push(snails[a])
    }
    for (var a = 0; a < snailBombs.length; ++a) {
        sprites.push(snailBombs[a])
    }
}

function dimCopyright() {
    setTimeout(function (a) {
        copyright.style.opacity = DIM
    }, INSTRUCTIONS_DIMMING_DELAY)
}

function dimInstructions() {
    setTimeout(function (a) {
        soundAndMusic.style.opacity = DIM;
        if (navigator && navigator.userAgent.match(/iPad/i) != null) {
            ipadInstructions.style.opacity = DIM
        } else {
            instructions.style.opacity = DIM
        }
    }, INSTRUCTIONS_DIMMING_DELAY)
}

function showStartMessage() {
    splashToast(START_GAME_MESSAGE)
}

function initializeSounds() {
    soundtrack.volume = SOUNDTRACK_VOLUME;
    jumpWhistleSound.volume = JUMP_WHISTLE_VOLUME;
    landingSound.volume = LANDING_VOLUME;
    fallingWhistleSound.volume = FALLING_WHISTLE_VOLUME;
    chimesSound.volume = CHIMES_VOLUME;
    explosionSound.volume = EXPLOSION_VOLUME;
    coinSound.volume = COIN_VOLUME
}

function initializeSoundsAndImages() {
    initializeImages();
    initializeSounds();
    soundOn = soundCheckbox.checked
}

function createAndInitializeSprites() {
    createSprites();
    setSpriteProperties();
    addSpritesToSpriteArray()
}

function startGame() {
    showStartMessage();
    gameTimer.start();
    if (musicCheckbox.checked) {
        playSound(soundtrack)
    }
    window.requestNextAnimationFrame(animate)
}
initializeSoundsAndImages();
createAndInitializeSprites();
if (navigator && navigator.userAgent.match(/iPad/i) != null) {
    soundCheckbox.checked = false;
    soundCheckbox.disabled = true;
    musicCheckbox.checked = false;
    musicCheckbox.disabled = true;
    soundOn = false;
    splashToast("Add this game to your Home Screen to turn it into an app", 2000)
};