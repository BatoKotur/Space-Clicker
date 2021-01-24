window.addEventListener('load', init);

const minStarDistance: number = 100;
let intervalId: number;
let gameScore: number = 0;
let baseScorePerSecond: number = 10;
let scorePerSecond: number = baseScorePerSecond;
let timeOutId: number;
const baseCost: number = 500;
const starCounter: number = 20;

function init(): void {
    (<HTMLElement>document.getElementById('startGameButton')).addEventListener('click', startGame);

    (<HTMLElement>document.getElementById('rocket')).addEventListener('click', startRocket);

    (<HTMLElement>document.getElementById('upgradeButton')).addEventListener('click', upgradeWindow);

    (<HTMLElement>document.getElementById('turboCheckbox')).addEventListener('change', turboSwitch);

    createStars();
    createCheckboxes();
}

function update(): void {
    (<HTMLElement>document.getElementById('score')).innerHTML = Math.floor(gameScore).toString();
    gameScore += scorePerSecond / 100;
    if (gameScore >= baseCost) {
        (<HTMLElement>document.getElementById('upgradeButton')).style.display = "block";
    }
    if (gameScore >= baseCost) {
        let shownCheckbox: number = (Math.log10(gameScore / 500));
        if (shownCheckbox <= 3) {
            updateCheckboxes(shownCheckbox); // Change lib 
        }
    }
    if (gameScore >= 1000000) {
        let turboCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById('turboCheckbox');
        let slider: HTMLElement = <HTMLElement>document.getElementById('slider');
        turboCheckbox.disabled = false;
        slider.className = ' enabled';
    }
    moveStars();
}

function startGame(): void {
    (<HTMLImageElement>document.getElementById("game")).classList.remove('blur');
    (<HTMLElement>document.getElementById('startScreenContainer')).style.display = 'none';
}

function startRocket(): void {
    let rocketFlame: HTMLImageElement = <HTMLImageElement>document.getElementById("rocketFlame");
    rocketFlame.style.display = 'block';
    intervalId = setInterval(moveRocket, 10);
    setInterval(update, 10);
    (<HTMLElement>document.getElementById('rocket')).removeEventListener('click', startRocket);
    (<HTMLElement>document.getElementById('rocket')).addEventListener('click', rocketClick);
}

function rocketClick(): void {
    let rocket: HTMLElement = <HTMLElement>document.getElementById('rocket');
    rocket.classList.add('clickAnimation')
    clearTimeout(timeOutId);
    timeOutId = setTimeout(removeAnimationClass, 2600);
    gameScore += 100;
}

function removeAnimationClass(): void {
    let rocket: HTMLElement = <HTMLElement>document.getElementById('rocket');
    rocket.classList.remove('clickAnimation')
}

function onChange(_event: Event): void {
    let element: HTMLInputElement = <HTMLInputElement>_event.target;
    let checkboxes: HTMLCollectionOf<Element> = (<HTMLElement>element.parentElement).getElementsByClassName('checkbox');
    for (let i: number = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] === element) {
            let pow: number = Math.pow(10, i);
            element.removeEventListener('change', onChange);
            element.className += ' bought';
            element.disabled = true;
            gameScore = gameScore - baseCost * pow;
            scorePerSecond += baseScorePerSecond * pow * 10;
            displayUpgrade((<HTMLElement>(<HTMLInputElement>element.parentElement).parentElement).id, i + 1);
        }
    }
    disableAllCheckboxes();
}

function displayUpgrade(_name: string, _rank: number): void {
    let element: HTMLElement | null = document.getElementById(`${_name}${_rank}`);
    if (element != null) {
        element.style.display = 'block';
    }
}

function createCheckbox(): HTMLInputElement {
    let checkbox: HTMLInputElement = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.disabled = true;
    checkbox.addEventListener('change', onChange);
    return checkbox;
}

function createCheckboxes(): void {
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('checkboxes');
    for (let i: number = 0; i < elements.length; i++) {
        let element: Element = elements[i]
        for (let j: number = 0; j < 3; j++) {
            element.appendChild(createCheckbox());
        }
    }
}

function turboSwitch(): void {
    let turboCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById('turboCheckbox');
    let slider: HTMLElement = <HTMLElement>document.getElementById('slider');
    (<HTMLElement>document.getElementById('turboMode')).style.display = 'block';
    turboCheckbox.disabled = true;
    slider.className = ' bought';
    gameScore -= 1000000;
    scorePerSecond += 10000;
}

