let currentGame = "";
let views = 0;
let viewTimer;

/* LOAD GAME (ALT SYSTEM) */
function loadVideo(id){

  window.history.pushState({}, "", "?v=" + id);

  const player = document.getElementById("player");

  const map = {
    alt1: "Altgame1",
    alt2: "Altgame2",
    alt3: "Altgame3",
    alt4: "Altgame4"
  };

  player.innerHTML =
    `<iframe src="${map[id]}/index.html" style="width:100%;height:360px;border:0;"></iframe>`;

  startViews();
  generateChat();
}

/* VIEW COUNTER */
function startViews(){

  clearInterval(viewTimer);
  views = 0;

  viewTimer = setInterval(() => {
    views += Math.floor(Math.random()*10)+1;
    document.getElementById("viewCount").textContent = views;
  }, 300);
}

/* ZUPY NAME */
function zupyName(){
  return "zupy praiser" + Math.floor(Math.random()*9999);
}

/* RANDOM CAPS PRAISE */
function praise(){
  const msg = "praise lord zupy";
  return msg.split("").map(c =>
    Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase()
  ).join("");
}

/* CHAT */
function generateChat(){

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  for(let i=0;i<180;i++){

    const div = document.createElement("div");
    div.textContent = zupyName() + ": " + praise();
    chat.appendChild(div);
  }
}

/* LIVE CHAT SPAM */
setInterval(() => {

  const chat = document.getElementById("chat");
  if(!chat) return;

  const div = document.createElement("div");
  div.textContent = zupyName() + ": " + praise();

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

}, 500);

/* SECRET EXIT */
function checkSecret(val){

  if(val === "i wont to go home i wont to go home i wont to go home"){
    window.location.href = "../index.html";
  }
}