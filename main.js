"use strict";
window.addEventListener('load', init);
var minStarDistance = 100;
var intervalId;
var gameScore = 0;
var baseScorePerSecond = 10;
var scorePerSecond = baseScorePerSecond;
var timeOutId;
var baseCost = 500;
var starCounter = 20;
function init() {
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('rocket').addEventListener('click', startRocket);
    document.getElementById('upgradeButton').addEventListener('click', upgradeWindow);
    document.getElementById('turboCheckbox').addEventListener('change', turboSwitch);
    createStars();
    createCheckboxes();
}
function update() {
    document.getElementById('score').innerHTML = Math.floor(gameScore).toString();
    gameScore += scorePerSecond / 100;
    if (gameScore >= baseCost) {
        document.getElementById('upgradeButton').style.display = "block";
    }
    if (gameScore >= baseCost) {
        var shownCheckbox = (Math.log10(gameScore / 500));
        if (shownCheckbox <= 3) {
            updateCheckboxes(shownCheckbox); // Change lib 
        }
    }
    if (gameScore >= 1000000) {
        var turboCheckbox = document.getElementById('turboCheckbox');
        var slider = document.getElementById('slider');
        turboCheckbox.disabled = false;
        slider.className = ' enabled';
    }
    moveStars();
}
function startGame() {
    document.getElementById("game").classList.remove('blur');
    document.getElementById('startScreenContainer').style.display = 'none';
}
function startRocket() {
    var rocketFlame = document.getElementById("rocketFlame");
    document.getElementById("audio").play();
    rocketFlame.style.display = 'block';
    intervalId = setInterval(moveRocket, 10);
    setInterval(update, 10);
    document.getElementById('rocket').removeEventListener('click', startRocket);
    document.getElementById('rocket').addEventListener('click', rocketClick);
}
function rocketClick() {
    var rocket = document.getElementById('rocket');
    rocket.classList.add('clickAnimation');
    clearTimeout(timeOutId);
    timeOutId = setTimeout(removeAnimationClass, 2600);
    gameScore += 100;
}
function removeAnimationClass() {
    var rocket = document.getElementById('rocket');
    rocket.classList.remove('clickAnimation');
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
            displayUpgrade(element.parentElement.parentElement.id, i + 1);
        }
    }
    disableAllCheckboxes();
}
function displayUpgrade(_name, _rank) {
    var element = document.getElementById("" + _name + _rank);
    if (element != null) {
        element.style.display = 'block';
    }
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
        for (var j = 0; j < 3; j++) {
            element.appendChild(createCheckbox());
        }
    }
}
function turboSwitch() {
    var turboCheckbox = document.getElementById('turboCheckbox');
    var slider = document.getElementById('slider');
    document.getElementById('turboMode').style.display = 'block';
    turboCheckbox.disabled = true;
    slider.className = ' bought';
    gameScore -= 1000000;
    scorePerSecond += 10000;
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
    var turboCheckbox = document.getElementById('turboCheckbox');
    var slider = document.getElementById('slider');
    turboCheckbox.disabled = true;
    if (!slider.classList.contains('bought')) {
        slider.className = '';
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
function createStars() {
    // let star: HTMLImageElement = <HTMLImageElement>document.getElementsByClassName('star')[0];
    var background = document.getElementById('game');
    var starContainer = document.getElementById('starContainer');
    for (var i = 0; i < starCounter; i++) {
        var star = document.createElement("img");
        var left = Math.random() * background.clientWidth;
        var top_1 = Math.random() * background.clientHeight - background.clientHeight;
        star.src = './assets/Star.svg';
        star.className = 'star assets';
        star.style.left = left + "px";
        star.style.top = top_1 + "px";
        starContainer.appendChild(star);
    }
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
    var background = document.getElementById('game');
    for (var i = 0; i < stars.length; i++) {
        var element = stars[i];
        var top_2 = parseStringToInt(element.style.top);
        if (background.clientHeight < top_2) {
            var left = Math.random() * background.clientWidth;
            element.style.left = left + "px";
            top_2 = -10;
        }
        else {
            top_2 += Math.log10(scorePerSecond);
        }
        element.style.top = top_2 + "px";
    }
}
function moveRocket() {
    var rocket = document.getElementById('rocket');
    var rocketBottom = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('bottom'));
    var rocketHeight = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('height'));
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
