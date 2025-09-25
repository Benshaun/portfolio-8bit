// ——— Utilitaires DOM
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ——— Panneaux
const screens = $$(".panel");
const startScreen = $("#screen-start");

const modeBtn = document.getElementById("modeToggle");

// ——— Son
const sfxBleep = $("#sfx-bleep");
const sfxSelect = $("#sfx-select");
let soundOn = false;
const soundBtn = $("#soundToggle");

function play(blip){
  if(!soundOn) return;
  // Rewind pour pouvoir rejouer vite
  blip.currentTime = 0;
  blip.play().catch(()=>{ /* silencieux */ });
}

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.textContent = `SOUND: ${soundOn ? "ON" : "OFF"}`;
  soundBtn.setAttribute("aria-pressed", String(soundOn));
  play(sfxBleep);
});

// —— Mode GameBoy (toggle + persistance)
const MODE_KEY = "vb-mode"; // 'color' | 'gb'
function applyMode(mode){
  const isGB = mode === "gb";
  document.body.classList.toggle("gb", isGB);
  modeBtn.textContent = `MODE: ${isGB ? "GAMEBOY" : "COLOR"}`;
  modeBtn.setAttribute("aria-pressed", String(isGB));
}
function loadMode(){
  const m = localStorage.getItem(MODE_KEY) || "color";
  applyMode(m);
}
function toggleMode(){
  const current = document.body.classList.contains("gb") ? "gb" : "color";
  const next = current === "gb" ? "color" : "gb";
  localStorage.setItem(MODE_KEY, next);
  applyMode(next);
}

modeBtn.addEventListener("click", toggleMode);
loadMode();

// ——— Navigation menu (boutons)
$$(".menu-item, .btn.back").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const targetId = btn.dataset.target;
    if(!targetId) return;
    switchTo(targetId);
    play(sfxSelect);
  });
});

// ——— Navigation clavier sur l’écran Start
let menuIndex = 0;
const items = $$(".menu-item", startScreen);
function setSelected(i){
  items.forEach(el=>el.classList.remove("selected"));
  items[i].classList.add("selected");
}
setSelected(menuIndex);

window.addEventListener("keydown", (e)=>{
  const key = e.key.toLowerCase();
  if(!$("#screen-start").classList.contains("active")) return;

  if(key === "arrowdown"){
    menuIndex = (menuIndex + 1) % items.length;
    setSelected(menuIndex);
    play(sfxBleep);
  }
  if(key === "arrowup"){
    menuIndex = (menuIndex - 1 + items.length) % items.length;
    setSelected(menuIndex);
    play(sfxBleep);
  }
  if(key === "enter"){
    const target = items[menuIndex].dataset.target;
    switchTo(target);
    play(sfxSelect);
  }
});

// ——— Changement de panneau
function switchTo(id){
  screens.forEach(s=>s.classList.remove("active"));
  const target = document.getElementById(id);
  if(target){ target.classList.add("active"); }
}

// ——— Lancer sur Start par défaut
switchTo("screen-start");

window.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase() === "m"){
    toggleMode();
    play(sfxBleep);
  }
});