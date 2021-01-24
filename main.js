"use strict";
window.addEventListener('load', init);
var minStarDistance = 100;
var intervalId;
var gameScore = 0;
var baseScorePerSecond = 10;
var scorePerSecond = 100; // baseScorePerSecond;
var baseCost = 500;
function init() {
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('rocketStart').addEventListener('click', startRocket);
    document.getElementById('upgradeButton').addEventListener('click', upgradeWindow);
    createCheckboxes();
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
    gameScore += scorePerSecond / 100;
    if (gameScore >= baseCost) {
        document.getElementById('upgradeButton').style.display = "block";
    }
    if (gameScore >= baseCost) {
        updateCheckboxes(Math.log10(gameScore / 500)); // Change lib 
    }
}
function startGame() {
    document.getElementById('startScreenContainer').style.display = 'none';
}
function startRocket() {
    var rocketFlame = document.getElementById("rocketFlame");
    rocketFlame.style.display = 'block';
    intervalId = setInterval(moveRocket, 10);
    setInterval(update, 10);
    document.getElementById('rocketStart').removeEventListener('click', startRocket);
}
function onChange(_event) {
    var element = _event.target;
    var checkboxes = element.parentElement.getElementsByClassName('checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] === element) {
            var pow = Math.pow(10, i);
            element.removeEventListener('change', onChange);
            element.className += ' bought';
            element.disabled = true;
            gameScore = gameScore - baseCost * pow;
            scorePerSecond += baseScorePerSecond * pow * 10;
            // displayUpgrade((<HTMLElement>(<HTMLInputElement>element.parentElement).parentElement).id, i + 1);
        }
    }
    disableAllCheckboxes();
}
function displayUpgrade(_name, _rank) {
    var element = document.getElementById("" + _name + _rank);
    element.style.display = 'block';
}
function createCheckbox() {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.disabled = true;
    checkbox.addEventListener('change', onChange);
    return checkbox;
}
function createCheckboxes() {
    var elements = document.getElementsByClassName('checkboxes');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < 5; j++) {
            element.appendChild(createCheckbox());
        }
    }
}
function updateCheckboxes(_activeCheckboxes) {
    var checkboxContainer = document.getElementsByClassName('checkboxes');
    for (var j = 0; j < checkboxContainer.length; j++) {
        var checkboxes = checkboxContainer[j].getElementsByClassName('checkbox');
        for (var i = 0; i < _activeCheckboxes; i++) {
            if (!checkboxes[i].classList.contains('bought')) {
                checkboxes[i].disabled = false;
            }
        }
    }
}
function disableAllCheckboxes() {
    var checkboxes = document.getElementsByClassName('checkbox');
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].disabled = true;
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
