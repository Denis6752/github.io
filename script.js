// ===== OfficeSpace — script.js =====
// Заголовки страниц и карточка пользователя в шапке раздела
const TT={map:['Карта офиса','Выберите дату и время, затем нажмите на свободное место'],search:['Умный поиск','Подберите место по оборудованию, зоне и числу мест рядом'],mine:['Мои бронирования','Предстоящие и прошедшие брони'],all:['Все бронирования','Просмотр и управление бронями сотрудников'],stats:['Аналитика','Загрузка офиса и ключевые показатели'],staff:['Сотрудники и права','Учётные записи, роли и матрица доступа'],sys:['Система','Параметры правил, журнал аудита и состояние'],msg:['Сообщения','Внутренние сообщения без мессенджера'],acc:['Настройки аккаунта','Профиль, контакты и пароль']};
const pageHead=()=>{const t=TT[S.v]||TT.map,u=DB.users.find(x=>x.id==S.uid);return`<div class="ph"><div><h1>${t[0]}</h1><p>${t[1]}</p></div><div class="who"><span class="av">${u.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><div><b>${u.name}</b><small>${RN[u.role]} · ${u.dep}</small></div></div></div>`};

const $=q=>document.querySelector(q),p2=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const tm=m=>p2(Math.floor(m/60)%24)+':'+p2(m%60),pm=s=>{const[a,b]=s.split(':');return+a*60+ +b};
let off=0;const now=()=>Date.now()+off,ts=(d,m)=>new Date(d+'T00:00').getTime()+m*6e4;
const DN={};const dn=d=>DN[d]??(DN[d]=Math.round(Date.parse(d+'T00:00:00Z')/864e5));
const mph=v=>{const d0=v.replace(/\D/g,'');if(!d0)return v.includes('+')?'+':'';let d=d0;if(v.trim().startsWith('+')||d.length>10||(d.length==1&&'78'.includes(d)))d=d.replace(/^[78]/,'');d=d.slice(0,10);const g=[d.slice(0,3),d.slice(3,6),d.slice(6,8),d.slice(8,10)].filter(Boolean);return '+7'+(g.length?' '+g.join(' '):'')};
const POP=['gmail.com','mail.ru','yandex.ru','ya.ru','bk.ru','inbox.ru','list.ru','internet.ru','rambler.ru','outlook.com','hotmail.com','yahoo.com','icloud.com','proton.me','protonmail.com','live.com','mail.kz','yandex.kz','yandex.com','ukr.net','tengrimail.com'];
const TLD='ru kz com org net by ua uz kg info me io ge am az tj tm us uk de fr it es pl cn jp edu gov biz co app dev tech'.split(' ');
const femail=v=>{v=v.toLowerCase().replace(/[^a-z0-9@._%+-]/g,'');const at=v.indexOf('@');if(at<0)return v;const loc=v.slice(0,at),dom=v.slice(at+1).replace(/@/g,'');for(let i=1;i<=dom.length;i++){const p=dom.slice(0,i);if(POP.includes(p)||/^[a-z0-9-]+(\.[a-z0-9-]+)*\.(ru|kz|com|org|net|by|ua|uz|kg|info)$/.test(p))return loc+'@'+p}return loc+'@'+dom};
const emOK=v=>{const m=v.match(/^([a-z0-9._%+-]+)@((?:[a-z0-9-]+\.)+)([a-z]{2,})$/i);return !!m&&!/^\.|\.$|\.\./.test(m[1])&&TLD.includes(m[3].toLowerCase())&&!/(^|\.)-|-(\.|$)/.test(m[2])};
const nv=n=>/сообщени/i.test(n.t)?'msg':/Добро пожаловать/.test(n.t)?'map':/брон|присутств/i.test(n.t)?'mine':'map';
const fmtD=d=>new Date(d+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',weekday:'short'});
const ACT=['confirmed','checked'],OK=[...ACT,'done'];
const SN={confirmed:'Подтверждена',checked:'Присутствие подтверждено',cancelled:'Отменена',noshow:'Не использовано',done:'Завершена'};
const ZN=['Общая зона','Тихая зона','Командная зона'];
const P=[];
for(let f=1;f<=3;f++)for(let r=0;r<5;r++)for(let c=0;c<10;c++){const id=(f-1)*50+r*10+c+1,z=c<3?0:c<7?1:2;
 const t=id%13==0?'Для особых потребностей':id%7==0?'Два монитора':z==1?'Тихая зона':z==2?'Командная работа':id%5==0?'Ноутбук':'Обычное';
 const eq=t=='Два монитора'?['2 монитора','док-станция']:t=='Ноутбук'?['док-станция']:t.startsWith('Для')?['монитор','регулируемый стол']:['монитор','док-станция'];
 P.push({id,f,r,c,zone:ZN[z],t,eq,x:30+c*95,y:44+r*58,w:80,h:46,room:0})}
for(let f=1;f<=3;f++)for(let k=0;k<2;k++){const n=(f-1)*2+k+1;P.push({id:150+n,f,r:9,c:k,zone:'Переговорные',t:'Переговорная',eq:['проектор','экран',(k?10:6)+' мест'],x:k?520:30,y:470,w:k?445:440,h:80,room:1,name:'Переговорная №'+n})}
const BASE=P.map(p=>({...p,eq:[...p.eq]}));let GONE={};
function buildP(){P.length=0;GONE={};const pe=(DB&&DB.pe)||{};
 BASE.forEach(b=>{const o=pe[b.id]||{};const p=Object.assign({},b,o,{eq:[...(o.eq||b.eq)]});
  if(p.room&&p.cap==null){const m=p.eq.find(e=>/мест/.test(e));p.cap=m?+m.match(/\d+/)[0]:6;p.eq=p.eq.filter(e=>!/мест/.test(e))}
  if(p.del)GONE[p.id]=p;else P.push(p)});
 ((DB&&DB.pn)||[]).forEach(p=>{if(p.del)GONE[p.id]=p;else P.push(p)})}
const pl=id=>P.find(x=>x.id==id)||GONE[id],nm=p=>p.room?p.name:'Место '+(p.label||'№'+p.id);
function upd(id,f){const n=(DB.pn||[]).find(x=>x.id==id);if(n)Object.assign(n,f);else{DB.pe=DB.pe||{};DB.pe[id]=Object.assign(DB.pe[id]||{},f)}}
let DB;const KEY='officespace_v4';const hp=s=>{let h=5381;for(const c of s)h=(h*33^c.charCodeAt(0))>>>0;return h.toString(16)};
let SIM=null;const sim=()=>{if(!SIM)SIM=JSON.stringify(DB)};
const save=()=>{if(SIM)return;try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}};
function seed(){let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;
 DB={users:[{id:1,name:'Михаил Радченко',role:'user',dep:'Разработка'},{id:5,name:'Кирилл Данилов',role:'admin',dep:'Администрация'},{id:6,name:'Денис Соколов',role:'it',dep:'ИТ-отдел'}],blocked:[17,88],bk:[],nt:[],log:[],cfg:{min:30,hor:14,ns:30},id:1};
 const W=[.05,.82,.91,.74,.95,.58,.05],t0=new Date();t0.setHours(0,0,0,0);const dd=o=>{const x=new Date(t0);x.setDate(x.getDate()+o);return ds(x)};
 const own=[[-3,12,540,1080,'done'],[-1,8,540,1080,'done'],[2,15,540,1080,'confirmed'],[1,152,840,930,'confirmed']],used=new Set();
 own.forEach(o=>{used.add(dd(o[0])+o[1]);DB.bk.push({id:DB.id++,uid:1,pid:o[1],d:dd(o[0]),s:o[2],e:o[3],st:o[4]})});
 let fu=10;
 for(let d=-13;d<=3;d++){const dt=new Date(t0);dt.setDate(dt.getDate()+d);const n=Math.round(150*W[dt.getDay()]*(d>0?.6:1)*(.9+R()*.2)),ids=[...Array(150)].map((_,i)=>i+1).sort(()=>R()-.5).slice(0,n);
  ids.forEach(pid=>{if(used.has(dd(d)+pid))return;const half=R()<.25,s0=half&&R()<.5?780:540,e0=half?(s0==540?780:1080):1080,r=R();
   DB.bk.push({id:DB.id++,uid:fu++,pid,d:dd(d),s:s0,e:e0,st:d<0?(r<.82?'done':r<.92?'cancelled':'noshow'):d==0?'checked':'confirmed'})})}
 [['m.radchenko@office.kz','+7 700 111 22 33','user123'],['k.danilov@office.kz','+7 707 555 66 77','admin123'],['d.sokolov@office.kz','+7 708 666 77 88','it12345']].forEach((c,i)=>Object.assign(DB.users[i],{email:c[0],phone:c[1],ph:hp(c[2])}));DB.nt=[{u:1,t:'Добро пожаловать в OfficeSpace! Выберите место на карте и забронируйте.',at:Date.now(),r:0}];save()}
function load(){try{DB=JSON.parse(localStorage.getItem(KEY))}catch(e){}if(!DB||!DB.bk)seed();if(!DB.msgs){DB.msgs=[{id:1,from:6,to:5,type:'Указание',subj:'Проверка параметров автоосвобождения',text:'Прошу проверить, что время автоосвобождения для всех отделов составляет 30 минут, и сообщить о результате.',at:Date.now()-36e5,r:0},{id:2,from:5,to:6,type:'Запрос',subj:'Добавить места в тихую зону',text:'Необходимо добавить два рабочих места в тихую зону на 2 этаже.',at:Date.now()-72e5,r:0}];DB.mid=2;save()}}
const S={uid:0,v:'map',f:1,d:ds(new Date()),s:540,e:1080,sel:null,q:{t:'',quiet:false,eq:'',n:1},m:null,nt:0,allDates:false,allPage:0};
// Remember the current section for each signed-in account.
const OS_SECTIONS=new Set(['map','search','mine','all','stats','staff','sys','msg','acc']);
const osViewKey=uid=>'officespace_active_section_'+String(uid);
const osSaveView=()=>{if(!S.uid||!OS_SECTIONS.has(S.v))return;try{sessionStorage.setItem(osViewKey(S.uid),S.v)}catch(e){}};
const osRestoreView=()=>{try{const v=sessionStorage.getItem(osViewKey(S.uid));if(OS_SECTIONS.has(v))S.v=v}catch(e){}};
const osScrollTop=()=>{window.scrollTo({top:0,left:0,behavior:'instant'});const main=document.querySelector('.os-content');if(main)main.scrollTop=0;const shell=document.querySelector('.os-shell');if(shell)shell.scrollTop=0};
try{history.scrollRestoration='manual'}catch(e){}
let osDidNavigate=false;

const uname=id=>id===0?'Гость':(DB.users.find(u=>u.id==id)||{}).name||'Сотрудник №'+(id-9);
function note(u,t){DB.nt.unshift({u,t,at:now(),r:0});DB.nt.length=Math.min(DB.nt.length,120)}
const RK={user:0,admin:1,it:2},RN={user:'Сотрудник',admin:'Администрация',it:'ИТ-специалист'};
const rk=()=>RK[DB.users.find(x=>x.id==S.uid).role];
const audit=t=>{DB.log=DB.log||[];DB.log.unshift({u:S.uid||0,t,at:now()});DB.log.length=Math.min(DB.log.length,150)};
function toast(t,er){const e=document.createElement('div');e.className='toast'+(er?' er':'');e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),3300)}
function st(pid,d=S.d,s=S.s,e=S.e){if(DB.blocked.includes(pid))return{k:'blk'};const A0=dn(d)*1440+s,A1=dn(d)*1440+e,b=DB.bk.find(b=>b.pid==pid&&ACT.includes(b.st)&&Math.abs(dn(b.d)-dn(d))<2&&dn(b.d)*1440+b.s<A1&&A0<dn(b.d)*1440+b.e);return b?{k:b.uid==S.uid?'me':'busy',b}:{k:'free'}}
function validate(pid,d,s,e,uid,ex){if(!P.some(x=>x.id==pid))return'Место не найдено';if(DB.blocked.includes(pid))return'Место заблокировано администратором';
 if(e<=s||e-s<DB.cfg.min)return'Минимальная длительность брони — '+DB.cfg.min+' минут';if(ts(d,0)>now()+DB.cfg.hor*864e5)return'Бронировать можно не более чем на '+DB.cfg.hor+' дней вперёд';if(ts(d,e)<=now()||(!ex&&ts(d,s)<now()-9e5))return'Нельзя бронировать в прошлом: выберите время от текущего момента';
 const A0=dn(d)*1440+s,A1=dn(d)*1440+e,A=DB.bk.filter(b=>b.id!=ex&&ACT.includes(b.st)&&Math.abs(dn(b.d)-dn(d))<2&&dn(b.d)*1440+b.s<A1&&A0<dn(b.d)*1440+b.e);
 const c=A.find(b=>b.pid==pid);if(c)return'409 Конфликт: место занято ('+tm(c.s)+'–'+tm(c.e)+')';if(A.find(b=>b.uid==uid))return'У вас уже есть бронь на это время';return''}
function book(pid){const m=validate(pid,S.d,S.s,S.e,S.uid);if(m)return toast(m,1);DB.bk.push({id:DB.id++,uid:S.uid,pid,d:S.d,s:S.s,e:S.e,st:'confirmed'});
 note(S.uid,'Бронь создана: '+nm(pl(pid))+', '+fmtD(S.d)+', '+tm(S.s)+'–'+tm(S.e));audit('Создана бронь: '+nm(pl(pid))+', '+S.d+' '+tm(S.s)+'–'+tm(S.e));save();toast('Забронировано: '+nm(pl(pid)));render()}
function cancel(id){const b=DB.bk.find(x=>x.id==id);if(b.uid!=S.uid&&rk()<1)return toast('Недостаточно прав: чужие брони отменяет администрация',1);b.st='cancelled';audit('Отменена бронь №'+b.id+' ('+nm(pl(b.pid))+', '+b.d+')');note(b.uid,(b.uid==S.uid?'Бронь отменена: ':'Администратор отменил вашу бронь: ')+nm(pl(b.pid))+', '+fmtD(b.d));save();toast('Бронь отменена');render()}
function sweep(){let ch=0;const n=now();DB.bk.forEach(b=>{if(b.st=='confirmed'){const a=ts(b.d,b.s);
 if(n>a+DB.cfg.ns*6e4){b.st='noshow';note(b.uid,'Бронь не подтверждена — место освобождено: '+nm(pl(b.pid))+' ('+fmtD(b.d)+', '+tm(b.s)+')');ch=1}
 else if(!b.rem&&a>n&&a-n<=18e5){b.rem=1;note(b.uid,'Скоро начало брони: '+nm(pl(b.pid))+' в '+tm(b.s));ch=1}}
 else if(b.st=='checked'&&n>ts(b.d,b.e)){b.st='done';ch=1}});if(ch)save();return ch}
