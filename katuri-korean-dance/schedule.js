"use strict";
function renderSchedule() {
  const data = window.KATURI_SCHEDULE || {};
  const events = (Array.isArray(data.events) ? data.events : []).filter(e => e && /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a,b) => a.date.localeCompare(b.date));
  function monthKey(date) { return date.getFullYear() + "-" + String(date.getMonth()+1).padStart(2,"0"); }
  function renderMonth(key, target) {
    const section = document.createElement("section"); section.className = "schedule-month-block";
    const heading = document.createElement("h3"); heading.textContent = key.slice(0,4) + "년 " + Number(key.slice(5)) + "월"; const englishMonth=document.createElement('span');englishMonth.className='translation';englishMonth.lang='en';englishMonth.textContent=new Date(Number(key.slice(0,4)),Number(key.slice(5))-1,1).toLocaleDateString('en-US',{month:'long',year:'numeric'});heading.append(englishMonth);section.append(heading);
    const selected = events.filter(e => e.date.slice(0,7) === key);
    if (!selected.length) { const empty = document.createElement("p"); empty.className = "schedule-empty"; empty.textContent = "등록된 공연이 없습니다. / No performances announced."; section.append(empty); }
    selected.forEach(e => {
      const entry = document.createElement("article"); entry.className = "schedule-event";
      const button = document.createElement("button");button.className="event-member-button";
      const monthNames=['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
      button.textContent=monthNames[Number(e.date.slice(5,7))-1]+" "+Number(e.date.slice(8,10))+" : "+(e.title||"공연");
      if(e.titleEn){const en=document.createElement('span');en.className='schedule-title-english';en.lang='en';en.textContent=' / '+e.titleEn;button.append(en);}
      const valid=typeof e.id==="string" && /^[A-Za-z0-9_-]{1,100}$/.test(e.id);
      const update=()=>{button.disabled=!valid;};
      update();window.addEventListener('katuri-member-change',update);
      button.onclick=()=>{if(valid)window.open('members.html?event='+encodeURIComponent(e.id),'_blank','noopener,noreferrer');};
      entry.append(button);section.append(entry);
    }); target.append(section);
  }
  const preview = document.querySelector("#schedule-events");
  if (preview) {
    preview.replaceChildren();
    const today = new Date();
    for (let i=3;i>=0;i--) renderMonth(monthKey(new Date(today.getFullYear(),today.getMonth()+i,1)),preview);
  }
  const all = document.querySelector("#schedule-all");
  if (all) {
    all.replaceChildren();
    if (!events.length) { const empty=document.createElement("p");empty.textContent="등록된 공연 일정이 없습니다. / No performances announced.";all.append(empty); }
    [...new Set(events.map(e=>e.date.slice(0,7)))].sort().reverse().forEach(key=>renderMonth(key,all));
  }
}
renderSchedule();
window.addEventListener("katuri-schedule-change",renderSchedule);

const scheduleRoot=document.querySelector('#schedule-events')||document.querySelector('#schedule-all');
if(scheduleRoot){
 const bar=document.createElement('div');bar.className='schedule-login';
 const label=document.createElement('p'),login=document.createElement('button');login.className='button';
 bar.append(label,login);scheduleRoot.before(bar);
 const sync=()=>{const m=window.KaturiMember||{};label.textContent=m.message||'일정을 선택하면 새 창이 열립니다. 참가 여부와 만남 장소는 회원 로그인 후 확인할 수 있습니다.';login.hidden=!m.login;login.textContent=m.user?'로그아웃 / Sign out':'Google로 회원 로그인 / Sign in with Google';};
 login.onclick=async()=>{try{const m=window.KaturiMember;await(m.user?m.logout():m.login());}catch(_){label.textContent='로그인 처리를 완료하지 못했습니다.';}};
 window.addEventListener('katuri-member-change',sync);sync();
}
