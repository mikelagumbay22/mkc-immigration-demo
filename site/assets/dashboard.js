(function(){
"use strict";
var S=window.MKCStore, data=S.load(), esc=S.esc, page=document.body.getAttribute('data-page');
function $(id){return document.getElementById(id);}
function appById(id){return data.applications.find(function(a){return a.id===id;});}
function clientById(id){return data.clients.find(function(c){return c.id===id;});}
function badge(st){return '<span class="badge '+esc(st)+'">'+esc(st)+'</span>';}
var PENCIL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
var TRASH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m1 0-1 14H8L7 6"/></svg>';
/* --- modal helpers: open/close, Escape, focus return, Tab trap-lite --- */
var lastFocus=null;
function openModal(id){lastFocus=document.activeElement;var m=$(id);m.hidden=false;var f=m.querySelector('input,select,textarea,button');if(f)f.focus();}
function closeModal(id){$(id).hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus();}
document.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',function(){closeModal(b.getAttribute('data-close'));});});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'){document.querySelectorAll('.modal-back:not([hidden])').forEach(function(m){m.hidden=true;});if(lastFocus&&lastFocus.focus)lastFocus.focus();}
 if(e.key==='Tab'){var open=document.querySelector('.modal-back:not([hidden])');if(!open)return;var items=open.querySelectorAll('button,input,select,textarea,a[href]');if(!items.length)return;var first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
document.querySelectorAll('[data-signout]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();sessionStorage.removeItem('mkc_demo_role');location.href='../index.html';});});
document.querySelectorAll('[data-menu]').forEach(function(b){b.addEventListener('click',function(){var s=document.querySelector('.side');b.setAttribute('aria-expanded',s.classList.toggle('open'));});});
function wireReset(){var b=$('resetDemo');if(b)b.addEventListener('click',function(){data=S.reset();location.reload();});}
function visaOptions(sel){return data.visas.map(function(v){return '<option value="'+esc(v.name)+'"'+(v.name===sel?' selected':'')+'>'+esc(v.name)+'</option>';}).join('');}

/* ================= CLIENT ================= */
if(page==='client-dashboard'){
 var mine=data.applications.filter(function(a){return a.clientId==='c-demo';});
 $('announcements').innerHTML=data.announcements.map(function(a){return '<article class="card"><p class="muted">'+esc(a.date)+' · Sample announcement</p><h3>'+esc(a.title)+'</h3><p>'+esc(a.body)+'</p></article>';}).join('');
 $('appCards').innerHTML=mine.map(function(a){var p=S.progress(data,a);return '<article class="card"><p>'+badge(a.status)+' <span class="badge">'+esc(a.type)+'</span></p><h3><a href="application.html?id='+a.id+'">'+esc(a.type)+' application</a></h3><p class="muted">Started '+esc(a.date)+' · Due '+esc(a.due)+'</p><div class="bar" role="progressbar" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100" aria-label="Checklist progress"><i style="width:'+p+'%"></i></div><p>'+p+'% complete</p><a class="btn navy" href="application.html?id='+a.id+'">Open application</a></article>';}).join('');
 wireReset();
}
if(page==='application'){
 var id=new URLSearchParams(location.search).get('id')||'a1'; var app=appById(id)||data.applications[0]; var cl=S.ensureChecklist(data,app); S.save(data);
 function render(){ var p=S.progress(data,app); var done=cl.filter(function(x){return x.done;}).length;
  $('appDetail').innerHTML='<p>'+badge(app.status)+' <span class="badge">'+esc(app.type)+'</span></p><h2>'+esc(app.type)+' application</h2><p class="muted">Sample application · Started '+esc(app.date)+' · Due '+esc(app.due)+'</p>'
  +'<div class="bar" role="progressbar" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+p+'%"></i></div><p><strong>'+p+'% complete</strong> · Checklist status: <strong>'+(p===100?'Complete':'Incomplete')+'</strong> ('+done+' of '+cl.length+' done) · Application status badge above stays “'+esc(app.status)+'” as seeded.</p>'
  +'<p class="muted">Sample checklist only — requirements come from this application’s visa type in the demo Visas list; not official IRCC advice. Upload is a demo: only the file name and Done state are saved in your browser; file contents are never read or stored.</p><ul class="check" style="list-style:none;padding:0">'
  +cl.map(function(r,i){return '<li class="card req"><div class="req-main"><strong>'+(r.done?'✓ Done':'○ To do')+' — '+esc(r.label)+'</strong></div><div class="req-side"><label class="btn">Upload (demo)<input type="file" data-upload="'+i+'" style="position:absolute;opacity:0;width:1px;height:1px" aria-label="Upload demo file for '+esc(r.label)+'"></label>'+(r.filename?'<span class="muted req-file">File (name only): '+esc(r.filename)+'</span>':'')+'</div></li>';}).join('')+'</ul>';
  document.querySelectorAll('[data-upload]').forEach(function(inp){inp.addEventListener('change',function(){if(inp.files&&inp.files[0]){var r=cl[Number(inp.getAttribute('data-upload'))];r.done=true;r.filename=inp.files[0].name;app.updatedAt=S.today();S.save(data);render();}});});
 } render();
}
if(page==='tasks'){
 var auto=[]; data.applications.filter(function(a){return a.clientId==='c-demo';}).forEach(function(a){S.ensureChecklist(data,a).forEach(function(r){if(!r.done)auto.push({app:a,r:r});});}); S.save(data);
 $('autoTasks').innerHTML=auto.length?auto.map(function(x){return '<li class="card"><strong>Missing: '+esc(x.r.label)+'</strong><br><a href="application.html?id='+x.app.id+'">Open '+esc(x.app.type)+' application</a></li>';}).join(''):'<li class="card">All sample checklist items are done.</li>';
 function renderTasks(){ $('ownerTasks').innerHTML=data.tasks.map(function(t,i){return '<li class="card"><label style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" data-task="'+i+'" '+(t.done?'checked':'')+' style="width:auto;margin-top:5px"><span><strong>'+esc(t.title)+'</strong><br><span class="muted">Due '+esc(t.due)+' · Sample task</span></span></label></li>';}).join('');
  document.querySelectorAll('[data-task]').forEach(function(c){c.addEventListener('change',function(){data.tasks[Number(c.getAttribute('data-task'))].done=c.checked;S.save(data);});});}
 renderTasks();
}
if(page==='profile'){
 var c=clientById('c-demo'); var f=$('profileForm');
 ['first','last','phone','email','address','language','dob'].forEach(function(k){if(f.elements[k])f.elements[k].value=c[k]||'';});
 f.addEventListener('submit',function(e){e.preventDefault();['first','last','phone','email','address','language','dob'].forEach(function(k){c[k]=f.elements[k].value.trim();});c.updatedAt=S.today();S.save(data);$('profileMsg').textContent='Saved (demo). Your changes are stored only in this browser’s local storage.';});
 wireReset();
}

/* ================= OWNER: dashboard ================= */
if(page==='owner-dashboard'){
 function render(){
  var active=data.applications.filter(function(a){return a.status==='Active';}).length;
  var awaiting=data.applications.filter(function(a){return S.progress(data,a)<100;}).length;
  $('kpis').innerHTML=[['Revenue','$12,400 — sample demo figure'],['Total clients',data.clients.length],['Active cases',active],['Awaiting documents',awaiting]].map(function(k){return '<article class="card"><p class="muted">'+k[0]+'</p><h2>'+esc(k[1])+'</h2><p><span class="demo-pill">Demo — sample data only</span></p></article>';}).join('');
  var counts={}; S.STATUSES.forEach(function(s){counts[s]=0;}); data.applications.forEach(function(a){counts[a.status]=(counts[a.status]||0)+1;});
  var max=Math.max.apply(null,Object.values(counts).concat([1]));
  $('chart').innerHTML=Object.keys(counts).map(function(k){var w=Math.round(counts[k]/max*100);return '<div style="margin:10px 0"><span>'+esc(k)+' ('+counts[k]+')</span><div class="bar" role="img" aria-label="'+esc(k)+': '+counts[k]+' cases"><i style="width:'+w+'%"></i></div></div>';}).join('')
   +'<table><caption class="muted">Cases by status (data table for the chart above)</caption><tr><th>Status</th><th>Cases</th></tr>'+Object.keys(counts).map(function(k){return '<tr><td>'+esc(k)+'</td><td>'+counts[k]+'</td></tr>';}).join('')+'</table>';
  var today=S.today(); var overdue=data.applications.filter(function(a){return a.due<today&&a.status!=='Approved'&&a.status!=='Cancelled';});
  $('overdue').innerHTML=overdue.length?overdue.map(function(a){return '<li>'+esc(S.clientName(clientById(a.clientId)))+' — '+esc(a.type)+' · due '+esc(a.due)+' · '+esc(a.status)+'</li>';}).join(''):'<li>No overdue sample cases.</li>';
  $('recent').innerHTML=data.applications.slice().reverse().slice(0,10).map(function(a,i){return '<tr><td>'+(i+1)+'</td><td>'+esc(S.clientName(clientById(a.clientId)))+'</td><td>'+esc(a.type)+'</td><td>'+badge(a.status)+'</td><td>'+esc(a.due)+'</td></tr>';}).join('');
 }
 $('appClient').innerHTML=data.clients.map(function(c){return '<option value="'+c.id+'">'+esc(S.clientName(c))+'</option>';}).join('');
 $('appType').innerHTML=visaOptions();
 $('addApp').addEventListener('submit',function(e){e.preventDefault();var a={id:'a-'+Date.now(),clientId:$('appClient').value,type:$('appType').value,status:$('appStatus').value,date:S.today(),due:$('appDue').value||'2026-12-31',createdAt:S.today(),updatedAt:S.today(),progress:0};data.applications.push(a);S.save(data);render();$('addMsg').textContent='Added sample application for '+S.clientName(clientById(a.clientId))+'.';});
 render();
}

/* ================= OWNER: clients ================= */
if(page==='clients'){
 var per=20, cur=1, editingId=null;
 $('newVisaType').innerHTML=visaOptions(); $('editVisaType').innerHTML=visaOptions();
 function filtered(){var q=$('search').value.toLowerCase(), st=$('fStatus').value, ty=$('fType').value;
  return data.clients.filter(function(c){var apps=data.applications.filter(function(a){return a.clientId===c.id;});var name=S.clientName(c).toLowerCase();
   return (!q||name.indexOf(q)>-1||apps.some(function(a){return a.type.toLowerCase().indexOf(q)>-1;})) && (!st||apps.some(function(a){return a.status===st;})) && (!ty||apps.some(function(a){return a.type===ty;}));});}
 function render(){var list=filtered();var pages=Math.max(1,Math.ceil(list.length/per));if(cur>pages)cur=pages;var slice=list.slice((cur-1)*per,cur*per);
  $('clientRows').innerHTML=slice.map(function(c){var apps=data.applications.filter(function(a){return a.clientId===c.id;});var latest=apps[apps.length-1];return '<tr><td>'+esc(S.clientName(c))+'</td><td>'+esc(c.email)+'</td><td>'+esc(c.phone)+'</td><td>'+apps.length+'</td><td>'+(latest?esc(latest.type)+' · '+esc(latest.status):'—')+'</td><td><button type="button" class="icon-btn" data-edit-client="'+c.id+'" aria-label="Edit client '+esc(S.clientName(c))+'" title="Edit client">'+PENCIL+'</button></td></tr>';}).join('');
  $('pageInfo').textContent='Page '+cur+' of '+pages+' · '+list.length+' sample clients';
  $('prevPage').disabled=cur<=1; $('nextPage').disabled=cur>=pages;
  document.querySelectorAll('[data-edit-client]').forEach(function(b){b.addEventListener('click',function(){openEdit(b.getAttribute('data-edit-client'),b);});});}
 function renderEditApps(){var apps=data.applications.filter(function(a){return a.clientId===editingId;});
  $('editApps').innerHTML=apps.length?apps.map(function(a){return '<li class="card"><strong>'+esc(a.type)+'</strong> · '+badge(a.status)+'<br><span class="muted">Created '+esc(a.createdAt||a.date)+' · Updated '+esc(a.updatedAt||a.createdAt||a.date)+' · Due '+esc(a.due)+'</span></li>';}).join(''):'<li class="card">No applications yet.</li>';}
 function openEdit(cid,btn){editingId=cid;var c=clientById(cid);$('editFirst').value=c.first||'';$('editMiddle').value=c.middle||'—';$('editLast').value=c.last||'';$('editEmail').value=c.email;$('editPhone').value=c.phone;$('editClientName').textContent=S.clientName(c);renderEditApps();openModal('editClientModal');if(btn)lastFocus=btn;}
 $('addClientBtn').addEventListener('click',function(){openModal('addClientModal');});
 $('addClientForm').addEventListener('submit',function(e){e.preventDefault();
  var first=$('newFirst').value.trim(),last=$('newLast').value.trim(),email=$('newEmail').value.trim(),type=$('newVisaType').value;
  var err=''; if(!first)err='First name is required.'; else if(!last)err='Last name is required.'; else if(!email||email.indexOf('@')<1)err='A valid demo email is required (e.g. name@demo.ca).'; else if(!type)err='Visa application type is required.';
  $('addClientError').textContent=err; if(err)return;
  var c={id:'c-'+Date.now(),first:first,middle:$('newMiddle').value.trim(),last:last,email:email,phone:$('newPhone').value.trim(),address:'',language:'',dob:'',createdAt:S.today(),updatedAt:S.today()};
  data.clients.push(c);
  data.applications.push({id:'a-'+Date.now(),clientId:c.id,type:type,status:'New',date:S.today(),due:$('newDue').value||'2026-12-31',createdAt:S.today(),updatedAt:S.today(),progress:0});
  S.save(data); closeModal('addClientModal'); e.target.reset(); cur=1; render();});
 $('editClientForm').addEventListener('submit',function(e){e.preventDefault();var c=clientById(editingId);c.email=$('editEmail').value.trim();c.phone=$('editPhone').value.trim();c.updatedAt=S.today();S.save(data);$('editMsg').textContent='Contact details saved (demo).';render();});
 $('addAppForClient').addEventListener('click',function(){if(!editingId)return;var a={id:'a-'+Date.now(),clientId:editingId,type:$('editVisaType').value,status:'New',date:S.today(),due:$('editDue').value||'2026-12-31',createdAt:S.today(),updatedAt:S.today(),progress:0};data.applications.push(a);S.save(data);renderEditApps();render();$('editMsg').textContent='Added '+a.type+' application (demo).';});
 ['search','fStatus','fType'].forEach(function(id){$(id).addEventListener('input',function(){cur=1;render();});});
 $('prevPage').addEventListener('click',function(){cur--;render();}); $('nextPage').addEventListener('click',function(){cur++;render();}); render();
}

/* ================= OWNER: documents ================= */
if(page==='documents'){
 var pendingDelete=null;
 function render(){var ty=$('dType').value;var list=data.documents.filter(function(d){return !ty||d.type===ty;});
  $('docRows').innerHTML=list.map(function(d){return '<tr><td>'+esc(d.name)+'</td><td>'+esc(d.version)+'</td><td>'+esc(d.type)+'</td><td>'+esc(d.status)+'</td><td>'+esc(d.createdAt)+'</td><td>'+esc(d.updatedAt)+'</td><td>'+d.uploaded+(d.sampleFileName?'<br><span class="muted">Sample file: '+esc(d.sampleFileName)+'</span>':'')+'</td><td style="white-space:nowrap"><button type="button" class="icon-btn" data-edit="'+d.id+'" aria-label="Edit document '+esc(d.name)+'" title="Edit document">'+PENCIL+'</button> <button type="button" class="icon-btn danger" data-del="'+d.id+'" aria-label="Delete document '+esc(d.name)+'" title="Delete document">'+TRASH+'</button></td></tr>';}).join('');
  document.querySelectorAll('[data-edit]').forEach(function(b){b.addEventListener('click',function(){var d=S.docById(data,b.getAttribute('data-edit'));$('docId').value=d.id;$('docName').value=d.name;$('docTypeForm').value=d.type;$('docVersion').value=d.version;$('docStatus').value=d.status;$('docFileName').textContent=d.sampleFileName?('Sample file (name only): '+d.sampleFileName):'';openModal('docModal');lastFocus=b;});});
  document.querySelectorAll('[data-del]').forEach(function(b){b.addEventListener('click',function(){pendingDelete=b.getAttribute('data-del');var d=S.docById(data,pendingDelete);$('deleteMsg').textContent='Delete “'+d.name+'” (demo)? It will also be removed from any visa required-document lists that use it.';openModal('confirmModal');lastFocus=b;});});}
 $('confirmDelete').addEventListener('click',function(){if(!pendingDelete)return;data.documents=data.documents.filter(function(d){return d.id!==pendingDelete;});data.visas.forEach(function(v){v.docIds=v.docIds.filter(function(id){return id!==pendingDelete;});v.updatedAt=S.today();});pendingDelete=null;S.save(data);closeModal('confirmModal');render();});
 $('dType').addEventListener('input',render);
 $('addDocBtn').addEventListener('click',function(){$('docForm').reset();$('docId').value='';$('docFileName').textContent='';openModal('docModal');});
 $('docFile').addEventListener('change',function(){var d=S.docById(data,$('docId').value);var name=$('docFile').files[0]?$('docFile').files[0].name:'';if(name){$('docFileName').textContent='Sample file (name only): '+name;if(d){d.sampleFileName=name;d.updatedAt=S.today();S.save(data);render();}else{$('docFileName').dataset.pending=name;}}});
 $('docForm').addEventListener('submit',function(e){e.preventDefault();var today=S.today();var id=$('docId').value;
  if(id){var d=S.docById(data,id);d.name=$('docName').value;d.type=$('docTypeForm').value;d.version=$('docVersion').value;d.status=$('docStatus').value;d.updatedAt=today;if($('docFileName').dataset.pending){d.sampleFileName=$('docFileName').dataset.pending;delete $('docFileName').dataset.pending;}$('docMsg').textContent='Updated sample document.';}
  else{data.documents.push({id:'d-'+Date.now(),name:$('docName').value,type:$('docTypeForm').value,version:$('docVersion').value||'v1.0',status:$('docStatus').value,createdAt:today,updatedAt:today,uploaded:0,sampleFileName:$('docFileName').dataset.pending||''});delete $('docFileName').dataset.pending;$('docMsg').textContent='Added sample document.';}
  S.save(data);closeModal('docModal');render();});
 render();
}

/* ================= OWNER: visas ================= */
if(page==='visas'){
 var editingVisa=null, selAvail=new Set(), selReq=new Set();
 function dualList(el,docs,selected,onToggle){$(el).innerHTML=docs.length?docs.map(function(d){return '<li tabindex="0" role="option" aria-selected="'+(selected.has(d.id)?'true':'false')+'" data-doc="'+d.id+'">'+esc(d.name)+'</li>';}).join(''):'<li aria-disabled="true">None</li>';
  $(el).querySelectorAll('[data-doc]').forEach(function(li){function tog(){var id=li.getAttribute('data-doc');selected.has(id)?selected.delete(id):selected.add(id);dualList(el,docs,selected,onToggle);}li.addEventListener('click',tog);li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();tog();}});});}
 function renderPicker(){var chosen=pickerChosen;
  var avail=data.documents.filter(function(d){return chosen.indexOf(d.id)<0;});var req=chosen.map(function(id){return S.docById(data,id);}).filter(Boolean);
  dualList('availList',avail,selAvail);dualList('reqList',req,selReq);pickerChosen=chosen;}
 var pickerChosen=[];
 function currentPickerSelection(){return pickerChosen;}
 function move(toReq){var from=toReq?selAvail:selReq;var list=Array.from(from);
  if(toReq){list.forEach(function(id){if(pickerChosen.indexOf(id)<0)pickerChosen.push(id);});selAvail.clear();}
  else{pickerChosen=pickerChosen.filter(function(id){return list.indexOf(id)<0;});selReq.clear();}
  renderPicker();}
 $('moveRight').addEventListener('click',function(){move(true);}); $('moveLeft').addEventListener('click',function(){move(false);});
 function render(){/* Display-only sort: effective date DESC (newest first); missing/invalid dates last; stable via original index. Stored order in data.visas is NOT mutated, so dropdowns elsewhere keep their order. */
  var sorted=data.visas.map(function(v,i){return {v:v,i:i};}).sort(function(a,b){var ta=Date.parse(a.v.effective),tb=Date.parse(b.v.effective);var va=!isNaN(ta),vb=!isNaN(tb);if(va&&vb)return (tb-ta)||(a.i-b.i);if(va)return -1;if(vb)return 1;return a.i-b.i;}).map(function(x){return x.v;});
  $('visaRows').innerHTML=sorted.map(function(v){return '<tr><td><strong>'+esc(v.name)+'</strong></td><td>'+esc(v.effective)+'</td><td>'+esc(v.notes)+'</td><td>'+v.docIds.length+'</td><td>'+esc(v.createdAt)+'</td><td>'+esc(v.updatedAt)+'</td><td><button type="button" class="icon-btn" data-edit-visa="'+v.id+'" aria-label="Edit visa '+esc(v.name)+'" title="Edit visa">'+PENCIL+'</button></td></tr>';}).join('');
  document.querySelectorAll('[data-edit-visa]').forEach(function(b){b.addEventListener('click',function(){editingVisa=b.getAttribute('data-edit-visa');var v=data.visas.find(function(x){return x.id===editingVisa;});$('visaName').value=v.name;$('visaDate').value=v.effective;$('visaNotes').value=v.notes;pickerChosen=v.docIds.slice();selAvail.clear();selReq.clear();renderPicker();openModal('visaModal');lastFocus=b;});});}
 $('addVisaBtn').addEventListener('click',function(){editingVisa=null;$('visaForm').reset();pickerChosen=[];selAvail.clear();selReq.clear();renderPicker();openModal('visaModal');});
 $('visaForm').addEventListener('submit',function(e){e.preventDefault();var name=$('visaName').value.trim();if(!name){$('visaMsg').textContent='Visa type is required.';return;}
  if(editingVisa){var v=data.visas.find(function(x){return x.id===editingVisa;});v.name=name;v.effective=$('visaDate').value;v.notes=$('visaNotes').value;v.docIds=pickerChosen.slice();v.updatedAt=S.today();}
  else{data.visas.push({id:'v-'+Date.now(),name:name,effective:$('visaDate').value||S.today(),notes:$('visaNotes').value,docIds:pickerChosen.slice(),createdAt:S.today(),updatedAt:S.today()});}
  S.save(data);closeModal('visaModal');render();});
 renderPicker(); render();
}
})();
