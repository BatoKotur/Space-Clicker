"use strict";
window.addEventListener('load', init);
var minStarDistance = 100;
var intervalId;
var gameScore = 0;
var scorePerSecond = 100;
function init() {
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('rocketStart').addEventListener('click', startRocket);
    document.getElementById('upgradeButton').addEventListener('click', upgradeWindow);
    createCheckboxes();
    updateCheckboxes(document.getElementById('shell'), 1);
    createStar(40, 20);
    createStar(100, 50);
    createStar(30, 100);
    createStar(15, 80);
    createStar(60, 10);
    createStar(100, 75);
    createStar(40, 53);
    createStar(23, 75);
    createStar(87, 10);
}
function update() {
    document.getElementById('score').innerHTML = Math.floor(gameScore).toString();
    if (gameScore === 500) {
        document.getElementById('upgradeButton').style.display = "block";
    }
    gameScore += scorePerSecond / 100;
}
function startGame() {
    document.getElementById('startScreenContainer').style.display = 'none';
}
function startRocket() {
    var rocketFlame = document.createElement("img");
    rocketFlame.src = './assets/Rocket_Flame.png';
    rocketFlame.className = 'assets';
    rocketFlame.id = 'rocketFlame';
    document.getElementById('game').appendChild(rocketFlame);
    intervalId = setInterval(moveRocket, 10);
    setInterval(update, 10);
    document.getElementById('rocketStart').removeEventListener('click', startRocket);
}
function onChange(_event) {
    var element = _event.target;
    var checkboxes = element.parentElement.getElementsByClassName('checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] === element) {
            console.log('kaka');
        }
    }
}
function createCheckboxes() {
    var elements = document.getElementsByClassName('checkboxes');
    var checkbox = document.createElement('input');
    checkbox.addEventListener('change', onChange);
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.disabled = true;
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < 5; j++) {
            element.appendChild(checkbox.cloneNode(true));
        }
    }
}
function updateCheckboxes(_container, _activeCheckboxes) {
    var elements = document.getElementsByClassName('checkbox');
    for (var i = 0; i < _activeCheckboxes; i++) {
        elements[i].disabled = false;
    }
}
function upgradeWindow() {
    var element = document.getElementById('upgradeWindowContainer');
    var icon = document.getElementById('arrowIcon');
    icon.style.transform = 'rotate(180deg)';
    element.hidden = !element.hidden;
    if (element.hidden) {
        icon.style.transform = 'rotate(0deg)';
    }
    else {
        icon.style.transform = 'rotate(180deg)';
    }
}
function createStar(_left, _top) {
    // let star: HTMLImageElement = <HTMLImageElement>document.getElementsByClassName('star')[0];
    var star = document.createElement("img");
    star.src = './assets/Star.svg';
    star.className = 'star assets';
    star.style.left = _left + "px";
    star.style.top = _top + "px";
    document.getElementById('background').appendChild(star);
}
function getStars() {
    var stars = document.getElementsByClassName('star');
    var arr = Array.prototype.slice.call(stars);
    return arr;
}
function parseStringToInt(_string) {
    var topNumbers = _string.replace('px', '');
    var top = parseInt(topNumbers, 10);
    return top;
}
function checkStarDistance(_star) {
    var stars = getStars();
    for (var i = 0; i < getStars.length; i++) {
        var element = stars[i];
        var elementTop = parseStringToInt(element.style.top);
        var starTop = parseStringToInt(_star.style.top);
        var topDistance = Math.abs(elementTop - starTop);
        if (topDistance < minStarDistance) {
            _star.style.top = elementTop + minStarDistance + "px";
        }
    }
}
function moveStars() {
    var stars = getStars();
    for (var i = 0; i < stars.length; i++) {
        var element = stars[i];
        var top_1 = parseStringToInt(element.style.top);
        element.style.top = top_1 + 1 + "px";
    }
}
function moveRocket() {
    var rocket = document.getElementById('rocketStart');
    var rocketBottom = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('bottom'));
    var rocketFlame = document.getElementById('rocketFlame');
    var rocketHeight = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('height'));
    rocketFlame.style.bottom = rocketBottom - .325 * rocketHeight + 1 + "px";
    rocket.style.bottom = rocketBottom + 1 + "px";
    if (rocketBottom >= screen.height / 2 - rocketHeight / 2) {
        clearInterval(intervalId);
        intervalId = setInterval(moveGround, 10);
    }
}
function moveGround() {
    var ground = document.getElementById('ground');
    var groundBottom = parseStringToInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
    ground.style.bottom = groundBottom - 1 + "px";
    if (groundBottom <= 0 - parseStringToInt(window.getComputedStyle(ground).getPropertyValue('height'))) {
        clearInterval(intervalId);
        ground.remove();
    }
}
