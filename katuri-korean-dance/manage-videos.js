"use strict";
const list=document.querySelector('#manager-list'),status=document.querySelector('#manager-status'),form=document.querySelector('#video-form'),fields=document.querySelector('#video-fields'),urlInput=document.querySelector('#video-url');
let ordered=[...(window.KATURI_VIDEOS||[])],orderDirty=false,dragIndex=null,savingOrder=false;
const saveOrder=document.querySelector('#save-video-order');
function moveVideo(from,to){
 if(savingOrder||!window.KaturiMember?.admin||to<0||to>=ordered.length||from===to)return;
 ordered.splice(to,0,ordered.splice(from,1)[0]);orderDirty=true;render();
 status.textContent='순서를 변경했습니다. 순서 저장을 눌러 반영하세요.';
 list.children[to]?.querySelector('button')?.focus();
}
function render(){
 const m=window.KaturiMember||{};fields.disabled=!m.admin;
 document.querySelector('#video-login').disabled=!m.login;document.querySelector('#video-login').hidden=!!m.user;document.querySelector('#video-logout').hidden=!m.user;
 saveOrder.disabled=savingOrder||!m.admin||!orderDirty;
 list.replaceChildren();
 ordered.forEach((item,index)=>{
  const row=document.createElement('li'),name=document.createElement('strong');name.textContent=item.title;row.append(name);
  const id=window.katuriYouTubeId(item.url);
  if(m.admin&&id){
   row.draggable=true;row.classList.add('sortable-video');
   row.addEventListener('dragstart',e=>{dragIndex=index;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(index));});
   row.addEventListener('dragover',e=>{if(dragIndex!==null){e.preventDefault();e.dataTransfer.dropEffect='move';}});
   row.addEventListener('drop',e=>{e.preventDefault();if(dragIndex!==null)moveVideo(dragIndex,index);dragIndex=null;});
   row.addEventListener('dragend',()=>{dragIndex=null;});
   const up=document.createElement('button');up.type='button';up.textContent='↑ 위';up.disabled=index===0;up.setAttribute('aria-label',item.title+' 위로 이동');up.onclick=()=>moveVideo(index,index-1);
   const down=document.createElement('button');down.type='button';down.textContent='↓ 아래';down.disabled=index===ordered.length-1;down.setAttribute('aria-label',item.title+' 아래로 이동');down.onclick=()=>moveVideo(index,index+1);
   row.append(up,down);
   const edit=document.createElement('button');edit.textContent='수정';edit.onclick=()=>{document.querySelector('#video-title').value=item.title;urlInput.value=item.url;document.querySelector('#video-description').value=item.description||'';form.scrollIntoView({block:'start'});};
   const hide=document.createElement('button');hide.textContent='목록에서 내리기';hide.onclick=async()=>{hide.disabled=true;try{await m.hideVideo(id,item);status.textContent='영상 목록에서 내렸습니다.';}catch(_){status.textContent='변경하지 못했습니다.';hide.disabled=false;}};
   row.append(edit,hide);
  }list.append(row);
 });
}
urlInput.oninput=()=>urlInput.setCustomValidity('');
form.onsubmit=async e=>{
 e.preventDefault();if(!window.KaturiMember?.admin)return;
 const id=window.katuriYouTubeId(urlInput.value.trim());
 if(!id){urlInput.setCustomValidity('유효한 유튜브 영상 링크를 입력해 주세요.');urlInput.reportValidity();return;}
 const title=document.querySelector('#video-title').value.trim();if(!title){status.textContent='제목을 입력해 주세요.';return;}
 const video={kind:'link',title,url:'https://www.youtube.com/watch?v='+id,description:document.querySelector('#video-description').value.trim(),active:true};
 fields.disabled=true;
 try{await window.KaturiMember.saveVideo(id,video);form.reset();status.textContent='영상을 게시했습니다. 같은 유튜브 링크가 있으면 내용을 수정합니다.';}
 catch(_){status.textContent='게시하지 못했습니다. 입력 내용은 유지됩니다. 권한과 연결을 확인해 주세요.';}
 finally{fields.disabled=!window.KaturiMember?.admin;}
};
document.querySelector('#video-login').onclick=async()=>{try{await window.KaturiMember.login();}catch(_){status.textContent='로그인을 완료하지 못했습니다.';}};
document.querySelector('#video-logout').onclick=async()=>{try{await window.KaturiMember.logout();}catch(_){status.textContent='로그아웃에 실패했습니다.';}};
window.addEventListener('katuri-member-change',()=>{status.textContent=window.KaturiMember.admin?'관리자 로그인 완료.':window.KaturiMember.user?'관리자 권한이 필요합니다.':window.KaturiMember.message;render();});
window.addEventListener('katuri-videos-change',()=>{
 const fresh=window.KATURI_VIDEOS||[];
 if(orderDirty){
  const latest=new Map(fresh.map(v=>[window.katuriYouTubeId(v.url),v]));
  const kept=ordered.map(v=>latest.get(window.katuriYouTubeId(v.url))).filter(Boolean);
  const ids=new Set(kept.map(v=>window.katuriYouTubeId(v.url)));
  ordered=[...fresh.filter(v=>!ids.has(window.katuriYouTubeId(v.url))),...kept];
 }else ordered=[...fresh];
 render();
});
saveOrder.onclick=async()=>{
 if(!window.KaturiMember?.admin)return;
 savingOrder=true;saveOrder.disabled=true;
 try{const ids=ordered.map(v=>window.katuriYouTubeId(v.url));if(ids.some(id=>!id))throw Error();await window.KaturiMember.saveVideoOrder(ids);orderDirty=false;status.textContent='영상 순서를 저장했습니다.';}
 catch(_){status.textContent='순서를 저장하지 못했습니다. 변경한 순서는 유지됩니다.';}
 finally{savingOrder=false;render();}
};
window.addEventListener('beforeunload',e=>{if(orderDirty){e.preventDefault();e.returnValue='';}});
window.addEventListener('katuri-videos-error',()=>{status.textContent='영상 목록 연결에 실패했습니다.';});render();