function updateCheckboxes(_activeCheckboxes: number): void {
    let checkboxContainer: HTMLCollectionOf<Element> = document.getElementsByClassName('checkboxes');
    for (let j: number = 0; j < checkboxContainer.length; j++) {
        let checkboxes: HTMLCollectionOf<Element> = checkboxContainer[j].getElementsByClassName('checkbox');
        for (let i: number = 0; i < _activeCheckboxes; i++) {
            if (!checkboxes[i].classList.contains('bought')) {
                (<HTMLInputElement>checkboxes[i]).disabled = false;
            }
        }
    }
}

function disableAllCheckboxes(): void {
    let checkboxes: HTMLCollectionOf<Element> = document.getElementsByClassName('checkbox');
    for (let i: number = 0; i < checkboxes.length; i++) {
        (<HTMLInputElement>checkboxes[i]).disabled = true;
    }
    let turboCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById('turboCheckbox');
    let slider: HTMLElement = <HTMLElement>document.getElementById('slider');
    turboCheckbox.disabled = true;
    if (!slider.classList.contains('bought')) {
        slider.className = '';
    }
}

function upgradeWindow(): void {
    let element: HTMLElement = (<HTMLElement>document.getElementById('upgradeWindowContainer'));
    let icon: HTMLElement = (<HTMLElement>document.getElementById('arrowIcon'));
    icon.style.transform = 'rotate(180deg)';
    element.hidden = !element.hidden;
    if (element.hidden) {
        icon.style.transform = 'rotate(0deg)';
    }
    else {
        icon.style.transform = 'rotate(180deg)';
    }
}

function createStars(): void {
    // let star: HTMLImageElement = <HTMLImageElement>document.getElementsByClassName('star')[0];
    let background: HTMLElement = <HTMLElement>document.getElementById('game');
    let starContainer: HTMLElement = (<HTMLElement>document.getElementById('starContainer'))
    for (let i: number = 0; i < starCounter; i++) {
        let star: HTMLImageElement = <HTMLImageElement>document.createElement("img");
        let left: number = Math.random() * background.clientWidth;
        let top: number = Math.random() * background.clientHeight - background.clientHeight;
        star.src = './assets/Star.svg';
        star.className = 'star assets';
        star.style.left = `${left}px`;
        star.style.top = `${top}px`;
        starContainer.appendChild(star);
    }
}

function getStars(): Element[] {
    let stars: HTMLCollectionOf<Element> = document.getElementsByClassName('star');
    let arr = Array.prototype.slice.call(stars);
    return arr;
}


function parseStringToInt(_string: string): number {
    let topNumbers = _string.replace('px', '');
    let top = parseInt(topNumbers, 10);
    return top;
}

function checkStarDistance(_star: HTMLElement): void {
    let stars: Element[] = getStars();
    for (let i: number = 0; i < getStars.length; i++) {
        let element: HTMLElement = <HTMLElement>stars[i];
        let elementTop: number = parseStringToInt(element.style.top);
        let starTop: number = parseStringToInt(_star.style.top);
        let topDistance: number = Math.abs(elementTop - starTop);
        if (topDistance < minStarDistance) {
            _star.style.top = `${elementTop + minStarDistance}px`;
        }
    }
}

function moveStars(): void {
    let stars: Element[] = getStars();
    let background: HTMLElement = <HTMLElement>document.getElementById('game');
    for (let i: number = 0; i < stars.length; i++) {
        let element: HTMLElement = <HTMLElement>stars[i];
        let top = parseStringToInt(element.style.top);
        if (background.clientHeight < top) {
            let left: number = Math.random() * background.clientWidth;
            element.style.left = `${left}px`;
            top = -10;
        }
        else {
            top += Math.log10(scorePerSecond);
        }
        element.style.top = `${top}px`;
    }
}

function moveRocket(): void {
    let rocket: HTMLElement = <HTMLElement>document.getElementById('rocket');
    let rocketBottom = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('bottom'));
    let rocketHeight: number = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('height'))
    rocket.style.bottom = `${rocketBottom + 1}px`;
    if (rocketBottom >= screen.height / 2 - rocketHeight / 2) {
        clearInterval(intervalId);
        intervalId = setInterval(moveGround, 10);
    }
}

function moveGround(): void {
    let ground: HTMLElement = <HTMLElement>document.getElementById('ground');
    let groundBottom = parseStringToInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
    ground.style.bottom = `${groundBottom - 1}px`;
    if (groundBottom <= 0 - parseStringToInt(window.getComputedStyle(ground).getPropertyValue('height'))) {
        clearInterval(intervalId);
        ground.remove();
    }
}