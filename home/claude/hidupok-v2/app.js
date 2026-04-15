// ============================================================
//  HidupOK v2 — app.js
//  Personal untuk: tidur jam 1-2 → target jam 23.00
//  Bangun jam 8+ → target jam 05.00
//  Shopee: game digital via Google Drive
//  Sholat: mulai dari nol, usaha 5 waktu
// ============================================================

// ── Tanggal ──
const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
function formatDate(d) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const now = new Date();
const fd = formatDate(now);
const dateEl = document.getElementById('app-date');
const clDateEl = document.getElementById('cl-date');
if (dateEl) dateEl.textContent = fd;
if (clDateEl) clDateEl.textContent = fd;

// ── Toast ──
function toast(msg, ms = 2800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), ms);
}

// ── Quote harian ──
const QUOTES = [
  '"Kamu belum gagal selama kamu belum berhenti."',
  '"Perubahan terbesar dimulai dari keputusan senyap yang tidak ada yang tahu."',
  '"Sholat adalah caramu berbicara langsung dengan yang memberi rezekimu."',
  '"Tidur lebih awal 30 menit = bangun lebih kuat. Mulai malam ini."',
  '"Toko Shopee-mu adalah aset. Rawat seperti kamu merawat masa depanmu."',
  '"Tidak ada yang berubah kalau kamu tidak berubah duluan."',
  '"Hari ini yang biasa-biasa saja tetap lebih baik dari kemarin yang tidak ada progresnya."',
  '"Konsistensi kecil mengalahkan semangat besar yang tidak bertahan."',
  '"Setiap game yang terjual hari ini = satu langkah menuju 20 juta."',
  '"PMO mencuri waktumu, energimu, dan masa depanmu. Lawan dengan sibuk."',
  '"Sholat Subuh adalah perbedaan antara hari yang produktif dan hari yang terbuang."',
];

const quoteEl = document.getElementById('quote-text');
if (quoteEl) quoteEl.textContent = QUOTES[now.getDate() % QUOTES.length];

// ── Navigasi tab ──
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const el = document.getElementById(`tab-${btn.dataset.tab}`);
    if (el) el.classList.add('active');
  });
});

// ── Streak checklist ──
function getStreak() { return parseInt(localStorage.getItem('streak') || '0'); }
function getStreakDate() { return localStorage.getItem('streakDate') || ''; }
function updateStreakUI() {
  const el = document.getElementById('streak-count');
  if (el) el.textContent = getStreak();
}

function tryIncrementStreak() {
  const today = todayKey();
  if (getStreakDate() === today) return;
  const yest = (() => {
    const d = new Date(now); d.setDate(d.getDate()-1);
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  })();
  const s = getStreakDate() === yest ? getStreak() + 1 : 1;
  localStorage.setItem('streak', s);
  localStorage.setItem('streakDate', today);
  updateStreakUI();
}

updateStreakUI();

// ── Checklist ──
const TOTAL = 10;
let state = {};

function loadState() {
  const s = localStorage.getItem(`cl-${todayKey()}`);
  state = s ? JSON.parse(s) : {};
}
function saveState() {
  localStorage.setItem(`cl-${todayKey()}`, JSON.stringify(state));
}

function renderChecklist() {
  const items = document.querySelectorAll('.ci');
  let done = 0;
  items.forEach(item => {
    const id = item.dataset.id;
    if (state[id]) { item.classList.add('done'); done++; }
    else item.classList.remove('done');
  });

  const pct = Math.round(done / TOTAL * 100);
  const bar = document.getElementById('prog-bar');
  const doneEl = document.getElementById('cl-done');
  const pctEl = document.getElementById('prog-pct');
  if (bar) bar.style.width = pct + '%';
  if (doneEl) doneEl.textContent = done;
  if (pctEl) pctEl.textContent = pct + '%';

  if (done === TOTAL) {
    tryIncrementStreak();
    toast('🎉 Semua checklist selesai! Kamu luar biasa hari ini.');
  }
}

document.querySelectorAll('.ci').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.id;
    state[id] = !state[id];
    saveState();
    renderChecklist();
  });
});

const resetClBtn = document.getElementById('reset-cl');
if (resetClBtn) {
  resetClBtn.addEventListener('click', () => {
    if (confirm('Reset semua checklist hari ini?')) {
      state = {}; saveState(); renderChecklist();
      toast('Checklist direset.');
    }
  });
}

loadState();
renderChecklist();

// ── PMO Streak ──
function loadPmo() {
  const d = localStorage.getItem('pmo');
  return d ? JSON.parse(d) : { days: 0, last: '' };
}
function savePmo(data) { localStorage.setItem('pmo', JSON.stringify(data)); }

function renderPmo() {
  const data = loadPmo();
  const el = document.getElementById('pmo-days');
  if (el) el.textContent = data.days;
  [{ id:'ms7', n:7 }, { id:'ms21', n:21 }, { id:'ms90', n:90 }].forEach(m => {
    const el = document.getElementById(m.id);
    if (el) el.classList.toggle('reached', data.days >= m.n);
  });
}

