// =====================
// ① Hero（背景ふわっとクロスフェード：2レイヤー方式）
// =====================
const images = [
  "./assets/gallery/c-1.JPG",
  "./assets/gallery/c-4.JPG",
  "./assets/gallery/c-5.JPG",
  "./assets/gallery/c-6.JPG",
  "./assets/gallery/c-7.JPG",
  "./assets/gallery/c-8.JPG",
];

const INTERVAL_MS = 4200; 
const FADE_MS = 2400;     

const layerA = document.querySelector(".heroBg--a");
const layerB = document.querySelector(".heroBg--b");

let index = 0;
let showA = true;

layerA.style.backgroundImage = `url("${images[0]}")`;
layerB.style.opacity = 0;

setInterval(() => {
  const next = (index + 1) % images.length;

  const front = showA ? layerA : layerB; 
  const back  = showA ? layerB : layerA; 

  back.style.backgroundImage = `url("${images[next]}")`;
  back.style.opacity = 1;   
  front.style.opacity = 0;  

  setTimeout(() => {
    index = next;
    showA = !showA;
  }, FADE_MS);

}, INTERVAL_MS);


// =====================
// ② Countdown（2026/04/29 14:30 JST）
// =====================
const targetDate = new Date("2026-04-29T14:30:00+09:00");

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMins = document.getElementById("cdMins");
const cdSecs = document.getElementById("cdSecs");

function pad2(n){ return String(n).padStart(2, "0"); }

