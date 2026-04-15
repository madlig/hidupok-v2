// HidupOK v3 — Personalized for: usia 26-30, tinggal ortu,
// Shopee game digital, badan gemuk/perut buncit,
// distraksi semua platform, mau bisnis stabil + badan sehat

const DAYS=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function todayKey(){const d=new Date();return`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`}
function fmtDate(d){return`${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`}

const now=new Date();
const el=id=>document.getElementById(id);

el('hdr-date').textContent=fmtDate(now);
const cld=el('cl-date');if(cld)cld.textContent=fmtDate(now);

// Toast
function toast(msg,ms=2800){
  const t=el('toast');t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),ms);
}

// Quotes personal
const QUOTES=[
  '"Pagi yang benar = sisa hari yang benar. HP di kasur adalah sabotase dirimu sendiri."',
  '"Setiap game yang terjual hari ini adalah satu batu bata menuju bisnis yang stabil."',
  '"Perut buncit tidak hilang dalam seminggu. Tapi 20 menit pagi ini akan memulai prosesnya."',
  '"Distraksi tidak akan berhenti datang. Tapi kamu bisa berhenti meresponnya."',
  '"Sholat adalah pausing dari dunia untuk terhubung dengan yang menciptakan dunia."',
  '"Dari 3 juta ke 20 juta bukan soal keberuntungan — soal sistem yang dijalankan setiap hari."',
  '"Tidur jam 1 pagi adalah meminjam energi dari hari besok dengan bunga yang mahal."',
  '"Copywriting yang bagus = thumbnail yang bagus = iklan yang profit. Mulai belajar hari ini."',
  '"Satu langkah maju setiap hari = 365 langkah dalam setahun. Kamu sudah lebih jauh dari yang kamu kira."',
  '"Jangan tunggu mood. Mood mengikuti aksi, bukan sebaliknya."',
  '"Orang yang hidupnya terorganisir bukan orang yang tidak pernah malas — mereka punya sistem yang jalan walau malas."',
];
const qt=el('quote-text');if(qt)qt.textContent=QUOTES[now.getDate()%QUOTES.length];

// Tab nav
document.querySelectorAll('.ni').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.ni').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
  });
});

// Streak
function getStreak(){return parseInt(localStorage.getItem('streak')||'0')}
function getStreakDate(){return localStorage.getItem('streakDate')||''}
function updateStreakUI(){const e=el('streak-num');if(e)e.textContent=getStreak()}

function tryIncStreak(){
  const today=todayKey();
  if(getStreakDate()===today)return;
  const d=new Date(now);d.setDate(d.getDate()-1);
  const yest=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  const s=getStreakDate()===yest?getStreak()+1:1;
  localStorage.setItem('streak',s);
  localStorage.setItem('streakDate',today);
  updateStreakUI();
}
updateStreakUI();

// Checklist
const TOTAL=12;
let state={};
function loadState(){const s=localStorage.getItem(`cl-${todayKey()}`);state=s?JSON.parse(s):{}}
function saveState(){localStorage.setItem(`cl-${todayKey()}`,JSON.stringify(state))}

function renderCL(){
  const items=document.querySelectorAll('.ci');
  let done=0;
  items.forEach(item=>{
    const id=item.dataset.id;
    if(state[id]){item.classList.add('done');done++;}
    else item.classList.remove('done');
  });
  const pct=Math.round(done/TOTAL*100);
  const bar=el('prog-bar');const de=el('cl-done');const pe=el('prog-pct');
  if(bar)bar.style.width=pct+'%';
  if(de)de.textContent=done;
  if(pe)pe.textContent=pct+'%';
  if(done===TOTAL){tryIncStreak();toast('🎉 Sempurna! Semua selesai hari ini. Streak naik!')}
}

document.querySelectorAll('.ci').forEach(item=>{
  item.addEventListener('click',()=>{
    state[item.dataset.id]=!state[item.dataset.id];
    saveState();renderCL();
  });
});

el('reset-cl')?.addEventListener('click',()=>{
  if(confirm('Reset semua checklist hari ini?')){
    state={};saveState();renderCL();toast('Checklist direset.');
  }
});

loadState();renderCL();

// PMO
function loadPmo(){const d=localStorage.getItem('pmo');return d?JSON.parse(d):{days:0,last:''}}
function savePmo(d){localStorage.setItem('pmo',JSON.stringify(d))}
function renderPmo(){
  const data=loadPmo();
  const e=el('pmo-days');if(e)e.textContent=data.days;
  [{id:'ms7',n:7},{id:'ms21',n:21},{id:'ms90',n:90}].forEach(m=>{
    el(m.id)?.classList.toggle('reached',data.days>=m.n);
  });
}

