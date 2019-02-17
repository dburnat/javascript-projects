let ball = document.querySelector('.ball');
let garden = document.querySelector('.garden');
let output = document.querySelector('.output');
let basket = document.querySelector('.basket');
let ballinfo = document.querySelector('.ballinfo');
let basketinfo = document.querySelector('.basketinfo');
let result = document.querySelector('.result');

// Funkcjonalności:
// Do wyboru:
// Wersja shame: jedna kulka, jedna dziurka. Traf kulką do dziurki sterując kulką za pomocą czujników pochylenia telefonu, zmierz czas. Plansza rysowana na div-ach.
// Wersja light: jedna kulka, wiele dziurek. Przejdź do wybranego miejsca na planszy omijając wszystkie dziurki po drodze. Sterowanie j/w. Plansza rysowana na svg lub canvas.
// Wersja normal: jedna kulka wiele dziurek. Przejdź kulką przez dziurki w wybranej kolejności (dowolna metoda wskazania kolejności - zmiana koloru następnej, kolorowanie wszystkich, animacja, whatever). Sterowanie j/w, plansza j/w.
// Wszystkie gry powinny mieć cel - minimum to mierzenie czasu. Mile widziane rozwinięcia pomysłu (np. jedna dziura wciąga kulkę a druga ją wypluwa w innym miejscu, zmiana rozmiaru dziur, dodatkowe niespodzianki).
// Odczytanie czasu: 
//  let czas = Date.now() 
//  lub 
//  let czas = new Date()
// Wymagania do kodu:
// 1. Komentarze
let startTime = Date.now();
let gameOn = true;

function getCssProperty(elmId, property) {
  var elem = document.getElementById(elmId);
  return window.getComputedStyle(elem, null).getPropertyValue(property);
}

let maxX = garden.clientWidth - ball.clientWidth;
let maxY = garden.clientHeight - ball.clientHeight;
basket.style.top = "180px";
let basketTop = parseInt(basket.style.top);
basket.style.left = "75px";
let basketLeft = parseInt(basket.style.left);


function handleOrientation(event) {
  if (gameOn) {
    let x = event.beta;  // In degree in the range [-180,180]
    let y = event.gamma; // In degree in the range [-90,90]
    let c = getCssProperty('ball', "top");
    let d = getCssProperty('ball', 'left');
    let e = getCssProperty('basket', 'top');

    output.innerHTML = "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";
    ballinfo.innerHTML = "top ball : " + c + "\n";
    ballinfo.innerHTML += "left ball: " + d + "\n";

    basketinfo.innerHTML = "top : " + e + "\n";
    basketinfo.innerHTML = "top : " + e + "\n";


    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x > 90) { x = 90 };
    if (x < -90) { x = -90 };

    // To make computation easier we shift the range of 
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top = (maxX * x / 180 - 5) + "px";
    ball.style.left = (maxY * y / 180 - 5) + "px";

    

    console.log("ball style top " + ball.style.top);
    console.log("ball style left " + ball.style.left);
    //console.log("basket style top" + basket.style.top);

    if (ball.style.top  > basketTop - 20 + 'px' && ball.style.top < basketTop +'px' && ball.style.left < basket.style.left - 25   +'px' ) {
      let wintime = Math.round( (Date.now() - startTime) / 1000);
      result.innerHTML = "You win, your time:" + wintime;
      console.log("colision");
      gameOn = false;
    }
  }
}

window.addEventListener('deviceorientation', handleOrientation);