function updateCountdown(){
  const now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    cdDays.textContent = "00";
    cdHours.textContent = "00";
    cdMins.textContent = "00";
    cdSecs.textContent = "00";
    return;
  }

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / (3600 * 24));
  const hours = Math.floor((sec % (3600 * 24)) / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  cdDays.textContent = String(days);
  cdHours.textContent = pad2(hours);
  cdMins.textContent = pad2(mins);
  cdSecs.textContent = pad2(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);


// =====================
// ⑦⑨ メニューモーダル（上からふわっ＋背景暗く）
// =====================
const menuBtn = document.getElementById("menuBtn");
const menuModal = document.getElementById("menuModal");
const menuClose = document.getElementById("menuClose");
const overlay = document.getElementById("overlay");

function openMenu(){
  menuModal.classList.add("is-open");
  menuModal.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeMenu(){
  menuModal.classList.remove("is-open");
  menuModal.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".menuLink").forEach(a=>{
  a.addEventListener("click", ()=> closeMenu());
});


// =====================
// ⑥ RSVP：確認→送信
// =====================
const form = document.getElementById("rsvpForm");
const step1 = form.querySelector('.rsvpStep[data-step="1"]');
const step2 = form.querySelector('.rsvpStep[data-step="2"]');
const toConfirm = document.getElementById("toConfirm");
const backToEdit = document.getElementById("backToEdit");
const confirmBox = document.getElementById("confirmBox");
const formMsg = document.getElementById("formMsg");
const submitMsg = document.getElementById("submitMsg");
const submitBtn = document.getElementById("submitBtn");

const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbywVFLvl4JdQU7BZa4ufsP7FnFri2YH_4r1_ONGHJ8ALX36VHGNy92FtOcndLUxFod7/exec"; 

function getFormData(){
  const fd = new FormData(form);
  return {
    name: fd.get("name")?.toString().trim() || "",
    furigana: fd.get("furigana")?.toString().trim() || "",
    guestType: fd.get("guestType") || "",
    attend: fd.get("attend") || "",
    tel: fd.get("tel") || "",
    zip: fd.get("zip") || "",
    address: fd.get("address") || "",
    allergy: fd.get("allergy") || "",
    companions: fd.get("companions") || "",
    message: fd.get("message") || "",
    photo: fd.get("photo") || null,
  };
}

function validate(data){
  if (!data.name) return "お名前を入力してください。";
  if (!data.attend) return "出欠を選択してください。";
  return "";
}

function renderConfirm(data){
  const attendText = data.attend === "attend" ? "出席" : "欠席";
  confirmBox.innerHTML = `
    <p><b>お名前：</b>${escapeHtml(data.name)}</p>
    <p><b>ふりがな：</b>${escapeHtml(data.furigana)}</p>
    <p><b>出欠：</b>${attendText}</p>
    <p><b>ゲスト区分：</b>${data.guestType === "groom" ? "新郎側" : "新婦側"}</p>
    <p><b>電話番号：</b>${escapeHtml(data.tel)}</p>
    <p><b>郵便番号：</b>${escapeHtml(data.zip)}</p>
    <p><b>住所：</b>${escapeHtml(data.address)}</p>
    <p><b>アレルギー：</b>${escapeHtml(data.allergy)}</p>
    <p><b>お連れ様：</b>${escapeHtml(data.companions)}</p>
    <p><b>メッセージ：</b>${escapeHtml(data.message)}</p>
    <p><b>写真：</b>${data.photo && data.photo.name ? data.photo.name : "なし"}</p>
  `;
}

function escapeHtml(str){
  if (!str) return "";
  return str
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

toConfirm.addEventListener("click", ()=>{
  formMsg.textContent = "";
  const data = getFormData();
  const err = validate(data);
  if (err){
    formMsg.textContent = err;
    return;
  }
  renderConfirm(data);
  step1.hidden = true;
  step2.hidden = false;
});

backToEdit.addEventListener("click", ()=>{
  submitMsg.textContent = "";
  step2.hidden = true;
  step1.hidden = false;
});

const photoInput = document.getElementById("photo");

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  submitMsg.style.color = "#1c2b33";
  submitMsg.textContent = "送信中…";

  const data = getFormData();
  const err = validate(data);
  if (err){
    submitMsg.style.color = "#b00020";
    submitMsg.textContent = err;
    return;
  }

  try{
    const fd = new FormData();

    fd.append("name", data.name);
    fd.append("furigana", data.furigana);
    fd.append("attend", data.attend);
    fd.append("guestType", data.guestType || "");
    fd.append("tel", data.tel || "");
    fd.append("zip", data.zip || "");
    fd.append("address", data.address || "");
    fd.append("allergy", data.allergy || "");
    fd.append("companions", data.companions || "");
    fd.append("message", data.message || "");
    const file = photoInput?.files?.[0];
    if (file){
      if (file.size > 5 * 1024 * 1024){
        submitMsg.style.color = "#b00020";
        submitMsg.textContent = "写真が大きすぎます（5MB以下にしてください）";
        return;
      }

      const dataUrl = await fileToDataUrl(file); 
      fd.append("photoName", file.name);
      fd.append("photoType", file.type);
      fd.append("photoDataUrl", dataUrl);
    }

    await postToGAS(fd);

    submitMsg.style.color = "#1c2b33";
    submitMsg.textContent = "送信しました！ありがとうございました。";
    submitBtn.disabled = true;

  }catch(err){
    submitMsg.style.color = "#b00020";
    submitMsg.textContent = "送信に失敗しました。時間を置いて再度お試しください。" + String(err);
  }
});

const zipEl = document.getElementById("zip");
const addressEl = document.getElementById("address");
const zipHint = document.getElementById("zipHint");

function normalizeZip(value){
  return (value || "").replace(/[^\d]/g, "").slice(0, 7); 
}

let zipTimer = null;

zipEl?.addEventListener("input", () => {
  const zip = normalizeZip(zipEl.value);

  if (zip.length >= 4) {
    zipEl.value = `${zip.slice(0,3)}-${zip.slice(3)}`;
  } else {
    zipEl.value = zip;
  }

  if (zip.length === 7) {
    clearTimeout(zipTimer);
    zipTimer = setTimeout(() => fetchAddress(zip), 250);
  } else {
    if (zipHint) zipHint.textContent = "";
  }
});

async function fetchAddress(zip7){
  try{
    if (zipHint) zipHint.textContent = "住所を検索中…";

    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip7}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== 200 || !json.results || !json.results.length){
      if (zipHint) zipHint.textContent = "住所が見つかりませんでした。";
      return;
    }

    const r = json.results[0];
    const addr = `${r.address1}${r.address2}${r.address3}`; 
    addressEl.value = addr;

    if (zipHint) zipHint.textContent = "住所を入力しました";
  }catch(e){
    if (zipHint) zipHint.textContent = "検索に失敗しました。通信環境をご確認ください。";
  }
}

async function postToGAS(fd){
  await fetch(ENDPOINT_URL, {
    method: "POST",
    body: fd,
    mode: "no-cors",
  });
}

// =====================
// Scroll FadeUp
// =====================
const fadeEls = document.querySelectorAll(".fadeUp");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add("is-show");
      observer.unobserve(entry.target);
    }
  });
},{
  threshold: 0.15
});

fadeEls.forEach(el => observer.observe(el));
