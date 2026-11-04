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
const S={uid:0,v:'map',f:1,d:ds(new Date()),s:540,e:1080,sel:null,q:{t:'',quiet:false,eq:'',n:1},m:null,nt:0};
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
 const bg=`<defs><pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--bd)" stroke-width=".4" opacity=".35"/></pattern></defs><rect x="0" y="0" width="1000" height="630" rx="20" fill="var(--floor-bg)"/><rect x="0" y="0" width="1000" height="630" rx="20" fill="url(#floor-grid)"/>${zones}<text class="floor-section" x="22" y="457">ПЕРЕГОВОРНЫЕ КОМНАТЫ</text><rect class="floor-lounge" x="16" y="577" width="968" height="42" rx="12"/><text class="floor-lounge-text" x="35" y="603">☕  Зона отдыха  ·  Кофе, диваны и место для перерыва</text>`;
 const desks=P.filter(p=>p.f==S.f).map(p=>{
  const k=st(p.id).k, selected=S.sel==p.id, label=String(p.room?(p.name||'Переговорная'):p.label||p.id).replace(/[<>&"']/g,'');
  if(p.room)return`<g class="pl floor-room s-${k}${selected?' sel':''}" data-id="${p.id}" role="button" tabindex="0" aria-label="${label}"><title>${label}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="12"/><circle class="floor-room-icon" cx="${p.x+29}" cy="${p.y+p.h/2}" r="16"/><text class="floor-room-glyph" x="${p.x+29}" y="${p.y+p.h/2+5}" text-anchor="middle">▣</text><text class="floor-room-name" x="${p.x+54}" y="${p.y+p.h/2-3}">${label}</text><text class="floor-room-meta" x="${p.x+54}" y="${p.y+p.h/2+16}">${p.cap||6} мест · ${k==='free'?'Свободна':k==='busy'?'Занята':k==='me'?'Ваша бронь':'Недоступна'}</text></g>`;
  const icon=p.t==='Два монитора'?'▣':p.t.startsWith('Для')?'♿':'▤';
  return`<g class="pl floor-desk s-${k}${selected?' sel':''}" data-id="${p.id}" role="button" tabindex="0" aria-label="Рабочее место ${label}"><title>Место ${label} · ${p.zone} · ${k==='free'?'Свободно':k==='busy'?'Занято':k==='me'?'Ваша бронь':'Заблокировано'}</title><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="9"/><rect class="floor-desk-indicator" x="${p.x+7}" y="${p.y+8}" width="3" height="${p.h-16}" rx="2"/><text class="floor-desk-icon" x="${p.x+18}" y="${p.y+p.h/2+4}">${icon}</text><text class="floor-desk-number" x="${p.x+p.w-12}" y="${p.y+p.h/2+4}" text-anchor="end">${label}</text></g>`;
 }).join('');
 return`<svg class="map floor-map" viewBox="0 0 1000 630" role="group" aria-label="Интерактивная карта ${S.f} этажа">${bg}${desks}${S.edit&&rk()>=1?emptyCells():''}</svg>`;
}
const EQL=['монитор','2 монитора','док-станция','регулируемый стол','проектор','экран','маркерная доска','веб-камера','настольная лампа','ПК'];
const clean=s=>String(s||'').replace(/[<>"&]/g,'').trim();
const TYPES=()=>[...new Set(['Обычное','Два монитора','Ноутбук','Тихая зона','Командная работа','Для особых потребностей',...P.filter(p=>!p.room).map(p=>p.t)])];
function emptyCells(){let h='';const occ=new Set(P.filter(p=>!p.room&&p.f==S.f).map(p=>p.r+'-'+p.c));
 for(let r=0;r<7;r++)for(let c=0;c<10;c++){if(occ.has(r+'-'+c))continue;const sel=S.ec&&S.ec.f==S.f&&S.ec.r==r&&S.ec.c==c;
  h+=`<g class="ec ${sel?'sel':''}" data-cell="${S.f}-${r}-${c}"><rect x="${30+c*95}" y="${44+r*58}" width="80" height="46" rx="9"/><text x="${70+c*95}" y="${74+r*58}">+</text></g>`}return h}
function editPanel(){const ec=S.ec,p=!ec&&S.sel?pl(S.sel):null;
 if(!ec&&!p)return'<h2>✏️ Режим редактирования</h2><div class="hint">Нажмите на место, чтобы изменить его, или на ячейку «+», чтобы добавить новое рабочее место.</div>';
 const nw=!!ec,room=!nw&&p.room,cur=nw?'Обычное':p.t,ty=room?['Переговорная']:TYPES(),cu=(nw?[]:p.eq).map(x=>x.toLowerCase()),oth=(nw?[]:p.eq).filter(x=>!EQL.includes(x.toLowerCase())),zn=nw?ZN[ec.c<3?0:ec.c<7?1:2]:p.zone;
 return`<h2>${nw?'➕ Новое рабочее место':'✏️ '+nm(p)}</h2><div class="row"><span>Расположение</span><b>Этаж ${nw?ec.f:p.f} · ${zn}</b></div>
<div style="display:flex;flex-direction:column;gap:14px;margin-top:14px">
<label class="fl2">${room?'Название комнаты':'Номер / название'}<input id="pe_l" value="${nw?'':room?p.name:(p.label||'')}" placeholder="${room?'Переговорная №1':'по умолчанию — номер места'}"></label>
<label class="fl2">Тип<select id="pe_t">${ty.map(t=>`<option ${t==cur?'selected':''}>${t}</option>`).join('')}</select></label>
${room?`<label class="fl2">Вместимость (человек)<input id="pe_c" type="number" min="1" max="100" value="${p.cap}"></label>`:'<label class="fl2">Или свой тип<input id="pe_tc" placeholder="например, Стойка для звонков"></label>'}
<div><div class="cl">Оборудование</div><div class="chs">${EQL.map(e=>`<label class="ck"><input type="checkbox" class="peq" value="${e}" ${cu.includes(e)?'checked':''}>${e}</label>`).join('')}</div></div>
<label class="fl2">Другое оборудование (через запятую)<input id="pe_o" value="${oth.join(', ')}"></label>
<label class="fl2">Примечание<input id="pe_d" value="${nw?'':(p.desc||'')}" placeholder="например, у окна"></label>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-a="pesave" data-i="${nw?'new':p.id}">${nw?'Создать место':'Сохранить'}</button>${nw||room?'':`<button class="btn red" data-a="pedel" data-i="${p.id}">${S.dc==p.id?'Подтвердить удаление':'Удалить'}</button>`}</div></div>`}
function panel(){if(S.edit&&rk()>=1)return editPanel();const p=S.sel&&pl(S.sel);if(!p)return'<div class="hint">👆 Нажмите на рабочее место или переговорную на плане</div>';const s=st(p.id),adm=rk()>=1;
 const lab={free:'Свободно',busy:'Занято',blk:'Заблокировано',me:'Ваша бронь'}[s.k];
 return`<h2>${nm(p)}</h2><div class="row"><span>Этаж</span><b>${p.f}</b></div><div class="row"><span>Зона</span><b>${p.zone}</b></div><div class="row"><span>Тип</span><b>${p.t}</b></div><div class="row"><span>Оборудование</span><b>${p.eq.join(', ')||'—'}${p.room?' · '+p.cap+' мест':''}</b></div>${p.desc?`<div class="row"><span>Примечание</span><b>${p.desc}</b></div>`:''}<div class="row"><span>Дата</span><b>${fmtD(S.d)}</b></div><div class="row"><span>Время</span><b>${tm(S.s)}–${tm(S.e)}</b></div><div class="row"><span>Статус</span><b>${lab}${adm&&s.b?' · '+uname(s.b.uid):''}</b></div>${rk()>1?`<div class="row"><span>QR-токен (ИТ)</span><b>OS-${p.id}</b></div>`:''}
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" data-a="book" data-i="${p.id}" ${s.k!='free'?'disabled':''}>Забронировать</button>${adm?`<button class="btn sec" data-a="blk" data-i="${p.id}">${s.k=='blk'?'Разблокировать':'Заблокировать'}</button>`:''}${adm&&s.b?`<button class="btn red" data-a="cancel" data-i="${s.b.id}">Отменить бронь</button>`:''}</div>`}
const wpl=()=>P.filter(p=>!p.room&&!DB.blocked.includes(p.id));
function ctrlOld(dateOnly){return`<div class="card ctrl"><label>Дата<input type="date" id="cd" value="${S.d}"></label>${dateOnly?'':`<label>Начало<input type="time" id="cs" step="900" value="${tm(S.s)}"></label><label>Конец<input type="time" id="ce" step="900" value="${tm(S.e)}"></label>`}<span class="mu">${!dateOnly&&S.e>1440?'<b>Ночная бронь: до '+tm(S.e)+' следующего дня.</b> ':''}Правила: от ${DB.cfg.min} мин, до ${DB.cfg.hor} дн. вперёд, без пересечений</span></div>`}
function vMap(){
 const floorPlaces=P.filter(p=>p.f==S.f&&!p.room),freeOnFloor=floorPlaces.filter(p=>st(p.id).k==='free').length;
 const free=f=>P.filter(p=>p.f==f&&!p.room&&st(p.id).k==='free').length;
 const all=wpl(),fr=all.filter(p=>st(p.id).k==='free').length;
 return`<section class="floor-dashboard">
 <div class="floor-summary"><div><span class="floor-eyebrow">ПЛАНИРОВАНИЕ ПРОСТРАНСТВА</span><h2>Карта рабочих мест</h2><p>Выберите этаж, время и свободное рабочее место на плане.</p></div><div class="floor-summary-stats"><div><strong>${freeOnFloor}</strong><span>свободно на этаже</span></div><div><strong>${floorPlaces.length-freeOnFloor}</strong><span>занято или недоступно</span></div></div></div>
 <div class="floor-filters">${ctrl()}</div>
 <div class="floor-workspace"><div class="floor-plan-card"><div class="floor-toolbar"><div class="floor-tabs">${[1,2,3].map(f=>`<button class="floor-tab ${S.f==f?'active':''}" data-a="fl" data-i="${f}"><span>0${f} этаж</span><small>${free(f)} свободно</small></button>`).join('')}</div>${rk()>=1?`<button class="btn sec floor-edit" data-a="medit">${S.edit?'✓ Завершить редактирование':'✎ Редактировать план'}</button>`:''}</div><div class="floor-canvas-scroll"><div class="floor-canvas">${mapSVG()}</div></div><div class="floor-legend"><span><i class="floor-dot free"></i>Свободно</span><span><i class="floor-dot busy"></i>Занято</span><span><i class="floor-dot me"></i>Моя бронь</span><span><i class="floor-dot blk"></i>Недоступно</span><span class="floor-legend-help">Нажмите на место для подробностей</span></div></div><aside class="floor-details"><div class="floor-details-top"><span class="floor-eyebrow">ИНФОРМАЦИЯ О МЕСТЕ</span><span class="floor-details-icon">⌘</span></div>${panel()}</aside></div>${guide()}</section>`;
}
function results(){const q=S.q;let M=P.filter(p=>(q.t=='Переговорная')==!!p.room&&st(p.id).k=='free'&&(!q.t||p.t==q.t)&&(!q.quiet||p.zone==ZN[1])&&(!q.eq||p.eq.some(e=>e.includes(q.eq))));
 if(q.n>1){const key=new Set(M.filter(p=>!p.room).map(p=>p.f+'-'+p.r+'-'+p.c));M=M.filter(p=>{if(p.room)return false;let n=1;for(let c=p.c-1;c>=0&&key.has(p.f+'-'+p.r+'-'+c);c--)n++;for(let c=p.c+1;c<10&&key.has(p.f+'-'+p.r+'-'+c);c++)n++;return n>=q.n})}return M}
function vSearch(){const q=S.q,R=results(),o=(a,v)=>a.map(x=>`<option ${x==v?'selected':''}>${x}</option>`).join('');
 return`${ctrl()}<div class="card ctrl"><label>Тип места<select id="qt"><option value="">Любой</option>${o([...new Set(P.map(p=>p.t))],q.t)}</select></label><label>Оборудование<select id="qe"><option value="">Любое</option>${o([...new Set(P.flatMap(p=>p.eq.map(e=>e.toLowerCase())))],q.eq)}</select></label><label>Мест рядом<select id="qn">${[1,2,3,4].map(n=>`<option ${n==q.n?'selected':''}>${n}</option>`).join('')}</select></label><label style="flex-direction:row;align-items:center;gap:6px"><input type="checkbox" id="qq" ${q.quiet?'checked':''}> только тихая зона</label></div>
 <div class="card"><h2>Подходящие варианты: ${R.length}</h2>${R.slice(0,30).map(p=>`<div class="it"><div><b>${nm(p)}</b> · этаж ${p.f} · ${p.zone}<br><small>${p.t} — ${p.eq.join(', ')}</small></div><div style="display:flex;gap:6px"><button class="btn sec" data-a="goto" data-i="${p.id}">На карте</button><button class="btn" data-a="book" data-i="${p.id}">Забронировать</button></div></div>`).join('')||'<div class="hint">Ничего не найдено — измените условия</div>'}${R.length>30?`<p class="mu">…и ещё ${R.length-30}</p>`:''}</div>`}
function vMine(){const L=DB.bk.filter(b=>b.uid==S.uid).sort((a,b)=>ts(b.d,b.s)-ts(a.d,a.s)),up=L.filter(b=>ACT.includes(b.st)&&ts(b.d,b.e)>=now()).reverse(),hi=L.filter(b=>!up.includes(b)).slice(0,25);
 const it=(b,a)=>{const p=pl(b.pid);return`<div class="it"><div><b>${nm(p)}</b> · ${fmtD(b.d)}, ${tm(b.s)}–${tm(b.e)}<br><small>Этаж ${p.f} · ${p.zone} · ${p.eq.join(', ')}</small></div><div style="display:flex;gap:6px;align-items:center"><span class="chip ${b.st}">${SN[b.st]}</span>${a&&b.st=='confirmed'?`<button class="btn sec" data-a="qr" data-i="${b.id}">📷 QR</button><button class="btn sec" data-a="edit" data-i="${b.id}">Изменить</button><button class="btn red" data-a="cancel" data-i="${b.id}">Отменить</button>`:''}</div></div>`};
 return`<div class="card"><h2>Предстоящие</h2>${up.map(b=>it(b,1)).join('')||'<div class="hint">Нет предстоящих броней</div>'}</div><div class="card"><h2>История</h2>${hi.map(b=>it(b,0)).join('')||'<div class="hint">Пока пусто</div>'}</div>`}
function vAll(){const L=DB.bk.filter(b=>b.d==S.d).sort((a,b)=>(ACT.includes(b.st)-ACT.includes(a.st))||a.pid-b.pid);
 return`${ctrl(1)}<div class="card"><h2>Все бронирования на ${fmtD(S.d)}: ${L.length}</h2><div style="overflow-x:auto"><table><tr><th>Ресурс</th><th>Сотрудник</th><th>Время</th><th>Статус</th><th></th></tr>${L.slice(0,70).map(b=>`<tr><td>${nm(pl(b.pid))}</td><td>${uname(b.uid)}</td><td>${tm(b.s)}–${tm(b.e)}</td><td><span class="chip ${b.st}">${SN[b.st]}</span></td><td>${b.st=='confirmed'?`<button class="btn red" data-a="cancel" data-i="${b.id}">Отменить</button>`:''}</td></tr>`).join('')}</table></div>${L.length>70?`<p class="mu">Показано 70 из ${L.length}</p>`:''}</div>`}
function vStats(){const today=ds(new Date(now())),dc={},zc={},pc={};let ca=0,ns=0,tot=0;
 DB.bk.forEach(b=>{if(!pl(b.pid)||pl(b.pid).room)return;tot++;if(b.st=='cancelled')ca++;if(b.st=='noshow')ns++;if(OK.includes(b.st)){(dc[b.d]=dc[b.d]||new Set()).add(b.pid);const z=pl(b.pid).zone;zc[z]=(zc[z]||0)+1;pc[b.pid]=(pc[b.pid]||0)+1}});
 const av=wpl().length,wd=[[],[],[],[],[],[],[]];Object.entries(dc).forEach(([d,s])=>{if(d<=today)wd[(new Date(d+'T00:00').getDay()+6)%7].push(s.size/av*100)});
 const avg=wd.map(a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0),bk=dc[today]?dc[today].size:0,top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0]||['—',0],D=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],ti=(new Date(now()).getDay()+6)%7;
 return`<div class="kpis"><div class="kpi"><b>${P.filter(p=>!p.room).length}</b><span>всего рабочих мест</span></div><div class="kpi"><b>${bk}</b><span>забронировано сегодня</span></div><div class="kpi"><b>${av-bk}</b><span>свободно</span></div><div class="kpi"><b>${Math.round(bk/av*100)}%</b><span>загрузка офиса</span></div></div>
 <div class="mw"><div class="card"><h2>Использование офиса по дням недели</h2>${avg.map((v,i)=>`<div class="bar"><span ${i==ti?'style="font-weight:800"':''}>${D[i]}</span><div><i style="width:${v}%"></i></div><b>${v}%</b></div>`).join('')}</div><div class="card"><h2>Показатели</h2><div class="row"><span>Популярная зона</span><b>${top(zc)[0]}</b></div><div class="row"><span>Популярное место</span><b>№${top(pc)[0]} (${top(pc)[1]} броней)</b></div><div class="row"><span>Отмен</span><b>${ca}</b></div><div class="row"><span>Не использовано</span><b>${ns} (${Math.round(ns/tot*100)}%)</b></div><div class="row"><span>Заблокировано мест</span><b>${DB.blocked.length}</b></div></div></div>`}
function vStaff(){return`${muteManagement()}<div class="card"><h2>Сотрудники и отделы</h2><table><tr><th>ФИО</th><th>Отдел</th>${rk()>1?'<th>Email</th><th>Телефон</th>':''}<th>Роль</th><th></th></tr>${DB.users.map(u=>`<tr><td>${u.name}</td><td>${u.dep}</td>${rk()>1?`<td>${u.email||'—'}</td><td>${u.phone||'—'}</td>`:''}<td>${rk()>1?`<select id="rl_${u.id}" ${u.id==S.uid||u.role=='it'?'disabled title="Роль защищена"':''}>${Object.keys(RN).map(k=>`<option value="${k}" ${k==u.role?'selected':''}>${RN[k]}</option>`).join('')}</select>`:RN[u.role]}</td><td>${rk()>1&&u.id!=S.uid&&u.role!='it'?`<button class="btn red" data-a="deluser" data-i="${u.id}">Удалить</button>`:''}</td></tr>`).join('')}</table></div>${rk()>1?`<div class="card"><h2>Регистрация нового пользователя (только ИТ-специалист)</h2><div class="ctrl"><label>ФИО<input id="un"></label><label>Отдел<input id="ud"></label><label>Email<input id="ue" class="em" autocomplete="off" placeholder="name@mail.ru"><small class="eh">Убедитесь в правильности ввода почты</small></label><label>Телефон<input id="up" class="ph" placeholder="+7 747 584 12 30"></label><label>Пароль<input id="upw" placeholder="не менее 6 символов"></label><label>Роль<select id="ur"><option value="user">Сотрудник</option><option value="admin">Администрация</option><option value="it">ИТ-специалист</option></select></label><button class="btn" data-a="adduser">Создать аккаунт</button></div></div>`:'<div class="card mu">🔒 Регистрация новых пользователей доступна только ИТ-специалисту.</div>'}<div class="card"><h2>Матрица прав доступа (RBAC)</h2><table><tr><th>Функция</th><th>Сотрудник</th><th>Администрация</th><th>ИТ</th></tr>${[['Карта, поиск, бронирование, изменение и отмена своих броней, QR',1,1,1],['Просмотр всех броней, отмена чужих броней, блокировка мест',0,1,1],['Аналитика загрузки, добавление сотрудников',0,1,1],['Назначение ролей, удаление пользователей',0,0,1],['Настройка правил, журнал аудита, состояние системы, сброс данных',0,0,1]].map(r=>`<tr><td>${r[0]}</td>${r.slice(1).map(v=>`<td>${v?'✅':'—'}</td>`).join('')}</tr>`).join('')}</table></div>`}
function modal(){const m=S.m;if(!m)return'';
 if(m.t=='help')return`<div class="mo"><div class="md" style="max-width:540px;text-align:left"><h2>🕐 Зачем нужна «машина времени»?</h2><p>Это <b>демо-инструмент</b>. Часть функций зависит от времени, и без неё их пришлось бы ждать по-настоящему:</p><ul class="rl"><li><b>Автоосвобождение</b>: если через 30 минут после начала брони нет подтверждения, бронь становится «Не использовано», а место освобождается.</li><li><b>Напоминание</b> за 30 минут до начала.</li><li><b>QR-подтверждение</b>: доступно с −15 до +30 минут от начала брони.</li><li>Завершение броней и ночные брони.</li></ul><p><b>+1 ч / +1 д</b> сдвигают часы сайта вперёд. <b>Сброс</b> возвращает реальное время и откатывает данные к состоянию до симуляции: в демо-режиме изменения не сохраняются, а после перезагрузки страницы всё возвращается как было.</p><div style="text-align:right"><button class="btn" data-a="close">Понятно</button></div></div></div>`;const b=DB.bk.find(x=>x.id==m.i),p=pl(b.pid);
 if(m.t=='qr')return`<div class="mo"><div class="md"><h2>QR-код: ${nm(p)}</h2>${qr('OS-'+p.id+'-'+b.id)}<p class="mu">Демо-код. В системе у каждого места свой токен; подтверждение возможно за 15 мин до начала и до 30 мин после.</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn sec" data-a="tt" data-i="${b.id}">⏱ К началу брони</button><button class="btn" data-a="scan" data-i="${b.id}">Сканировать</button><button class="btn sec" data-a="close">Закрыть</button></div></div></div>`;
 return`<div class="mo"><div class="md"><h2>Изменить бронь</h2><p>${nm(p)}, ${fmtD(b.d)}</p><div class="ctrl" style="justify-content:center"><label>Начало<input type="time" id="es" step="900" value="${tm(b.s)}"></label><label>Конец<input type="time" id="ee" step="900" value="${tm(b.e)}"></label></div><br><div style="display:flex;gap:8px;justify-content:center"><button class="btn" data-a="saveedit" data-i="${b.id}">Сохранить</button><button class="btn sec" data-a="close">Отмена</button></div></div></div>`}
function vSys(){const c=DB.cfg,L=(DB.log||[]).slice(0,40);return`<div class="mw"><div class="card"><h2>⚙️ Параметры бизнес-правил</h2><div class="ctrl"><label>Мин. длительность, мин<input id="c1" type="number" min="15" step="15" value="${c.min}"></label><label>Горизонт, дней<input id="c2" type="number" min="1" max="90" value="${c.hor}"></label><label>Автоосвобождение, мин<input id="c3" type="number" min="5" max="120" value="${c.ns}"></label></div><br><button class="btn" data-a="cfg">Сохранить</button><h2 style="margin-top:20px">Состояние системы</h2><div class="row"><span>Пользователей</span><b>${DB.users.length}</b></div><div class="row"><span>Броней в базе</span><b>${DB.bk.length}</b></div><div class="row"><span>Заблокировано мест</span><b>${DB.blocked.length}</b></div><div class="row"><span>Ресурсов (места и переговорные)</span><b>${P.length}</b></div></div><div class="card"><h2>🧾 Журнал аудита</h2>${L.map(l=>`<p style="margin:0;padding:6px 0;border-bottom:1px dashed var(--bd);font-size:13px"><b>${uname(l.u)}</b>: ${l.t}<br><small class="mu">${new Date(l.at).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></p>`).join('')||'<div class="hint">Журнал пуст. Совершите действие — оно появится здесь</div>'}</div></div>`}
function loginView(){
$('#app').innerHTML=`<main style="max-width:460px;padding-top:8vh"><div class="card" style="padding:26px"><div style="font-weight:800;font-size:24px">🏢 OfficeSpace</div><div class="mu" style="margin-bottom:16px">Вход в облачную систему бронирования</div><div class="ctrl" style="flex-direction:column;align-items:stretch"><label>Email<input id="lg" type="email" autocomplete="username" placeholder="name@mail.ru"></label><label>Пароль<input id="pw" type="password" autocomplete="current-password"></label><button class="btn" data-a="login">Войти</button></div><p class="mu" style="font-size:12px;margin-bottom:0">Учётные записи создаются ИТ-специалистом в Supabase Authentication. Демо-аккаунты отключены.</p></div></main>`}

// DND: account-wide setting stored in Supabase; it never blocks delivery or reading.
function dndActive(){return !!(DB?.dndUntil&&(DB.dndUntil==='infinity'||DB.dndUntil.startsWith('9999-')||new Date(DB.dndUntil).getTime()>Date.now()))}
function dndSettings(){const active=dndActive(),until=DB?.dndUntil;
 return `<div class="card"><h2>🌙 Не беспокоить</h2><p class="mu">Для всех сотрудников. Сообщения сохраняются и доступны, но уведомления о новых сообщениях не показываются.</p><div class="ctrl" style="align-items:end"><label>Продолжительность<select id="dndDuration"><option value="30">30 минут</option><option value="60">1 час</option><option value="120">2 часа</option><option value="480">8 часов</option><option value="0">Пока не выключу</option></select></label><button class="btn" data-a="dndon">${active?'Продлить':'Включить'}</button>${active?'<button class="btn sec" data-a="dndoff">Выключить</button>':''}</div><p class="mu">Статус: <b>${active?((until==='infinity'||until?.startsWith('9999-'))?'Включён до ручного отключения':'Включён до '+new Date(until).toLocaleString('ru-RU')):'Выключен'}</b></p></div>`;
}
function vAcc(){const u=DB.users.find(x=>x.id==S.uid),E='<small class="eh">Убедитесь в правильности ввода почты</small>';
return`${dndSettings()}<div class="g2"><div class="card"><h2>👤 Профиль</h2><div class="ctrl" style="flex-direction:column;align-items:stretch"><label>ФИО<input id="an" value="${u.name}"></label><label>Email<input id="ae" value="${u.email||''}" readonly>${E}</label><label>Телефон<input id="ap" class="ph" value="${u.phone||''}" placeholder="+7 747 584 12 30"></label><label>Telegram (для уведомлений)<input id="at" value="Пока не подключено" readonly></label><button class="btn" data-a="saveprof">Сохранить профиль</button></div></div><div><div class="card"><h2>🔒 Смена пароля</h2><div class="ctrl" style="flex-direction:column;align-items:stretch"><label>Текущий пароль<input id="pwo" type="password" autocomplete="current-password"></label><label>Новый пароль (от 6 символов)<input id="pwn" type="password" autocomplete="new-password"></label><label>Повторите новый пароль<input id="pwr" type="password" autocomplete="new-password"></label><button class="btn" data-a="savepw">Сменить пароль</button></div></div><div class="card"><h2>ℹ️ Доступ</h2><div class="row"><span>Роль</span><b>${RN[u.role]}</b></div><div class="row"><span>Отдел</span><b>${u.dep}</b></div><p class="mu" style="font-size:12px;margin-bottom:0">Роль и отдел меняет только ИТ-специалист.</p></div></div></div>`}
const WD=['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],WS=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
const ld=d=>{const s=new Set();DB.bk.forEach(b=>{if(b.d==d&&!(pl(b.pid)||{room:1}).room&&OK.includes(b.st))s.add(b.pid)});return Math.round(s.size/wpl().length*100)};
function fixT(){if(!['map','search'].includes(S.v))return;const n=new Date(now()),td=ds(n);let nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15;if(S.d<td)S.d=td;
 if(S.d==td&&nm>=1440){const x=new Date(n);x.setDate(x.getDate()+1);S.d=ds(x);nm=0}
 const mx=ds(new Date(now()+DB.cfg.hor*864e5));if(S.d>mx)S.d=mx;if(S.d==td&&S.s<nm)S.s=nm;
 if(S.e-S.s<DB.cfg.min)S.e=S.s+120;if(S.e-S.s>960)S.e=S.s+960}
function ctrl(dateOnly){if(dateOnly)return ctrlOld(1);const n=new Date(now()),td=ds(n),nm=Math.ceil((n.getHours()*60+n.getMinutes())/15)*15,cm=S.cm||'strip',isT=S.d==td,
 days=[...Array(DB.cfg.hor+1)].map((_,i)=>{const x=new Date(n);x.setDate(x.getDate()+i);return ds(x)}),dl=d=>new Date(d+'T00:00').getDay();
 const dsel=cm=='cal'?`<input type="date" id="cd" min="${td}" max="${days[days.length-1]}" value="${S.d}">`:cm=='list'?`<select id="cd" style="min-width:280px">${days.map(d=>`<option value="${d}" ${d==S.d?'selected':''}>${d.slice(8)}.${d.slice(5,7)} — ${WD[dl(d)]}${d==td?' (сегодня)':''}</option>`).join('')}</select>`:`<div class="strip">${days.map(d=>`<button class="dc ${d==S.d?'on':''}" data-a="day" data-i="${d}"><small>${WS[dl(d)]}</small><b>${+d.slice(8)}</b><i>${ld(d)}%</i></button>`).join('')}</div>`;
 const so=[],eo=[];for(let m=isT?nm:0;m<1440;m+=15)so.push(`<option value="${m}" ${m==S.s?'selected':''}>${tm(m)}</option>`);
 for(let m=S.s+DB.cfg.min;m<=S.s+960;m+=15){const du=m-S.s;eo.push(`<option value="${m}" ${m==S.e?'selected':''}>${tm(m)}${m>=1440?' (+1 день)':''} · ${du>=60?Math.floor(du/60)+' ч'+(du%60?' '+du%60+' мин':''):du+' мин'}</option>`)}
 const pre=[['Весь день',540,1080],['Утро',540,780],['После обеда',780,1080],['Вечер',1080,1320],['Ночь',1380,1620]],du=[[30,'30 мин'],[60,'1 ч'],[120,'2 ч'],[240,'4 ч'],[480,'8 ч']];
 return`<div class="card"><div class="cr"><div class="cl">Дата</div><div class="seg">${[['strip','🧭 Лента'],['cal','📅 Календарь'],['list','🗒 Список']].map(k=>`<button class="${cm==k[0]?'on':''}" data-a="cm" data-i="${k[0]}">${k[1]}</button>`).join('')}</div></div><div class="cr">${dsel}</div>
 <div class="cr"><div class="cl">Время</div><div class="tt"><label>Начало<select id="cs">${so.join('')}</select></label><span>→</span><label>Конец<select id="ce">${eo.join('')}</select></label><div class="sum">🕒 ${tm(S.s)}–${tm(S.e)}${S.e>1440?' (до след. дня)':''}</div></div></div>
 <div class="cr"><div class="cl">Быстрый выбор</div><div class="chs">${pre.map(p=>`<button class="ch" data-a="pre" data-i="${p[1]}-${p[2]}" ${isT&&p[1]<nm?'disabled':''}>${p[0]} <small>${tm(p[1])}–${tm(p[2])}</small></button>`).join('')}${du.filter(x=>x[0]>=DB.cfg.min).map(x=>`<button class="ch" data-a="dur" data-i="${x[0]}">на ${x[1]}</button>`).join('')}</div></div>
 <div class="mu" style="font-size:12px">Прошедшее время не отображается. Правила: от ${DB.cfg.min} мин, до ${DB.cfg.hor} дн. вперёд, без пересечений. Ночную бронь выбирайте в «Конец» с пометкой (+1 день).</div></div>`}
function guide(){const T=[['Обычное','🖥','Обычный кабинет с постоянным правами — рабочее место с ПК: стол, кресло, монитор и док-станция.'],['Два монитора','🖥🖥','Кабинет, оборудованный двумя мониторами: удобно для разработки, дизайна и аналитики.'],['Ноутбук','💻','Стол с розетками и док-станцией для работы со своим ноутбуком.'],['Тихая зона','🤫','Кабинет без разговоров и звонков — для сосредоточенной работы.'],['Командная работа','👥','Общий стол в командной зоне: можно работать группой и обсуждать задачи вслух.'],['Для особых потребностей','♿','Регулируемый по высоте стол, свободный проход рядом, удобное расположение вблизи лифта.'],['Переговорная','📽','Комната на 6 или 10 человек с проектором и экраном; бронируется так же, как рабочее место.']];
return`<div class="g2"><div class="card"><h2>📖 Что означают типы мест</h2>${T.map(t=>`<div class="it"><div><b>${t[1]} ${t[0]}</b><br><small>${t[2]}</small></div></div>`).join('')}</div><div class="card"><h2>☕ Зона отдыха</h2><p>На каждом этаже есть зона отдыха. <b>Её не нужно бронировать</b> — приходите в любое время.</p><ul class="rl"><li>☕ кофе-автомат и чайная станция</li><li>🛋 мягкие диваны и кресла</li><li>🚰 кулер с питьевой водой</li><li>🍽 микроволновая печь и холодильник</li><li>📚 стеллаж с книгами и журналами</li></ul><p class="mu" style="font-size:12px">Зона отдыха на плане обозначена пунктирной рамкой внизу этажа.</p></div></div>`}
function vMsgU(){return vMsg()}
function vMsg(){
 const me=S.uid,I=(DB.msgs||[]).filter(m=>m.to===me),O=(DB.msgs||[]).filter(m=>m.from===me),peers=DB.users.filter(x=>x.id!==me),rp=S.rp||{};
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
 const myMute=(DB.mutes||[]).find(m=>m.user_id===me&&(!m.expires_at||new Date(m.expires_at)>new Date()));
 const blocked=x=>{const pref=(DB.privacy||[]).find(p=>p.user_id===x.id);return pref&&(pref.mode==='none'||pref.mode==='admins'&&rk()<1)};
 const all=[...I,...O].sort((a,b)=>b.at-a.at),selected=all.find(m=>m.id===S.mo)||null;
 const listItem=m=>{const incoming=m.to===me,person=uname(incoming?m.from:m.to),initials=person.split(' ').map(x=>x[0]).slice(0,2).join('');return `<button class="thread ${S.mo===m.id?'selected':''} ${incoming&&!m.r?'unread':''}" data-a="mopen" data-i="${m.id}"><span class="thread-avatar">${esc(initials)}</span><span class="thread-body"><span class="thread-line"><b>${esc(person)}</b><small>${new Date(m.at).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit'})}</small></span><span class="thread-subject">${esc(m.subj||m.type)}</span><span class="thread-excerpt">${esc((m.text||'').slice(0,78))}</span></span></button>`};
 const privacy=rk()>=1?`<div class="mess-settings"><h3>Приватность</h3><label>Кто может писать мне<select id="privacyMode"><option value="all" ${DB.myPrivacy==='all'?'selected':''}>Все сотрудники</option><option value="admins" ${DB.myPrivacy==='admins'?'selected':''}>Только администрация и ИТ</option><option value="none" ${DB.myPrivacy==='none'?'selected':''}>Никто</option></select></label><button class="btn sec" data-a="saveprivacy">Сохранить</button></div>`:'';
 return `<section class="messenger"><aside class="mess-list"><div class="mess-panel-title"><span>Диалоги</span><span class="mess-count">${all.length}</span></div><div class="mess-filter">Все сообщения <span>· ${I.filter(m=>!m.r).length} непрочитанных</span></div><div class="mess-threads">${all.map(listItem).join('')||'<div class="mess-empty">Сообщений пока нет</div>'}</div></aside><div class="mess-center"><div class="mess-panel-title">${selected?esc(uname(selected.to===me?selected.from:selected.to)):'Переписка'}<span class="mess-online">● OfficeSpace</span></div>${selected?`<div class="mess-conversation"><div class="mess-date">${new Date(selected.at).toLocaleString('ru-RU')}</div><div class="mess-bubble ${selected.from===me?'outgoing':''}"><span class="mess-bubble-kind">${esc(selected.type||'Сообщение')}</span><h3>${esc(selected.subj)}</h3><p>${esc(selected.text)}</p></div></div><div class="mess-bottom">${selected.to===me&&!myMute?`<button class="btn" data-a="mreply" data-i="${selected.id}">↩ Ответить</button>`:''}<span>История сообщений синхронизируется через Supabase</span></div>`:'<div class="mess-placeholder"><span class="mess-placeholder-icon">✉</span><h2>Выберите сообщение</h2><p>Здесь появится переписка с сотрудниками</p></div>'}</div><aside class="mess-compose"><div class="mess-panel-title">Новое сообщение</div><div class="mess-compose-content">${myMute?`<p class="mu">🔕 Отправка сообщений ограничена${myMute.expires_at?' до '+new Date(myMute.expires_at).toLocaleString('ru-RU'):''}.</p>`:''}<div class="mess-fields"><label>Получатель<select id="mto" ${myMute?'disabled':''}><option value="">Выберите сотрудника</option>${peers.map(x=>`<option value="${esc(x.id)}" ${rp.to===x.id?'selected':''} ${blocked(x)?'disabled':''}>${esc(x.name)}${blocked(x)?' · входящие закрыты':''}</option>`).join('')}</select></label><label>Тема<input id="msj" maxlength="200" value="${esc(rp.subj||'')}" placeholder="Тема сообщения" ${myMute?'disabled':''}></label><label>Сообщение<textarea id="mtx" rows="7" maxlength="10000" placeholder="Напишите сообщение..." ${myMute?'disabled':''}></textarea></label><button class="btn" data-a="msend" ${myMute?'disabled':''}>Отправить сообщение ↗</button></div>${privacy}</div></aside></section>`;
}
function muteManagement(){if(rk()<1)return '';const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');const targets=DB.users.filter(u=>u.id!==S.uid&&(rk()>1?u.role!=='it':u.role==='user'));return `<div class="card"><h2>🔕 Ограничения сообщений</h2><p class="mu">Администрация может ограничивать сотрудников; ИТ — сотрудников и администрацию. Брони остаются доступны.</p><div class="ctrl"><label>Сотрудник<select id="muteUser">${targets.map(u=>`<option value="${esc(u.id)}">${esc(u.name)} · ${esc(RN[u.role])}</option>`).join('')}</select></label><label>Срок<select id="muteDuration"><option value="30">30 минут</option><option value="60">1 час</option><option value="1440">24 часа</option><option value="10080">7 дней</option><option value="0">Бессрочно</option></select></label><label>Причина<input id="muteReason" maxlength="250" placeholder="Причина ограничения"></label><button class="btn" data-a="muteuser" ${targets.length?'':'disabled'}>Заглушить</button></div><h3>Активные ограничения</h3>${(DB.mutes||[]).filter(m=>!m.expires_at||new Date(m.expires_at)>new Date()).filter(m=>targets.some(u=>u.id===m.user_id)).map(m=>`<div class="it"><span>${esc(uname(m.user_id))} · ${m.expires_at?new Date(m.expires_at).toLocaleString('ru-RU'):'Бессрочно'} · ${esc(m.reason||'Без причины')}</span><button class="btn sec" data-a="unmuteuser" data-i="${esc(m.user_id)}">Снять</button></div>`).join('')||'<p class="mu">Активных ограничений нет</p>'}</div>`}

function render(){
 buildP();sweep();if(!S.uid)return loginView();fixT();
 const u=DB.users.find(x=>x.id==S.uid),R=RK[u.role],um=(DB.msgs||[]).filter(m=>m.to==S.uid&&!m.r).length;
 const base=[['map','Карта офиса','map'],['search','Поиск мест','search'],['mine','Мои бронирования','calendar-days']];
 const tabs=R===0?[...base,['msg','Сообщения','message-circle']]:[...base,['all','Все бронирования','list-checks'],['stats','Аналитика','chart-no-axes-column'],['staff','Сотрудники','users'],['msg','Сообщения','message-circle'],...(R>1?[['sys','Система','settings']]:[])];
 if(!tabs.some(t=>t[0]===S.v)&&S.v!=='acc')S.v='map';
 const mine=DB.nt.filter(n=>n.u===S.uid),un=mine.filter(n=>!n.r).length;
 const staffDraft=S.v==='staff'?Object.fromEntries(['un','ud','ue','up','upw','ur','muteReason','muteUser','muteDuration'].map(id=>{const el=document.getElementById(id);return [id,el?el.value:null]})):null;
 const icons={map:'▦',search:'⌕','calendar-days':'▤','list-checks':'☷','chart-no-axes-column':'▥',users:'♧','message-circle':'▢',settings:'⚙'};
 const title=(TT[S.v]||TT.map)[0];
 $('#app').innerHTML=`<header class="os-sidebar"><div class="os-brand"><span class="os-mark">◈</span><span><strong>OfficeSpace</strong><small>WORKSPACE PLATFORM</small></span></div><div class="os-workspace"><span class="os-workspace-icon">OS</span><span><b>Рабочее пространство</b><small>Команда · ${DB.users.length} участников</small></span><span class="os-chevron">⌄</span></div><div class="os-section-label">РАБОЧЕЕ ПРОСТРАНСТВО</div><nav>${tabs.map(t=>`<button class="${S.v===t[0]?'on':''}" data-a="tab" data-i="${t[0]}"><span class="os-nav-icon">${icons[t[2]]}</span><span>${t[1]}</span>${t[0]==='msg'&&um?`<span class="os-nav-count">${um}</span>`:''}</button>`).join('')}</nav><div class="os-sidebar-bottom"><div class="os-section-label">АККАУНТ</div><button class="os-profile ${S.v==='acc'?'on':''}" data-a="tab" data-i="acc"><span class="os-profile-avatar">${u.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span><span><b>${u.name}</b><small>${RN[u.role]}</small></span><span>⚙</span></button><div class="os-bottom-actions"><button data-a="theme" class="os-bottom-btn" title="Сменить тему">◐ <span>Тема</span></button><button data-a="logout" class="os-bottom-btn" title="Выйти">↪ <span>Выход</span></button></div></div></header><div class="os-shell"><div class="os-topbar"><div class="os-breadcrumb"><span>OfficeSpace</span><span class="os-slash">/</span><strong>${title}</strong></div><div class="os-top-actions"><span class="os-clock">${new Date(now()).toLocaleDateString('ru-RU',{day:'numeric',month:'short',year:'numeric'})}</span><button class="os-top-icon" data-a="theme" title="Переключить тему">◐</button><button class="os-top-icon" data-a="bell" title="Уведомления">♧${un?`<span class="os-top-badge">${un}</span>`:''}</button><button class="os-top-avatar" data-a="tab" data-i="acc" title="Профиль">${u.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</button></div></div>${S.nt?`<div class="nt">${mine.slice(0,14).map(n=>`<p class="${n.r?'':'u'}" data-a="nt" data-i="${DB.nt.indexOf(n)}">${n.t}<br><small>${new Date(n.at).toLocaleString('ru-RU')}</small></p>`).join('')||'<p>Уведомлений нет</p>'}</div>`:''}<main class="os-content"><div class="os-page-head"><div><span class="os-eyebrow">OFFICESPACE / ${title.toUpperCase()}</span><h1>${title}</h1><p>${(TT[S.v]||TT.map)[1]}</p></div><div class="os-page-user"><span class="os-status-dot"></span> ${RN[u.role]}</div></div>${{map:vMap,search:vSearch,mine:vMine,all:vAll,stats:vStats,staff:vStaff,sys:vSys,msg:vMsg,acc:vAcc}[S.v]()}<footer class="os-footer">OfficeSpace · Облачная синхронизация Supabase ${rk()>1?'· <a href="#" data-a="reset">Сброс данных (ИТ)</a>':''}</footer></main></div>${modal()}`;
 if(staffDraft)for(const [id,value] of Object.entries(staffDraft)){const el=document.getElementById(id);if(el&&value!==null)el.value=value}
}
// ===== Supabase cloud integration =====
let sb=null, cloudUser=null, cloudChannel=null, cloudBusy=false, cloudPending=false, cloudRetry=null, cloudStatus="", knownMessageIds=null;
const CLOUD_URL=window.OFFICESPACE_SUPABASE_URL;
const CLOUD_KEY=window.OFFICESPACE_SUPABASE_ANON_KEY;
function cloudError(err){return (err&&err.message)||'Не удалось выполнить запрос к облачной базе'}
async function cloudFetch(){
 const [pr,wr,br,mr,sr,privacyResult,mutesResult,dndResult]=await Promise.all([
  sb.from('profiles').select('id,full_name,department,phone,role,email').order('full_name'),
  sb.from('workplaces').select('*').eq('is_active',true).order('id'),
  sb.from('bookings').select('*').order('booking_date'),
  sb.from('office_messages').select('*').order('created_at',{ascending:false}).limit(500),
  sb.from('office_settings').select('*').eq('id',1).maybeSingle(),
  sb.from('message_privacy').select('user_id,mode'),
  sb.from('message_mutes').select('user_id,expires_at,reason'),
  sb.from('message_dnd').select('until_at').eq('user_id',cloudUser.id).maybeSingle()
 ]);
 for(const x of [pr,wr,br,mr,sr,privacyResult,mutesResult,dndResult])if(x.error)throw x.error;
 DB={users:(pr.data||[]).map(x=>({id:x.id,name:x.full_name||'Сотрудник',dep:x.department||'—',phone:x.phone||'',email:x.email||(x.id===cloudUser.id?(cloudUser.email||''):''),role:x.role})),
  blocked:(wr.data||[]).filter(x=>x.is_blocked).map(x=>x.id),
  bk:(br.data||[]).map(x=>({id:x.id,uid:x.user_id,pid:x.workplace_id,d:x.booking_date,s:x.start_minute,e:x.end_minute,st:x.status})),
  dndUntil:dndResult.data?.until_at||null,privacy:privacyResult.data||[],myPrivacy:(privacyResult.data||[]).find(x=>x.user_id===cloudUser.id)?.mode||'all',mutes:mutesResult.data||[],nt:[],log:[],msgs:(mr.data||[]).map(x=>({id:x.id,from:x.sender_id,to:x.recipient_id,type:x.message_type,subj:x.subject,text:x.body,at:new Date(x.created_at).getTime(),r:x.is_read})),mid:0,cfg:{min:sr.data?.min_duration_minutes||30,hor:sr.data?.booking_horizon_days||14,ns:sr.data?.no_show_grace_minutes||30},id:1,pe:{},pn:[],pid:200};
 (wr.data||[]).forEach(x=>{DB.pe[x.id]={f:x.floor,r:x.row_no,c:x.col_no,zone:x.zone,t:x.title,eq:x.equipment||[],room:x.is_room?1:0,name:x.is_room?`Переговорная №${x.id-150}`:undefined,cap:x.capacity||undefined,del:!x.is_active}});
 const me=DB.users.find(x=>x.id===cloudUser.id);if(!me)throw new Error('Профиль пользователя не найден. Проверьте trigger handle_new_user и таблицу profiles.');
 S.uid=cloudUser.id;
 // Never replay old messages as new notifications on first load.
 const current=new Set((DB.msgs||[]).filter(m=>m.to===S.uid).map(m=>String(m.id)));
 if(knownMessageIds!==null){
  const incoming=(DB.msgs||[]).filter(m=>m.to===S.uid&&!knownMessageIds.has(String(m.id)));
  if(incoming.length&&!dndActive()&&!document.hidden)toast(incoming.length===1?'💬 Новое сообщение от '+uname(incoming[0].from):'💬 Новых сообщений: '+incoming.length);
 }
 knownMessageIds=current;
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
  .on('postgres_changes',{event:'*',schema:'public',table:'office_messages'},()=>cloudRefresh())
  .on('postgres_changes',{event:'*',schema:'public',table:'message_mutes'},()=>cloudRefresh())
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
document.addEventListener('focusout',()=>{if(cloudPending)setTimeout(()=>cloudRefresh(),100)});
window.addEventListener('online',()=>{if(cloudUser){cloudSubscribe();cloudRefresh()}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&cloudUser)cloudRefresh()});
async function cloudBoot(){
 if(!CLOUD_URL||!CLOUD_KEY||!window.supabase?.createClient){$('#app').innerHTML='<main class="card"><h2>Не настроено подключение Supabase</h2><p>Проверьте файл supabase-config.js.</p></main>';return}
 sb=window.supabase.createClient(CLOUD_URL,CLOUD_KEY);
 const {data:{session},error}=await sb.auth.getSession();if(error){toast(cloudError(error),1);return}
 cloudUser=session?.user||null;
 if(!cloudUser){DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};S.uid=0;render();return}
 try{await cloudFetch();render();await cloudSubscribe();}
 catch(e){$('#app').innerHTML=`<main class="card"><h2>Не удалось загрузить OfficeSpace</h2><p>${clean(cloudError(e))}</p><p>Проверьте, что SQL-настройка выполнена полностью и профиль создан.</p><button class="btn" onclick="location.reload()">Повторить</button></main>`}
}
async function cloudLogin(){const email=$('#lg')?.value.trim().toLowerCase(),password=$('#pw')?.value;if(!email||!password)return toast('Введите email и пароль',1);const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)return toast('Ошибка входа: '+cloudError(error),1);cloudUser=data.user;knownMessageIds=null;try{await cloudFetch();render();await cloudSubscribe();toast('Добро пожаловать, '+(DB.users.find(x=>x.id==S.uid)?.name||email))}catch(e){toast('Профиль не загружен: '+cloudError(e),1)}}
async function cloudLogout(){knownMessageIds=null;clearTimeout(cloudRetry);if(cloudChannel)await sb.removeChannel(cloudChannel);await sb.auth.signOut();cloudUser=null;S.uid=0;DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};render()}
sweep=function(){return 0};
book=async function(pid){const m=validate(pid,S.d,S.s,S.e,S.uid);if(m)return toast(m,1);const {error}=await sb.rpc('create_booking',{p_workplace_id:pid,p_booking_date:S.d,p_start_minute:S.s,p_end_minute:S.e});if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Бронь сохранена в облаке: '+nm(pl(pid)));S.sel=null;render()};
cancel=async function(id){const b=DB.bk.find(x=>x.id==id);if(!b)return toast('Бронь не найдена',1);if(b.uid!==S.uid&&rk()<1)return toast('Недостаточно прав',1);const {error}=await sb.from('bookings').update({status:'cancelled'}).eq('id',id);if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Бронь отменена')};
async function cloudToggleBlock(id){if(rk()<1)return toast('Недостаточно прав',1);const blocked=DB.blocked.includes(id);const {error}=await sb.from('workplaces').update({is_blocked:!blocked}).eq('id',id);if(error)return toast(cloudError(error),1);await cloudRefresh();toast(blocked?'Место разблокировано':'Место заблокировано')}
async function cloudSaveProfile(){const n=$('#an').value.trim(),ph=$('#ap').value.trim();if(!n)return toast('Введите ФИО',1);const {error}=await sb.from('profiles').update({full_name:n,phone:ph,updated_at:new Date().toISOString()}).eq('id',S.uid);if(error)return toast(cloudError(error),1);await cloudRefresh();toast('Профиль сохранён')}
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
async function cloudOpenMessage(id){
 const m=DB.msgs.find(x=>x.id===id);if(!m)return;
 S.mo=S.mo===id?null:id;
 if(m.to===S.uid&&!m.r){m.r=true;const {error}=await sb.from('office_messages').update({is_read:true}).eq('id',id).eq('recipient_id',cloudUser.id);if(error)toast(cloudError(error),1)}
 render();
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]'),g=e.target.closest('[data-id]');
 const gc=e.target.closest('[data-cell]');if(gc&&!a&&S.edit){const q=gc.dataset.cell.split('-');S.ec={f:+q[0],r:+q[1],c:+q[2]};S.sel=null;S.dc=0;return render()}
 if(g&&!a){S.sel=+g.dataset.id;S.ec=null;S.dc=0;S.nt=0;return render()}
 if(!a){if(S.nt&&!e.target.closest('.nt')){S.nt=0;render()}return}
 const A=a.dataset.a,i=a.dataset.i;e.preventDefault();
 if(A=='login'){cloudLogin();return} if(A=='logout'){cloudLogout();return} if(A=='blk'){cloudToggleBlock(+i);return} if(A=='saveprof'){cloudSaveProfile();return} if(A=='savepw'){cloudSavePassword();return} if(A==='msend'){cloudSendMessage();return} if(A==='dndon'){cloudSetDnd(false);return} if(A==='dndoff'){cloudSetDnd(true);return} if(A==='saveprivacy'){cloudSavePrivacy();return} if(A==='muteuser'){cloudSetMute();return} if(A==='unmuteuser'){cloudSetMute(true,i);return} if(A==='mopen'){cloudOpenMessage(i);return} if(A==='mreply'){const m=DB.msgs.find(x=>x.id===i);if(m){S.rp={to:m.from,subj:(m.subj.startsWith('Re: ')?'':'Re: ')+m.subj};S.mo=i;render()}return} if(['deluser','cfg','saveedit','scan','pesave','pedel','reset'].includes(A))return toast('Эта административная функция пока не подключена к облаку и отключена, чтобы не создавать локальные изменения.',1); if(A=='adduser'){cloudCreateUser();return;}
 if(A=='tab'){S.v=i;S.nt=0}else if(A=='fl')S.f=+i;else if(A=='book')return book(+i);else if(A=='cancel')return cancel(i);
 else if(A=='goto'){S.sel=+i;S.f=pl(+i).f;S.v='map'}
 else if(A=='blk'){if(rk()<1)return toast('Недостаточно прав',1);const id=+i,k=DB.blocked.indexOf(id);k<0?DB.blocked.push(id):DB.blocked.splice(k,1);audit((k<0?'Заблокировано ':'Разблокировано ')+nm(pl(id)));save()}
 else if(A=='qr'||A=='edit')S.m={t:A,i:+i};else if(A=='close')S.m=null;
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
 else if(A=='medit'){if(rk()<1)return;S.edit=!S.edit;S.ec=null;S.dc=0}
 else if(A=='pesave'){if(rk()<1)return;const lab=clean($('#pe_l').value),tsl=$('#pe_t').value,tc=$('#pe_tc')?clean($('#pe_tc').value):'',desc=clean($('#pe_d').value),eq=[...document.querySelectorAll('.peq:checked')].map(x=>x.value).concat(clean($('#pe_o').value).split(',').map(x=>x.trim()).filter(Boolean)),t=tc||tsl;
  if(i=='new'){const c=S.ec;if(!c)return;DB.pid=(DB.pid||200)+1;DB.pn=DB.pn||[];DB.pn.push({id:DB.pid,f:c.f,r:c.r,c:c.c,zone:ZN[c.c<3?0:c.c<7?1:2],t,eq,label:lab,desc,x:30+c.c*95,y:44+c.r*58,w:80,h:46,room:0});S.sel=DB.pid;S.ec=null;buildP();audit('Добавлено рабочее место: '+nm(pl(DB.pid)))}
  else{const p=pl(+i);if(!p)return;const up={eq,desc};if(p.room){up.name=lab||p.name;up.cap=Math.max(1,Math.min(100,+$('#pe_c').value||p.cap))}else{up.t=t;up.label=lab}upd(p.id,up);buildP();
   DB.bk.forEach(b=>{if(b.pid==p.id&&ACT.includes(b.st)&&ts(b.d,b.e)>now())note(b.uid,'Параметры места изменены: '+nm(pl(p.id))+'. Проверьте оборудование в «Мои брони»')});audit('Изменено: '+nm(pl(p.id)))}
  save();toast('Сохранено')}
 else if(A=='pedel'){if(rk()<1)return;const p=pl(+i);if(!p||p.room)return;if(S.dc!=p.id){S.dc=p.id;toast('Нажмите «Подтвердить удаление». Активные брони будут отменены',1)}
  else{DB.bk.forEach(b=>{if(b.pid==p.id&&ACT.includes(b.st)&&ts(b.d,b.e)>now()){b.st='cancelled';note(b.uid,'Бронь отменена: '+nm(p)+' удалено из системы ('+fmtD(b.d)+')')}});
   const n=(DB.pn||[]).find(x=>x.id==p.id);if(n)n.del=1;else{DB.pe=DB.pe||{};DB.pe[p.id]=Object.assign(DB.pe[p.id]||{},{del:1})}
   DB.blocked=DB.blocked.filter(x=>x!=p.id);S.sel=null;S.dc=0;audit('Удалено: '+nm(p));buildP();save();toast('Место удалено')}}
 else if(A=='cm')S.cm=i;
 else if(A=='day'){S.d=i}
 else if(A=='pre'){const q=i.split('-');S.s=+q[0];S.e=+q[1]}
 else if(A=='dur')S.e=S.s+ +i;
 else if(A=='nt'){const n=DB.nt[+i];if(n){n.r=1;S.v=nv(n);S.nt=0;save()}}
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
 else if(A=='bell'){S.nt=!S.nt;if(!S.nt)DB.nt.forEach(n=>n.u==S.uid&&(n.r=1));save()}
 else if(A=='theme'){const r=document.documentElement;let t=r.dataset.theme||'dark';r.dataset.theme=t==='dark'?'light':'dark';try{localStorage.setItem('officespace_theme',r.dataset.theme)}catch(e){}}
 else if(A=='reset'){if(rk()<2)return;try{localStorage.removeItem(KEY)}catch(x){}seed();off=0;SIM=null;save()}
 render()});
document.addEventListener('change',e=>{const t=e.target,id=t.id;if(!id)return;
 if(id=='usr'){S.uid=+t.value;S.sel=null;S.nt=0}else if(id=='cd')S.d=t.value||S.d;else if(id=='cs'){const du=S.e-S.s;S.s=+t.value;S.e=S.s+Math.max(du,DB.cfg.min)}else if(id=='ce')S.e=+t.value;
 else if(id.startsWith('rl_')){if(rk()<2)return;const u=DB.users.find(x=>x.id==id.slice(3));if(!u||u.id==S.uid||u.role=='it'){toast('Нельзя менять собственную роль или роль ИТ-специалиста',1);render();return}sb.rpc('set_user_role',{target_user:u.id,new_role:t.value}).then(({error})=>{if(error)toast(cloudError(error),1);else cloudRefresh()})}else if(id=='qt')S.q.t=t.value;else if(id=='qe')S.q.eq=t.value;else if(id=='qn')S.q.n=+t.value;else if(id=='qq')S.q.quiet=t.checked;else return;render()});
DB={users:[],blocked:[],bk:[],nt:[],log:[],msgs:[],cfg:{min:30,hor:14,ns:30},id:1,pe:{},pn:[]};
document.addEventListener('keydown',e=>{if(e.key=='Enter'&&(e.target.id=='pw'||e.target.id=='lg')){const b=document.querySelector('[data-a="login"]');if(b)b.click()}});
const chk=(t,force)=>{const h=t.parentElement.querySelector('.eh');if(!h)return;const v=t.value,dom=v.split('@')[1]||'';h.style.display=v&&v.includes('@')&&(force||dom.includes('.'))&&!emOK(v)?'block':'none'};
document.addEventListener('input',e=>{const t=e.target,id=t.id;if(!id||t.tagName!='INPUT')return;let v=t.value;
 if(t.classList.contains('ph')||(id=='lg'&&/^[+\d\s()-]*$/.test(v)&&/\d/.test(v)))v=mph(v);else if(t.classList.contains('em')||(id=='lg'&&v.includes('@')))v=femail(v);else return;
 if(v!==t.value)t.value=v;chk(t,false)});
document.addEventListener('focusout',e=>{const t=e.target;if(t.tagName=='INPUT'&&(t.classList.contains('em')||t.id=='lg'))chk(t,true)});
new MutationObserver(()=>{const e=document.querySelector('.dc.on');if(e){const p=e.parentElement;p.scrollLeft=e.offsetLeft-p.clientWidth/2+e.offsetWidth/2}}).observe($('#app'),{childList:true});
cloudBoot();setInterval(()=>{if(sb&&cloudUser&&!S.m)cloudRefresh()},15000);