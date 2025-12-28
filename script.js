// ====== LINK TO SURVEY ======
const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeSzNoEabj9xiWyiiBPO7JtZOCQKI-l8xrHOQ-q1bFFE77wDg/viewform?usp=sharing&ouid=103231803179167534745";
// ============================

const toast = document.getElementById("toast");
const showToast = (msg="Done!") => {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 1400);
};

// Survey buttons
const surveyBtn = document.getElementById("surveyBtn");
if(surveyBtn) {
    surveyBtn.href = SURVEY_URL;
    surveyBtn.target = "_blank";
}

const copyLinkBtn = document.getElementById("copyLinkBtn");
if(copyLinkBtn){
    copyLinkBtn.addEventListener("click", async () => {
        if (!SURVEY_URL) return showToast("No survey link yet.");
        await navigator.clipboard.writeText(SURVEY_URL);
        showToast("Survey link copied!");
    });
}

// Local/Global toggle
const scopeSwitch = document.getElementById("scopeSwitch");
const scopeLabel = document.getElementById("scopeLabel");
const factTitle = document.querySelector("#factCard .mini-title");
const factText = document.getElementById("factText");

const localFact = {
  title: "Local focus (Nice)",
  text: "Nice faces increasing drought pressure and high summer demand. Let’s reduce waste at school and at home."
};
const globalFact = {
  title: "Global context",
  text: "Many regions face water scarcity. Saving water locally helps reduce pressure and builds sustainable habits."
};

const setScope = (isGlobal) => {
  if (isGlobal) {
    scopeSwitch.classList.add("on");
    scopeSwitch.setAttribute("aria-checked", "true");
    scopeLabel.textContent = "Show local focus";
    factTitle.textContent = globalFact.title;
    factText.textContent = globalFact.text;
  } else {
    scopeSwitch.classList.remove("on");
    scopeSwitch.setAttribute("aria-checked", "false");
    scopeLabel.textContent = "Show global context";
    factTitle.textContent = localFact.title;
    factText.textContent = localFact.text;
  }
  localStorage.setItem("scopeGlobal", JSON.stringify(isGlobal));
};

const savedScope = JSON.parse(localStorage.getItem("scopeGlobal") || "false");
if(scopeSwitch) setScope(savedScope);

if(scopeSwitch){
    scopeSwitch.addEventListener("click", ()=> setScope(!scopeSwitch.classList.contains("on")));
    scopeSwitch.addEventListener("keydown", (e)=>{
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setScope(!scopeSwitch.classList.contains("on")); }
    });
}

// Tips
const tips = [
  "Turn off the tap while brushing.",
  "Report leaking taps at school.",
  "Choose shorter showers this week.",
  "Refill your bottle instead of buying new ones.",
  "Only run full loads in the dishwasher/washing machine.",
  "Close taps fully—no drips.",
  "Encourage your family to try the 7-day challenge."
];

const tipEl = document.getElementById("tipOfDay");
const newTipBtn = document.getElementById("newTipBtn");

if(newTipBtn){
    newTipBtn.addEventListener("click", ()=>{
    const pick = tips[Math.floor(Math.random()*tips.length)];
    tipEl.textContent = pick;
    showToast("New tip!");
    });
}

// 7-day challenge checklist
const checklist = document.getElementById("checklist");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const KEY = "teamwater_challenge";

const loadChecks = () => JSON.parse(localStorage.getItem(KEY) || "[false,false,false,false,false,false,false]");
const saveChecks = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));

const renderChecklist = () => {
  if(!checklist) return;
  const checks = loadChecks();
  checklist.innerHTML = "";
  checks.forEach((val, idx) => {
    const id = `day${idx+1}`;
    const label = document.createElement("label");
    label.className = "chk";
    label.innerHTML = `
      <input type="checkbox" id="${id}" ${val ? "checked" : ""} />
      <div>
        <strong>Day ${idx+1}</strong>
        <div class="muted">Complete one water-saving action today.</div>
      </div>
    `;
    checklist.appendChild(label);

    const cb = label.querySelector("input");
    cb.addEventListener("change", ()=>{
      const updated = loadChecks();
      updated[idx] = cb.checked;
      saveChecks(updated);
      updateProgress();
      if (updated.every(Boolean)) celebrate();
    });
  });
  updateProgress();
};

const updateProgress = () => {
  if(!progressText) return;
  const checks = loadChecks();
  const done = checks.filter(Boolean).length;
  progressText.textContent = done;
  const pct = Math.round((done/7)*100);
  progressPercent.textContent = pct + "%";
  progressBar.style.width = pct + "%";
};

const resetBtn = document.getElementById("resetChallengeBtn");
if(resetBtn){
    resetBtn.addEventListener("click", ()=>{
    saveChecks([false,false,false,false,false,false,false]);
    renderChecklist();
    showToast("Reset!");
    });
}

const shareBtn = document.getElementById("shareProgressBtn");
if(shareBtn){
    shareBtn.addEventListener("click", async ()=>{
    const done = loadChecks().filter(Boolean).length;
    const text = `#DropByDrop challenge: I completed ${done}/7 days!`;
    await navigator.clipboard.writeText(text);
    showToast("Progress text copied!");
    });
}

