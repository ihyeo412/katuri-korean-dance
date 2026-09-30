"use strict";
const eventId=new URL(location.href).searchParams.get('event');
const publicEvent=(window.KATURI_SCHEDULE?.events||[]).find(item=>item.id===eventId);
if(publicEvent){
 const title=document.createElement('h2');title.textContent=publicEvent.title;
 const date=document.createElement('p');date.textContent=publicEvent.date+(publicEvent.tentative?' · 잠정 일정':'');
 document.querySelector('#public-event-summary').append(title,date);
}
const panel=document.querySelector('#private-meeting'),status=document.querySelector('#member-status');
let generation=0,subscriptions=[];
function clearPrivate(){
 generation++;subscriptions.forEach(stop=>stop());subscriptions=[];panel.hidden=true;
 document.querySelector('#dance-comments').replaceChildren();
 for(const id of ['event-title','meeting-time','meeting-place','meeting-note'])document.getElementById(id).textContent='';
}
function danceSection(danceId,name,member,run){
 const section=document.createElement('section');section.className='dance-comments';
 const heading=document.createElement('h3');heading.textContent=name;
 const form=document.createElement('form');
 const label=document.createElement('label');label.textContent='참석 여부 댓글';label.htmlFor='comment-'+danceId;
 const input=document.createElement('textarea');input.id=label.htmlFor;input.rows=3;input.maxLength=500;input.required=true;input.placeholder='예: '+name+'에 참석합니다.';
 const button=document.createElement('button');button.type='submit';button.className='button';button.textContent='댓글 등록';
 const message=document.createElement('p');message.setAttribute('role','status');
 const list=document.createElement('div');list.setAttribute('aria-live','polite');
 form.append(label,input,button);section.append(heading,form,message,list);
 document.querySelector('#dance-comments').append(section);
 subscriptions.push(member.watchComments(eventId,danceId,comments=>{
  if(run!==generation||!member.approved)return;
  list.replaceChildren();
  if(!comments.length){const empty=document.createElement('p');empty.textContent='아직 참석 댓글이 없습니다.';list.append(empty);}
  comments.forEach(comment=>{
   const item=document.createElement('article');item.className='member-comment';
   const author=document.createElement('strong');author.textContent=comment.authorName||'회원';
   const time=document.createElement('small');time.textContent=comment.createdAt?.toDate?comment.createdAt.toDate().toLocaleString('ko-KR'):'저장 중…';
   const text=document.createElement('p');text.textContent=comment.text;item.append(author,time,text);
   if(comment.authorId===member.user?.uid){const remove=document.createElement('button');remove.type='button';remove.textContent='내 댓글 삭제';remove.onclick=async()=>{remove.disabled=true;try{await member.deleteComment(eventId,danceId,comment.id);}catch(_){message.textContent='댓글을 삭제하지 못했습니다.';remove.disabled=false;}};item.append(remove);}
   list.append(item);
  });
 },()=>{if(run!==generation)return;list.replaceChildren();message.textContent='댓글을 불러오지 못했습니다. 권한과 연결을 확인해 주세요.';}));
 form.onsubmit=async e=>{
  e.preventDefault();const text=input.value.trim();
  if(!text||text.length>500){message.textContent='댓글을 1~500자로 입력해 주세요.';return;}
  button.disabled=true;
  try{if(!member.approved||run!==generation)throw Error();await member.addComment(eventId,danceId,text);if(run!==generation)return;input.value='';message.textContent=name+' 댓글을 등록했습니다.';}
  catch(_){message.textContent='등록하지 못했습니다. 다시 시도해 주세요.';}
  finally{button.disabled=false;}
 };
}
async function refreshMember(){
 clearPrivate();const run=generation,member=window.KaturiMember||{};
 document.querySelector('.member-preview-fields').hidden=false;document.querySelector('#locked-comment-preview').hidden=false;
 const login=document.querySelector('#google-login');login.hidden=!!member.user;login.disabled=!member.login;login.textContent=member.login?'Google로 로그인':'Google로 로그인 · 연결 준비 중';
 document.querySelector('#member-logout').hidden=!member.user;status.textContent=member.message||'회원 로그인 연결 준비 중입니다.';
 if(!member.approved)return;
 if(!/^[A-Za-z0-9_-]{1,100}$/.test(eventId||'')){status.textContent='공연 소식에서 일정을 선택해 주세요.';return;}
 try{
  const event=await member.readEvent(eventId);if(run!==generation||!member.approved)return;
  if(!event.exists()){status.textContent='공연 안내가 아직 등록되지 않았습니다.';return;}
  const data=event.data();
  document.querySelector('#event-title').textContent=data.title||'공연';
  document.querySelector('#meeting-place').textContent='만나는 장소: '+(data.meetingPlace||'추후 안내');
  document.querySelector('#meeting-time').textContent='만나는 시간: '+(data.meetingTime||'추후 안내');
  document.querySelector('#meeting-note').textContent=data.note||'';
  const dances=Object.entries(data.dances||{}).filter(([id,name])=>/^[A-Za-z0-9_-]{1,100}$/.test(id)&&typeof name==='string'&&name.trim());
  if(!dances.length){document.querySelector('#dance-comments').textContent='공연할 춤이 아직 등록되지 않았습니다.';}
  dances.forEach(([id,name])=>danceSection(id,name,member,run));
  panel.hidden=false;document.querySelector('.member-preview-fields').hidden=true;document.querySelector('#locked-comment-preview').hidden=true;
 }catch(_){clearPrivate();status.textContent='공연 안내를 불러오지 못했습니다. 권한과 연결을 확인해 주세요.';}
}
document.querySelector('#google-login').onclick=async()=>{try{await window.KaturiMember.login();}catch(_){status.textContent='로그인을 완료하지 못했습니다.';}};
document.querySelector('#member-logout').onclick=async()=>{clearPrivate();try{await window.KaturiMember.logout();}catch(_){status.textContent='로그아웃에 실패했습니다. 다시 시도해 주세요.';}};
window.addEventListener('pagehide',clearPrivate);
window.addEventListener('pageshow',e=>{if(e.persisted)refreshMember();});
window.addEventListener('katuri-member-change',refreshMember);refreshMember();
