"use strict";
const form=document.querySelector('#schedule-editor'),message=document.querySelector('#editor-message'),fields=document.querySelector('#editor-fields'),list=document.querySelector('#schedule-editor-list');
let editing=null,privateData={},revision=0;
const value=id=>document.getElementById(id).value.trim();
function reset(){editing=null;privateData={};form.reset();}
function sync(){
 revision++;const m=window.KaturiMember||{};
 fields.disabled=!m.admin;document.querySelector('#admin-list').hidden=!m.admin;
 document.querySelector('#admin-login').disabled=!m.login;document.querySelector('#admin-login').hidden=!!m.user;
 document.querySelector('#admin-logout').hidden=!m.user;
 if(!m.admin){reset();list.replaceChildren();}
 message.textContent=m.admin?'관리자 로그인 완료. 저장하면 웹사이트에 바로 반영됩니다.':m.user?'관리자 권한이 필요합니다.':(m.message||'Firebase 연결 준비 중입니다.');render();
}
function render(){
 list.replaceChildren();if(!window.KaturiMember?.admin)return;
 [...(window.KATURI_SCHEDULE?.events||[])].sort((a,b)=>b.date.localeCompare(a.date)).forEach(e=>{
 const row=document.createElement('article');row.className='member-comment';const title=document.createElement('strong');title.textContent=e.date+' : '+e.title;
 const edit=document.createElement('button');edit.type='button';edit.textContent='수정';edit.onclick=async()=>{
  const run=revision;fields.disabled=true;
  try{const record=await window.KaturiMember.readEvent(e.id);if(run!==revision||!window.KaturiMember.admin)return;reset();editing=e.id;privateData=record.exists()?record.data():{};
   for(const [id,key] of [['edit-title','title'],['edit-title-en','titleEn'],['edit-date','date'],['edit-time','time']])document.getElementById(id).value=e[key]||'';
   document.querySelector('#edit-tentative').checked=!!e.tentative;
   for(const [id,key] of [['private-place','meetingPlace'],['private-time','meetingTime'],['private-note','note']])document.getElementById(id).value=privateData[key]||'';
   document.querySelector('#dance-one').value=privateData.dances?.['dance-1']||'';document.querySelector('#dance-two').value=privateData.dances?.['dance-2']||'';
   message.textContent='編集中'.replace('編集中','수정 중: ')+e.title;form.scrollIntoView({block:'start'});
  }catch(_){message.textContent='공연 정보를 불러오지 못했습니다.';}finally{fields.disabled=!window.KaturiMember?.admin;}
 };
 const remove=document.createElement('button');remove.type='button';remove.textContent='공개 목록에서 내리기';remove.onclick=async()=>{remove.disabled=true;try{await window.KaturiMember.removeSchedule(e.id);if(editing===e.id)reset();message.textContent='공개 목록에서 내렸습니다. 회원 안내와 댓글은 보존됩니다.';}catch(_){message.textContent='변경하지 못했습니다.';remove.disabled=false;}};
 row.append(title,edit,remove);list.append(row);
 });
}
form.onsubmit=async e=>{
 e.preventDefault();if(!window.KaturiMember?.admin)return;
 const id=editing||'event-'+crypto.randomUUID();
 const publicEvent={id,title:value('edit-title'),titleEn:value('edit-title-en'),date:value('edit-date'),time:value('edit-time'),tentative:document.querySelector('#edit-tentative').checked};
 if(!publicEvent.title||!publicEvent.date||!value('dance-one')){message.textContent='공연명, 날짜와 첫 번째 춤을 입력해 주세요.';return;}
 const dances={...(privateData.dances||{}),'dance-1':value('dance-one')};
 if(value('dance-two'))dances['dance-2']=value('dance-two');else delete dances['dance-2'];
 fields.disabled=true;
 try{await window.KaturiMember.saveSchedule(publicEvent,{title:publicEvent.title,meetingPlace:value('private-place'),meetingTime:value('private-time'),note:value('private-note'),dances});reset();message.textContent='게시했습니다. 홈페이지의 공연 소식에 반영되었습니다.';}
 catch(_){message.textContent='게시하지 못했습니다. 연결과 관리자 권한을 확인해 주세요. 입력 내용은 유지됩니다.';}
 finally{fields.disabled=!window.KaturiMember?.admin;}
};
document.querySelector('#new-event').onclick=reset;
document.querySelector('#admin-login').onclick=async()=>{try{await window.KaturiMember.login();}catch(_){message.textContent='로그인을 완료하지 못했습니다.';}};
document.querySelector('#admin-logout').onclick=async()=>{try{await window.KaturiMember.logout();}catch(_){message.textContent='로그아웃에 실패했습니다.';}};
window.addEventListener('katuri-member-change',sync);window.addEventListener('katuri-schedule-change',render);sync();
