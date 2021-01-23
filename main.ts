window.addEventListener('load', init);

const minStarDistance: number = 100;
let intervalId: number;
let gameScore: number = 0;
let scorePerSecond: number = 100;

function init(): void {
    (<HTMLElement>document.getElementById('startGameButton')).addEventListener('click', startGame);

    (<HTMLElement>document.getElementById('rocketStart')).addEventListener('click', startRocket);

    (<HTMLElement>document.getElementById('upgradeButton')).addEventListener('click', upgradeWindow);

    createCheckboxes();
    updateCheckboxes(<HTMLElement>document.getElementById('shell'),1);


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

function update(): void {
    (<HTMLElement>document.getElementById('score')).innerHTML = Math.floor(gameScore).toString();
    if (gameScore === 500) {
        (<HTMLElement>document.getElementById('upgradeButton')).style.display = "block";
    }
    gameScore += scorePerSecond / 100;
}

function startGame(): void {
    (<HTMLElement>document.getElementById('startScreenContainer')).style.display = 'none';
}

function startRocket(): void {
    let rocketFlame: HTMLImageElement = <HTMLImageElement>document.createElement("img");
    rocketFlame.src = './assets/Rocket_Flame.png';
    rocketFlame.className = 'assets';
    rocketFlame.id = 'rocketFlame';
    (<HTMLElement>document.getElementById('game')).appendChild(rocketFlame);
    intervalId = setInterval(moveRocket, 10);
    setInterval(update, 10);
    (<HTMLElement>document.getElementById('rocketStart')).removeEventListener('click', startRocket);
}

function onChange(_event: Event): void {
    let element: HTMLElement = <HTMLElement>_event.target;
    let checkboxes: HTMLCollectionOf<Element> = (<HTMLElement>element.parentElement).getElementsByClassName('checkbox');
    for (let i: number = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] === element) {
            console.log('kaka')
        }
    }
}
function createCheckboxes(): void {
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('checkboxes');
    let checkbox: HTMLInputElement = document.createElement('input')
    checkbox.addEventListener('change', onChange);
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.disabled = true;
    for (let i: number = 0; i < elements.length; i++) {
        let element: Element = elements[i]
        for (let j: number = 0; j < 5; j++) {
            element.appendChild(checkbox.cloneNode(true));
        }
    }
}

function updateCheckboxes(_container: HTMLElement, _activeCheckboxes: number): void {
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('checkbox');
    for (let i: number = 0; i < _activeCheckboxes; i++) {
        (<HTMLInputElement>elements[i]).disabled = false;
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

function createStar(_left: number, _top: number): void {
    // let star: HTMLImageElement = <HTMLImageElement>document.getElementsByClassName('star')[0];
    let star: HTMLImageElement = <HTMLImageElement>document.createElement("img");
    star.src = './assets/Star.svg';
    star.className = 'star assets';
    star.style.left = `${_left}px`;
    star.style.top = `${_top}px`;
    (<HTMLElement>document.getElementById('background')).appendChild(star);
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
    for (let i: number = 0; i < stars.length; i++) {
        let element: HTMLElement = <HTMLElement>stars[i];
        let top = parseStringToInt(element.style.top);
        element.style.top = `${top + 1}px`;
    }
}

function moveRocket(): void {
    let rocket: HTMLElement = <HTMLElement>document.getElementById('rocketStart');
    let rocketBottom = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('bottom'));
    let rocketFlame: HTMLElement = <HTMLElement>document.getElementById('rocketFlame');
    let rocketHeight: number = parseStringToInt(window.getComputedStyle(rocket).getPropertyValue('height'))
    rocketFlame.style.bottom = `${rocketBottom - .325 * rocketHeight + 1}px`;
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