function qr(seed){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;let s=h||1;const R=()=>(s=(s*1103515245+12345)>>>0)/4294967296;let r='';
 for(let y=0;y<21;y++)for(let x=0;x<21;x++){let on=null;for(const[ox,oy]of[[0,0],[14,0],[0,14]]){const dx=x-ox,dy=y-oy;if(dx>=0&&dx<7&&dy>=0&&dy<7)on=dx==0||dx==6||dy==0||dy==6||(dx>=2&&dx<=4&&dy>=2&&dy<=4)}
  if(on===null)on=R()<.5;if(on)r+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
 return`<svg viewBox="-1 -1 23 23" width="170" height="170"><rect x="-1" y="-1" width="23" height="23" fill="#fff"/><g fill="#000">${r}</g></svg>`}
function mapSVG(){
 const zone=(x,w,title,sub,kind)=>`<g class="floor-zone ${kind}"><rect x="${x}" y="43" width="${w}" height="391" rx="18"/><text class="floor-zone-title" x="${x+18}" y="73">${title}</text><text class="floor-zone-sub" x="${x+18}" y="94">${sub}</text></g>`;
 const zones=zone(16,288,'ОБЩАЯ ЗОНА','Открытое пространство','general')+zone(310,380,'ТИХАЯ ЗОНА','Для сосредоточенной работы','quiet')+zone(696,288,'КОМАНДНАЯ ЗОНА','Работа вместе','team');
 const bg=`<defs><pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--bd)" stroke-width=".4" opacity=".35"/></pattern></defs><rect x="0" y="0" width="1000" height="630" rx="20" fill="var(--floor-bg)"/><rect x="0" y="0" width="1000" height="630" rx="20" fill="url(#floor-grid)"/>${zones}<text class="floor-section" x="22" y="457">ПЕРЕГОВОРНЫЕ КОМНАТЫ</text><g class="floor-lounge-action" data-a="lounge" role="button" tabindex="0" aria-label="Открыть информацию о зоне отдыха"><title>Подробнее о зоне отдыха</title><rect class="floor-lounge" x="16" y="577" width="968" height="42" rx="12"/><text class="floor-lounge-text" x="500" y="603" text-anchor="middle">☕  Зона отдыха  ·  Нажмите для подробностей</text></g>`;
 const desks=P.filter(p=>p.f==S.f).map(p=>{
  const k=st(p.id).k, selected=S.sel==p.id, label=String(p.room?(p.name||'Переговорная'):p.label||p.id).replace(/[<>&"']/g,'');
  if(p.room)return`<g class="pl floor-room ${S.zone&&S.zone!=='all'&&p.zone!==S.zone?'os-zone-muted':''} s-${k}${selected?' sel':''}" data-id="${p.id}" role="button" tabindex="0" aria-label="${label}"><title>${label}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="12"/><circle class="floor-room-icon" cx="${p.x+29}" cy="${p.y+p.h/2}" r="16"/><text class="floor-room-glyph" x="${p.x+29}" y="${p.y+p.h/2+5}" text-anchor="middle">MR</text><text class="floor-room-name" x="${p.x+54}" y="${p.y+p.h/2-3}">${label}</text><text class="floor-room-meta" x="${p.x+54}" y="${p.y+p.h/2+16}">${p.cap||6} мест · ${k==='free'?'Свободна':k==='busy'?'Занята':k==='me'?'Ваша бронь':'Недоступна'}</text></g>`;
  const kind=p.t==='Два монитора'?'dual':p.t.startsWith('Для')?'access':'standard';
  const badge=kind==='dual'?'2M':kind==='access'?'AD':'WS';
  const meaning=kind==='dual'?'Два монитора':kind==='access'?'Адаптированное рабочее место':'Рабочее место';
  return`<g class="pl floor-desk ${p.c<3?'os-desk-general':p.c<7?'os-desk-quiet':'os-desk-team'} ${S.zone&&S.zone!=='all'&&p.zone!==S.zone?'os-zone-muted':''} s-${k}${selected?' sel':''}" data-id="${p.id}" role="button" tabindex="0" aria-label="${meaning} ${label}"><title>${meaning} ${label} · ${p.zone} · ${k==='free'?'Свободно':k==='busy'?'Занято':k==='me'?'Ваша бронь':'Заблокировано'}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="9"/><rect class="floor-desk-indicator" x="${p.x+7}" y="${p.y+8}" width="3" height="${p.h-16}" rx="2"/><rect class="floor-desk-badge ${kind}" x="${p.x+15}" y="${p.y+p.h/2-12}" width="24" height="24" rx="7"/><text class="floor-desk-badge-text ${kind}" x="${p.x+27}" y="${p.y+p.h/2+3.5}" text-anchor="middle">${badge}</text><text class="floor-desk-number" x="${p.x+p.w-12}" y="${p.y+p.h/2+4}" text-anchor="end">${label}</text></g>`;
 }).join('');
 return`<svg class="map floor-map" viewBox="0 0 1000 630" role="group" aria-label="Интерактивная карта ${S.f} этажа">${bg}${desks}</svg>`;
}
const EQL=['монитор','2 монитора','док-станция','регулируемый стол','проектор','экран','маркерная доска','веб-камера','настольная лампа','ПК'];
const clean=s=>String(s||'').replace(/[<>"&]/g,'').trim();
const TYPES=()=>[...new Set(['Обычное','Два монитора','Ноутбук','Тихая зона','Командная работа','Для особых потребностей',...P.filter(p=>!p.room).map(p=>p.t)])];
function editPanel(){
 const p=S.sel?pl(S.sel):null;
 if(!p)return'<h2>✏️ Редактирование карты</h2><div class="hint">Выберите существующее рабочее место или переговорную на карте, чтобы изменить его параметры. Добавление новых мест отключено.</div>';
 const room=!!p.room,cur=p.t,ty=room?['Переговорная']:TYPES(),cu=p.eq.map(x=>x.toLowerCase()),oth=p.eq.filter(x=>!EQL.includes(x.toLowerCase()));
 return`<h2>✏️ ${nm(p)}</h2><div class="row"><span>Расположение</span><b>Этаж ${p.f} · ${p.zone}</b></div>
<div style="display:flex;flex-direction:column;gap:14px;margin-top:14px">
<label class="fl2">${room?'Название комнаты':'Номер / название'}<input id="pe_l" value="${room?p.name:(p.label||'')}" placeholder="${room?'Переговорная №1':'по умолчанию — номер места'}"></label>
<label class="fl2">Тип<select id="pe_t">${ty.map(t=>`<option ${t==cur?'selected':''}>${t}</option>`).join('')}</select></label>
${room?`<label class="fl2">Вместимость (человек)<input id="pe_c" type="number" min="1" max="100" value="${p.cap}"></label>`:'<label class="fl2">Или свой тип<input id="pe_tc" placeholder="например, Стойка для звонков"></label>'}
<div><div class="cl">Оборудование</div><div class="chs">${EQL.map(e=>`<label class="ck"><input type="checkbox" class="peq" value="${e}" ${cu.includes(e)?'checked':''}>${e}</label>`).join('')}</div></div>
<label class="fl2">Другое оборудование (через запятую)<input id="pe_o" value="${oth.join(', ')}"></label>
<label class="fl2">Примечание<input id="pe_d" value="${p.desc||''}" placeholder="например, у окна"></label>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-a="pesave" data-i="${p.id}">Сохранить изменения</button>${room?'':`<button class="btn red" data-a="pedel" data-i="${p.id}">${S.dc==p.id?'Подтвердить удаление':'Удалить'}</button>`}</div></div>`}
function panel(){if(S.edit&&rk()>1)return editPanel();const p=S.sel&&pl(S.sel);if(!p)return'<div class="hint">👆 Нажмите на рабочее место или переговорную на плане</div>';const s=st(p.id),adm=rk()>=1;
 const lab={free:'Свободно',busy:'Занято',blk:'Заблокировано',me:'Ваша бронь'}[s.k];
 return`<h2>${nm(p)}</h2><div class="row"><span>Этаж</span><b>${p.f}</b></div><div class="row"><span>Зона</span><b>${p.zone}</b></div><div class="row"><span>Тип</span><b>${p.t}</b></div><div class="row"><span>Оборудование</span><b>${p.eq.join(', ')||'—'}${p.room?' · '+p.cap+' мест':''}</b></div>${p.desc?`<div class="row"><span>Примечание</span><b>${p.desc}</b></div>`:''}<div class="row"><span>Дата</span><b>${fmtD(S.d)}</b></div><div class="row"><span>Время</span><b>${tm(S.s)}–${tm(S.e)}</b></div><div class="row"><span>Статус</span><b>${lab}${adm&&s.b?' · '+uname(s.b.uid):''}</b></div>${rk()>1?`<div class="row"><span>QR-токен (ИТ)</span><b>OS-${p.id}</b></div>`:''}
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" data-a="book" data-i="${p.id}" ${s.k!='free'?'disabled':''}>Забронировать</button>${adm?`<button class="btn sec" data-a="blk" data-i="${p.id}">${s.k=='blk'?'Разблокировать':'Заблокировать'}</button>`:''}${adm&&s.b?`<button class="btn red" data-a="cancel" data-i="${s.b.id}">Отменить бронь</button>`:''}</div>`}
const wpl=()=>P.filter(p=>!p.room&&!DB.blocked.includes(p.id));
function ctrlOld(dateOnly){return`<div class="card ctrl"><label>Дата<input type="date" id="cd" value="${S.d}"></label>${dateOnly?'':`<label>Начало<input type="time" id="cs" step="900" value="${tm(S.s)}"></label><label>Конец<input type="time" id="ce" step="900" value="${tm(S.e)}"></label>`}<span class="mu">${!dateOnly&&S.e>1440?'<b>Ночная бронь: до '+tm(S.e)+' следующего дня.</b> ':''}Правила: от ${DB.cfg.min} мин, до ${DB.cfg.hor} дн. вперёд, без пересечений</span></div>`}
// Local UI preferences; no Supabase schema changes.
const osLocalKey=(suffix)=>'os_ui_'+suffix+'_'+String(S.uid||'guest');
// Older browser-local deletions remain hidden on that device.
// New deletions are stored in Supabase and synchronized across devices.
const osHiddenMessages=()=>{
 let legacy=[];
 try{legacy=JSON.parse(localStorage.getItem(osLocalKey('hidden'))||'[]')}catch(e){}
 const cloud=DB?.hiddenMessageIds||[];
 return new Set([...legacy,...cloud].map(String));
};
// The cloud profile is the source of truth. Legacy browser avatars are only a fallback
// until the user explicitly reselects one or uploads a photo.
const osAvatarBucket='officespace-avatars';
const osAvatarLinks=new Map();
const osAttr=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const osAvatarLegacy=()=>{try{return localStorage.getItem(osLocalKey('avatar'))||''}catch(e){return ''}};
const osAvatarForUser=id=>{
 const user=DB?.users?.find(u=>u.id===id);
 if(user){
  if(user.avatarPreset!==null&&Number.isInteger(user.avatarPreset)&&user.avatarPreset>=0&&user.avatarPreset<osDevAvatarThemes.length)return osDevAvatarSvg(user.avatarPreset);
  if(user.avatarPath)return osAvatarLinks.get(user.avatarPath)?.url||'';
  if(id===S.uid)return osAvatarLegacy();
 }
 return '';
};
const osAvatar=()=>osAvatarForUser(S.uid);
async function osRefreshAvatarLinks(users){
 const now=Date.now();
 const paths=[...new Set(users.map(u=>u.avatarPath).filter(Boolean))];
 for(const path of paths){
  if(osAvatarLinks.get(path)?.expires>now)continue;
  const {data,error}=await sb.storage.from(osAvatarBucket).createSignedUrl(path,3600);
  if(error){console.warn('[OfficeSpace] Не удалось загрузить аватар',error.message);continue}
  osAvatarLinks.set(path,{url:data.signedUrl,expires:Date.now()+45*60*1000});
 }
 for(const path of [...osAvatarLinks.keys()])if(!paths.includes(path))osAvatarLinks.delete(path);
}
async function osSaveAvatarProfile(changes,success){
 if(!sb||!cloudUser)return toast('Войдите в аккаунт',1);
 const {error}=await sb.from('profiles').update(changes).eq('id',cloudUser.id);
 if(error)return toast('Аватар не сохранён: '+cloudError(error),1);
 try{localStorage.removeItem(osLocalKey('avatar'))}catch(e){}
 await cloudFetch();render();toast(success);
 return true;
}

const osDevAvatarThemes=[
 ['#d8e8ff','#718fe9','#f2ba8b','#29243c','#4059b7',0,0],
 ['#e2d7ff','#9b7eea','#d99b72','#332742','#673db5',1,0],
 ['#cef4eb','#4aaea1','#a56b49','#231b2b','#277a79',0,1],
 ['#ffdfda','#ea8587','#f0cba9','#52362d','#c15a5c',1,1],
 ['#daeaff','#538ec2','#e8b88f','#302535','#345ca6',0,2],
 ['#fff0cb','#dba25b','#a66c4c','#161c31','#a36b3c',1,2],
 ['#e6daf8','#9b76cb','#f5cda8','#5a373c','#583e8e',0,0],
 ['#d6f4f6','#67accc','#d49d75','#2b2c3b','#356fa8',1,0],
 ['#ffe0ea','#dd7494','#b07a59','#252438','#bc497b',0,1],
 ['#d6ebd8','#71b289','#efb891','#3c2b31','#3f8f72',1,1],
 ['#d8deff','#828cd9','#d89d77','#2c273e','#5666a8',0,2],
 ['#ffe7cb','#d89a6e','#f4cca6','#382932','#a66c49',1,2],
 ['#d4edf7','#7baece','#b8805e','#201c28','#457f9c',0,0],
 ['#f3defc','#b486d5','#e8b48b','#403043','#7e56b8',1,0],
 ['#e4f0d7','#95b872','#c9906c','#292d29','#68884a',0,1],
 ['#ffe1e3','#d77d88','#f1c09c','#302331','#b25374',1,2]
];
const osDevAvatarSvg=n=>{
 const [bg,accent,skin,hair,shirt,hairType,accessory]=osDevAvatarThemes[n%osDevAvatarThemes.length];
 const bangs=hairType?`<path d="M37 55Q30 15 67 20Q103 17 92 57L84 50Q78 35 63 42Q48 40 42 56Z" fill="${hair}"/>`:`<path d="M38 52Q34 19 64 21Q96 19 90 52Q74 37 61 39Q47 36 38 52Z" fill="${hair}"/>`;
 const hairBack=hairType?`<path d="M35 40Q23 16 64 17Q104 18 96 46L95 98H34Z" fill="${hair}"/>`:`<path d="M35 44Q32 20 64 20Q92 18 93 48L86 61H42Z" fill="${hair}"/>`;
 const specs=accessory===1?`<g fill="none" stroke="#2e3651" stroke-width="3" stroke-linecap="round"><rect x="44" y="56" width="16" height="12" rx="5"/><rect x="69" y="56" width="16" height="12" rx="5"/><path d="M60 60Q65 57 69 60M43 60l-4-2M86 60l5-2"/></g>`:'';
 const headset=accessory===2?`<path d="M37 65V54Q37 26 64 26Q91 26 91 54v11" fill="none" stroke="#343a59" stroke-width="6"/><rect x="33" y="58" width="10" height="19" rx="4" fill="#384561"/><rect x="85" y="58" width="10" height="19" rx="4" fill="#384561"/><path d="M88 78Q87 87 72 86" fill="none" stroke="#384561" stroke-width="3"/><circle cx="70" cy="86" r="3" fill="#384561"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="${bg}"/><circle cx="112" cy="23" r="28" fill="${accent}" opacity=".23"/><path d="M-10 116Q30 103 57 110Q102 119 141 95V140H-10Z" fill="${accent}" opacity=".26"/><path d="M17 128Q19 95 49 93H78Q110 93 113 128" fill="${shirt}"/><path d="M47 95L64 115L81 95" fill="none" stroke="#fff" stroke-width="3" opacity=".45"/><rect x="57" y="81" width="15" height="18" rx="6" fill="${skin}"/>${hairBack}<ellipse cx="64" cy="63" rx="25" ry="31" fill="${skin}"/><ellipse cx="40" cy="64" rx="4" ry="7" fill="${skin}"/><ellipse cx="88" cy="64" rx="4" ry="7" fill="${skin}"/>${bangs}<path d="M49 61h4M75 61h4" stroke="#28263a" stroke-width="3.5" stroke-linecap="round"/><path d="M58 76Q64 81 70 76" stroke="#a76459" stroke-width="2" fill="none" stroke-linecap="round"/>${specs}${headset}<rect x="92" y="91" width="25" height="19" rx="5" fill="#fff" opacity=".95"/><path d="M99 100l-3 3 3 3M109 100l3 3-3 3" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
};
const osAvatarMarkup=(initials,id=S.uid)=>{const a=osAvatarForUser(id);return a?`<img src="${osAttr(a)}" alt="Аватар сотрудника" class="os-avatar-img" loading="lazy">`:osAttr(initials)};
const osTelegramClean=value=>String(value||'').trim().replace(/^@/,'');
const osTelegramValid=value=>!value||/^[A-Za-z0-9_]{5,32}$/.test(osTelegramClean(value));
const osTelegramHref=value=>{const n=osTelegramClean(value);return /^[A-Za-z0-9_]{5,32}$/.test(n)?'https://t.me/'+n:''};
let osTelegramColumnAvailable=true;
function vMap(){
 const zone=S.zone||"all";
 const zones=[["all","Все зоны"],["Общая зона","Общая"],["Тихая зона","Тихая"],["Командная зона","Командная"],["Переговорные","Переговорные"]];
 const floorPlaces=P.filter(p=>p.f==S.f&&!p.room),freeOnFloor=floorPlaces.filter(p=>st(p.id).k==='free').length;
 const free=f=>P.filter(p=>p.f==f&&!p.room&&st(p.id).k==='free').length;
 const all=wpl(),fr=all.filter(p=>st(p.id).k==='free').length;
 return`<section class="floor-dashboard">
 <div class="floor-summary"><div><span class="floor-eyebrow">ПЛАНИРОВАНИЕ ПРОСТРАНСТВА</span><h2>Карта рабочих мест</h2><p>Выберите этаж, время и свободное рабочее место на плане.</p></div><div class="floor-summary-stats"><div><strong>${freeOnFloor}</strong><span>свободно на этаже</span></div><div><strong>${floorPlaces.length-freeOnFloor}</strong><span>занято или недоступно</span></div></div></div>
 <div class="floor-filters">${ctrl()}</div><div class="os-zone-picker"><div><b>Выбор зоны</b><small>Показывать рабочие места нужного типа</small></div><div class="os-zone-buttons">${zones.map(([id,label])=>`<button class="os-zone-btn ${zone===id?'active':''}" data-a="zone" data-i="${id}">${label}</button>`).join('')}</div></div>
 <div class="floor-workspace"><div class="floor-plan-card"><div class="floor-toolbar"><div class="floor-tabs">${[1,2,3].map(f=>`<button class="floor-tab ${S.f==f?'active':''}" data-a="fl" data-i="${f}"><span>0${f} этаж</span><small>${free(f)} свободно</small></button>`).join('')}</div>${rk()>1?`<button class="btn sec floor-edit" data-a="medit">${S.edit?'✓ Завершить редактирование':'✎ Редактировать план'}</button>`:''}</div><div class="floor-type-legend" aria-label="Обозначения типов рабочих мест">
 <div class="floor-type-legend-heading"><strong>Обозначения на карте</strong><span>Тип рабочего места обозначен буквами, цвет показывает его состояние</span></div>
 <div class="floor-type-legend-items">
  <span class="floor-type-legend-item"><b class="floor-type-key standard">WS</b><span>Обычное место</span></span>
  <span class="floor-type-legend-item"><b class="floor-type-key dual">2M</b><span>Два монитора</span></span>
  <span class="floor-type-legend-item"><b class="floor-type-key access">AD</b><span>Адаптированное место</span></span>
  <span class="floor-type-legend-item"><b class="floor-type-key room">MR</b><span>Переговорная</span></span>
 </div>
 <div class="floor-type-statuses" aria-label="Статусы мест"><span><i class="floor-dot free"></i>Свободно</span><span><i class="floor-dot busy"></i>Занято</span><span><i class="floor-dot blk"></i>Заблокировано</span><span><i class="floor-dot me"></i>Моя бронь</span></div>
 </div><div class="floor-canvas-scroll"><div class="floor-canvas">${mapSVG()}</div></div></div><aside class="floor-details"><div class="floor-details-top"><span class="floor-eyebrow">ИНФОРМАЦИЯ О МЕСТЕ</span><span class="floor-details-icon">⌘</span></div>${panel()}</aside></div></section>`;
}
function results(){const q=S.q;return P.filter(p=>(q.t==='Переговорная')===!!p.room&&st(p.id).k==='free'&&(!q.floor||p.f===Number(q.floor))&&(!q.t||p.t===q.t)&&(!q.eq||p.eq.some(e=>e.toLowerCase().includes(q.eq))))}
function vSearch(){const q=S.q,R=results(),o=(a,v)=>a.map(x=>`<option ${x==v?'selected':''}>${x}</option>`).join('');
 return`${ctrl()}<div class="card os-search-filters"><div class="os-search-filters-heading"><div><span class="os-search-filters-eyebrow">ПАРАМЕТРЫ ПОИСКА</span><h2>Подберите рабочее место</h2><p>Выберите тип пространства и необходимое оборудование</p></div><span class="os-search-filters-counter">${R.length} вариантов</span></div><div class="os-search-fields"><label for="qfloor"><span class="os-search-field-label">Этаж</span><select id="qfloor"><option value="">Все этажи</option>${[1,2,3].map(f=>`<option value="${f}" ${Number(q.floor)===f?'selected':''}>${f}-й этаж</option>`).join('')}</select></label><label for="qt"><span class="os-search-field-label">Тип места</span><select id="qt"><option value="">Все типы мест</option>${o([...new Set(P.map(p=>p.t))],q.t)}</select></label><label for="qe"><span class="os-search-field-label">Оборудование</span><select id="qe"><option value="">Любое оборудование</option>${o([...new Set(P.flatMap(p=>p.eq.map(e=>e.toLowerCase())))],q.eq)}</select></label></div></div>
 <div class="card"><h2>Подходящие варианты: ${R.length}</h2>${R.slice(0,30).map(p=>`<div class="it"><div><b>${nm(p)}</b> · этаж ${p.f} · ${p.zone}<br><small>${p.t} — ${p.eq.join(', ')}</small></div><div style="display:flex;gap:6px"><button class="btn sec" data-a="goto" data-i="${p.id}">На карте</button><button class="btn" data-a="book" data-i="${p.id}">Забронировать</button></div></div>`).join('')||'<div class="hint">Ничего не найдено — измените условия</div>'}${R.length>30?`<p class="mu">…и ещё ${R.length-30}</p>`:''}</div>`}
function vMine(){const L=DB.bk.filter(b=>b.uid==S.uid).sort((a,b)=>ts(b.d,b.s)-ts(a.d,a.s)),up=L.filter(b=>ACT.includes(b.st)&&ts(b.d,b.e)>=now()).reverse(),hi=L.filter(b=>!up.includes(b)).slice(0,25);
 const it=(b,a)=>{const p=pl(b.pid);return`<div class="it"><div><b>${nm(p)}</b> · ${fmtD(b.d)}, ${tm(b.s)}–${tm(b.e)}<br><small>Этаж ${p.f} · ${p.zone} · ${p.eq.join(', ')}</small></div><div style="display:flex;gap:6px;align-items:center"><span class="chip ${b.st}">${SN[b.st]}</span>${a&&b.st=='confirmed'?`<button class="btn sec" data-a="qr" data-i="${b.id}">📷 QR</button><button class="btn sec" data-a="edit" data-i="${b.id}">Изменить</button><button class="btn red" data-a="cancel" data-i="${b.id}">Отменить</button>`:''}</div></div>`};
 return`<div class="card"><h2>Предстоящие</h2>${up.map(b=>it(b,1)).join('')||'<div class="hint">Нет предстоящих броней</div>'}</div><div class="card"><h2>История</h2>${hi.map(b=>it(b,0)).join('')||'<div class="hint">Пока пусто</div>'}</div>`}
function vAll(){
 const all=!!S.allDates,perPage=50;
 const list=DB.bk.filter(b=>all||b.d===S.d).sort((a,b)=>
   all?(b.d.localeCompare(a.d)||b.s-a.s||String(b.id).localeCompare(String(a.id)))
      :((Number(ACT.includes(b.st))-Number(ACT.includes(a.st)))||a.pid-b.pid));
 const pages=Math.max(1,Math.ceil(list.length/perPage));
 S.allPage=Math.max(0,Math.min(S.allPage||0,pages-1));
 const shown=list.slice(S.allPage*perPage,(S.allPage+1)*perPage);
 const title=all?'Все бронирования за всё время':'Бронирования на '+fmtD(S.d);
 return`<div class="card os-all-filters">
   <div class="os-all-filter-heading"><div><div class="cl">Просмотр бронирований</div><p>Выберите конкретную дату или покажите все записи сразу.</p></div>
   <button type="button" class="os-all-switch ${all?'active':''}" data-a="all-dates" aria-pressed="${all}" aria-label="${all?'Показать только выбранную дату':'Показать все даты'}"><span class="os-all-switch-track"><i></i></span><span>Все даты</span></button></div>
   <div class="os-all-date-row ${all?'disabled':''}"><label for="cd">Дата</label><input type="date" id="cd" value="${S.d}" ${all?'disabled':''}></div>
 </div>
 <div class="card os-all-results"><div class="os-all-results-head"><div><h2>${title}</h2><p>Найдено бронирований: <b>${list.length}</b></p></div><span class="os-all-page-counter">Страница ${S.allPage+1} из ${pages}</span></div>
 <div class="os-all-table-scroll"><table><thead><tr><th>Ресурс</th><th>Сотрудник</th>${all?'<th>Дата</th>':''}<th>Время</th><th>Статус</th><th>Действие</th></tr></thead><tbody>
 ${shown.map(b=>`<tr><td><strong>${nm(pl(b.pid)||{room:0,id:b.pid})}</strong></td><td>${uname(b.uid)}</td>${all?`<td>${fmtD(b.d)}</td>`:''}<td>${tm(b.s)}–${tm(b.e)}</td><td><span class="chip ${b.st}">${SN[b.st]||b.st}</span></td><td>${b.st==='confirmed'?`<button class="btn red" data-a="cancel" data-i="${b.id}">Отменить</button>`:'—'}</td></tr>`).join('')||`<tr><td colspan="${all?6:5}" class="os-all-empty">Бронирований пока нет</td></tr>`}
 </tbody></table></div>
 <div class="os-all-pagination"><span>Показано ${list.length?S.allPage*perPage+1:0}–${Math.min((S.allPage+1)*perPage,list.length)} из ${list.length}</span><div><button type="button" class="btn sec" data-a="all-prev" ${S.allPage===0?'disabled':''}>← Назад</button><button type="button" class="btn sec" data-a="all-next" ${S.allPage>=pages-1?'disabled':''}>Далее →</button></div></div></div>`;
}
function vStats(){const today=ds(new Date(now())),dc={},zc={},pc={};let ca=0,ns=0,tot=0;
 DB.bk.forEach(b=>{if(!pl(b.pid)||pl(b.pid).room)return;tot++;if(b.st=='cancelled')ca++;if(b.st=='noshow')ns++;if(OK.includes(b.st)){(dc[b.d]=dc[b.d]||new Set()).add(b.pid);const z=pl(b.pid).zone;zc[z]=(zc[z]||0)+1;pc[b.pid]=(pc[b.pid]||0)+1}});
 const av=wpl().length,wd=[[],[],[],[],[],[],[]];Object.entries(dc).forEach(([d,s])=>{if(d<=today)wd[(new Date(d+'T00:00').getDay()+6)%7].push(s.size/av*100)});
 const avg=wd.map(a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0),bk=dc[today]?dc[today].size:0,top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0]||['—',0],D=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],ti=(new Date(now()).getDay()+6)%7;
 return`<div class="kpis"><div class="kpi"><b>${P.filter(p=>!p.room).length}</b><span>всего рабочих мест</span></div><div class="kpi"><b>${bk}</b><span>забронировано сегодня</span></div><div class="kpi"><b>${av-bk}</b><span>свободно</span></div><div class="kpi"><b>${Math.round(bk/av*100)}%</b><span>загрузка офиса</span></div></div>
 <div class="mw"><div class="card"><h2>Использование офиса по дням недели</h2>${avg.map((v,i)=>`<div class="bar"><span ${i==ti?'style="font-weight:800"':''}>${D[i]}</span><div><i style="width:${v}%"></i></div><b>${v}%</b></div>`).join('')}</div><div class="card"><h2>Показатели</h2><div class="row"><span>Популярная зона</span><b>${top(zc)[0]}</b></div><div class="row"><span>Популярное место</span><b>№${top(pc)[0]} (${top(pc)[1]} броней)</b></div><div class="row"><span>Отмен</span><b>${ca}</b></div><div class="row"><span>Не использовано</span><b>${ns} (${Math.round(ns/tot*100)}%)</b></div><div class="row"><span>Заблокировано мест</span><b>${DB.blocked.length}</b></div></div></div>`}
function vStaff(){
 const teamSummary=rk()>=1?(()=>{
  const total=DB.users.length;
  const users=DB.users.filter(x=>x.role==='user').length;
  const admins=DB.users.filter(x=>x.role==='admin').length;
  const it=DB.users.filter(x=>x.role==='it').length;
  return `<section class="os-staff-overview" aria-label="Статистика участников команды">
   <div class="os-staff-overview-heading"><div><span class="os-staff-eyebrow">СОСТАВ КОМАНДЫ</span><h2>Участники OfficeSpace</h2><p>Актуальное количество аккаунтов по ролям</p></div><span class="os-staff-live"><i></i> Данные из системы</span></div>
   <div class="os-staff-stats">
    <div class="os-staff-stat os-staff-stat-all"><span class="os-staff-stat-icon" aria-hidden="true">◎</span><strong>${total}</strong><span>Всего участников</span></div>
    <div class="os-staff-stat os-staff-stat-users"><span class="os-staff-stat-icon" aria-hidden="true">◫</span><strong>${users}</strong><span>Сотрудники</span></div>
    <div class="os-staff-stat os-staff-stat-admin"><span class="os-staff-stat-icon" aria-hidden="true">♢</span><strong>${admins}</strong><span>Администрация</span></div>
    <div class="os-staff-stat os-staff-stat-it"><span class="os-staff-stat-icon" aria-hidden="true">⌘</span><strong>${it}</strong><span>ИТ-специалисты</span></div>
   </div>
  </section>`;
 })():'';
 return`${teamSummary}${muteManagement()}<div class="card"><h2>Сотрудники и отделы</h2><table><tr><th>ФИО</th><th>Отдел</th>${rk()>1?'<th>Email</th><th>Телефон</th>':''}<th>Роль</th><th>Telegram</th><th></th></tr>${DB.users.map(u=>`<tr><td><span class="os-staff-person"><span class="os-staff-picture">${osAvatarMarkup(u.name.split(' ').map(x=>x[0]).slice(0,2).join(''),u.id)}</span><span>${osAttr(u.name)}</span></span></td><td>${rk()>1?`<div class="os-dept-editor"><input id="dept_${u.id}" type="text" maxlength="100" value="${String(u.dep||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}" aria-label="Отдел: ${String(u.name||'Сотрудник').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}" /><button class="btn sec" data-a="savedept" data-i="${u.id}" type="button">Сохранить</button></div>`:u.dep}</td>${rk()>1?`<td>${u.email||'—'}</td><td>${u.phone||'—'}</td>`:''}<td>${rk()>1?`<select id="rl_${u.id}" ${u.id==S.uid||u.role=='it'?'disabled title="Роль защищена"':''}>${Object.keys(RN).map(k=>`<option value="${k}" ${k==u.role?'selected':''}>${RN[k]}</option>`).join('')}</select>`:RN[u.role]}</td><td>${osTelegramHref(u.tg)?`<a class="os-telegram-link" href="${osTelegramHref(u.tg)}" target="_blank" rel="noopener noreferrer">@${osTelegramClean(u.tg)}</a>`:'<span class="mu">Не указан</span>'}</td><td>${rk()>1&&u.id!=S.uid&&u.role!='it'?`<button class="btn red" data-a="deluser" data-i="${u.id}">Удалить</button>`:''}</td></tr>`).join('')}</table></div>${rk()>1?`<div class="card"><h2>Регистрация нового пользователя (только ИТ-специалист)</h2><div class="ctrl"><label>ФИО<input id="un"></label><label>Отдел<input id="ud"></label><label>Email<input id="ue" class="em" autocomplete="off" placeholder="name@mail.ru"><small class="eh">Убедитесь в правильности ввода почты</small></label><label>Телефон<input id="up" class="ph" placeholder="+7 747 584 12 30"></label><label>Пароль<input id="upw" placeholder="не менее 6 символов"></label><label>Роль<select id="ur"><option value="user">Сотрудник</option><option value="admin">Администрация</option><option value="it">ИТ-специалист</option></select></label><button class="btn" data-a="adduser">Создать аккаунт</button></div></div>`:'<div class="card mu">🔒 Регистрация новых пользователей доступна только ИТ-специалисту.</div>'}<div class="card"><h2>Матрица прав доступа (RBAC)</h2><table><tr><th>Функция</th><th>Сотрудник</th><th>Администрация</th><th>ИТ</th></tr>${[['Карта, поиск, бронирование, изменение и отмена своих броней, QR',1,1,1],['Просмотр всех броней, отмена чужих броней, блокировка мест',0,1,1],['Аналитика загрузки, добавление сотрудников',0,1,1],['Назначение ролей, удаление пользователей',0,0,1],['Настройка правил, журнал аудита, состояние системы, сброс данных',0,0,1]].map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(v=>`<td>${v?'✅':'—'}</td>`).join('')}</tr>`).join('')}</table></div>`}
function modal(){const m=S.m;if(!m)return'';
 if(m.t==='logout')return`<div class="mo os-logout-overlay" role="presentation"><div class="md os-logout-dialog" role="dialog" aria-modal="true" aria-labelledby="os-logout-title" aria-describedby="os-logout-desc"><span class="os-logout-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6"/></svg></span><span class="os-logout-kicker">ЗАВЕРШЕНИЕ СЕАНСА</span><h2 id="os-logout-title">Уже уходите?</h2><p id="os-logout-desc">Вы действительно хотите выйти из OfficeSpace?</p><div class="os-logout-actions"><button type="button" class="os-logout-stay" data-a="close">Нет, остаться</button><button type="button" class="os-logout-leave" data-a="logout-confirm" aria-label="Удерживайте 1,8 секунды, чтобы выйти"><span class="os-logout-progress" aria-hidden="true"></span><span class="os-logout-leave-label">Да, хочу выйти</span></button></div></div></div>`;

 if(m.t==='lounge')return`<div class="mo os-lounge-backdrop" role="presentation"><div class="md os-lounge-dialog" role="dialog" aria-modal="true" aria-labelledby="os-lounge-title"><div class="os-lounge-dialog-icon" aria-hidden="true">☕</div><h2 id="os-lounge-title">Зона отдыха</h2><p class="os-lounge-lead">Пространство для перерывов на каждом этаже. <b>Бронирование не требуется.</b></p><div class="os-lounge-features"><div><span>☕</span><span>Кофе-автомат и чайная станция</span></div><div><span>🛋</span><span>Диваны и удобные кресла</span></div><div><span>🚰</span><span>Кулер с питьевой водой</span></div><div><span>🍽</span><span>Микроволновая печь и холодильник</span></div><div><span>📚</span><span>Книги и журналы</span></div></div><button class="btn os-lounge-close" data-a="close" type="button">Понятно, закрыть</button></div></div>`;
 if(m.t=='help')return`<div class="mo"><div class="md" style="max-width:540px;text-align:left"><h2>🕐 Зачем нужна «машина времени»?</h2><p>Это <b>демо-инструмент</b>. Часть функций зависит от времени, и без неё их пришлось бы ждать по-настоящему:</p><ul class="rl"><li><b>Автоосвобождение</b>: если через 30 минут после начала брони нет подтверждения, бронь становится «Не использовано», а место освобождается.</li><li><b>Напоминание</b> за 30 минут до начала.</li><li><b>QR-подтверждение</b>: доступно с −15 до +30 минут от начала брони.</li><li>Завершение броней и ночные брони.</li></ul><p><b>+1 ч / +1 д</b> сдвигают часы сайта вперёд. <b>Сброс</b> возвращает реальное время и откатывает данные к состоянию до симуляции: в демо-режиме изменения не сохраняются, а после перезагрузки страницы всё возвращается как было.</p><div style="text-align:right"><button class="btn" data-a="close">Понятно</button></div></div></div>`;const b=DB.bk.find(x=>x.id==m.i),p=pl(b.pid);
 if(m.t=='qr')return`<div class="mo"><div class="md"><h2>QR-код: ${nm(p)}</h2>${qr('OS-'+p.id+'-'+b.id)}<p class="mu">Демо-код. В системе у каждого места свой токен; подтверждение возможно за 15 мин до начала и до 30 мин после.</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn sec" data-a="tt" data-i="${b.id}">⏱ К началу брони</button><button class="btn" data-a="scan" data-i="${b.id}">Сканировать</button><button class="btn sec" data-a="close">Закрыть</button></div></div></div>`;
 return`<div class="mo"><div class="md"><h2>Изменить бронь</h2><p>${nm(p)}, ${fmtD(b.d)}</p><div class="ctrl" style="justify-content:center"><label>Начало<input type="time" id="es" step="900" value="${tm(b.s)}"></label><label>Конец<input type="time" id="ee" step="900" value="${tm(b.e)}"></label></div><br><div style="display:flex;gap:8px;justify-content:center"><button class="btn" data-a="saveedit" data-i="${b.id}">Сохранить</button><button class="btn sec" data-a="close">Отмена</button></div></div></div>`}
function vSys(){const c=DB.cfg,L=(DB.log||[]).slice(0,40);return`<div class="mw"><div class="card"><h2>⚙️ Параметры бизнес-правил</h2><div class="ctrl"><label>Мин. длительность, мин<input id="c1" type="number" min="15" step="15" value="${c.min}"></label><label>Горизонт, дней<input id="c2" type="number" min="1" max="90" value="${c.hor}"></label><label>Автоосвобождение, мин<input id="c3" type="number" min="5" max="120" value="${c.ns}"></label></div><br><button class="btn" data-a="cfg">Сохранить</button><p class="os-settings-note">Настройки сохраняются в Supabase. Изменять их может только ИТ-специалист.</p><h2 style="margin-top:20px">Состояние системы</h2><div class="row"><span>Пользователей</span><b>${DB.users.length}</b></div><div class="row"><span>Броней в базе</span><b>${DB.bk.length}</b></div><div class="row"><span>Заблокировано мест</span><b>${DB.blocked.length}</b></div><div class="row"><span>Ресурсов (места и переговорные)</span><b>${P.length}</b></div></div><div class="card"><h2>🧾 Журнал аудита</h2>${L.map(l=>`<p style="margin:0;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><b>${uname(l.u)}</b>: ${l.t}<br><small class="mu">${new Date(l.at).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></p>`).join('')||'<div class="hint">Журнал пуст. Совершите действие — оно появится здесь</div>'}</div></div>`}
function loginView(){
 const isLight=document.documentElement.dataset.theme==='light';
 const themeIcon=isLight?'☾':'☀';
 const themeName=isLight?'Тёмная тема':'Светлая тема';
 $('#app').innerHTML=`<main class="os-auth">
  <div class="os-auth-top"><div class="os-auth-mini"><span class="os-auth-logo-mini">◈</span><span>OfficeSpace</span></div><button type="button" class="os-auth-theme" data-a="theme" aria-label="${themeName}" title="${themeName}"><span aria-hidden="true">${themeIcon}</span><span>${themeName}</span></button></div>
  <section class="os-auth-layout" aria-label="Вход в OfficeSpace">
   <div class="os-auth-showcase">
    <div class="os-auth-ambient os-auth-ambient-one"></div><div class="os-auth-ambient os-auth-ambient-two"></div>
    <div class="os-auth-showcase-content">
     <div class="os-auth-kicker"><span class="os-auth-status"></span> Единое пространство для команды</div>
     <h1>Рабочий день<br>начинается <em>здесь.</em></h1>
     <p>Бронируйте рабочие места, общайтесь с коллегами и управляйте офисом в одном пространстве.</p>
     <div class="os-auth-preview" aria-hidden="true">
      <div class="os-auth-preview-head"><span class="os-auth-preview-brand">◈ &nbsp; OfficeSpace</span><span class="os-auth-preview-dots">● ● ●</span></div>
      <div class="os-auth-preview-grid"><div class="os-auth-preview-nav"><span class="active">◈ &nbsp; Рабочие места</span><span>▦ &nbsp; Бронирования</span><span>✉ &nbsp; Сообщения</span></div><div class="os-auth-preview-main"><div class="os-auth-preview-heading"><strong>Ваш офис</strong><small>План рабочего пространства</small></div><div class="os-auth-preview-chips"><span>Этаж 01</span><span>Этаж 02</span><span>Этаж 03</span></div><div class="os-auth-preview-seats">${Array.from({length:12},(_,i)=>`<span class="${[2,7].includes(i)?'busy':[5].includes(i)?'own':''}"></span>`).join('')}</div><small class="os-auth-preview-footer">Всё необходимое для комфортной работы</small></div></div>
     </div>
     <div class="os-auth-showcase-bottom"><span>✦</span> Комфортная работа. Простое управление.</div>
    </div>
   </div>
   <div class="os-auth-form-side">
    <div class="os-auth-form-wrap">
      <span class="os-auth-welcome-mark" aria-hidden="true">◈</span>
      <div class="os-auth-heading"><div class="os-auth-eyebrow">С ВОЗВРАЩЕНИЕМ</div><h2>Войти в аккаунт</h2><p>Введите свои данные, чтобы продолжить работу в OfficeSpace.</p></div>
      <div class="os-auth-fields">
       <label for="lg">Электронная почта</label>
       <div class="os-auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg><input id="lg" type="email" autocomplete="username" inputmode="email" placeholder="name@example.com" aria-describedby="os-auth-email-hint" aria-invalid="false" spellcheck="false" required></div><p id="os-auth-email-hint" class="os-auth-field-error" role="status" aria-live="polite" hidden>Убедитесь в правильности ввода почты</p>
       <label for="pw">Пароль</label>
       <div class="os-auth-input-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg><input id="pw" type="password" autocomplete="current-password" placeholder="Введите пароль" required><button type="button" class="os-auth-visibility" data-a="auth-visibility" aria-label="Показать пароль" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg></button></div>
       <div class="os-auth-login-error" id="os-auth-login-error" role="alert" aria-live="assertive" hidden><span aria-hidden="true">!</span><span id="os-auth-login-error-text"></span></div>
       <button type="button" class="os-auth-submit btn" data-a="login"><span>Войти в OfficeSpace</span><span aria-hidden="true">→</span></button>
      </div>
      <div class="os-auth-security"><span aria-hidden="true">✧</span> Защищённый вход для сотрудников компании</div>
      <p class="os-auth-help">Нет доступа? Обратитесь к ИТ-специалисту вашей организации.</p>
    </div>
   </div>
  </section>
  <footer class="os-auth-footer"><span>© OfficeSpace · Пространство вашей команды</span><span>Безопасная авторизация через Supabase</span></footer>
 </main>`;
}
// DND: account-wide setting stored in Supabase; it never blocks delivery or reading.
function dndActive(){return !!(DB?.dndUntil&&(DB.dndUntil==='infinity'||DB.dndUntil.startsWith('9999-')||new Date(DB.dndUntil).getTime()>Date.now()))}
function dndSettings(){const active=dndActive(),until=DB?.dndUntil;
 return `<div class="card"><h2>🌙 Не беспокоить</h2><p class="mu">Для всех сотрудников. Сообщения сохраняются и доступны, но уведомления о новых сообщениях не показываются.</p><div class="ctrl" style="align-items:end"><label>Продолжительность<select id="dndDuration"><option value="30">30 минут</option><option value="60">1 час</option><option value="120">2 часа</option><option value="480">8 часов</option><option value="0">Пока не выключу</option></select></label><button class="btn" data-a="dndon">${active?'Продлить':'Включить'}</button>${active?'<button class="btn sec" data-a="dndoff">Выключить</button>':''}</div><p class="mu">Статус: <b>${active?((until==='infinity'||until?.startsWith('9999-'))?'Включён до ручного отключения':'Включён до '+new Date(until).toLocaleString('ru-RU')):'Выключен'}</b></p></div>`;
}
function vAcc(){
 const u=DB.users.find(x=>x.id==S.uid);
 const E='<small class="eh">Убедитесь в правильности ввода почты</small>';
 return`<section class="os-account-stack">
 <div class="card os-account-card os-account-profile">
  <div class="os-account-title"><span class="os-account-icon" aria-hidden="true">01</span><div><h2>Профиль</h2><p>Личные данные и фотография сотрудника</p></div></div>
  <div class="os-account-avatar os-avatar-settings">
   <div class="os-avatar-info"><h3>Мой аватар</h3><p class="mu">Выберите портрет из IT-коллекции или загрузите своё фото. Аватар сохраняется в Supabase и виден коллегам на других устройствах.</p></div>
   <div class="os-avatar-options">${osDevAvatarThemes.map((x,i)=>`<button type="button" class="os-avatar-option ${DB.users.find(x=>x.id===S.uid)?.avatarPreset===i?'is-selected':''}" data-a="avatarpick" data-i="${i}" aria-label="Выбрать IT-аватар ${i+1}" title="IT-аватар ${i+1}"><img src="${osDevAvatarSvg(i)}" alt="" loading="lazy"></button>`).join('')}</div>
   <div class="os-account-avatar-actions">
    <input type="file" id="osAvatarUpload" accept="image/png,image/jpeg,image/webp" hidden style="display:none!important" aria-label="Загрузить свою фотографию">
    <label class="os-photo-picker" for="osAvatarUpload" tabindex="0" role="button">
      <span class="os-photo-picker-icon" aria-hidden="true">↥</span>
      <span class="os-photo-picker-copy"><strong>Выбрать фотографию</strong><small>PNG, JPG или WebP · до 1 МБ</small></span>
    </label>
    <span class="os-photo-upload-status" aria-live="polite">${DB.users.find(x=>x.id===S.uid)?.avatarPath?'Фотография хранится в Supabase':'Выберите аватар или загрузите фото'}</span>
    <button type="button" class="btn sec os-photo-remove" data-a="avatarclear">Убрать аватар</button>
  </div>
  </div>
  <div class="os-account-form ctrl"><label>ФИО<input id="an" value="${u.name}"></label><label>Email<input id="ae" value="${u.email||''}" readonly>${E}</label><label>Телефон<input id="ap" class="ph" value="${u.phone||''}" placeholder="+7 747 584 12 30"></label><label>Telegram для связи<input id="at" value="${u.tg?'@'+u.tg:''}" autocomplete="off" maxlength="33" placeholder="@username"><small class="os-field-hint">Укажите свой Telegram, чтобы коллеги могли написать вам. Только латиница, цифры и _, от 5 до 32 символов.</small></label><button class="btn os-account-submit" data-a="saveprof">Сохранить профиль</button></div>
 </div>
 <div class="card os-account-card os-account-password">
  <div class="os-account-title"><span class="os-account-icon" aria-hidden="true">02</span><div><h2>Смена пароля</h2><p>Защитите доступ к своей учётной записи</p></div></div>
  <div class="os-account-form ctrl"><label>Текущий пароль<input id="pwo" type="password" autocomplete="current-password"></label><label>Новый пароль (от 6 символов)<input id="pwn" type="password" autocomplete="new-password"></label><label>Повторите новый пароль<input id="pwr" type="password" autocomplete="new-password"></label><button class="btn os-account-submit" data-a="savepw">Сменить пароль</button></div>
 </div>
 <div class="card os-account-card os-account-access">
  <div class="os-account-title"><span class="os-account-icon" aria-hidden="true">03</span><div><h2>Доступ</h2><p>Ваши права и принадлежность к отделу</p></div></div>
  <div class="os-account-access-list"><div class="row"><span>Роль</span><b>${RN[u.role]}</b></div><div class="row"><span>Отдел</span><b>${u.dep}</b></div></div><p class="mu os-account-access-note">Роль и отдел меняет только ИТ-специалист.</p>
 </div>
 </section>`;
}
const WD=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],WS=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const ld=d=>{const s=new Set();DB.bk.forEach(b=>{if(b.d==d&&!(pl(b.pid)||{room:1}).room&&OK.includes(b.st))s.add(b.pid)});return Math.round(s.size/wpl().length*100)};
function fixT(){if(!['map','search'].includes(S.v))return;const n=new Date(now()),td=ds(n);let nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(S.d<td)S.d=td;
 if(S.d==td&&nm>=1440){const x=new Date(n);x.setDate(x.getDate()+1);S.d=ds(x);nm=0}
 const mx=ds(new Date(now()+DB.cfg.hor*864e5));if(S.d>mx)S.d=mx;if(S.d==td&&S.s<nm)S.s=nm;
 if(S.e-S.s<DB.cfg.min)S.e=S.s+DB.cfg.min;if(S.e-S.s>960)S.e=S.s+960}
function ctrl(dateOnly){if(dateOnly)return ctrlOld(1);const n=new Date(now()),td=ds(n),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15,cm=S.cm||'strip',isT=S.d==td,
 days=[...Array(DB.cfg.hor+1)].map((_,i)=>{const x=new Date(n);x.setDate(x.getDate()+i);return ds(x)}),dl=d=>new Date(d+'T00:00').getDay();
 const dsel=cm=='cal'?`<div class="os-date-value"><button type="button" class="os-calendar-opener" data-picker="open" aria-haspopup="dialog" aria-label="Выбрать дату, в том числе вручную"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2"/></svg><span>${S.d.slice(8)}.${S.d.slice(5,7)}.${S.d.slice(0,4)}</span><svg class="os-calendar-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><p class="os-calendar-hint">Нажмите на поле, чтобы открыть календарь или ввести дату вручную</p></div>`:cm=='list'?`<div class="os-date-value"><select id="cd" aria-label="Выберите дату">${days.map(d=>`<option value="${d}" ${d==S.d?'selected':''}>${d.slice(8)}.${d.slice(5,7)} — ${WD[dl(d)]}${d==td?' (сегодня)':''}</option>`).join('')}</select></div>`:`<div class="strip">${days.map(d=>`<button class="dc ${d==S.d?'on':''}" data-a="day" data-i="${d}"><small>${WS[dl(d)]}</small><b>${+d.slice(8)}</b><i>${ld(d)}%</i></button>`).join('')}</div>`;
 const so=[],eo=[];for(let m=isT?nm:0;m<1440;m+=15)so.push(`<option value="${m}" ${m==S.s?'selected':''}>${tm(m)}</option>`);
 for(let m=S.s+DB.cfg.min;m<=S.s+960;m+=15){const du=m-S.s;eo.push(`<option value="${m}" ${m==S.e?'selected':''}>${tm(m)}${m>=1440?' (+1 день)':''} · ${du>=60?Math.floor(du/60)+' ч'+(du%60?' '+du%60+' мин':''):du+' мин'}</option>`)}
 const pre=[['Весь день',540,1080],['Утро',540,780],['После обеда',780,1080],['Вечер',1080,1320],['Ночь',1380,1620]];
 const durationLabel=m=>m>=60?(Math.floor(m/60)+' ч'+(m%60?' '+m%60+' мин':'')):m+' мин';
 const du=[...new Set([DB.cfg.min,30,60,120,240,480].filter(m=>m>=DB.cfg.min&&m<=960))].sort((a,b)=>a-b).map(m=>[m,durationLabel(m)]);
 return`<div class="card os-date-controls"><div class="cr"><div class="cl">Дата</div><div class="seg os-date-modes"><button class="${cm==='strip'?'on':''}" data-a="cm" data-i="strip" aria-pressed="${cm==='strip'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 9h10M7 13h7M7 16h4"/></svg><span>Лента</span></button><button class="${cm==='cal'?'on':''}" data-a="cm" data-i="cal" aria-pressed="${cm==='cal'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 18h2"/></svg><span>Календарь</span></button><button class="${cm==='list'?'on':''}" data-a="cm" data-i="list" aria-pressed="${cm==='list'}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 9h10M8 13h10M8 17h7"/><path d="M6 9h.01M6 13h.01M6 17h.01"/></svg><span>Список</span></button></div></div><div class="cr os-date-selection">${dsel}</div>
 <div class="cr"><div class="cl">Время</div><div class="tt"><label>Начало<select id="cs">${so.join('')}</select></label><span>→</span><label>Конец<select id="ce">${eo.join('')}</select></label><div class="sum">🕒 ${tm(S.s)}–${tm(S.e)}${S.e>1440?' (до след. дня)':''}</div></div></div>
 <div class="cr"><div class="cl">Быстрый выбор</div><div class="chs">${pre.map(p=>`<button class="ch" data-a="pre" data-i="${p[1]}-${p[2]}" ${(isT&&p[1]<nm)||(p[2]-p[1]<DB.cfg.min)?'disabled':''}>${p[0]} <small>${tm(p[1])}–${tm(p[2])}</small></button>`).join('')}${du.filter(x=>x[0]>=DB.cfg.min).map(x=>`<button class="ch" data-a="dur" data-i="${x[0]}">на ${x[1]}</button>`).join('')}</div></div>
 <div class="mu" style="font-size:12px"><strong>Правила бронирования:</strong> минимум ${DB.cfg.min} мин · доступно на ${DB.cfg.hor} дн. вперёд · пересечения запрещены. Прошедшее время недоступно. Для ночной брони выберите время окончания с пометкой (+1 день).</div></div>`}
function guide(){
 return`<div class="card floor-rest-guide"><h2>☕ Зона отдыха</h2><p>На каждом этаже есть зона отдыха. <b>Её не нужно бронировать</b> — приходите в любое время.</p><ul class="rl"><li>☕ Кофе-автомат и чайная станция</li><li>🛋 Мягкие диваны и кресла</li><li>🚰 Кулер с питьевой водой</li><li>🍽 Микроволновая печь и холодильник</li><li>📚 Стеллаж с книгами и журналами</li></ul><p class="mu" style="font-size:12px">Зона отдыха отмечена на плане этажа пунктирной рамкой.</p></div>`;
}
function vMsgU(){return vMsg()}
function vMsg(){
 const me=S.uid,I=(DB.msgs||[]).filter(m=>m.to===me),O=(DB.msgs||[]).filter(m=>m.from===me),peers=DB.users.filter(x=>x.id!==me),rp=S.rp||{};
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const myMute=(DB.mutes||[]).find(m=>m.user_id===me&&(!m.expires_at||new Date(m.expires_at)>new Date()));
 const blocked=x=>{const pref=(DB.privacy||[]).find(p=>p.user_id===x.id);return pref&&(pref.mode==='none'||pref.mode==='admins'&&rk()<1)};
 const hidden=osHiddenMessages();
 const all=[...I,...O].filter(m=>!hidden.has(String(m.id))).sort((a,b)=>b.at-a.at),selected=all.find(m=>String(m.id)===String(S.mo))||null;
 const listItem=m=>{const incoming=m.to===me,person=uname(incoming?m.from:m.to),initials=person.split(' ').map(x=>x[0]).slice(0,2).join('');return `<button class="thread ${S.mo===m.id?'selected':''} ${incoming&&!m.r?'unread':''}" data-a="mopen" data-i="${m.id}"><span class="thread-avatar">${osAvatarMarkup(initials,incoming?m.from:m.to)}</span><span class="thread-body"><span class="thread-line"><b>${esc(person)}</b><small>${new Date(m.at).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</small></span><span class="thread-subject">${esc(m.subj||m.type)}</span><span class="thread-excerpt">${esc((m.text||'').slice(0,78))}</span></span></button>`};
 const privacy=rk()>=1?`<div class="mess-settings"><h3>Приватность</h3><label>Кто может писать мне<select id="privacyMode"><option value="all" ${DB.myPrivacy==='all'?'selected':''}>Все сотрудники</option><option value="admins" ${DB.myPrivacy==='admins'?'selected':''}>Только администрация и ИТ</option><option value="none" ${DB.myPrivacy==='none'?'selected':''}>Никто</option></select></label><button class="btn sec" data-a="saveprivacy">Сохранить</button></div>`:'';
 return `<div class="os-msg-dnd-shell"><details class="os-msg-dnd"><summary><span>🌙 Режим «Не беспокоить»</span><span class="os-msg-dnd-state">${dndActive()?'Включён':'Выключен'} · Настроить</span></summary>${dndSettings()}</details></div><section class="messenger"><aside class="mess-list"><div class="mess-panel-title"><span>Диалоги</span><span class="mess-count">${all.length}</span></div><div class="mess-filter">Все сообщения <span>· ${I.filter(m=>!m.r&&!hidden.has(String(m.id))).length} непрочитанных</span></div><div class="mess-threads">${all.map(listItem).join('')||'<div class="mess-empty">Сообщений пока нет</div>'}</div></aside><div class="mess-center"><div class="mess-panel-title">${selected?esc(uname(selected.to===me?selected.from:selected.to)):'Переписка'}<span class="mess-online">${selected&&osTelegramHref(DB.users.find(u=>u.id===(selected.to===me?selected.from:selected.to))?.tg)?`<a class="os-telegram-link" target="_blank" rel="noopener noreferrer" href="${osTelegramHref(DB.users.find(u=>u.id===(selected.to===me?selected.from:selected.to))?.tg)}">Написать в Telegram ↗</a>`:'● OfficeSpace'}</span></div>${selected?`<div class="mess-conversation"><div class="mess-date">${new Date(selected.at).toLocaleString('ru-RU')}</div><div class="mess-bubble ${selected.from===me?'outgoing':''}"><span class="mess-bubble-kind">${esc(selected.type||'Сообщение')}</span><h3>${esc(selected.subj)}</h3><p>${esc(selected.text)}</p></div></div><div class="mess-bottom">${selected.to===me&&!myMute?`<button class="btn" data-a="mreply" data-i="${selected.id}">↩ Ответить</button>`:''}<button class="btn sec" data-a="mhide" data-i="${selected.id}" title="Скрыть это сообщение у себя на всех устройствах">Удалить у себя</button><span>История сообщений синхронизируется через Supabase</span></div>`:'<div class="mess-placeholder"><span class="mess-placeholder-icon">✉</span><h2>Выберите сообщение</h2><p>Здесь появится переписка с сотрудниками</p></div>'}</div><aside class="mess-compose"><div class="mess-panel-title">Новое сообщение</div><div class="mess-compose-content">${myMute?`<p class="mu">🔕 Отправка сообщений ограничена${myMute.expires_at?' до '+new Date(myMute.expires_at).toLocaleString('ru-RU'):''}.</p>`:''}<div class="mess-fields"><label>Получатель<select id="mto" ${myMute?'disabled':''}><option value="">Выберите сотрудника</option>${peers.map(x=>`<option value="${esc(x.id)}" ${rp.to===x.id?'selected':''} ${blocked(x)?'disabled':''}>${esc(x.name)}${blocked(x)?' · входящие закрыты':''}</option>`).join('')}</select></label><label>Тема<input id="msj" maxlength="200" value="${esc(rp.subj||'')}" placeholder="Тема сообщения" ${myMute?'disabled':''}></label><label>Сообщение<textarea id="mtx" rows="7" maxlength="10000" placeholder="Напишите сообщение..." ${myMute?'disabled':''}></textarea></label><button class="btn" data-a="msend" ${myMute?'disabled':''}>Отправить сообщение ↗</button></div>${privacy}</div></aside></section>`;
}
function muteManagement(){if(rk()<1)return '';const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');const targets=DB.users.filter(u=>u.id!==S.uid&&(rk()>1?u.role!=='it':u.role==='user'));return `<div class="card os-mute-management"><h2>🔕 Ограничения сообщений</h2><p class="mu">Администрация может ограничивать сотрудников; ИТ — сотрудников и администрацию. Брони остаются доступны.</p><div class="ctrl"><label>Сотрудник<select id="muteUser">${targets.map(u=>`<option value="${esc(u.id)}">${esc(u.name)} · ${esc(RN[u.role])}</option>`).join('')}</select></label><label>Срок<select id="muteDuration"><option value="30">30 минут</option><option value="60">1 час</option><option value="1440">24 часа</option><option value="10080">7 дней</option><option value="0">Бессрочно</option></select></label><label>Причина<input id="muteReason" maxlength="250" placeholder="Причина ограничения"></label><button class="btn" data-a="muteuser" ${targets.length?'':'disabled'}>Заглушить</button></div><h3>Активные ограничения</h3>${(DB.mutes||[]).filter(m=>!m.expires_at||new Date(m.expires_at)>new Date()).filter(m=>targets.some(u=>u.id===m.user_id)).map(m=>`<div class="it"><span>${esc(uname(m.user_id))} · ${m.expires_at?new Date(m.expires_at).toLocaleString('ru-RU'):'Бессрочно'} · ${esc(m.reason||'Без причины')}</span><button class="btn sec" data-a="unmuteuser" data-i="${esc(m.user_id)}">Снять</button></div>`).join('')||'<p class="mu">Активных ограничений нет</p>'}</div>`}

function render(){
 buildP();sweep();if(!S.uid)return loginView();fixT();
 const u=DB.users.find(x=>x.id==S.uid),R=RK[u.role],um=(DB.msgs||[]).filter(m=>m.to==S.uid&&!m.r&&!osHiddenMessages().has(String(m.id))).length;
 if(R<2){S.edit=false;S.ec=null;S.dc=0;}
 const base=[['map','Карта офиса','map'],['search','Поиск мест','search'],['mine','Мои бронирования','calendar-days']];
 const tabs=R===0?[...base,['msg','Сообщения','message-circle']]:[...base,['all','Все бронирования','list-checks'],['stats','Аналитика','chart-no-axes-column'],['staff','Сотрудники','users'],['msg','Сообщения','message-circle'],...(R>1?[['sys','Система','settings']]:[])];
 if(!tabs.some(t=>t[0]===S.v)&&S.v!=='acc')S.v='map';
 osSaveView();
 const mine=DB.nt.filter(n=>n.u===S.uid),un=mine.filter(n=>!n.r).length;
 const staffDraft=S.v==='staff'?Object.fromEntries(['un','ud','ue','up','upw','ur','muteReason','muteUser','muteDuration'].map(id=>{const el=document.getElementById(id);return [id,el?el.value:null]})):null;
 const navPaths={
  map:'<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/><path d="M8.4 10.8h4.8M10.8 8.4v4.8"/>',
  'calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7.5 3v4M16.5 3v4M3 10h18"/><path d="M8 14h2M14 14h2M8 17.5h2"/>',
  'list-checks':'<path d="m4 7 1.5 1.5L8.5 5.5M12 7h8M4 15l1.5 1.5 3-3M12 15h8"/>',
  'chart-no-axes-column':'<rect x="4" y="12" width="3.6" height="8" rx="1"/><rect x="10.2" y="8" width="3.6" height="12" rx="1"/><rect x="16.4" y="4" width="3.6" height="16" rx="1"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.4a3 3 0 0 1 0 5.6M17 14.8a4.6 4.6 0 0 1 3.4 4.5V20"/>',
  'message-circle':'<path d="M20.5 11.8a8.6 8.6 0 0 1-8.8 8.4 9.7 9.7 0 0 1-4.2-.9l-4.3 1.2 1.4-3.9A8.3 8.3 0 0 1 3 11.8a8.6 8.6 0 0 1 8.8-8.4 8.6 8.6 0 0 1 8.7 8.4Z"/><path d="M8.1 11.8h7.6M8.1 15h4.5"/>',
  settings:'<circle cx="12" cy="12" r="3.4"/><path d="M10 2.8h4l.7 2.3 1.8.8 2.1-1.1 2.8 2.8-1.1 2.1.8 1.8 2.3.7v4l-2.3.7-.8 1.8 1.1 2.1-2.8 2.8-2.1-1.1-1.8.8-.7 2.3h-4l-.7-2.3-1.8-.8-2.1 1.1-2.8-2.8 1.1-2.1-.8-1.8-2.3-.7v-4l2.3-.7.8-1.8-1.1-2.1 2.8-2.8 2.1 1.1 1.8-.8Z" transform="translate(1.5 1.5) scale(.875)"/>',
 };
 const navIcon=(key)=>`<svg class="os-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${navPaths[key]||navPaths.map}</svg>`;
 const title=(TT[S.v]||TT.map)[0];
 $('#app').innerHTML=`<header class="os-sidebar"><div class="os-brand os-brand-identity" aria-label="OfficeSpace — платформа управления офисом"><span class="os-brand-emblem" aria-hidden="true"><svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="50" height="50" rx="15" fill="url(#osBrandGradient)"/><path d="M16 21.5 28 14l12 7.5v13L28 42l-12-7.5v-13Z" stroke="white" stroke-width="2.5" stroke-linejoin="round"/><path d="m16 21.5 12 7.4 12-7.4M28 29v13" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40.5" cy="15.5" r="3" fill="#D2CAFF"/><defs><linearGradient id="osBrandGradient" x1="5" y1="4" x2="53" y2="53" gradientUnits="userSpaceOnUse"><stop stop-color="#8B85FF"/><stop offset=".56" stop-color="#795BEB"/><stop offset="1" stop-color="#B870D9"/></linearGradient></defs></svg></span><span class="os-brand-copy"><strong>Office<span class="os-brand-space">Space</span></strong><small>УПРАВЛЕНИЕ ОФИСОМ</small></span></div><div class="os-nav-heading"><span class="os-section-label">РАЗДЕЛЫ</span><span class="os-nav-heading-rule" aria-hidden="true"></span></div><nav aria-label="Основные разделы">${tabs.map(t=>`<button type="button" class="os-nav-link ${S.v===t[0]?'on':''}" data-a="tab" data-i="${t[0]}" ${S.v===t[0]?'aria-current="page"':''}><span class="os-nav-icon">${navIcon(t[2])}</span><span class="os-nav-text">${t[1]}</span>${t[0]==='msg'&&um?`<span class="os-nav-count">${um}</span>`:''}</button>`).join('')}</nav><div class="os-sidebar-bottom"><div class="os-section-label">АККАУНТ</div><button class="os-profile ${S.v==='acc'?'on':''}" data-a="tab" data-i="acc"><span class="os-profile-avatar">${osAvatarMarkup(u.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</span><span><b>${u.name}</b><small>${RN[u.role]}</small></span><span>⚙</span></button><div class="os-bottom-actions"><button data-a="theme" class="os-bottom-btn" title="Сменить тему">◐ <span>Тема</span></button><button data-a="logout" class="os-bottom-btn" title="Выйти">↪ <span>Выход</span></button></div></div></header><div class="os-shell"><div class="os-topbar"><div class="os-breadcrumb"><strong>${title}</strong></div><div class="os-top-actions"><span class="os-clock">${new Date(now()).toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'})}</span><button class="os-top-icon" data-a="theme" title="Переключить тему">◐</button><button class="os-top-icon" data-a="bell" title="Уведомления">🔔 <span class="os-bell-label">Уведомления</span>${un?`<span class="os-top-badge">${un}</span>`:''}</button><button class="os-top-avatar" data-a="tab" data-i="acc" title="Профиль">${osAvatarMarkup(u.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</button></div></div>${S.nt?`<div class="nt">${mine.slice(0,14).map(n=>`<p class="${n.r?'':'u'}" data-a="nt" data-i="${DB.nt.indexOf(n)}">${esc(n.t)}<br><small>${new Date(n.at).toLocaleString('ru-RU')}</small></p>`).join('')||'<p>Уведомлений нет</p>'}</div>`:''}<main class="os-content"><div class="os-page-head"><div><h1>${title}</h1><p>${(TT[S.v]||TT.map)[1]}</p></div><div class="os-page-user"><span class="os-status-dot"></span> ${RN[u.role]}</div></div>${{map:vMap,search:vSearch,mine:vMine,all:vAll,stats:vStats,staff:vStaff,sys:vSys,msg:vMsg,acc:vAcc}[S.v]()}<footer class="os-footer">OfficeSpace · Облачная синхронизация Supabase</footer></main></div>${modal()}`;
 // Keep dialogs outside #app's grid/stacking context so the overlay
 // cannot cover the page while its dialog is hidden behind other layers.
 const osDialog=$('#app > .mo');
 document.querySelectorAll('body > .mo.os-global-dialog').forEach(el=>el.remove());
 if(osDialog){osDialog.classList.add('os-global-dialog');document.body.appendChild(osDialog)}
 if(staffDraft)for(const [id,value] of Object.entries(staffDraft)){const el=document.getElementById(id);if(el&&value!==null)el.value=value}
}
// ===== Supabase cloud integration =====
let sb=null, cloudUser=null, cloudChannel=null, cloudBusy=false, cloudPending=false, cloudRetry=null, cloudStatus="", knownMessageIds=null;
const CLOUD_URL=window.OFFICESPACE_SUPABASE_URL;
const CLOUD_KEY=window.OFFICESPACE_SUPABASE_ANON_KEY;
function cloudError(err){return (err&&err.message)||'Не удалось выполнить запрос к облачной базе'}
// OfficeSpace 6.0 — cloud-backed IT booking settings.
let osSettingsSaving=false;
async function cloudSaveSettings(button){
 if(osSettingsSaving)return;
 if(!sb||!cloudUser||!DB)return toast('Войдите в аккаунт',1);
 if(DB.users.find(u=>u.id===cloudUser.id)?.role!=='it')
  return toast('Изменять настройки может только ИТ-специалист',1);
 const raw=['c1','c2','c3'].map(id=>document.getElementById(id)?.value?.trim());
 const nums=raw.map(Number);
 if(raw.some(v=>v===undefined||v==='')||nums.some(n=>!Number.isSafeInteger(n)))
  return toast('Введите целые числа во все три поля',1);
 const [min,hor,ns]=nums;
 if(min<15||min>1440||min%15!==0)return toast('Минимальная длительность: от 15 до 1440 минут, шаг 15',1);
 if(hor<1||hor>90)return toast('Горизонт бронирования: от 1 до 90 дней',1);
 if(ns<5||ns>120)return toast('Автоосвобождение: от 5 до 120 минут',1);
 osSettingsSaving=true;
 if(button){button.disabled=true;button.textContent='Сохранение…'}
 try{
  const payload={min_duration_minutes:min,booking_horizon_days:hor,no_show_grace_minutes:ns,updated_at:new Date().toISOString()};
  const {data,error}=await sb.from('office_settings').update(payload).eq('id',1)
   .select('min_duration_minutes,booking_horizon_days,no_show_grace_minutes').single();
  if(error)throw error;
  if(!data)throw new Error('Запись настроек не найдена');
  DB.cfg={min:data.min_duration_minutes,hor:data.booking_horizon_days,ns:data.no_show_grace_minutes};
  toast('Настройки сохранены в Supabase');
  fixT();render();
 }catch(err){
  console.error('[OfficeSpace] settings save failed',err);
  toast('Не удалось сохранить настройки: '+cloudError(err),1);
  if(button){button.disabled=false;button.textContent='Сохранить'}
 }finally{osSettingsSaving=false}
}
async function cloudReadAllBookings(){
 const rows=[];let offset=0;
 for(;;){
  const {data,error}=await sb.from('bookings').select('*').order('booking_date',{ascending:false}).order('id',{ascending:false}).range(offset,offset+499);
  if(error)throw error;
  rows.push(...(data||[]));
  if(!data||data.length<500)break;
  offset+=500;
 }
 return {data:rows,error:null};
}
async function cloudFetch(){
 const [pr,wr,br,mr,sr,privacyResult,mutesResult,dndResult,hiddenResult,notificationsResult]=await Promise.all([
  (async()=>{const q=await sb.from('profiles').select('id,full_name,department,phone,role,email,telegram_username,avatar_path,avatar_preset').order('full_name');if(q.error?.code==='42703'||/telegram_username/.test(q.error?.message||'')){return sb.from('profiles').select('id,full_name,department,phone,role,email').order('full_name')}return q})(),
  sb.from('workplaces').select('*').eq('is_active',true).order('id'),
  cloudReadAllBookings(),
  sb.from('office_messages').select('*').order('created_at',{ascending:false}).limit(500),
  sb.from('office_settings').select('*').eq('id',1).maybeSingle(),
  sb.from('message_privacy').select('user_id,mode'),
  sb.from('message_mutes').select('user_id,expires_at,reason'),
  sb.from('message_dnd').select('until_at').eq('user_id',cloudUser.id).maybeSingle(),
  sb.from('message_hidden').select('message_id').eq('user_id',cloudUser.id),
  sb.from('office_notifications').select('id,user_id,body,created_at,is_read').eq('user_id',cloudUser.id).order('created_at',{ascending:false}).limit(150)
 ]);
 for(const x of [pr,wr,br,mr,sr,privacyResult,mutesResult,dndResult,hiddenResult,notificationsResult]){
  if(x.error){
   if(x===hiddenResult)throw new Error('Сначала выполните SQL для удаления сообщений (message_hidden): '+cloudError(x.error));
   throw x.error;
  }
 }
 osTelegramColumnAvailable=(pr.data||[]).some(x=>Object.prototype.hasOwnProperty.call(x,'telegram_username'));
 DB={users:(pr.data||[]).map(x=>({id:x.id,name:x.full_name||'Сотрудник',dep:x.department||'—',phone:x.phone||'',email:x.email||(x.id===cloudUser.id?(cloudUser.email||''):''),tg:x.telegram_username||'',avatarPath:x.avatar_path||null,avatarPreset:Number.isInteger(x.avatar_preset)?x.avatar_preset:null,role:x.role})),
  blocked:(wr.data||[]).filter(x=>x.is_blocked).map(x=>x.id),
  bk:(br.data||[]).map(x=>({id:x.id,uid:x.user_id,pid:x.workplace_id,d:x.booking_date,s:x.start_minute,e:x.end_minute,st:x.status})),
  hiddenMessageIds:(hiddenResult.data||[]).map(x=>String(x.message_id)),dndUntil:dndResult.data?.until_at||null,privacy:privacyResult.data||[],myPrivacy:(privacyResult.data||[]).find(x=>x.user_id===cloudUser.id)?.mode||'all',mutes:mutesResult.data||[],nt:(notificationsResult.data||[]).map(n=>({id:n.id,u:n.user_id,t:n.body,at:new Date(n.created_at).getTime(),r:n.is_read})),log:[],msgs:(mr.data||[]).map(x=>({id:x.id,from:x.sender_id,to:x.recipient_id,type:x.message_type,subj:x.subject,text:x.body,at:new Date(x.created_at).getTime(),r:x.is_read})),mid:0,cfg:{min:sr.data?.min_duration_minutes||30,hor:sr.data?.booking_horizon_days||14,ns:sr.data?.no_show_grace_minutes||30},id:1,pe:{},pn:[],pid:200};
 (wr.data||[]).forEach(x=>{DB.pe[x.id]={f:x.floor,r:x.row_no,c:x.col_no,zone:x.zone,t:x.title,eq:x.equipment||[],room:x.is_room?1:0,name:x.is_room?`Переговорная №${x.id-150}`:undefined,cap:x.capacity||undefined,del:!x.is_active}});
 await osRefreshAvatarLinks(DB.users);
 const me=DB.users.find(x=>x.id===cloudUser.id);if(!me)throw new Error('Профиль пользователя не найден. Проверьте trigger handle_new_user и таблицу profiles.');
 S.uid=cloudUser.id;
 // Never replay old messages as new notifications on first load.
 const current=new Set((DB.msgs||[]).filter(m=>m.to===S.uid).map(m=>String(m.id)));
 if(knownMessageIds!==null){
  const incoming=(DB.msgs||[]).filter(m=>m.to===S.uid&&!knownMessageIds.has(String(m.id)));
  if(incoming.length&&!dndActive()&&!document.hidden)toast(incoming.length===1?'💬 Новое сообщение от '+uname(incoming[0].from):'💬 Новых сообщений: '+incoming.length);
 }
 knownMessageIds=current;
 if(S.mo!==null&&osHiddenMessages().has(String(S.mo)))S.mo=null;
}
function cloudEditing(){const a=document.activeElement;return !!(a&&['INPUT','TEXTAREA','SELECT'].includes(a.tagName)&&a.closest('#app'))}
async function cloudRefresh(){
 if(!sb||!cloudUser)return;
 if(cloudBusy){cloudPending=true;return}
 if(cloudEditing()){cloudPending=true;return}
 cloudBusy=true;
 try{await cloudFetch();if(!S.m&&!cloudEditing())render();else if(cloudEditing())cloudPending=true}
 catch(e){console.error('[OfficeSpace] refresh failed',e);toast('Ошибка синхронизации: '+cloudError(e),1)}
 finally{cloudBusy=false;if(cloudPending&&!cloudEditing()&&!S.m){cloudPending=false;setTimeout(()=>cloudRefresh(),100)}}
}
async function cloudSubscribe(){
 if(cloudChannel){await sb.removeChannel(cloudChannel);cloudChannel=null}
 cloudChannel=sb.channel('officespace-live-'+cloudUser.id)
  .on('postgres_changes',{event:'*',schema:'public',table:'bookings'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'workplaces'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'profiles'},()=>cloudRefresh())
  .on('postgres_changes',{event:'UPDATE',schema:'public',table:'office_settings'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'office_messages'},()=>cloudRefresh())
  .on('postgres_changes',{event:'INSERT',schema:'public',table:'message_hidden',filter:'user_id=eq.'+cloudUser.id},()=>osSyncHiddenMessages())
  .on('postgres_changes',{event:'*',schema:'public',table:'message_mutes'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'office_notifications',filter:'user_id=eq.'+cloudUser.id},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'message_privacy'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'message_dnd'},()=>cloudRefresh())
  .subscribe(status=>{
   if(status!==cloudStatus)console.info('[OfficeSpace] Realtime:',status);
   cloudStatus=status;
   if(status==='SUBSCRIBED'){clearTimeout(cloudRetry);cloudRefresh()}
   if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){
    console.warn('[OfficeSpace] Realtime disconnected:',status);
    clearTimeout(cloudRetry);cloudRetry=setTimeout(()=>{if(cloudUser)cloudSubscribe()},5000);
   }
  });
}
// 5.9.1: independent lightweight synchronization of per-user message hides.
// Realtime remains the primary mechanism; this check recovers missed INSERT events.
let osHiddenSyncBusy=false;
async function osSyncHiddenMessages(){
 if(osHiddenSyncBusy||!sb||!cloudUser||!DB||S.uid!==cloudUser.id)return;
 osHiddenSyncBusy=true;
 const owner=cloudUser.id;
 try{
  const {data,error}=await sb.from('message_hidden').select('message_id').eq('user_id',owner);
  if(error)throw error;
  if(!cloudUser||cloudUser.id!==owner||S.uid!==owner)return;
  const latest=[...new Set((data||[]).map(row=>String(row.message_id)))];
  const previous=new Set((DB.hiddenMessageIds||[]).map(String));
  const changed=latest.length!==previous.size||latest.some(id=>!previous.has(id));
  if(!changed)return;
  DB.hiddenMessageIds=latest;
  if(S.mo!==null&&latest.includes(String(S.mo)))S.mo=null;
  if(!cloudEditing()&&!S.m)render();
  else cloudPending=true;
  console.info('[OfficeSpace] Hidden messages synced:',latest.length);
 }catch(error){console.warn('[OfficeSpace] Hidden message sync:',cloudError(error))}
 finally{osHiddenSyncBusy=false}
}
// Only the small hidden-ID list is checked, not all bookings or messages.
setInterval(()=>{if(!document.hidden)osSyncHiddenMessages()},6000);
window.addEventListener('focus',()=>osSyncHiddenMessages());

document.addEventListener('focusout',()=>{if(cloudPending)setTimeout(()=>cloudRefresh(),100)});
window.addEventListener('online',()=>{if(cloudUser){cloudSubscribe();cloudRefresh()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cloudUser)cloudRefresh()});

// OfficeSpace 5.1: hold-to-confirm logout. Pointer and keyboard both supported.
const osLogoutHoldMs=1800;
let osLogoutHoldTimer=null,osLogoutHeldButton=null,osLogoutHoldKey=null,osLogoutSigningOut=false;
function osLogoutAbort(){
 if(osLogoutHoldTimer!==null){clearTimeout(osLogoutHoldTimer);osLogoutHoldTimer=null}
 if(osLogoutHeldButton){
  osLogoutHeldButton.classList.remove('os-is-holding');
  const hint=osLogoutHeldButton.closest('.os-logout-dialog')?.querySelector('.os-logout-hint');
  if(hint)hint.textContent='Удерживайте красную кнопку до завершения полосы';
 }
 osLogoutHeldButton=null;osLogoutHoldKey=null;
}
function osLogoutHoldStart(button,key){
 if(osLogoutSigningOut||osLogoutHoldTimer!==null||S.m?.t!=='logout'||!button?.isConnected)return;
 osLogoutHeldButton=button;osLogoutHoldKey=key;
 button.classList.remove('os-is-holding');
 void button.offsetWidth; // Restart visual progress on each attempt.
 button.classList.add('os-is-holding');
 const hint=button.closest('.os-logout-dialog')?.querySelector('.os-logout-hint');
 if(hint)hint.textContent='Удерживайте…';
 osLogoutHoldTimer=setTimeout(async()=>{
  osLogoutHoldTimer=null;
  if(S.m?.t!=='logout'||!button.isConnected||osLogoutSigningOut)return;
  osLogoutSigningOut=true;
  button.classList.add('os-is-logging-out');
  button.disabled=true;
  if(hint)hint.textContent='Завершаем сеанс…';
  osLogoutHeldButton=null;osLogoutHoldKey=null;
  try{await cloudLogout()}
  catch(error){osLogoutSigningOut=false;S.m=null;render();toast('Не удалось выйти: '+(error?.message||'ошибка сети'),1)}
  finally{osLogoutSigningOut=false}
 },osLogoutHoldMs);
}
document.addEventListener('pointerdown',e=>{
 const button=e.target.closest('[data-a="logout-confirm"]');
 if(!button||e.button!==0||!e.isPrimary)return;
 e.preventDefault();
 try{button.setPointerCapture(e.pointerId)}catch(_e){}
 osLogoutHoldStart(button,'pointer:'+e.pointerId);
});
function osLogoutPointerFinish(e){
 if(osLogoutHoldKey==='pointer:'+e.pointerId)osLogoutAbort();
}
document.addEventListener('pointerup',osLogoutPointerFinish);
document.addEventListener('pointercancel',osLogoutPointerFinish);
window.addEventListener('blur',osLogoutAbort);
document.addEventListener('keydown',e=>{
 const button=e.target.closest?.('[data-a="logout-confirm"]');
 if(!button||e.repeat||!(e.key===' '||e.key==='Enter'))return;
 e.preventDefault();osLogoutHoldStart(button,'key:'+e.key);
});
document.addEventListener('keyup',e=>{
 if(osLogoutHoldKey==='key:'+e.key){e.preventDefault();osLogoutAbort()}
});

async function cloudBoot(){
 if(!CLOUD_URL||!CLOUD_KEY||!window.supabase?.createClient){$('#app').innerHTML='<main class="card"><h2>Не настроено подключение Supabase</h2><p>Проверьте файл supabase-config.js.</p></main>';return}
 sb=window.supabase.createClient(CLOUD_URL,CLOUD_KEY);
 const {data:{session},error}=await sb.auth.getSession();if(error){toast(cloudError(error),1);return}
 cloudUser=session?.user||null;
 // Всплывающие окна нельзя переносить между сеансами.
 S.m=null;osLogoutAbort();
 if(!cloudUser){DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};S.uid=0;render();return}
 try{await cloudFetch();osRestoreView();render();osScrollTop();await cloudSubscribe();}
 catch(e){$('#app').innerHTML=`<main class="card"><h2>Не удалось загрузить OfficeSpace</h2><p>${clean(cloudError(e))}</p><p>Проверьте, что SQL-настройка выполнена полностью и профиль создан.</p><button class="btn" onclick="location.reload()">Повторить</button></main>`}
}
// Часто используемые окончания для предупреждения о возможной опечатке.
// Список не является полным реестром доменных зон: другие редкие зоны могут
// существовать, но для корпоративного входа лучше показать предупреждение.
const OS_AUTH_TLDS=new Set(('com ru kz org net edu gov mil int info biz me io co app dev tech '+
 'ai uk us de fr it es pl jp cn in ca au nz nl be ch at se no fi dk ie pt gr tr '+
 'ua by uz kg ge am az tj tm md ee lv lt ro bg cz sk hu hr rs si il ae sa qa '+
 'online site store shop xyz cloud digital email space studio design agency '+
 'pro name club life live world work team company solutions systems').split(' '));
function osAuthEmailValid(value){
 const email=String(value||'').trim().toLowerCase();
 const match=email.match(/^([a-z0-9](?:[a-z0-9.!#$%&'*+\/?^_`{|}~-]*[a-z0-9])?)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/);
 if(!match||email.length>254||email.includes('..'))return false;
 const labels=match[2].split('.');
 if(labels.some(x=>x.length>63||x.startsWith('-')||x.endsWith('-')))return false;
 const tld=labels[labels.length-1];
 return OS_AUTH_TLDS.has(tld);
}
function osAuthEmailHint(force=false){
 const field=$('#lg'),hint=$('#os-auth-email-hint');
 if(!field||!hint)return true;
 const value=field.value.trim();
 const invalid=!!value&&!osAuthEmailValid(value);
 // На неизвестную зону предупреждаем после ввода 2+ букв;
 // при частичном вводе привычной зоны (.co -> .com) не мешаем печатать.
 const suffix=(value.split('@')[1]||'').split('.').pop().toLowerCase();
 const unknownTld=value.includes('@')&&(value.split('@')[1]||'').includes('.')&&
  suffix.length>=2&&/^[a-z]+$/.test(suffix)&&
  !OS_AUTH_TLDS.has(suffix)&&![...OS_AUTH_TLDS].some(t=>t.startsWith(suffix));
 const show=invalid&&(force||unknownTld);
 hint.textContent='Убедитесь в правильности набора почты';
 hint.hidden=!show;
 field.setAttribute('aria-invalid',String(show));
 field.classList.toggle('os-auth-invalid',show);
 return !invalid;
}
function osAuthLoginError(message){
 const node=$('#os-auth-login-error'),label=$('#os-auth-login-error-text');
 if(!node||!label){if(message)toast(message,1);return}
 label.textContent=message||'';
 node.hidden=!message;
}
function osAuthRussianError(error){
 const code=String(error?.code||'').toLowerCase();
 const status=Number(error?.status||0);
 const msg=String(error?.message||'').toLowerCase();
 if(code==='invalid_credentials'||msg.includes('invalid login credentials')||msg.includes('invalid credentials'))return 'Неверная электронная почта или пароль. Проверьте данные и попробуйте снова.';
 if(code==='email_not_confirmed'||msg.includes('email not confirmed'))return 'Электронная почта не подтверждена. Проверьте почту или обратитесь к ИТ-специалисту.';
 if(status===429||code.includes('rate_limit')||msg.includes('too many requests'))return 'Слишком много попыток входа. Попробуйте немного позже.';
 if(msg.includes('failed to fetch')||msg.includes('network')||msg.includes('fetch failed'))return 'Не удалось связаться с сервером. Проверьте интернет и повторите попытку.';
 if(status>=500)return 'Сервис авторизации временно недоступен. Попробуйте позже.';
 return 'Не удалось войти в аккаунт. Проверьте данные и повторите попытку.';
}
async function cloudLogin(){
 const emailField=$('#lg'),pwField=$('#pw'),button=$('.os-auth-submit');
 if(!emailField||!pwField)return;
 const email=emailField.value.trim().toLowerCase(),password=pwField.value;
 osAuthLoginError('');
 if(!email){osAuthLoginError('Введите электронную почту.');emailField.focus();return}
 if(!osAuthEmailHint(true)){osAuthLoginError('Проверьте формат электронной почты.');emailField.focus();return}
 if(!password){osAuthLoginError('Введите пароль.');pwField.focus();return}
 if(button?.disabled)return;
 if(button)button.disabled=true;
 try{
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  if(error){osAuthLoginError(osAuthRussianError(error));return}
  cloudUser=data.user;knownMessageIds=null;S.m=null;osLogoutAbort();
  try{await cloudFetch();S.v='map';render();osScrollTop();await cloudSubscribe();toast('Добро пожаловать, '+(DB.users.find(x=>x.id==S.uid)?.name||email))}
  catch(e){toast('Профиль не загружен: '+cloudError(e),1)}
 }catch(e){osAuthLoginError(osAuthRussianError(e))}
 finally{if(button?.isConnected)button.disabled=false}
}
async function cloudLogout(){
 osAvatarLinks.clear();
 // Явный выход завершает навигационную сессию пользователя.
 // При F5 без выхода сохранённая вкладка по-прежнему восстанавливается.
 try{if(S.uid)sessionStorage.removeItem(osViewKey(S.uid))}catch(e){}
 S.v='map';S.mo=null;
 knownMessageIds=null;clearTimeout(cloudRetry);if(cloudChannel)await sb.removeChannel(cloudChannel);await sb.auth.signOut();S.m=null;osLogoutHoldTimer=null;osLogoutHeldButton=null;osLogoutHoldKey=null;cloudUser=null;S.uid=0;DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};render()}
sweep=function(){return 0};
book=async function(pid){const m=validate(pid,S.d,S.s,S.e,S.uid);if(m)return toast(m,1);const {error}=await sb.rpc('create_booking',{p_workplace_id:pid,p_booking_date:S.d,p_start_minute:S.s,p_end_minute:S.e});if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Бронь сохранена в облаке: '+nm(pl(pid)));S.sel=null;render()};
cancel=async function(id){const b=DB.bk.find(x=>x.id==id);if(!b)return toast('Бронь не найдена',1);if(b.uid!==S.uid&&rk()<1)return toast('Недостаточно прав',1);const {error}=await sb.from('bookings').update({status:'cancelled'}).eq('id',id);if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Бронь отменена')};
// OfficeSpace 6.1.2 — native modal in the browser top layer.
// Independent of render() to prevent invisible overlays and lost input.
function osCloseBlockDialog(){
 const d=document.getElementById('osBlockDialog');
 if(!d)return;
 if(d.open)d.close();
 d.remove();
}
function osOpenBlockDialog(id){
 if(!cloudUser||rk()<1)return toast('Недостаточно прав для блокировки',1);
 const p=pl(id);
 if(!p)return toast('Рабочее место не найдено',1);
 osCloseBlockDialog();
 const blocked=DB.blocked.includes(id);
 const d=document.createElement('dialog');
 d.id='osBlockDialog';
 d.className='os-block-native';
 d.setAttribute('aria-labelledby','osBlockTitle');
 d.innerHTML=`<div class="os-native-content">
  <div class="os-native-symbol" aria-hidden="true">${blocked?'🔓':'🔒'}</div>
  <h2 id="osBlockTitle">${blocked?'Разблокировать место?':'Заблокировать место?'}</h2>
  <p class="os-native-place">${osAttr(nm(p))}</p>
  ${blocked?'<p class="os-native-help">Место снова станет доступным. Отменённые брони не восстановятся автоматически.</p>':`<label class="os-native-label" for="osBlockReason">Причина блокировки<textarea id="osBlockReason" rows="3" maxlength="500" placeholder="Например, ремонт оборудования"></textarea></label><p class="os-native-help">Действующие и будущие бронирования будут отменены. Владельцы получат уведомления с причиной.</p>`}
  <p id="osBlockError" class="os-native-error" role="alert" hidden></p>
  <div class="os-native-actions"><button class="btn sec" type="button" id="osBlockCancel">Назад</button><button class="btn ${blocked?'':'red'}" type="button" id="osBlockConfirm">${blocked?'Разблокировать':'Заблокировать'}</button></div>
 </div>`;
 document.body.appendChild(d);
 d.addEventListener('close',()=>d.remove(),{once:true});
 d.addEventListener('click',e=>{if(e.target===d)osCloseBlockDialog()});
 d.querySelector('#osBlockCancel').addEventListener('click',osCloseBlockDialog);
 const confirm=d.querySelector('#osBlockConfirm');
 confirm.addEventListener('click',async()=>{
  const reason=d.querySelector('#osBlockReason')?.value.trim()||'';
  const errorEl=d.querySelector('#osBlockError');
  if(!blocked&&reason.length<5){errorEl.textContent='Укажите причину блокировки — минимум 5 символов.';errorEl.hidden=false;d.querySelector('#osBlockReason')?.focus();return}
  confirm.disabled=true;confirm.textContent='Сохранение…';errorEl.hidden=true;
  try{
   const {error}=await sb.rpc('office_set_workplace_block',{p_workplace_id:id,p_block:!blocked,p_reason:blocked?null:reason});
   if(error)throw error;
   osCloseBlockDialog();
   await cloudRefresh();
   toast(blocked?'Место разблокировано':'Место заблокировано. Затронутые брони отменены.');
  }catch(err){
   if(!d.isConnected){toast('Ошибка блокировки: '+cloudError(err),1);return}
   errorEl.textContent='Ошибка Supabase: '+cloudError(err);errorEl.hidden=false;
   console.error('[OfficeSpace] block RPC',err);
  }finally{if(d.isConnected){confirm.disabled=false;confirm.textContent=blocked?'Разблокировать':'Заблокировать'}}
 });
 try{d.showModal()}catch(err){d.remove();toast('Не удалось открыть окно: '+err.message,1)}
 if(!blocked)d.querySelector('#osBlockReason')?.focus();
 else d.querySelector('#osBlockCancel')?.focus();
}
async function cloudToggleBlock(id,reason=''){
 if(rk()<1)return toast('Недостаточно прав',1);
 const blocked=DB.blocked.includes(id);
 if(!blocked&&(!reason.trim()||reason.trim().length<5))return toast('Укажите причину блокировки (от 5 символов)',1);
 const {error}=await sb.rpc('office_set_workplace_block',{p_workplace_id:id,p_block:!blocked,p_reason:blocked?null:reason.trim()});
 if(error)return toast('Ошибка блокировки: '+cloudError(error),1);
 S.m=null;await cloudRefresh();toast(blocked?'Место разблокировано':'Место заблокировано; затронутые брони отменены');
}
async function cloudSaveDepartment(id,button){
 if(!cloudUser||rk()<2)return toast('Только ИТ-специалист может менять отдел',1);
 const user=DB.users.find(u=>u.id===id);
 if(!user)return toast('Сотрудник не найден',1);
 const input=document.getElementById('dept_'+id);
 const department=input?.value.trim();
 if(!department||department.length>100)return toast('Введите название отдела от 1 до 100 символов',1);
 if(department===user.dep)return toast('Отдел уже указан',0);
 if(button){button.disabled=true;button.textContent='Сохраняем…'}
 try{
  const {error}=await sb.rpc('set_user_department',{target_user:id,new_department:department});
  if(error)throw error;
  await cloudFetch();render();toast('Отдел сотрудника обновлён');
 }catch(e){toast('Не удалось изменить отдел: '+cloudError(e),1);if(button?.isConnected){button.disabled=false;button.textContent='Сохранить'}}
}
async function osCleanupOldAvatar(path){
 if(!path||!cloudUser||!path.startsWith(cloudUser.id+'/'))return;
 const {error}=await sb.storage.from(osAvatarBucket).remove([path]);
 if(error)console.warn('[OfficeSpace] Old avatar cleanup:',error.message);
 osAvatarLinks.delete(path);
}
async function osSaveAvatarPreset(index){
 const old=DB.users.find(u=>u.id===S.uid)?.avatarPath;
 if(await osSaveAvatarProfile({avatar_preset:index,avatar_path:null,updated_at:new Date().toISOString()},'Аватар сохранён в облаке'))await osCleanupOldAvatar(old);
}
async function osClearAvatar(){
 const old=DB.users.find(u=>u.id===S.uid)?.avatarPath;
 if(await osSaveAvatarProfile({avatar_preset:null,avatar_path:null,updated_at:new Date().toISOString()},'Аватар удалён'))await osCleanupOldAvatar(old);
}
async function osUploadAvatar(file){
 if(!cloudUser)return toast('Войдите в аккаунт',1);
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>1024*1024||file.size===0)return toast('Выберите JPG, PNG или WebP до 1 МБ',1);
 const magic={ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' };
 const ext=magic[file.type];
 // Only the user's own directory is writable by storage RLS.
 const path=cloudUser.id+'/'+crypto.randomUUID()+'.'+ext;
 const el=document.querySelector('.os-photo-upload-status');if(el)el.textContent='Загружаем фотографию…';
 try{
  const old=DB.users.find(u=>u.id===S.uid)?.avatarPath;
  const {error:uploadError}=await sb.storage.from(osAvatarBucket).upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
  if(uploadError)throw uploadError;
  const {error:profileError}=await sb.from('profiles').update({avatar_path:path,avatar_preset:null,updated_at:new Date().toISOString()}).eq('id',cloudUser.id);
  if(profileError){await sb.storage.from(osAvatarBucket).remove([path]);throw profileError}
  try{localStorage.removeItem(osLocalKey('avatar'))}catch(e){}
  await cloudFetch();render();toast('Фото сохранено в Supabase');
  await osCleanupOldAvatar(old);
 }catch(e){toast('Ошибка загрузки аватара: '+cloudError(e),1);if(el?.isConnected)el.textContent='Не удалось загрузить фотографию'}
}
async function cloudSaveProfile(){
 const n=$('#an')?.value.trim(),ph=$('#ap')?.value.trim(),tg=osTelegramClean($('#at')?.value);
 if(!n)return toast('Введите ФИО',1);
 if(!osTelegramValid(tg))return toast('Telegram: от 5 до 32 символов, латиница, цифры и _',1);
 if(!osTelegramColumnAvailable)return toast('Для сохранения Telegram сначала выполните SQL из файла telegram_setup.sql в Supabase',1);
 const {error}=await sb.from('profiles').update({full_name:n,phone:ph,telegram_username:tg||null,updated_at:new Date().toISOString()}).eq('id',S.uid);
 if(error)return toast('Профиль не сохранён: '+cloudError(error),1);
 await cloudRefresh();toast('Профиль и Telegram сохранены');
}
async function cloudSavePassword(){const oldPassword=$('#pwo').value,newPassword=$('#pwn').value,repeat=$('#pwr').value;if(newPassword.length<6)return toast('Новый пароль — не менее 6 символов',1);if(newPassword!==repeat)return toast('Пароли не совпадают',1);const {error:verifyError}=await sb.auth.signInWithPassword({email:cloudUser.email,password:oldPassword});if(verifyError)return toast('Текущий пароль указан неверно',1);const {error}=await sb.auth.updateUser({password:newPassword});if(error)return toast(cloudError(error),1);toast('Пароль изменён')}

async function cloudCreateUser(){
 if(!cloudUser||DB.users.find(x=>x.id===S.uid)?.role!=='it')return toast('Создавать аккаунты может только ИТ-специалист',1);
 const name=$('#un')?.value.trim(),department=$('#ud')?.value.trim()||'—',email=$('#ue')?.value.trim().toLowerCase(),phone=$('#up')?.value.trim(),password=$('#upw')?.value,role=$('#ur')?.value||'user';
 const digits=(phone||'').replace(/\D/g,'');
 if(!name)return toast('Введите ФИО',1);if(!emOK(email))return toast('Проверьте email',1);if(digits.length<10)return toast('Введите корректный телефон',1);if(!password||password.length<6)return toast('Пароль должен содержать не менее 6 символов',1);if(!['user','admin','it'].includes(role))return toast('Недопустимая роль',1);
 if(DB.users.some(x=>(x.email||'').toLowerCase()===email))return toast('Этот email уже есть в списке сотрудников',1);
 const btn=document.querySelector('[data-a="adduser"]');if(btn){btn.disabled=true;btn.textContent='Создаём аккаунт…'}
 try{
  const {data:{session}}=await sb.auth.getSession();if(!session?.access_token)throw new Error('Сессия истекла. Войдите снова.');
  const response=await fetch(CLOUD_URL.replace(/\/$/,'')+'/functions/v1/create-user',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':CLOUD_KEY},body:JSON.stringify({name,department,email,phone,password,role})});
  const result=await response.json().catch(()=>({error:'Сервер вернул некорректный ответ'}));if(!response.ok)throw new Error(result.error||'Не удалось создать аккаунт');
  await cloudFetch();render();toast('Аккаунт создан: '+email+' — сотрудник может войти с указанным паролем');
 }catch(e){toast('Не удалось создать аккаунт: '+cloudError(e),1);if(btn){btn.disabled=false;btn.textContent='Создать аккаунт'}}
}

async function cloudSetDnd(disable=false){
 const minutes=disable?null:Number($('#dndDuration')?.value||60);
 const {error}=await sb.rpc('set_my_message_dnd',{p_minutes:minutes});
 if(error)return toast('Не удалось изменить режим: '+cloudError(error),1);
 await cloudFetch();render();toast(disable?'Режим «Не беспокоить» выключен':'Режим «Не беспокоить» включён');
}
async function cloudSavePrivacy(){
 if(rk()<1)return toast('Недостаточно прав',1);
 const mode=$('#privacyMode')?.value;
 const {error}=await sb.rpc('set_my_message_privacy',{p_mode:mode});
 if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Приватность сохранена');
}
async function cloudSetMute(remove=false,id=null){
 if(rk()<1)return toast('Недостаточно прав',1);
 const target=id||$('#muteUser')?.value,mins=Number($('#muteDuration')?.value||0),reason=$('#muteReason')?.value.trim()||'';
 if(!remove&&!reason)return toast('Укажите причину ограничения',1);
 const {error}=await sb.rpc('manage_message_mute',{p_target:target,p_minutes:mins,p_reason:reason,p_remove:remove});
 if(error)return toast(cloudError(error),1);await cloudRefresh();toast(remove?'Ограничение снято':'Отправка сообщений ограничена');
}
async function cloudSendMessage(){
 const to=$('#mto')?.value,subject=$('#msj')?.value.trim(),body=$('#mtx')?.value.trim();
 if(!to||!DB.users.some(x=>x.id===to&&x.id!==S.uid))return toast('Выберите получателя',1);
 if(!subject||!body)return toast('Заполните тему и текст',1);
 const btn=document.querySelector('[data-a="msend"]');if(btn)btn.disabled=true;
 const {error}=await sb.from('office_messages').insert({sender_id:cloudUser.id,recipient_id:to,message_type:'Сообщение',subject,body});
 if(error){if(btn)btn.disabled=false;return toast('Не удалось отправить: '+cloudError(error),1)}
 S.rp=null;await cloudFetch();render();toast('Сообщение отправлено');
}
// Кастомное подтверждение удаления вместо браузерного confirm().
function osConfirmHideMessage(){
 return new Promise(resolve=>{
  const previous=document.querySelector('.os-delete-dialog-overlay');
  if(previous)previous.remove();
  const backdrop=document.createElement('div');
  backdrop.className='os-delete-dialog-overlay';
  backdrop.innerHTML=`
   <section class="os-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="os-delete-dialog-title" aria-describedby="os-delete-dialog-desc">
    <div class="os-delete-dialog-icon" aria-hidden="true">
     <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 4v6m4-6v6"/></svg>
    </div>
    <h2 id="os-delete-dialog-title">Удалить сообщение?</h2>
    <p id="os-delete-dialog-desc">Сообщение исчезнет у вас на всех устройствах. У собеседника оно сохранится.</p>
    <div class="os-delete-dialog-actions">
     <button type="button" class="os-delete-dialog-cancel">Оставить</button>
     <button type="button" class="os-delete-dialog-confirm">Удалить у себя</button>
    </div>
   </section>`;
  const previousFocus=document.activeElement;
  const cancel=backdrop.querySelector('.os-delete-dialog-cancel');
  const confirmButton=backdrop.querySelector('.os-delete-dialog-confirm');
  const alreadyLocked=document.body.classList.contains('os-delete-dialog-open');
  document.body.classList.add('os-delete-dialog-open');
  document.body.appendChild(backdrop);
  let settled=false;
  const finish=(result)=>{
   if(settled)return;
   settled=true;
   document.removeEventListener('keydown',onKeydown,true);
   backdrop.remove();
   if(!alreadyLocked)document.body.classList.remove('os-delete-dialog-open');
   if(previousFocus?.isConnected&&typeof previousFocus.focus==='function')previousFocus.focus();
   resolve(result);
  };
  function onKeydown(event){
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(false)}
   if(event.key==='Tab'){
    const controls=[cancel,confirmButton];
    const index=controls.indexOf(document.activeElement);
    if(event.shiftKey&&index<=0){event.preventDefault();confirmButton.focus()}
    else if(!event.shiftKey&&index===controls.length-1){event.preventDefault();cancel.focus()}
   }
  }
  cancel.addEventListener('click',()=>finish(false));
  confirmButton.addEventListener('click',()=>finish(true));
  backdrop.addEventListener('click',event=>{if(event.target===backdrop)finish(false)});
  document.addEventListener('keydown',onKeydown,true);
  cancel.focus();
 });
}

// "Удалить у себя" is a per-user tombstone. The original message is kept for the other party.
async function cloudHideMessage(id,button){
 if(!cloudUser)return toast('Войдите в аккаунт',1);
 const message=DB.msgs.find(x=>String(x.id)===String(id));
 if(!message||![message.from,message.to].includes(cloudUser.id))return toast('Сообщение не найдено',1);
 if(!await osConfirmHideMessage())return;
 if(button?.disabled)return;
 if(button)button.disabled=true;
 try{
  const {error}=await sb.from('message_hidden').upsert({user_id:cloudUser.id,message_id:String(id)},{onConflict:'user_id,message_id',ignoreDuplicates:true});
  if(error)throw error;
  const {data:verified,error:verifyError}=await sb.from('message_hidden')
   .select('message_id').eq('user_id',cloudUser.id).eq('message_id',String(id)).maybeSingle();
  if(verifyError)throw verifyError;
  if(!verified)throw new Error('Скрытие не найдено в Supabase после сохранения');
  DB.hiddenMessageIds=[...new Set([...(DB.hiddenMessageIds||[]),String(id)])];
  if(String(S.mo)===String(id))S.mo=null;
  render();
  toast('Сообщение удалено у вас на всех устройствах');
 }catch(error){toast('Не удалось удалить сообщение: '+cloudError(error),1);if(button?.isConnected)button.disabled=false}
}
async function cloudOpenMessage(id){
 const m=DB.msgs.find(x=>x.id===id);if(!m)return;
 S.mo=S.mo===id?null:id;
 if(m.to===S.uid&&!m.r){m.r=true;const {error}=await sb.from('office_messages').update({is_read:true}).eq('id',id).eq('recipient_id',cloudUser.id);if(error)toast(cloudError(error),1)}
 render();
}
// OfficeSpace 6.1.3 — notifications in a native top-layer dialog.
function osOpenNotifications(){
 if(!cloudUser||!sb)return toast('Войдите в аккаунт',1);
 const old=document.getElementById('osNotificationsDialog');
 if(old){old.close();old.remove();return}
 S.nt=0;
 const dialog=document.createElement('dialog');
 dialog.id='osNotificationsDialog';
 dialog.className='os-notifications-dialog';
 dialog.setAttribute('aria-labelledby','osNotificationsTitle');
 const head=document.createElement('div');
 head.className='os-notifications-header';
 const label=document.createElement('div');
 const eyebrow=document.createElement('small');eyebrow.textContent='OFFICESPACE';
 const title=document.createElement('h2');title.id='osNotificationsTitle';title.textContent='Уведомления';
 label.append(eyebrow,title);
 const close=document.createElement('button');close.type='button';close.className='os-notifications-close';close.textContent='✕';close.setAttribute('aria-label','Закрыть уведомления');
 head.append(label,close);
 const body=document.createElement('div');body.className='os-notifications-list';
 dialog.append(head,body);document.body.appendChild(dialog);
 const dismiss=()=>{if(dialog.open)dialog.close();dialog.remove()};
 close.addEventListener('click',dismiss);
 dialog.addEventListener('close',()=>dialog.remove());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss()});
 const show=()=>{
  body.replaceChildren();
  const items=(DB?.nt||[]).filter(n=>String(n.u)===String(S.uid)).slice(0,100);
  if(!items.length){const empty=document.createElement('div');empty.className='os-notifications-empty';empty.textContent='Пока уведомлений нет';body.appendChild(empty);return}
  for(const n of items){
   const item=document.createElement('button');item.type='button';item.className='os-notification-item'+(n.r?'':' unread');
   const main=document.createElement('span');main.className='os-notification-body';main.textContent=n.t||'Уведомление';
   const stamp=document.createElement('span');stamp.className='os-notification-date';stamp.textContent=new Date(n.at).toLocaleString('ru-RU');
   item.append(main,stamp);
   if(!n.r){const dot=document.createElement('span');dot.className='os-notification-dot';dot.setAttribute('aria-label','Не прочитано');item.appendChild(dot)}
   item.addEventListener('click',async()=>{
    if(n.r)return;
    item.disabled=true;
    const {data,error}=await sb.from('office_notifications').update({is_read:true}).eq('id',n.id).eq('user_id',cloudUser.id).select('id');
    if(error||!data?.length){item.disabled=false;toast('Не удалось отметить прочитанным: '+cloudError(error),1);return}
    n.r=true;show();render();
   });
   body.appendChild(item);
  }
 };
 show();
 try{dialog.showModal()}catch(error){dialog.remove();toast('Не удалось открыть уведомления: '+error.message,1)}
}
// OfficeSpace 6.3 — booking actions with native dialogs and server-side rescheduling.
function osBookingDialogClose(){const d=document.getElementById('osBookingDialog');if(d){if(d.open)d.close();d.remove()}}
function osBookingDialogOpen(id,kind){
 const b=DB?.bk?.find(x=>String(x.id)===String(id));
 if(!b||b.uid!==S.uid||b.st!=='confirmed')return toast('Эта бронь больше недоступна для действия',1);
 const p=pl(b.pid);if(!p)return toast('Рабочее место не найдено',1);
 osBookingDialogClose();
 const d=document.createElement('dialog');d.id='osBookingDialog';d.className='os-block-native';
 const name=osAttr(nm(p)),date=osAttr(fmtD(b.d)),times=osAttr(tm(b.s)+'–'+tm(b.e));
 d.innerHTML=kind==='qr'?`<div class="os-native-content"><h2>Бронь №${osAttr(b.id)}</h2><p><b>${name}</b> · ${date} · ${times}</p><div style="margin:16px auto;max-width:190px;background:white;padding:10px;border-radius:12px">${qr('OS-'+p.id+'-'+b.id)}</div><p class="os-native-help">Это демонстрационный рисунок, не сканируемый QR-код. Подтверждение присутствия пока не подключено к серверу.</p><div class="os-native-actions"><button type="button" class="btn sec" id="osBookingClose">Закрыть</button></div></div>`:
 `<div class="os-native-content"><h2>Изменить время брони</h2><p><b>${name}</b> · ${date}</p><p class="os-native-help">Старая бронь будет отменена и заменена новой в одной транзакции Supabase. Если новое время недоступно, прежняя бронь сохранится.</p><div class="ctrl"><label>Начало<input id="osBookingStart" type="time" step="900" value="${tm(b.s)}"></label><label>Конец<input id="osBookingEnd" type="time" step="900" value="${tm(b.e)}"></label></div><p id="osBookingError" class="os-native-error" role="alert" hidden></p><div class="os-native-actions"><button type="button" class="btn sec" id="osBookingClose">Назад</button><button type="button" class="btn" id="osBookingSave">Сохранить</button></div></div>`;
 document.body.appendChild(d);
 d.addEventListener('close',()=>d.remove(),{once:true});
 d.addEventListener('click',e=>{if(e.target===d)osBookingDialogClose()});
 d.querySelector('#osBookingClose').addEventListener('click',osBookingDialogClose);
 const saveBtn=d.querySelector('#osBookingSave');
 if(saveBtn)saveBtn.addEventListener('click',async()=>{
  const start=d.querySelector('#osBookingStart').value,end=d.querySelector('#osBookingEnd').value;
  const errorEl=d.querySelector('#osBookingError');
  const fail=message=>{errorEl.textContent=message;errorEl.hidden=false};
  if(!/^\d{2}:\d{2}$/.test(start)||!/^\d{2}:\d{2}$/.test(end))return fail('Укажите начало и конец');
  const s=pm(start),e0=pm(end),en=e0>s?e0:e0+1440;
  if(s===b.s&&en===b.e)return fail('Время не изменилось');
  if(s<0||s>=1440||en>2880||en-s<DB.cfg.min)return fail('Проверьте время и минимальную длительность');
  saveBtn.disabled=true;saveBtn.textContent='Сохраняем…';errorEl.hidden=true;
  try{
   const {error}=await sb.rpc('office_reschedule_booking',{p_booking_id:b.id,p_start_minute:s,p_end_minute:en});
   if(error)throw error;
   osBookingDialogClose();await cloudFetch();render();toast('Время брони изменено в Supabase');
  }catch(err){
   console.error('[OfficeSpace] reschedule',err);
   fail('Не удалось изменить бронь: '+cloudError(err)+(err?.code==='PGRST202'?' (сначала выполните SQL из комплекта)':''));
  }finally{if(saveBtn.isConnected){saveBtn.disabled=false;saveBtn.textContent='Сохранить'}}
 });
 try{d.showModal()}catch(err){d.remove();toast('Не удалось открыть окно: '+err.message,1)}
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]'),g=e.target.closest('[data-id]');
 if(g&&!a){S.sel=+g.dataset.id;S.ec=null;S.dc=0;S.nt=0;return render()}
 if(!a){if(S.nt&&!e.target.closest('.nt')){S.nt=0;render()}return}
 const A=a.dataset.a,i=a.dataset.i;e.preventDefault();
 if(A==='qr'||A==='edit'){osBookingDialogOpen(i,A);return}
 if(A==='bell'){osOpenNotifications();return}
 if(A==='savedept'){cloudSaveDepartment(i,a);return}
 if(A==='lounge'){S.m={t:'lounge'};render();return}
 if(A==='all-dates'){S.allDates=!S.allDates;S.allPage=0;render();return}
 if(A==='all-prev'){S.allPage=Math.max(0,(S.allPage||0)-1);render();return}
 if(A==='all-next'){S.allPage=(S.allPage||0)+1;render();return}
 if(A==='zone'){S.zone=i;S.sel=null;render();return}
 if(A==='mhide'){cloudHideMessage(i,a);return}
 if(A==='avatarpick'){const index=Number(i);if(!Number.isInteger(index)||index<0||index>=osDevAvatarThemes.length)return;osSaveAvatarPreset(index);return}
 if(A==='avatarclear'){osClearAvatar();return}
 if(A==='auth-visibility'){const pw=$('#pw');if(pw){pw.type=pw.type==='password'?'text':'password';a.setAttribute('aria-pressed',String(pw.type==='text'));a.setAttribute('aria-label',pw.type==='text'?'Скрыть пароль':'Показать пароль')}return}
 if(A=='login'){cloudLogin();return} if(A=='logout'){S.m={t:'logout'};render();return} if(A==='logout-confirm'){return} if(A==='blk'){osOpenBlockDialog(Number(i));return} if(A=='saveprof'){cloudSaveProfile();return} if(A=='savepw'){cloudSavePassword();return} if(A==='msend'){cloudSendMessage();return} if(A==='dndon'){cloudSetDnd(false);return} if(A==='dndoff'){cloudSetDnd(true);return} if(A==='saveprivacy'){cloudSavePrivacy();return} if(A==='muteuser'){cloudSetMute();return} if(A==='unmuteuser'){cloudSetMute(true,i);return} if(A==='mopen'){cloudOpenMessage(i);return} if(A==='mreply'){const m=DB.msgs.find(x=>x.id===i);if(m){S.rp={to:m.from,subj:(m.subj.startsWith('Re: ')?'':'Re: ')+m.subj};S.mo=i;render()}return} if(A==='cfg'){cloudSaveSettings(a);return} if(['deluser','saveedit','scan','pesave','pedel','reset'].includes(A))return toast('Эта административная функция пока не подключена к облаку и отключена, чтобы не создавать локальные изменения.',1); if(A=='adduser'){cloudCreateUser();return;}
 if(A=='tab'){osDidNavigate=S.v!==i;S.v=i;S.nt=0}else if(A=='fl')S.f=+i;else if(A=='book')return book(+i);else if(A=='cancel')return cancel(i);
 else if(A=='goto'){S.sel=+i;S.f=pl(+i).f;S.v='map';osDidNavigate=true}
 else if(A=='blk'){if(rk()<1)return toast('Недостаточно прав',1);const id=+i,k=DB.blocked.indexOf(id);k<0?DB.blocked.push(id):DB.blocked.splice(k,1);audit((k<0?'Заблокировано ':'Разблокировано ')+nm(pl(id)));save()}
 else if(A=='qr'||A=='edit')S.m={t:A,i:+i};else if(A=='close'){osLogoutAbort();S.m=null;}
 else if(A=='tt'){sim();const b=DB.bk.find(x=>x.id==+i);off=ts(b.d,b.s)-Date.now()}
 else if(A=='scan'){const b=DB.bk.find(x=>x.id==+i),n=now(),a0=ts(b.d,b.s);if(n<a0-9e5||n>a0+DB.cfg.ns*6e4)return toast('Подтверждение доступно за 15 мин до начала и до '+DB.cfg.ns+' мин после. Нажмите «К началу брони».',1);
  b.st='checked';note(b.uid,'Присутствие подтверждено: '+nm(pl(b.pid)));save();S.m=null;toast('✅ '+nm(pl(b.pid))+': бронь подтверждена')}
 else if(A=='saveedit'){const b=DB.bk.find(x=>x.id==+i),s=pm($('#es').value),en0=pm($('#ee').value),en=en0>s?en0:en0+1440,m=validate(b.pid,b.d,s,en,b.uid,b.id);if(m)return toast(m,1);b.s=s;b.e=en;b.rem=0;audit('Изменена бронь №'+b.id);note(b.uid,'Бронь изменена: '+nm(pl(b.pid))+', '+tm(s)+'–'+tm(en));save();S.m=null;toast('Бронь изменена')}
 else if(A=='adduser'){if(rk()<2)return toast('Регистрировать пользователей может только ИТ-специалист',1);const n=$('#un').value.trim(),em=$('#ue').value.trim().toLowerCase(),phs=$('#up').value.trim(),pw=$('#upw').value,dg=phs.replace(/\D/g,'').slice(-10);
 if(!n)return toast('Введите ФИО',1);if(!emOK(em))return toast('Убедитесь в правильности ввода почты',1);if(dg.length<10)return toast('Введите телефон (не менее 10 цифр)',1);if(pw.length<6)return toast('Пароль — не менее 6 символов',1);
 if(DB.users.some(x=>(x.email||'').toLowerCase()==em))return toast('Этот email уже зарегистрирован',1);if(DB.users.some(x=>(x.phone||'').replace(/\D/g,'').slice(-10)==dg))return toast('Этот телефон уже зарегистрирован',1);
 const ro=$('#ur').value;DB.users.push({id:Math.max(...DB.users.map(u=>u.id))+1,name:n,role:ro,dep:$('#ud').value.trim()||'—',email:em,phone:phs,ph:hp(pw)});audit('Зарегистрирован пользователь '+n+' ('+RN[ro]+')');save();toast('Аккаунт создан: '+em)}
 else if(A=='cfg'){if(rk()<2)return;DB.cfg={min:Math.max(15,+$('#c1').value||30),hor:Math.min(90,Math.max(1,+$('#c2').value||14)),ns:Math.min(120,Math.max(5,+$('#c3').value||30))};audit('Изменены параметры правил: '+DB.cfg.min+' мин / '+DB.cfg.hor+' дн. / '+DB.cfg.ns+' мин');save();toast('Параметры сохранены')}
 else if(A=='deluser'){const u0=DB.users.find(x=>x.id==+i);if(rk()<2||+i==S.uid||(u0&&u0.role=='it'))return toast('Учётные записи ИТ-специалистов защищены',1);const u=DB.users.find(x=>x.id==+i);DB.bk.forEach(b=>{if(b.uid==u.id&&ACT.includes(b.st))b.st='cancelled'});DB.users=DB.users.filter(x=>x.id!=u.id);audit('Удалён пользователь '+u.name);save();toast('Пользователь удалён')}
 else if(A=='medit'){if(rk()<2)return toast('Редактировать план может только ИТ-специалист',1);S.edit=!S.edit;S.ec=null;S.dc=0}
 else if(A=='pesave'){
  if(rk()<2||i==='new')return toast('Редактирование доступно только ИТ-специалисту',1);
  const p=pl(+i);if(!p)return;
  const lab=clean($('#pe_l').value),tsl=$('#pe_t').value,tc=$('#pe_tc')?clean($('#pe_tc').value):'',desc=clean($('#pe_d').value),eq=[...document.querySelectorAll('.peq:checked')].map(x=>x.value).concat(clean($('#pe_o').value).split(',').map(x=>x.trim()).filter(Boolean)),t=tc||tsl;
  const up={eq,desc};
  if(p.room){up.name=lab||p.name;up.cap=Math.max(1,Math.min(100,+$('#pe_c').value||p.cap))}
  else{up.t=t;up.label=lab}
  upd(p.id,up);buildP();
  DB.bk.forEach(b=>{if(b.pid==p.id&&ACT.includes(b.st)&&ts(b.d,b.e)>now())note(b.uid,'Параметры места изменены: '+nm(pl(p.id))+'. Проверьте оборудование в «Мои брони»')});
  audit('Изменено: '+nm(pl(p.id)));save();toast('Сохранено')}
 else if(A=='pedel'){if(rk()<2)return toast('Удалять места может только ИТ-специалист',1);const p=pl(+i);if(!p||p.room)return;if(S.dc!=p.id){S.dc=p.id;toast('Нажмите «Подтвердить удаление». Активные брони будут отменены',1)}
  else{DB.bk.forEach(b=>{if(b.pid==p.id&&ACT.includes(b.st)&&ts(b.d,b.e)>now()){b.st='cancelled';note(b.uid,'Бронь отменена: '+nm(p)+' удалено из системы ('+fmtD(b.d)+')')}});
   const n=(DB.pn||[]).find(x=>x.id==p.id);if(n)n.del=1;else{DB.pe=DB.pe||{};DB.pe[p.id]=Object.assign(DB.pe[p.id]||{},{del:1})}
   DB.blocked=DB.blocked.filter(x=>x!=p.id);S.sel=null;S.dc=0;audit('Удалено: '+nm(p));buildP();save();toast('Место удалено')}}
 else if(A=='cm')S.cm=i;
 else if(A=='day'){S.d=i}
 else if(A=='pre'){const q=i.split('-');S.s=+q[0];S.e=+q[1]}
 else if(A=='dur')S.e=S.s+ +i;
 else if(A=='nt'){const n=DB.nt[+i];if(n){n.r=1;S.nt=0;sb.from('office_notifications').update({is_read:true}).eq('id',n.id).then(({error})=>{if(error)console.warn(error);else cloudRefresh()});render()}}
 else if(A=='mopen'){const m=DB.msgs.find(x=>x.id==+i);S.mo=S.mo==m.id?null:m.id;if(m.to==S.uid){m.r=1;save()}}
 else if(A=='mreply'){if(rk()<1)return;const m=DB.msgs.find(x=>x.id==+i);S.rp={to:m.from,subj:(m.subj.startsWith('Re: ')?'':'Re: ')+m.subj}}
 else if(A=='msend'){if(rk()<1)return;const tv=$('#mto').value,to=+tv,ty=$('#mty').value,sj=$('#msj').value.trim(),tx=$('#mtx').value.trim(),r=tv=='all'?{name:'все сотрудники',role:'user'}:DB.users.find(x=>x.id==to);if(!r)return toast('Выберите получателя',1);if(!sj||!tx)return toast('Заполните тему и текст',1);
  if(ty=='Объявление'&&r.role!='user')return toast('Объявления адресованы сотрудникам',1);if(ty=='Указание'&&r.role!='admin')return toast('Указания направляются только администрации',1);if(ty=='Запрос'&&r.role!='it')return toast('Запросы направляются только ИТ-специалистам',1);
  const G=Date.now();(tv=='all'?DB.users.filter(x=>x.role=='user').map(x=>x.id):[to]).forEach(t=>{DB.mid=(DB.mid||2)+1;DB.msgs.unshift({id:DB.mid,from:S.uid,to:t,type:ty,subj:sj,text:tx,at:now(),r:0,g:tv=='all'?G:0});note(t,'Новое сообщение от '+uname(S.uid)+': '+sj)});audit('Сообщение → '+r.name+': '+sj);S.rp=null;save();toast('Сообщение отправлено')}
 else if(A=='saveprof'){const u=DB.users.find(x=>x.id==S.uid),n=$('#an').value.trim(),em=$('#ae').value.trim().toLowerCase(),phs=$('#ap').value.trim(),dg=phs.replace(/\D/g,'').slice(-10),tg=$('#at').value.trim();
  if(!n)return toast('Введите ФИО',1);if(!emOK(em))return toast('Убедитесь в правильности ввода почты',1);if(dg.length<10)return toast('Введите телефон полностью: +7 747 584 12 30',1);if(tg&&!/^@?[A-Za-z0-9_]{5,32}$/.test(tg))return toast('Telegram: от 5 символов, латиница, цифры и _',1);
  if(DB.users.some(x=>x.id!=u.id&&(x.email||'').toLowerCase()==em))return toast('Этот email уже используется',1);if(DB.users.some(x=>x.id!=u.id&&(x.phone||'').replace(/\D/g,'').slice(-10)==dg))return toast('Этот телефон уже используется',1);
  Object.assign(u,{name:n,email:em,phone:phs,tg:tg?(tg[0]=='@'?tg:'@'+tg):''});audit('Обновлён профиль');save();toast('Профиль сохранён')}
 else if(A=='savepw'){const u=DB.users.find(x=>x.id==S.uid),o=$('#pwo').value,n=$('#pwn').value,r=$('#pwr').value;if(u.ph!=hp(o))return toast('Текущий пароль указан неверно',1);if(n.length<6)return toast('Новый пароль — не менее 6 символов',1);if(n!=r)return toast('Пароли не совпадают',1);if(n==o)return toast('Новый пароль должен отличаться от текущего',1);u.ph=hp(n);audit('Изменён пароль');save();toast('Пароль изменён')}
 else if(A=='fill'){const[a,b]=i.split('|');$('#lg').value=a;$('#pw').value=b;return}
 else if(A=='login'){if(S.lock&&Date.now()<S.lock)return toast('Слишком много попыток. Подождите '+Math.ceil((S.lock-Date.now())/1000)+' с',1);
  const k=$('#lg').value.trim(),pw=$('#pw').value,kk=k.includes('@')?k.toLowerCase():k.replace(/\D/g,'').slice(-10);
  const u=k&&DB.users.find(x=>x.ph==hp(pw)&&(k.includes('@')?(x.email||'').toLowerCase()==kk:kk.length>=10&&(x.phone||'').replace(/\D/g,'').slice(-10)==kk));
  if(!u){S.fail=(S.fail||0)+1;audit('Неудачная попытка входа: '+(k||'—'));save();if(S.fail>=3){S.lock=Date.now()+3e4;S.fail=0;return toast('3 неверные попытки. Вход заблокирован на 30 секунд',1)}return toast('Неверный логин или пароль',1)}
  S.uid=u.id;S.fail=0;S.v='map';S.sel=null;S.nt=0;audit('Вход в систему');save();try{localStorage.setItem('officespace_sess',u.id)}catch(x){}toast('Добро пожаловать, '+u.name)}
 else if(A=='logout'){audit('Выход из системы');save();S.uid=0;S.m=null;S.nt=0;try{localStorage.removeItem('officespace_sess')}catch(x){}}
 else if(A=='t1'){sim();off+=36e5}else if(A=='t24'){sim();off+=864e5}else if(A=='t0'){if(SIM){DB=JSON.parse(SIM);SIM=null}off=0;toast('Реальное время и данные восстановлены')}else if(A=='help')S.m={t:'help'};
 else if(A=='bell'){S.nt=!S.nt;render()}
 else if(A=='theme'){const r=document.documentElement;let t=r.dataset.theme||'dark';r.dataset.theme=t==='dark'?'light':'dark';try{localStorage.setItem('officespace_theme',r.dataset.theme)}catch(e){}}
 else if(A=='reset'){if(rk()<2)return;try{localStorage.removeItem(KEY)}catch(x){}seed();off=0;SIM=null;save()}
 render();if(osDidNavigate){osDidNavigate=false;osScrollTop()} });
document.addEventListener('change',e=>{const t=e.target,id=t.id;if(!id)return;
 if(id=='usr'){S.uid=+t.value;S.sel=null;S.nt=0}else if(id=='cd'){S.d=t.value||S.d;S.allPage=0;}else if(id=='cs'){const du=S.e-S.s;S.s=+t.value;S.e=S.s+Math.max(du,DB.cfg.min)}else if(id=='ce')S.e=+t.value;
 else if(id.startsWith('rl_')){if(rk()<2)return;const u=DB.users.find(x=>x.id==id.slice(3));if(!u||u.id==S.uid||u.role=='it'){toast('Нельзя менять собственную роль или роль ИТ-специалиста',1);render();return}sb.rpc('set_user_role',{target_user:u.id,new_role:t.value}).then(({error})=>{if(error)toast(cloudError(error),1);else cloudRefresh()})}else if(id=='qfloor')S.q.floor=t.value;else if(id=='qt')S.q.t=t.value;else if(id=='qe')S.q.eq=t.value;else if(id=='qn')S.q.n=+t.value;else if(id=='qq')S.q.quiet=t.checked;else return;render()});
DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};
// Проверку логина выполняем после нормализации почты, не до неё.
document.addEventListener('input',e=>{
 if(e.target.id==='pw')osAuthLoginError('');
});
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&(e.target.id=='pw'||e.target.id=='lg')){const b=document.querySelector('[data-a="login"]');if(b)b.click()}});
const chk=(t,force)=>{const h=t.parentElement.querySelector('.eh');if(!h)return;const v=t.value,dom=v.split('@')[1]||'';h.style.display=v&&v.includes('@')&&(force||dom.includes('.'))&&!emOK(v)?'block':'none'};
document.addEventListener('input',e=>{const t=e.target,id=t.id;if(!id||t.tagName!='INPUT')return;let v=t.value;
 if(id==='lg'){
  // Убираем посторонние символы и обрезаем лишний ввод после известного
  // окончания домена (.com, .ru, .kz и др.) перед проверкой формата.
  v=femail(v);
  if(t.value!==v)t.value=v;
  osAuthEmailHint(false);
  osAuthLoginError('');
  return;
 }
 if(t.classList.contains('ph'))v=mph(v);else if(t.classList.contains('em'))v=femail(v);else return;
 if(v!==t.value)t.value=v;chk(t,false)});