document.getElementById('pmo-ok')?.addEventListener('click', () => {
  const data = loadPmo();
  const today = todayKey();
  if (data.last === today) { toast('Sudah dicatat hari ini 👍'); return; }
  const yest = (() => {
    const d = new Date(now); d.setDate(d.getDate()-1);
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  })();
  const newDays = data.last === yest ? data.days + 1 : 1;
  savePmo({ days: newDays, last: today });
  renderPmo();
  const msgs = [
    `✅ Hari ke-${newDays}! Terus pertahankan.`,
    `💪 ${newDays} hari! Kamu lebih kuat dari hasrat itu.`,
    `🔥 Streak ${newDays} hari! Dopaminmu sedang recovery.`,
  ];
  toast(msgs[newDays % msgs.length]);
});

document.getElementById('pmo-reset')?.addEventListener('click', () => {
  if (confirm('Reset streak PMO ke 0?\n\nIngat: jatuh bukan berarti gagal. Yang penting bangkit lagi.')) {
    savePmo({ days: 0, last: '' });
    renderPmo();
    toast('Bangkit lagi. Hari ini mulai dari 0 — dan itu lebih baik dari menyerah. 💪');
  }
});

renderPmo();

// ── Notifikasi terjadwal ──
// Jadwal disesuaikan dengan kebiasaan + tujuan user
const NOTIFS = [
  { h:5, m:0,  title:'⏰ Waktunya bangun!', body:'Langsung duduk — jangan rebahan. Minum air putih sekarang.' },
  { h:5, m:10, title:'🕌 Sholat Subuh', body:'Waktu subuh. Jadikan ini habit pertama yang dibangun.' },
  { h:7, m:0,  title:'🎮 Buka Shopee!', body:'Cek pesanan, balas chat, kirim link GDrive ke pembeli.' },
  { h:9, m:0,  title:'🔍 Riset & Optimasi', body:'Update listing, buat thumbnail baru, cari produk digital baru.' },
  { h:12, m:0, title:'🕛 Sholat Dzuhur', body:'Istirahat sebentar. Sholat dulu sebelum makan siang.' },
  { h:15, m:30,title:'🕒 Sholat Ashar', body:'Alarm Ashar berbunyi. Berhenti sejenak dari layar.' },
  { h:16, m:0, title:'📱 Buat 1 konten hari ini', body:'TikTok atau Reels: review game yang kamu jual. 30–60 detik cukup.' },
  { h:18, m:0, title:'🕕 Sholat Maghrib', body:'Jeda dari layar. Waktunya sholat dan evaluasi sore.' },
  { h:19, m:30,title:'🕖 Sholat Isya', body:'Selesaikan sholat Isya sebelum jam 20.00.' },
  { h:20, m:0, title:'📓 Tulis jurnal malam', body:'3 hal: apa yang berhasil, apa yang gagal, target besok.' },
  { h:22, m:30,title:'😴 Siap tidur!', body:'HP di luar kamar. Target tidur jam 23.00. Istirahat = produktivitas.' },
];

function notifEnabled() {
  return localStorage.getItem('notifOn') === '1' && Notification.permission === 'granted';
}

function updateNotifBtn() {
  const btn = document.getElementById('notif-btn');
  if (!btn) return;
  btn.textContent = notifEnabled() ? '🔔' : '🔕';
  btn.title = notifEnabled() ? 'Notifikasi aktif (klik nonaktifkan)' : 'Aktifkan notifikasi';
}

document.getElementById('notif-btn')?.addEventListener('click', async () => {
  if (!('Notification' in window)) { toast('Browser tidak mendukung notifikasi.'); return; }
  if (notifEnabled()) {
    localStorage.setItem('notifOn', '0');
    updateNotifBtn();
    toast('Notifikasi dinonaktifkan.');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    localStorage.setItem('notifOn', '1');
    updateNotifBtn();
    toast('🔔 Notifikasi aktif! Pengingat harian sudah disiapkan.');
    setTimeout(() => {
      new Notification('HidupOK siap!', {
        body: 'Notifikasi aktif. Kamu akan diingatkan sesuai jadwal harianmu.',
        icon: 'icons/icon-192.png',
      });
    }, 800);
  } else {
    toast('Izin notifikasi ditolak. Cek pengaturan browser.');
  }
});

updateNotifBtn();

function checkNotifs() {
  if (!notifEnabled()) return;
  const h = now.getHours(), m = now.getMinutes();
  NOTIFS.forEach(n => {
    if (n.h === h && n.m === m) {
      const key = `notif-${todayKey()}-${h}-${m}`;
      if (!localStorage.getItem(key)) {
        new Notification(n.title, { body: n.body, icon: 'icons/icon-192.png' });
        localStorage.setItem(key, '1');
      }
    }
  });
}

setInterval(checkNotifs, 60000);
checkNotifs();

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(r => console.log('SW ok:', r.scope))
      .catch(e => console.log('SW fail:', e));
  });
}