const celebrate = () => {
  showToast("Challenge completed! 🎉");
  for (let i=0;i<28;i++){
    const d = document.createElement("div");
    d.className = "dot";
    const x = Math.random()*window.innerWidth;
    const y = window.innerHeight - 80;
    const dx = (Math.random()*2 - 1) * 220 + "px";
    const dy = -(Math.random()*260 + 120) + "px";
    d.style.left = x + "px";
    d.style.top = y + "px";
    d.style.setProperty("--dx", dx);
    d.style.setProperty("--dy", dy);
    d.style.background = `rgba(${Math.floor(120+Math.random()*135)},${Math.floor(120+Math.random()*135)},255,.9)`;
    document.body.appendChild(d);
    setTimeout(()=>d.remove(), 1000);
  }
};

renderChecklist();

// Note: Removed "Update Stats" logic as requested. 
// To change stats, edit the HTML directly.

// Pledge wall
const PLEDGE_KEY = "teamwater_pledges";
const pledgeWall = document.getElementById("pledgeWall");
const pledgeInput = document.getElementById("pledgeInput");
const addPledgeBtn = document.getElementById("addPledgeBtn");
const clearPledgesBtn = document.getElementById("clearPledgesBtn");

const loadPledges = () => JSON.parse(localStorage.getItem(PLEDGE_KEY) || "[]");
const savePledges = (arr) => localStorage.setItem(PLEDGE_KEY, JSON.stringify(arr));

const renderPledges = () => {
  if(!pledgeWall) return;
  const pledges = loadPledges();
  pledgeWall.innerHTML = pledges.length ? "" : `<div class="muted">No pledges yet!</div>`;
  pledges.slice().reverse().forEach(p => {
    const div = document.createElement("div");
    div.className = "pledge";
    div.innerHTML = `<span>${escapeHtml(p.text)}</span><small>${new Date(p.time).toLocaleDateString()}</small>`;
    pledgeWall.appendChild(div);
  });
};

const escapeHtml = (str) => str.replace(/[&<>"']/g, m => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[m]));

if(addPledgeBtn){
    addPledgeBtn.addEventListener("click", ()=>{
    const text = pledgeInput.value.trim();
    if (!text) return showToast("Write a pledge first.");
    const pledges = loadPledges();
    pledges.push({ text, time: Date.now() });
    savePledges(pledges);
    pledgeInput.value = "";
    renderPledges();
    showToast("Pledge added!");
    });
}

if(clearPledgesBtn){
    clearPledgesBtn.addEventListener("click", ()=>{
    savePledges([]);
    renderPledges();
    showToast("Cleared.");
    });
}

renderPledges();

// Smooth scroll helper
function smoothScrollTo(targetY, duration = 1600) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
  
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  
    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) requestAnimationFrame(step);
    }
  
    requestAnimationFrame(step);
  }

// ====== STICKY NAV LOGIC ======
const navbar = document.getElementById("navbar");
const mainContent = document.getElementById("main-content");
const heroSection = document.querySelector(".us-hero");

function handleStickyNav() {
  if (!navbar || !heroSection) return;
  const stickyPoint = heroSection.offsetHeight;

  if (window.scrollY >= stickyPoint) {
    navbar.classList.add("fixed-nav");
    if (mainContent) {
      mainContent.style.paddingTop = navbar.offsetHeight + 46 + "px"; 
    }
  } else {
    navbar.classList.remove("fixed-nav");
    if (mainContent) {
      mainContent.style.paddingTop = "46px"; 
    }
  }
}

// ====== UPDATE: IMPACT COUNTERS (0 → final value animation) ======
// Animates key impact numbers when the Impact section scrolls into view
// Improves clarity and engagement without affecting data accuracy
// Uses IntersectionObserver to trigger once when section enters viewport

window.addEventListener("scroll", handleStickyNav);
window.addEventListener("load", handleStickyNav);

const enterBtn = document.getElementById("enterSiteBtn");
if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    const target = document.getElementById("main-content") || document.querySelector(".hero");
    
    if (!target) {
        console.error("Target section not found!"); 
        return;
    }

    const y = target.offsetTop - 80;
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  });
}

function animateCount(el, to, duration = 700, suffix = "") {
  const start = 0;
  const startTime = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const val = Math.round(start + (to - start) * easeOut(t));
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setupImpactCounters() {
  const section = document.getElementById("impact");
  if (!section) return;

  const elResponses = document.getElementById("statResponses");
  const elReached = document.getElementById("statReached");
  const elDonations = document.getElementById("statDonations");

  let played = false;

  const io = new IntersectionObserver((entries) => {
    if (played) return;
    if (entries[0].isIntersecting) {
      played = true;

      // Update: responses statistics number updated (92)
      animateCount(elResponses, 92, 650);

      // Update: reached statistics number updated (650)
      animateCount(elReached, 650, 700);

      // 351€
      animateCount(elDonations, 351, 800, "€");

      io.disconnect();
    }
  }, { threshold: 0.35 });

  io.observe(section);
}

window.addEventListener("load", setupImpactCounters);