el('pmo-ok')?.addEventListener('click',()=>{
  const data=loadPmo();const today=todayKey();
  if(data.last===today){toast('Sudah dicatat hari ini 👍');return;}
  const d=new Date(now);d.setDate(d.getDate()-1);
  const yest=`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  const nd=data.last===yest?data.days+1:1;
  savePmo({days:nd,last:today});renderPmo();
  const msgs=[
    `✅ Hari ke-${nd}! Otakmu sedang memulihkan diri.`,
    `💪 ${nd} hari bersih! Testosteronmu naik, fokusmu membaik.`,
    `🔥 Streak ${nd} hari! Kamu lebih kuat dari godaan itu.`,
    `⭐ ${nd} hari! Energi yang tadinya terbuang kini milikmu.`,
  ];
  toast(msgs[nd%msgs.length]);
});

el('pmo-reset')?.addEventListener('click',()=>{
  if(confirm('Reset streak PMO?\n\nJatuh bukan berarti gagal. Yang penting bangkit dan mulai lagi hari ini.')){
    savePmo({days:0,last:''});renderPmo();
    toast('Bangkit lagi. Hari ke-1 dimulai sekarang. 💪');
  }
});
renderPmo();

// Notifikasi — disesuaikan dengan jadwal personal
const NOTIFS=[
  {h:4,m:55,title:'⏰ 5 menit lagi jam 05.00!',body:'Siapkan diri. Alarm utama akan bunyi sebentar lagi.'},
  {h:5,m:0,title:'🌅 Waktunya bangun!',body:'Langsung duduk — kaki ke lantai. Jangan rebahan lagi. Minum air putih.'},
  {h:5,m:10,title:'🕌 Sholat Subuh',body:'Waktunya sholat Subuh. Habit terpenting yang sedang kamu bangun.'},
  {h:6,m:45,title:'🎮 Cek orderan Shopee',body:'Buka Shopee Seller — proses pesanan, balas chat, kirim link GDrive.'},
  {h:7,m:15,title:'💼 Blok Fokus A dimulai',body:'Shopee: optimasi listing dan pantau iklan. HP silent, fokus penuh.'},
  {h:9,m:15,title:'📱 Blok Fokus B — Konten',body:'Waktunya buat 1 konten TikTok/Reels hari ini. Buka TikTok hanya untuk upload.'},
  {h:11,m:45,title:'🕛 Sholat Dzuhur',body:'Istirahat sebentar. Sholat Dzuhur dulu sebelum makan siang.'},
  {h:13,m:0,title:'💼 Blok Fokus D — Cari Kerja',body:'Buka Glints/LinkedIn. Kirim minimal 2 lamaran atau 1 proposal hari ini.'},
  {h:15,m:0,title:'🕒 Sholat Ashar',body:'Alarm Ashar. Berhenti dari layar, sholat, lalu lanjut kerja.'},
  {h:17,m:30,title:'🚶 Jalan kaki sore!',body:'30 menit jalan kaki = senjata terbaik melawan perut buncit. Ayo gerak!'},
  {h:18,m:0,title:'🕕 Sholat Maghrib',body:'Jeda dari semua layar. Evaluasi: sudah berapa checklist yang selesai?'},
  {h:19,m:45,title:'🕖 Sholat Isya',body:'Selesaikan sholat Isya sebelum jam 20.00.'},
  {h:20,m:0,title:'📓 Jurnal 3 hal',body:'Tulis: 1 hal berhasil, 1 hal gagal, 1 target besok. Cukup 10 menit.'},
  {h:22,m:30,title:'😴 Waktunya tidur!',body:'HP di luar kamar sekarang. Target tidur jam 23.00. Istirahat adalah investasi.'},
];

function notifOn(){return localStorage.getItem('notifOn')==='1'&&Notification.permission==='granted'}
function updateNotifBtn(){
  const btn=el('notif-btn');if(!btn)return;
  btn.textContent=notifOn()?'🔔':'🔕';
  btn.title=notifOn()?'Notifikasi aktif (klik nonaktifkan)':'Aktifkan notifikasi harian';
}

el('notif-btn')?.addEventListener('click',async()=>{
  if(!('Notification'in window)){toast('Browser tidak mendukung notifikasi.');return;}
  if(notifOn()){
    localStorage.setItem('notifOn','0');updateNotifBtn();
    toast('Notifikasi dinonaktifkan.');return;
  }
  const perm=await Notification.requestPermission();
  if(perm==='granted'){
    localStorage.setItem('notifOn','1');updateNotifBtn();
    toast('🔔 Notifikasi aktif! Pengingat harian sudah siap.');
    setTimeout(()=>{
      new Notification('HidupOK siap!',{
        body:'Pengingat harian aktif. Kamu akan diingatkan sesuai jadwalmu.',
        icon:'icons/icon-192.png'
      });
    },800);
  }else{
    toast('Izin ditolak. Aktifkan di pengaturan browser.');
  }
});
updateNotifBtn();

function checkNotifs(){
  if(!notifOn())return;
  const h=now.getHours(),m=now.getMinutes();
  NOTIFS.forEach(n=>{
    if(n.h===h&&n.m===m){
      const key=`notif-${todayKey()}-${h}-${m}`;
      if(!localStorage.getItem(key)){
        new Notification(n.title,{body:n.body,icon:'icons/icon-192.png'});
        localStorage.setItem(key,'1');
      }
    }
  });
}
setInterval(checkNotifs,60000);checkNotifs();

// SW
if('serviceWorker'in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js')
      .then(r=>console.log('SW:',r.scope))
      .catch(e=>console.log('SW err:',e));
  });
}
