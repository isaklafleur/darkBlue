var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      ",
];

var actorChars = {
  "@": Player,
  o: Coin,
  "=": Lava,
  "|": Lava,
  v: Lava,
};

// Level
var maxStep = 0.05;

// DOMDisplay
var scale = 20;

// Player
var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;

// Coin
var wobbleSpeed = 8;
var wobbleDist = 0.07;

var simpleLevel = new Level(simpleLevelPlan);
console.log(simpleLevel.width, "by", simpleLevel.height);
var arrowCodes = { 37: "left", 38: "up", 39: "right" };
var arrows = trackKeys(arrowCodes);

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) {
    elt.className = className;
  } else {
    return elt;
  }
}

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop) {
      requestAnimationFrame(frame);
    }
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(step => {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen) {
        andThen(level.status);
      } else {
        return false;
      }
    }
  });
}

function runGame(plans, Display) {
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, status => {
      if (status == "lost") {
        startLevel(n);
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else console.log("You win!");
    });
  }
  startLevel(0);
}
