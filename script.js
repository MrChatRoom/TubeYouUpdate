let currentGame = "";
let views = 0;
let viewInterval;

/* LOAD VIDEO */
function loadVideo(id){

  window.history.pushState({}, "", "?v=" + id);

  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 520;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }catch(e){}

  const player = document.getElementById("player");

  if(viewInterval) clearInterval(viewInterval);
  views = 0;

  let src = "";

  if(id === "cookie"){
    currentGame = "cookie";
    src = "game1/index.html";
  }

  if(id === "snake"){
    currentGame = "snake";
    src = "game2/index.html";
  }

  if(id === "lidar"){
    currentGame = "lidar";
    src = "game3/index.html";
  }

  if(id === "vector"){
    currentGame = "vector";
    src = "game4/index.html";
  }

  player.innerHTML = `<iframe src="${src}" style="width:100%;height:360px;border:0;"></iframe>`;

  startViews();
  generateChat();
  startChatSpam();
}

/* VIEW COUNTER */
function startViews(){
  const el = document.getElementById("viewCount");

  viewInterval = setInterval(() => {
    views += Math.floor(Math.random()*6)+1;
    el.textContent = views;
  }, 500);
}

/* SEARCH EASTER EGG */
function searchSite(){
  const val = document.getElementById("searchInput").value.toLowerCase();

  if(val === "zupy"){
    window.location.href = "AltSite/index.html";
  }
}

/* ===== RANDOM SYSTEM ===== */

const start = ["xX","dark","pro","ultra","mega","cool","retro","noob","sk8","neo","pixel","omega","hyper","xx","z","ghost","cyber","alpha","beta","glitch"];
const mid = ["skater","gamer","killer","wizard","ninja","player","lord","kid","bot","dude","master","legend","runner","clicker","snake","cookie","fear","shadow","void","system"];
const end = ["x","xx","00","99","420","1337","7","x_","z","q","v","k","m","s","l","r","n","zz","xp","404"];

/* MESSAGE SYSTEM */
const msgStart = ["bro","yo","lol","wtf","this","game","chat","im","we","someone","everyone","no way","holy","broooo","nah","ok","wait","lmao","this dude","system"];

const msgMid = {
  cookie: ["cookies","clicker","bakery","mouse","dough","farm","upgrade","cursor","factory","sweet"],
  snake: ["snake","tail","wall","speed","collision","level","spawn","loop","path","ai"],
  lidar: ["darkness","scan","signal","echo","noise","static","shadow","distance","pulse","unknown"],
  vector: ["survival","vector","arena","fight","energy","core","enemy","shield","zone","grid"]
};

const msgEnd = ["insane","broken","OP","funny","lagging","crazy","lol","help","why","no stop","gg","dead","alive","bugged","classic","2005 vibes","peak","unreal","chaos","404"];

/* NAME */
function nameGen(){
  return start[Math.floor(Math.random()*start.length)] +
         mid[Math.floor(Math.random()*mid.length)] +
         end[Math.floor(Math.random()*end.length)] +
         Math.floor(Math.random()*9999);
}

/* MESSAGE BUILDER */
function buildMsg(){

  const s = msgStart[Math.floor(Math.random()*msgStart.length)];

  const pool = msgMid[currentGame] || msgMid.cookie;

  const m = pool[Math.floor(Math.random()*pool.length)];

  const e = msgEnd[Math.floor(Math.random()*msgEnd.length)];

  if(Math.random() < 0.2){
    return s + " random thoughts " + e;
  }

  return s + " " + m + " " + e;
}

/* CHAT */
function generateChat(){

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  for(let i=0;i<180;i++){

    const div = document.createElement("div");
    div.className = "msg";

    div.innerHTML = `<span style="color:${color()}">${nameGen()}</span>: ${buildMsg()}`;

    chat.appendChild(div);
  }
}

/* LIVE CHAT */
function startChatSpam(){

  setInterval(() => {

    const chat = document.getElementById("chat");
    if(!chat) return;

    const div = document.createElement("div");
    div.className = "msg";

    div.innerHTML = `<span style="color:${color()}">${nameGen()}</span>: ${buildMsg()}`;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

  }, 350);
}

/* COLORS */
function color(){
  const c = ["#cc0000","#0000cc","#009900","#990099","#ff6600","#333"];
  return c[Math.floor(Math.random()*c.length)];
}