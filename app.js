
const FULL_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

let totalTime = FULL_TIME;
let remaining = FULL_TIME;

let interval = null;
let isStudy = true;
let session = 1;
let endTime = null;
let audioCtx = null;

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

function playBeep(
 freq = 800,
 duration = 150
){

 if(!audioCtx){
  return;
 }

 if(
  audioCtx.state ===
  "suspended"
 ){
  audioCtx.resume();
 }

 const osc =
 audioCtx.createOscillator();

 const gain =
 audioCtx.createGain();

 osc.connect(gain);

 gain.connect(
  audioCtx.destination
 );

 osc.frequency.value =
 freq;

 osc.type = "square";

 gain.gain.setValueAtTime(
 1.0,
 audioCtx.currentTime
 );

 gain.gain
 .exponentialRampToValueAtTime(
 0.001,
  audioCtx.currentTime +
  duration / 1000
 );

 osc.start();

 osc.stop(
  audioCtx.currentTime +
  duration / 1000
 );
}


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

 if(card.classList.contains("active")){

  card.style.border =
  `3px solid ${glowColor}`;

card.style.boxShadow =
`
0 0 15px ${glowColor},
0 0 30px ${glowColor},
0 0 60px ${glowColor},
inset 0 0 30px ${glowColor}
`;

  card.style.background =
  "rgba(103,232,249,.15)";

  card.style.opacity = "1";

 }else{

  card.style.border =
  "#27324a";

  card.style.boxShadow =
  "none";

  card.style.background =
  "transparent";

  card.style.opacity = "0.45";

 }

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

/* 集中・休憩文字 */

document
.querySelectorAll(".mode-card")
.forEach(card=>{

 const icon =
 card.querySelector(".mode-icon");

 const label =
 card.querySelector(".mode-label");

 if(card.classList.contains("active")){

  icon.style.filter =
  `drop-shadow(0 0 8px ${glowColor})
   drop-shadow(0 0 20px ${glowColor})`;

  label.style.color =
  glowColor;

  label.style.textShadow =
  `
  0 0 10px ${glowColor},
  0 0 20px ${glowColor},
  0 0 40px ${glowColor}
  `;

 }else{

  icon.style.filter =
  "none";

  label.style.color =
  "#4b5563";

  label.style.textShadow =
  "none";

 }

});

 /* ボタン更新 */

 updateControlState();

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


updateDisplay();
updateControlState();

localStorage.setItem(
 "isStudy",
 String(isStudy)
);

pauseTimer();

startTimer();
}


function startTimer(){

 if(interval) return;


 endTime =
 Date.now() +
 remaining * 1000;

localStorage.setItem(
 "endTime",
 endTime
);
 interval =
 setInterval(()=>{

   remaining--;
if(remaining === 3){
 playBeep(1800,150);
}

if(remaining === 2){
 playBeep(1800,150);
}

if(remaining === 1){
 playBeep(1800,150);
}

if(remaining === 0){
 playBeep(2400,1200);
}

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

 
 localStorage.removeItem(
  "endTime"
 );

 updateControlState();

}

function resetTimer(){

 pauseTimer();

 if(isStudy){

   totalTime = FULL_TIME;
   remaining = FULL_TIME;

 }else{

   totalTime = BREAK_TIME;
   remaining = BREAK_TIME;

 }

 updateDisplay();
 updateControlState();

}


document
.getElementById("startBtn")
.addEventListener(
 "click",
 ()=>{

  if(!audioCtx){

   audioCtx =
   new (
    window.AudioContext ||
    window.webkitAudioContext
   )();

  }

  audioCtx.resume();

  startTimer();

 }
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

localStorage.setItem(
 "isStudy",
 "true"
);

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

localStorage.setItem(
 "isStudy",
 "false"
);

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


const savedMode =
 localStorage.getItem(
  "isStudy"
 );

if(savedMode !== null){

 isStudy =
 savedMode === "true";

 if(isStudy){

   totalTime = FULL_TIME;

   modeLabel.textContent =
   "集中";

   document
   .getElementById("studyCard")
   .classList.add("active");

   document
   .getElementById("breakCard")
   .classList.remove("active");

}else{

   totalTime = BREAK_TIME;

   modeLabel.textContent =
   "休憩";

   document
   .getElementById("studyCard")
   .classList.remove("active");

   document
   .getElementById("breakCard")
   .classList.add("active");

 }

}


const savedEndTime =
 localStorage.getItem(
  "endTime"
 );

if(savedEndTime){

 endTime =
 Number(savedEndTime);

 remaining =
 Math.max(
 0,
  Math.floor(
   (endTime - Date.now())
   / 1000
  )
 );

 updateDisplay();

 interval =
 setInterval(()=>{

  remaining =
  Math.max(
   0,
   Math.floor(
    (endTime - Date.now())
    / 1000
   )
  );

  updateDisplay();

  if(remaining <= 0){

   clearInterval(interval);

   interval = null;


   switchMode();

  }

 },1000);

 updateControlState();

}

function updateRealClock(){

 const now = new Date();

 const y =
 now.getFullYear();

 const m =
 String(
 now.getMonth() + 1
 ).padStart(2,"0");

 const d =
 String(
 now.getDate()
 ).padStart(2,"0");

 const h =
 String(
 now.getHours()
 ).padStart(2,"0");

 const min =
 String(
 now.getMinutes()
 ).padStart(2,"0");

 const sec =
 String(
 now.getSeconds()
 ).padStart(2,"0");

 document
 .getElementById("realDate")
 .textContent =
 `${y}.${m}.${d}`;

 document
 .getElementById("realTime")
 .textContent =
 `${h}:${min}:${sec}`;

}

updateRealClock();

setInterval(
 updateRealClock,
 1000
);

document.addEventListener(
 "visibilitychange",
 ()=>{

  if(
   document.visibilityState
   === "visible"
   &&
   endTime
  ){

   remaining =
   Math.max(
    0,
    Math.floor(
     (endTime - Date.now())
     / 1000
    )
   );

   updateDisplay();

  }

 }
);

