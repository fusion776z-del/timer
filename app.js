

const FULL_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let totalTime = FULL_TIME;
let remaining = FULL_TIME;

let interval = null;
let isStudy = true;
let session = 1;

const display =
document.getElementById("timerDisplay");

const ring =
document.getElementById("progressRing");

const modeLabel =
document.getElementById("modeLabel");

const radius = 120;

const circumference =
2 * Math.PI * radius;

ring.style.strokeDasharray =
circumference;

ring.style.strokeDashoffset = 0;
function updateDisplay(){

 const m =
 String(
 Math.floor(
 remaining / 60
 )
 ).padStart(2,"0");

 const s =
 String(
 remaining % 60
 ).padStart(2,"0");

 display.textContent =
 `${m}:${s}`;

 updateRing();

}
function updateRing(){

 const percent =
 remaining / totalTime;

 const offset =
 -circumference *
 (1 - percent);

 ring.style.strokeDashoffset =
 offset;

 const glowColor =
 percent > 0.5
 ? "#67e8f9"
 : percent > 0.2
 ? "#facc15"
 : "#ef4444";

 /* リング */

 ring.style.stroke =
 glowColor;

 ring.style.filter =
 `drop-shadow(0 0 8px ${glowColor})`;

 /* カード */

 document
 .querySelectorAll(".mode-card")
 .forEach(card=>{

   card.style.border =
   `3px solid ${glowColor}`;

   card.style.boxShadow =
   `0 0 15px ${glowColor}`;

 });

 /* アイコン */

 document
 .querySelectorAll(".mode-icon")
 .forEach(icon=>{

   icon.style.filter =
   `drop-shadow(0 0 6px ${glowColor})
    drop-shadow(0 0 12px ${glowColor})`;

 });

 /* 中央文字 */

 modeLabel.style.color =
 glowColor;

 modeLabel.style.textShadow =
 `0 0 15px ${glowColor}`;

 display.style.color =
 glowColor;

 display.style.textShadow =
 `0 0 25px ${glowColor}`;

 /* ボタン更新 */

 updateControlState();

}

function updateDots(){

 const dots =
 document.querySelectorAll(
 "#sessionDots span"
 );

 dots.forEach(dot =>
   dot.classList.remove("done")
 );

 let completed =
 (session - 1) % 4;

 for(let i=0;i<completed;i++){

   dots[i].classList.add("done");

 }

}
function switchMode(){

 if(isStudy){

   isStudy = false;

   totalTime = BREAK_TIME;

   remaining = BREAK_TIME;

   modeLabel.textContent =
   "休憩";

   document
   .getElementById("studyCard")
   .classList.remove("active");

   document
   .getElementById("breakCard")
   .classList.add("active");

 }else{

   isStudy = true;

   session++;

   totalTime = FULL_TIME;

   remaining = FULL_TIME;

   modeLabel.textContent =
   "集中";

   document
   .getElementById("breakCard")
   .classList.remove("active");

   document
   .getElementById("studyCard")
   .classList.add("active");

 }

updateDots();
updateDisplay();
updateControlState();
}


function startTimer(){

 if(interval) return;

 interval =
 setInterval(()=>{

   remaining--;

   updateDisplay();

   if(remaining<=0){

      switchMode();

   }

 },1000);

 updateControlState();

}

function pauseTimer(){

 clearInterval(interval);

 interval = null;

 updateControlState();

}

function resetTimer(){

 pauseTimer();

 isStudy = true;
 session = 1;

 totalTime = FULL_TIME;
 remaining = FULL_TIME;

 modeLabel.textContent = "集中";

 document
 .getElementById("studyCard")
 .classList.add("active");

 document
 .getElementById("breakCard")
 .classList.remove("active");

updateDots();
updateDisplay();
updateControlState();
}

document
.getElementById("startBtn")
.addEventListener(
"click",
startTimer
);

document
.getElementById("pauseBtn")
.addEventListener(
"click",
pauseTimer
);

document
.getElementById("resetBtn")
.addEventListener(
"click",
resetTimer
);



document
.getElementById("studyCard")
.addEventListener("click",()=>{

 pauseTimer();

 isStudy = true;

 totalTime = FULL_TIME;
 remaining = FULL_TIME;

 modeLabel.textContent =
 "集中";

 document
 .getElementById("studyCard")
 .classList.add("active");

 document
 .getElementById("breakCard")
 .classList.remove("active");

 updateDisplay();

});

document
.getElementById("breakCard")
.addEventListener("click",()=>{

 pauseTimer();

 isStudy = false;

 totalTime = BREAK_TIME;
 remaining = BREAK_TIME;

 modeLabel.textContent =
 "休憩";

 document
 .getElementById("breakCard")
 .classList.add("active");

 document
 .getElementById("studyCard")
 .classList.remove("active");

 updateDisplay();

});


function updateControlState(){

 document
 .querySelectorAll(".controls button")
 .forEach(btn=>{

   btn.classList.remove("active");

   btn.style.background = "";
   btn.style.boxShadow = "";

 });

 const percent =
 remaining / totalTime;

 const glowColor =
 percent > 0.5
 ? "#67e8f9"
 : percent > 0.2
 ? "#facc15"
 : "#ef4444";

 let activeBtn;

 if(interval){

   activeBtn =
   document.getElementById(
   "pauseBtn"
   );

 }else{

   activeBtn =
   document.getElementById(
   "startBtn"
   );

 }

 activeBtn.classList.add("active");

 activeBtn.style.background =
 glowColor;

 activeBtn.style.boxShadow =
 `0 0 10px ${glowColor},
  0 0 20px ${glowColor},
  0 0 30px ${glowColor}`;

}

updateDisplay();
updateControlState();