document.addEventListener('focusout',e=>{const t=e.target;if(t.tagName=='INPUT'&&(t.classList.contains('em')||t.id=='lg'))chk(t,true)});
document.addEventListener('focusout',e=>{if(e.target.id==='lg')osAuthEmailHint(true)},true);
new MutationObserver(()=>{const e=document.querySelector('.dc.on');if(e){const p=e.parentElement;p.scrollLeft=e.offsetLeft-p.clientWidth/2+e.offsetWidth/2}}).observe($('#app'),{childList:true});
cloudBoot();setInterval(()=>{if(sb&&cloudUser&&!S.m)cloudRefresh()},15000);
// Cloud avatars: validated file is uploaded to the user's private Storage folder.
document.addEventListener('change',async(e)=>{if(e.target.id!=='osAvatarUpload')return;const f=e.target.files?.[0];if(f)await osUploadAvatar(f)});


// OfficeSpace: accessible centered calendar with manual date entry.
// No database changes; date selection uses the existing S.d and render() path.
const osDateFmt=d=>d.slice(8,10)+'.'+d.slice(5,7)+'.'+d.slice(0,4);
let osCalendarMonth=null;
let osCalendarFocus=null;
let osCalendarDraft=null; // provisional date, applied to S.d only on confirmation
const osDateBounds=()=>{
 const start=new Date(now());start.setHours(0,0,0,0);
 const end=new Date(start);end.setDate(end.getDate()+Number(DB.cfg.hor||14));
 return {start:ds(start),end:ds(end)};
};
function osDateParse(value){
 const s=String(value||'').trim();
 const m=s.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
 const iso=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
 let y,mo,d;
 if(m){d=+m[1];mo=+m[2];y=+m[3]}
 else if(iso){y=+iso[1];mo=+iso[2];d=+iso[3]}
 else return null;
 if(y<1900||y>2200||mo<1||mo>12||d<1||d>31)return null;
 const chk=new Date(y,mo-1,d);
 if(chk.getFullYear()!==y||chk.getMonth()!==mo-1||chk.getDate()!==d)return null;
 return ds(chk);
}
// Range of selectable months and years is derived from the IT-managed booking horizon.
function osCalendarAvailableMonths(){
 const {start,end}=osDateBounds();
 const a=new Date(start+'T12:00:00'),b=new Date(end+'T12:00:00');
 const months=[];
 for(let y=a.getFullYear(),m=a.getMonth();y<b.getFullYear()||(y===b.getFullYear()&&m<=b.getMonth());){
  const d=new Date(y,m,1);
  months.push({year:y,month:m,code:ds(d).slice(0,7),label:d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})});
  m++;if(m===12){m=0;y++}
 }
 return months;
}
function osCalendarManualError(raw){
 const digits=String(raw||'').replace(/\D/g,'').slice(0,8);
 if(!digits)return '';
 const {start,end}=osDateBounds();
 const months=osCalendarAvailableMonths();
 const allowed=months.map(x=>x.code);
 if(digits.length>=4){
  const mm=Number(digits.slice(2,4));
  if(mm<1||mm>12)return 'Месяц должен быть от 01 до 12';
  if(!months.some(x=>x.month+1===mm))return 'Этот месяц недоступен. Разрешено: '+allowed.join(', ');
 }
 if(digits.length>=5){
  const prefix=digits.slice(4);
  if(!months.some(x=>String(x.year).startsWith(prefix)))return 'Год должен соответствовать диапазону: '+start.slice(0,4)+'–'+end.slice(0,4);
 }
 if(digits.length===8){
  const iso=osDateParse(osMaskDate(digits));
  if(!iso)return 'Некорректная дата';
  if(iso<start||iso>end)return 'Дата вне диапазона: '+osDateFmt(start)+' — '+osDateFmt(end);
 }
 return '';
}
function osCalendarClose(){
 document.getElementById('os-calendar-overlay')?.remove();
 if(osCalendarFocus&&document.contains(osCalendarFocus))osCalendarFocus.focus({preventScroll:true});
 osCalendarFocus=null;
 osCalendarDraft=null;
}
function osCalendarDraw(){
 const overlay=document.getElementById('os-calendar-overlay');if(!overlay)return;
 const {start,end}=osDateBounds();
 const first=new Date(osCalendarMonth.getFullYear(),osCalendarMonth.getMonth(),1);
 const last=new Date(first.getFullYear(),first.getMonth()+1,0);
 const pad=(first.getDay()+6)%7;
 const heading=first.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});
 const selectableMonths=osCalendarAvailableMonths();
 const input=overlay.querySelector('#os-calendar-manual');
 const currentText=input?.value??(osCalendarDraft?osDateFmt(osCalendarDraft):'');
 let cells='';
 for(let k=0;k<Math.ceil((pad+last.getDate())/7)*7;k++){
  const date=new Date(first.getFullYear(),first.getMonth(),1-pad+k);
  const iso=ds(date),allowed=iso>=start&&iso<=end;
  cells+=`<button type="button" class="os-cal-day${iso===osCalendarDraft?' selected':''}${iso===ds(new Date(now()))?' today':''}${date.getMonth()!==first.getMonth()?' outside':''}" data-picker="day" data-date="${iso}" ${allowed?'':'disabled'} aria-label="${date.toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})}" ${iso===osCalendarDraft?'aria-pressed="true"':'aria-pressed="false"'}>${date.getDate()}</button>`;
 }
 const prev=new Date(first.getFullYear(),first.getMonth()-1,1),next=new Date(first.getFullYear(),first.getMonth()+1,1);
 const monthEnd=new Date(prev.getFullYear(),prev.getMonth()+1,0);
 overlay.querySelector('.os-calendar-inner').innerHTML=`<div class="os-cal-header"><div><span class="os-cal-eyebrow">ВЫБОР ДАТЫ</span><h2 id="os-calendar-title">${heading[0].toUpperCase()+heading.slice(1)}</h2></div><button type="button" class="os-cal-x" data-picker="close" aria-label="Закрыть">×</button></div>
 <div class="os-cal-nav"><button type="button" data-picker="prev" ${ds(monthEnd)<start?'disabled':''} aria-label="Предыдущий месяц">‹</button><span>${heading}</span><button type="button" data-picker="next" ${ds(next)>end?'disabled':''} aria-label="Следующий месяц">›</button></div>
 <div class="os-cal-period"><label for="os-cal-period">Доступные месяц и год</label><select id="os-cal-period" aria-label="Месяц и год в разрешённом диапазоне">${selectableMonths.map(x=>`<option value="${x.code}" ${x.year===first.getFullYear()&&x.month===first.getMonth()?'selected':''}>${x.label}</option>`).join('')}</select></div>
 <div class="os-cal-week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div>
 <div class="os-cal-days">${cells}</div>
 <div class="os-cal-preview" id="os-cal-preview" aria-live="polite">${osCalendarDraft?`Выбрана дата: <strong>${osDateFmt(osCalendarDraft)}</strong> · нажмите «Выбрать дату» для подтверждения`:'Выберите дату для подтверждения'}</div>
 <div class="os-cal-manual"><label for="os-calendar-manual">Или введите дату вручную</label><input id="os-calendar-manual" type="text" inputmode="numeric" autocomplete="off" value="${currentText.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}" placeholder="ДД.ММ.ГГГГ" maxlength="10" aria-describedby="os-cal-range os-cal-error"/><small id="os-cal-range">Доступно: ${osDateFmt(start)} — ${osDateFmt(end)}</small><div id="os-cal-error" role="status"></div></div>
 <div class="os-cal-actions"><button type="button" data-picker="today" class="os-cal-subtle">Сегодня</button><button type="button" data-picker="cancel" class="os-cal-subtle">Отмена</button><button type="button" data-picker="apply" class="os-cal-apply">Выбрать дату</button></div>`;
}
function osCalendarOpen(){
 osCalendarClose();osCalendarFocus=document.activeElement;
 osCalendarDraft=S.d;
 const current=new Date(S.d+'T12:00:00');osCalendarMonth=new Date(current.getFullYear(),current.getMonth(),1);
 const overlay=document.createElement('div');overlay.id='os-calendar-overlay';overlay.className='os-calendar-overlay';
 overlay.innerHTML='<div class="os-calendar-inner" role="dialog" aria-modal="true" aria-labelledby="os-calendar-title"></div>';
 document.body.appendChild(overlay);osCalendarDraw();
 overlay.querySelector('#os-calendar-manual')?.focus({preventScroll:true});
}
function osCalendarApply(value){
 const d=osDateParse(value),{start,end}=osDateBounds();
 const err=document.getElementById('os-cal-error');
 const monthYearError=osCalendarManualError(value);
 if(monthYearError){if(err)err.textContent=monthYearError;return}
 if(!d){if(err)err.textContent='Введите дату в формате ДД.ММ.ГГГГ';return}
 if(d<start||d>end){if(err)err.textContent='Выберите дату в доступном диапазоне';return}
 S.d=d;osCalendarClose();render();
}
function osCalendarUpdatePreview(){
 const overlay=document.getElementById('os-calendar-overlay');if(!overlay)return;
 overlay.querySelectorAll('.os-cal-day').forEach(button=>{
  const selected=button.dataset.date===osCalendarDraft;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
 const preview=overlay.querySelector('#os-cal-preview');
 if(preview)preview.textContent=osCalendarDraft?'Выбрана дата: '+osDateFmt(osCalendarDraft)+' · нажмите «Выбрать дату» для подтверждения':'Выберите дату для подтверждения';
}
document.addEventListener('click',e=>{
 const target=e.target.closest('[data-picker]');
 if(!target){if(e.target.id==='os-calendar-overlay')osCalendarClose();return}
 const action=target.dataset.picker;
 if(action==='open')return osCalendarOpen();
 if(action==='close'||action==='cancel')return osCalendarClose();
 if(action==='apply')return osCalendarApply(document.getElementById('os-calendar-manual')?.value);
 if(action==='day'){
  osCalendarDraft=target.dataset.date;
  const manual=document.getElementById('os-calendar-manual');
  if(manual)manual.value=osDateFmt(osCalendarDraft);
  return osCalendarDraw();
 }
 if(action==='today'){
  osCalendarDraft=osDateBounds().start;
  const day=new Date(osCalendarDraft+'T12:00:00');
  osCalendarMonth=new Date(day.getFullYear(),day.getMonth(),1);
  const manual=document.getElementById('os-calendar-manual');
  if(manual)manual.value=osDateFmt(osCalendarDraft);
  return osCalendarDraw();
 }
 if(action==='prev'||action==='next'){
  osCalendarMonth=new Date(osCalendarMonth.getFullYear(),osCalendarMonth.getMonth()+(action==='next'?1:-1),1);
  return osCalendarDraw();
 }
});
document.addEventListener('change',e=>{
 if(e.target.id!=='os-cal-period')return;
 const chosen=osCalendarAvailableMonths().find(x=>x.code===e.target.value);
 if(!chosen)return;
 osCalendarMonth=new Date(chosen.year,chosen.month,1);
 osCalendarDraw();
});
// Automatic DD.MM.YYYY mask for the calendar's manual date field.
const osMaskDate=value=>{
 const digits=String(value||'').replace(/\D/g,'').slice(0,8);
 return [digits.slice(0,2),digits.slice(2,4),digits.slice(4,8)].filter(Boolean).join('.');
};
document.addEventListener('input',e=>{
 const input=e.target;
 if(input?.id!=='os-calendar-manual')return;
 const before=input.value;
 const digitsBefore=before.slice(0,input.selectionStart??before.length).replace(/\D/g,'').length;
 const formatted=osMaskDate(before);
 input.value=formatted;
 let count=0,pos=formatted.length;
 if(digitsBefore===0)pos=0;
 else for(let i=0;i<formatted.length;i++){
  if(/\d/.test(formatted[i]))count++;
  if(count===digitsBefore){pos=i+1;break}
 }
 input.setSelectionRange(pos,pos);
 const error=document.getElementById('os-cal-error');
 if(error)error.textContent=osCalendarManualError(formatted);
 const parsed=osDateParse(formatted),{start,end}=osDateBounds();
 osCalendarDraft=parsed&&parsed>=start&&parsed<=end?parsed:null;
 osCalendarUpdatePreview();
});
document.addEventListener('keydown',e=>{
 const input=e.target;
 if(input?.id!=='os-calendar-manual'||e.key!=='Backspace')return;
 if(input.selectionStart!==input.selectionEnd)return;
 const pos=input.selectionStart;
 if(pos>0&&input.value[pos-1]==='.'){
  e.preventDefault();
  const digits=input.value.replace(/\D/g,'').split('');
  const previous=input.value.slice(0,pos).replace(/\D/g,'').length;
  if(previous>0)digits.splice(previous-1,1);
  input.value=osMaskDate(digits.join(''));
  const caret=previous<=1?0:previous===2?1:previous===3?3:previous===4?4:Math.min(pos-1,input.value.length);
  input.setSelectionRange(caret,caret);
  const error=document.getElementById('os-cal-error');
  if(error)error.textContent=osCalendarManualError(input.value);
  const parsed=osDateParse(input.value),{start,end}=osDateBounds();
  osCalendarDraft=parsed&&parsed>=start&&parsed<=end?parsed:null;
  osCalendarUpdatePreview();
 }
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&document.getElementById('os-calendar-overlay')){e.preventDefault();osCalendarClose()}
 if(e.key==='Enter'&&e.target.id==='os-calendar-manual'){e.preventDefault();osCalendarApply(e.target.value)}
});

// Keyboard accessibility for the relaxation-area hotspot.
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.floor-lounge-action')){e.preventDefault();S.m={t:'lounge'};render();}});

// Keyboard access to the custom file-picker label.
document.addEventListener('keydown',e=>{if(e.target.matches('label.os-photo-picker')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();document.getElementById('osAvatarUpload')?.click()}});

// Escape always closes the block dialog, even if a previous request failed.
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&S.m?.t==='block'){S.m=null;render()}
});