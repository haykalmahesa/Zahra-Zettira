// ================= KONFIGURASI =================
const PASSWORD = "2907";          // kode rahasia pembuka website
const NAMA = "Zahra Zettira";         // ganti dengan nama teman kamu
const ULTAH_TANGGAL = 29;         // tanggal ulang tahun
const ULTAH_BULAN = 7;            // bulan ulang tahun (1-12), 7 = Juli
const ULTAH_TAHUN = 2027;

// Terapkan nama ke halaman
document.getElementById("nameDisplay").textContent = NAMA;
document.getElementById("nameDisplay2").textContent = NAMA;

// ================= GERBANG KATA SANDI =================
const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gateInput = document.getElementById("gateInput");
const gateSubmitBtn = document.getElementById("gateSubmitBtn");
const gateError = document.getElementById("gateError");
const gateCard = document.querySelector(".gate-card");
const site = document.getElementById("site");
const gateLockCaption = document.getElementById("gateLockCaption");

// Jam berapa gerbang boleh mulai dibuka (default: tengah malam di tanggal ultah).
// Ganti angka jam/menit di bawah kalau mau gerbang kebuka di jam tertentu, misal jam 00:00.
const UNLOCK_JAM = 0;
const UNLOCK_MENIT = 0;

let gateUnlocked = false; // true kalau waktu sudah sampai, form baru bisa dipakai

function getUnlockTarget() {
  return new Date(ULTAH_TAHUN, ULTAH_BULAN - 1, ULTAH_TANGGAL, UNLOCK_JAM, UNLOCK_MENIT, 0);
}

function startGateLock() {
  const target = getUnlockTarget();
  const dEl = document.getElementById("gcDays");
  const hEl = document.getElementById("gcHours");
  const mEl = document.getElementById("gcMins");
  const sEl = document.getElementById("gcSecs");
  let gateTimer = null;

  function tick() {
    const now = new Date().getTime();
    const diff = target.getTime() - now;

    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      unlockGateForm();
      clearInterval(gateTimer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  tick();
  gateTimer = setInterval(tick, 1000);
}

function unlockGateForm() {
  gateUnlocked = true;
  gateInput.disabled = false;
  gateSubmitBtn.disabled = false;
  gateLockCaption.textContent = "gerbang sudah bisa dibuka, masukkan kode rahasianya ✨";
  gateLockCaption.classList.add("ready");
}

startGateLock();

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!gateUnlocked) return; // jaga-jaga: form tetap tidak diproses selama masih terkunci
  if (gateInput.value.trim() === PASSWORD) {
    gateCard.classList.add("unlocked");
    spawnFlowerBurst();
    gate.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      gate.style.opacity = "0";
    }, 650);
    setTimeout(() => {
      gate.remove();
      site.hidden = false;
      initBalloons();
      startCountdown();
    }, 1250);
  } else {
    gateError.classList.add("show");
    gateCard.classList.add("shake");
    gateInput.value = "";
    setTimeout(() => gateCard.classList.remove("shake"), 400);
  }
});

// ================= ANIMASI BUNGA (kode benar) =================
const flowerBurst = document.getElementById("flowerBurst");
const FLOWER_EMOJIS = ["🌸", "🌼", "🌷", "🌺", "💐", "🌹", "🪻"];

function spawnFlowerBurst() {
  if (!flowerBurst) return;
  const count = 70;
  const width = window.innerWidth;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "flower-piece";
    petal.textContent = FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)];

    const startX = Math.random() * width;
    const driftStart = (Math.random() - 0.5) * 200;
    const driftEnd = (Math.random() - 1) * 260;
    const size = 40 + Math.random() * 30;
    const duration = 2 + Math.random() * 2;
    const delay = Math.random() * 2;
    const spin = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360);

    petal.style.left = startX + "px";
    petal.style.fontSize = size + "px";
    petal.style.animationDuration = duration + "s";
    petal.style.animationDelay = delay + "s";
    petal.style.setProperty("--drift-start", driftStart + "px");
    petal.style.setProperty("--drift-end", driftEnd + "px");
    petal.style.setProperty("--spin", spin + "deg");

    flowerBurst.appendChild(petal);
    setTimeout(() => petal.remove(), (duration + delay) * 1000 + 200);
  }
}

