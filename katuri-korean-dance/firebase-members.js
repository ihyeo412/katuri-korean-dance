// Shared Google sign-in and server-enforced membership access.
window.KaturiMember = {approved:false,admin:false,user:null,ready:false};
(async () => {
 const state=window.KaturiMember;
 const notify=()=>window.dispatchEvent(new Event('katuri-member-change'));
 const config=window.KATURI_FIREBASE_CONFIG;
 if(!config?.apiKey || !config?.projectId){state.message='회원 로그인 연결 준비 중입니다. / Member sign-in is not yet available.';notify();return;}
 try {
  const [appSDK,authSDK,dbSDK]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js')]);
  const app=appSDK.initializeApp(config),auth=authSDK.getAuth(app),db=dbSDK.getFirestore(app);
  state.login=()=>authSDK.signInWithPopup(auth,new authSDK.GoogleAuthProvider());
  state.logout=()=>authSDK.signOut(auth);
  state.readEvent=id=>dbSDK.getDocFromServer(dbSDK.doc(db,'katuri_events',id));
  state.watchComments=(id,danceId,next,error)=>dbSDK.onSnapshot(dbSDK.query(dbSDK.collection(db,'katuri_events',id,'dances',danceId,'comments'),dbSDK.orderBy('createdAt','desc')),snap=>next(snap.docs.map(doc=>({id:doc.id,...doc.data()}))),error);
  state.addComment=(id,danceId,text)=>dbSDK.addDoc(dbSDK.collection(db,'katuri_events',id,'dances',danceId,'comments'),{authorId:auth.currentUser.uid,authorName:(auth.currentUser.displayName||'회원').slice(0,100),text,createdAt:dbSDK.serverTimestamp()});
  state.deleteComment=(id,danceId,commentId)=>dbSDK.deleteDoc(dbSDK.doc(db,'katuri_events',id,'dances',danceId,'comments',commentId));
  state.watchSchedule=(next,error)=>dbSDK.onSnapshot(dbSDK.collection(db,'katuri_public_events'),snap=>next(snap.docs.map(d=>({...d.data(),id:d.id}))),error);
  state.saveSchedule=async(publicEvent,privateEvent)=>{
   const batch=dbSDK.writeBatch(db);
   batch.set(dbSDK.doc(db,'katuri_public_events',publicEvent.id),publicEvent);
   batch.set(dbSDK.doc(db,'katuri_events',publicEvent.id),privateEvent,{merge:true});
   await batch.commit();
  };
  state.removeSchedule=id=>dbSDK.deleteDoc(dbSDK.doc(db,'katuri_public_events',id));
  state.watchSchedule(events=>{
   window.KATURI_SCHEDULE={events};window.dispatchEvent(new Event('katuri-schedule-change'));
  },()=>{window.dispatchEvent(new Event('katuri-schedule-error'));});
  const initialVideos=[...(window.KATURI_VIDEOS||[])];
  state.saveVideo=(id,video)=>dbSDK.setDoc(dbSDK.doc(db,'katuri_videos',id),{...video,updatedAt:dbSDK.serverTimestamp()});
  state.hideVideo=(id,video)=>state.saveVideo(id,{kind:'link',title:video.title,url:video.url,description:video.description||'',active:false});
  let savedOrder=[],videoOverrides=new Map();
  const videoId=v=>{try{return new URL(v.url).searchParams.get('v');}catch(_){return null;}};
  function publishVideos(){
   const fresh=[...videoOverrides.values()].filter(v=>v.active).sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));
   const remaining=initialVideos.filter(v=>!videoOverrides.has(videoId(v)));
   const ranks=new Map(savedOrder.map((id,index)=>[id,index]));
   window.KATURI_VIDEOS=[...fresh,...remaining].sort((a,b)=>{
    const x=ranks.get(videoId(a)),y=ranks.get(videoId(b));
    if(x===undefined&&y===undefined)return 0;
    if(x===undefined)return -1;if(y===undefined)return 1;return x-y;
   });
   window.dispatchEvent(new Event('katuri-videos-change'));
  }
  state.saveVideoOrder=ids=>dbSDK.setDoc(dbSDK.doc(db,'katuri_settings','video_order'),{ids,updatedAt:dbSDK.serverTimestamp()});
  dbSDK.onSnapshot(dbSDK.doc(db,'katuri_settings','video_order'),snap=>{
   savedOrder=snap.exists()&&Array.isArray(snap.data().ids)?snap.data().ids:[];publishVideos();
  },()=>window.dispatchEvent(new Event('katuri-videos-error')));
  dbSDK.onSnapshot(dbSDK.collection(db,'katuri_videos'),snap=>{
   videoOverrides=new Map(snap.docs.map(d=>[d.id,{...d.data(),videoId:d.id}]));publishVideos();
  },()=>window.dispatchEvent(new Event('katuri-videos-error')));
  let unsubscribe=()=>{};
  authSDK.onAuthStateChanged(auth,user=>{
   unsubscribe();state.user=user;state.approved=false;state.admin=false;state.ready=true;state.message=user?'회원 승인 확인 중…':'Google 로그인 후 회원 일정을 열 수 있습니다.';notify();
   if(user) unsubscribe=dbSDK.onSnapshot(dbSDK.doc(db,'katuri_members',user.uid),snap=>{
    state.admin=snap.exists() && snap.data().approved===true && snap.data().admin===true;
    state.approved=snap.exists() && snap.data().approved===true;
    state.message=state.approved?'회원 로그인 완료 / Signed in':'승인된 회원만 이용할 수 있습니다. / Approved members only.';notify();
   },()=>{state.approved=false;state.admin=false;state.message='회원 권한을 확인할 수 없습니다.';notify();});
  });
 }catch(_){state.message='로그인 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.';notify();}
})();
