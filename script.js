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
        try {
          await navigator.clipboard.writeText(SURVEY_URL);
          showToast("Survey link copied!");
        } catch {
          showToast("Survey link ready.");
        }
    });
}

// Local/Global toggle
const scopeSwitch = document.getElementById("scopeSwitch");
const scopeLabel = document.getElementById("scopeLabel");
const factTitle = document.querySelector("#factCard .mini-title");
const factText = document.getElementById("factText");

const localFact = {
  title: "Local focus (Nice)",
  text: "Nice faces drought pressure and high summer demand. Let’s save water at school and home."
};
const globalFact = {
  title: "Global context",
  text: "Many regions face water scarcity. Saving water locally helps reduce pressure and builds sustainable habits."
};

const setScope = (isGlobal) => {
  if (!scopeSwitch) return;
  scopeSwitch.checked = isGlobal;
  scopeSwitch.setAttribute("aria-checked", String(isGlobal));

  if (isGlobal) {
    scopeLabel.textContent = "Show local focus";
    factTitle.textContent = globalFact.title;
    factText.textContent = globalFact.text;
  } else {
    scopeLabel.textContent = "Show global context";
    factTitle.textContent = localFact.title;
    factText.textContent = localFact.text;
  }
  localStorage.setItem("scopeGlobal", JSON.stringify(isGlobal));
};

const savedScope = JSON.parse(localStorage.getItem("scopeGlobal") || "false");
if(scopeSwitch) setScope(savedScope);

if(scopeSwitch){
    scopeSwitch.addEventListener("change", ()=> setScope(scopeSwitch.checked));
    scopeSwitch.addEventListener("keydown", (e)=>{
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setScope(!scopeSwitch.checked); }
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
    const currentTip = tipEl.textContent.trim();
    const availableTips = tips.filter((tip) => tip !== currentTip);
    const tipPool = availableTips.length ? availableTips : tips;
    const pick = tipPool[Math.floor(Math.random()*tipPool.length)];
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
    try {
      await navigator.clipboard.writeText(text);
      showToast("Progress text copied!");
    } catch {
      showToast("Progress text ready.");
    }
    });
}

const celebrate = () => {
  showToast("Challenge completed.");
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
const menuToggle = document.getElementById("menuToggle");
const navSectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const navSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function handleStickyNav() {
  if (!navbar || !heroSection) return;
  const stickyPoint = heroSection.offsetHeight;

  if (window.scrollY >= stickyPoint) {
    navbar.classList.add("is-stuck");
  } else {
    navbar.classList.remove("is-stuck");
  }
}

function updateActiveNavLink() {
  if (!navSectionLinks.length || !navSections.length) return;

  const navOffset = navbar ? navbar.offsetHeight : 0;
  const activeLine = window.scrollY + navOffset + 80;
  let activeSection = null;

  navSections.forEach((section) => {
    if (section.offsetTop <= activeLine) {
      activeSection = section;
    }
  });

  navSectionLinks.forEach((link) => {
    const isActive = activeSection && link.getAttribute("href") === `#${activeSection.id}`;
    link.classList.toggle("active", Boolean(isActive));
    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeMenu() {
  if (!navbar || !menuToggle) return;
  navbar.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function updateMenuPosition() {
  if (!navbar) return;
  const navRect = navbar.getBoundingClientRect();
  document.documentElement.style.setProperty("--menu-top", `${Math.round(navRect.bottom + 10)}px`);
}

if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    updateMenuPosition();
    const isOpen = navbar.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  navSectionLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) closeMenu();
  });

  window.addEventListener("scroll", () => {
    if (navbar.classList.contains("menu-open")) updateMenuPosition();
  });

  window.addEventListener("resize", () => {
    if (navbar.classList.contains("menu-open")) updateMenuPosition();
  });
}

// ====== UPDATE: IMPACT COUNTERS (0 → final value animation) ======
// Animates key impact numbers when the Impact section scrolls into view
// Improves clarity and engagement without affecting data accuracy
// Uses IntersectionObserver to trigger once when section enters viewport

window.addEventListener("scroll", handleStickyNav);
window.addEventListener("load", handleStickyNav);
window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);
window.addEventListener("resize", updateActiveNavLink);

const enterBtn = document.getElementById("enterSiteBtn");
if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    const target = document.getElementById("mainStart") || document.getElementById("main-content") || document.querySelector(".hero");
    
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

const brandLink = document.querySelector('.brand[href="#mainStart"]');
if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    const target = document.getElementById("mainStart");
    if (!target) return;

    event.preventDefault();
    const navOffset = navbar ? navbar.offsetHeight : 0;
    history.replaceState(null, "", "#mainStart");
    window.scrollTo({
      top: target.offsetTop - navOffset,
      behavior: "smooth"
    });
  });
}

window.addEventListener("load", () => {
  if (window.location.hash !== "#mainStart") return;

  const target = document.getElementById("mainStart");
  if (!target) return;

  const navOffset = navbar ? navbar.offsetHeight : 0;
  window.scrollTo({
    top: target.offsetTop - navOffset,
    behavior: "auto"
  });
});

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

function setupHeroCounters() {
  const counters = document.querySelectorAll(".stat-count");
  if (!counters.length) return;

  counters.forEach((counter) => {
    counter.textContent = "0" + (counter.dataset.suffix || "");
  });

  const playCounter = (counter) => {
    if (counter.dataset.animated === "true") return;
    counter.dataset.animated = "true";
    animateCount(
      counter,
      Number(counter.dataset.count || 0),
      750,
      counter.dataset.suffix || ""
    );
  };

  const checkCounters = () => {
    counters.forEach((counter) => {
      const rect = counter.getBoundingClientRect();
      const viewportHeight = Math.max(window.innerHeight, document.documentElement.clientHeight, 720);
      const isVisible = rect.top < viewportHeight * 0.9 && rect.bottom > 0;
      if (isVisible) playCounter(counter);
    });

    if ([...counters].every((counter) => counter.dataset.animated === "true")) {
      clearInterval(counterCheckInterval);
      window.removeEventListener("scroll", checkCounters);
    }
  };

  window.addEventListener("scroll", checkCounters, { passive: true });
  const counterCheckInterval = setInterval(checkCounters, 250);
  checkCounters();
}

function setupImpactCounters() {
  const section = document.getElementById("impact");
  if (!section) return;

  const elResponses = document.getElementById("statResponses");
  const elReached = document.getElementById("statReached");
  const elDonations = document.getElementById("statDonations");
  if (!elResponses || !elReached || !elDonations) return;

  let played = false;

  const io = new IntersectionObserver((entries) => {
    if (played) return;
    if (entries[0].isIntersecting) {
      played = true;

      animateCount(elResponses, 96, 650);
      animateCount(elReached, 650, 700);
      animateCount(elDonations, 351, 800, "€");

      io.disconnect();
    }
  }, { threshold: 0.35 });

  io.observe(section);
}

window.addEventListener("load", setupHeroCounters);
window.addEventListener("load", setupImpactCounters);