// ================= COUNTDOWN =================
function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, ULTAH_BULAN - 1, ULTAH_TANGGAL, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target = new Date(year + 1, ULTAH_BULAN - 1, ULTAH_TANGGAL, 0, 0, 0);
  }
  return target;
}

function startCountdown() {
  const target = getNextBirthday();
  const dEl = document.getElementById("cDays");
  const hEl = document.getElementById("cHours");
  const mEl = document.getElementById("cMins");
  const sEl = document.getElementById("cSecs");
  const caption = document.getElementById("countdownCaption");

  function tick() {
    const now = new Date().getTime();
    const diff = target.getTime() - now;

    if (diff <= 0) {
      dEl.textContent = "00";
      hEl.textContent = "00";
      mEl.textContent = "00";
      sEl.textContent = "00";
      caption.textContent = "hari ini adalah hari-nya! 🎉";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(mins).padStart(2, "0");
    sEl.textContent = String(secs).padStart(2, "0");
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// ================= BALON MELAYANG =================
function initBalloons() {
  const container = document.getElementById("balloons");
  const colors = ["#e8b86d", "#f2a6b0", "#c98fd6", "#f2cf9a", "#e08fa0"];
  const count = 10;

  for (let i = 0; i < count; i++) {
    const b = document.createElement("div");
    b.className = "balloon";
    b.style.left = Math.random() * 96 + "%";
    b.style.background = colors[i % colors.length];
    const duration = 5 + Math.random() * 4;
    const delay = Math.random() * 5;
    b.style.animationDuration = duration + "s";
    b.style.animationDelay = "-" + delay + "s";
    container.appendChild(b);
  }
}

// ================= TIUP LILIN =================
const blowBtn = document.getElementById("blowBtn");
const blowHint = document.getElementById("blowHint");
const flames = document.querySelectorAll(".flame");
const messageSection = document.getElementById("wishReveal");
let blown = false;

blowBtn.addEventListener("click", () => {
  if (blown) return;
  blown = true;

  flames.forEach((f, i) => {
    setTimeout(() => f.classList.add("out"), i * 120);
  });

  blowBtn.disabled = true;
  blowBtn.textContent = "Permohonan terkirim ✨";
  blowHint.textContent = "semoga semua yang kamu harapkan tadi terkabul";

  launchConfetti();

  setTimeout(() => {
    messageSection.classList.add("revealed");
    messageSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1000);
});

// ================= CONFETTI =================
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confettiPieces = [];
let confettiAnimId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  const colors = ["#e8b86d", "#f2a6b0", "#fdf6ec", "#c98fd6", "#f2cf9a"];
  confettiPieces = [];

  for (let i = 0; i < 140; i++) {
    confettiPieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 10 + 6),
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.28,
      life: 0,
      maxLife: 180 + Math.random() * 60,
    });
  }

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((p) => {
    p.vy += p.gravity * 0.05;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.life++;

    const alpha = p.life > p.maxLife * 0.7 ? Math.max(0, 1 - (p.life - p.maxLife * 0.7) / (p.maxLife * 0.3)) : 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((p) => p.life < p.maxLife);

  if (confettiPieces.length > 0) {
    confettiAnimId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// ================= MUSIK LATAR =================
const musicBtn = document.getElementById("musicToggle");
const music = document.getElementById("bgMusic");
let playing = false;

musicBtn.addEventListener("click", () => {
  if (!playing) {
    music.play().catch(() => {
      blowHint.textContent = "tambahkan file music.mp3 di folder yang sama agar musik bisa diputar";
    });
    musicBtn.classList.add("playing");
    playing = true;
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    playing = false;
  }
});
