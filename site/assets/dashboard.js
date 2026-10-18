(function(){
"use strict";
var S=window.MKCStore, data=S.load(), esc=S.esc, page=document.body.getAttribute('data-page'), role=document.body.getAttribute('data-role');
function $(id){return document.getElementById(id);}
function appById(id){return data.applications.find(function(a){return a.id===id;});}
function clientById(id){return data.clients.find(function(c){return c.id===id;});}
function checklist(app){if(!data.checklists[app.id]){data.checklists[app.id]=S.genericChecklist();S.save(data);}return data.checklists[app.id];}
function badge(st){return '<span class="badge '+esc(st)+'">'+esc(st)+'</span>';}
function signout(){document.querySelectorAll('[data-signout]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();sessionStorage.removeItem('mkc_demo_role');location.href='../index.html';});});}
signout();
/* mobile sidebar toggle */
document.querySelectorAll('[data-menu]').forEach(function(b){b.addEventListener('click',function(){var s=document.querySelector('.side');var open=s.classList.toggle('open');b.setAttribute('aria-expanded',open);});});
function wireReset(){var b=$('resetDemo');if(b)b.addEventListener('click',function(){data=S.reset();location.reload();});}

if(page==='client-dashboard'){
 var mine=data.applications.filter(function(a){return a.clientId==='c-demo';});
 $('announcements').innerHTML=data.announcements.map(function(a){return '<article class="card"><p class="muted">'+esc(a.date)+' · Sample announcement</p><h3>'+esc(a.title)+'</h3><p>'+esc(a.body)+'</p></article>';}).join('');
 $('appCards').innerHTML=mine.map(function(a){var p=S.progress(data,a);return '<article class="card"><p>'+badge(a.status)+' <span class="badge">'+esc(a.type)+'</span></p><h3><a href="application.html?id='+a.id+'">'+esc(a.type)+' application</a></h3><p class="muted">Started '+esc(a.date)+' · Due '+esc(a.due)+'</p><div class="bar" role="progressbar" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100" aria-label="Checklist progress"><i style="width:'+p+'%"></i></div><p>'+p+'% complete</p><a class="btn navy" href="application.html?id='+a.id+'">Open application</a></article>';}).join('');
 wireReset();
}
if(page==='application'){
 var id=new URLSearchParams(location.search).get('id')||'a1'; var app=appById(id)||data.applications[0]; var cl=checklist(app);
 function render(){
  var p=S.progress(data,app); var done=cl.filter(function(x){return x.done;}).length;
  $('appDetail').innerHTML='<p>'+badge(app.status)+' <span class="badge">'+esc(app.type)+'</span></p><h2>'+esc(app.type)+' application</h2><p class="muted">Sample application · Started '+esc(app.date)+' · Due '+esc(app.due)+'</p>'
  +'<div class="bar" role="progressbar" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+p+'%"></i></div><p><strong>'+p+'% complete</strong> · Checklist status: <strong>'+(p===100?'Complete':'Incomplete')+'</strong> ('+done+' of '+cl.length+' done) · Application status badge above stays “'+esc(app.status)+'” as seeded.</p>'
  +'<p class="muted">Sample checklist only — generic examples, not official IRCC advice. Upload is a demo: only the file name and Done state are saved in your browser; file contents are never read or stored.</p><ul class="check" style="list-style:none;padding:0">'
  +cl.map(function(r,i){return '<li class="card"><strong>'+(r.done?'✓ Done':'○ To do')+' — '+esc(r.label)+'</strong>'+(r.filename?'<br><span class="muted">File (name only): '+esc(r.filename)+'</span>':'')+'<br><label class="btn" style="margin-top:10px">Upload (demo)<input type="file" data-upload="'+i+'" style="position:absolute;opacity:0;width:1px;height:1px" aria-label="Upload demo file for '+esc(r.label)+'"></label></li>';}).join('')+'</ul>';
  document.querySelectorAll('[data-upload]').forEach(function(inp){inp.addEventListener('change',function(){if(inp.files&&inp.files[0]){var r=cl[Number(inp.getAttribute('data-upload'))];r.done=true;r.filename=inp.files[0].name;S.save(data);render();}});});
 }
 render();
}
if(page==='tasks'){
 function render(){
  var auto=[]; data.applications.filter(function(a){return a.clientId==='c-demo';}).forEach(function(a){checklist(a).forEach(function(r){if(!r.done)auto.push({app:a,r:r});});});
  $('autoTasks').innerHTML=auto.length?auto.map(function(x){return '<li class="card"><strong>Missing: '+esc(x.r.label)+'</strong><br><a href="application.html?id='+x.app.id+'">Open '+esc(x.app.type)+' application</a></li>';}).join(''):'<li class="card">All sample checklist items are done.</li>';
  $('ownerTasks').innerHTML=data.tasks.map(function(t,i){return '<li class="card"><label style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" data-task="'+i+'" '+(t.done?'checked':'')+' style="width:auto;margin-top:5px"><span><strong>'+esc(t.title)+'</strong><br><span class="muted">Due '+esc(t.due)+' · Sample task</span></span></label></li>';}).join('');
  document.querySelectorAll('[data-task]').forEach(function(c){c.addEventListener('change',function(){data.tasks[Number(c.getAttribute('data-task'))].done=c.checked;S.save(data);});});
 } render();
}
if(page==='profile'){
 var c=clientById('c-demo'); var f=$('profileForm');
 ['first','last','phone','email','address','language','dob'].forEach(function(k){if(f.elements[k])f.elements[k].value=c[k]||'';});
 f.addEventListener('submit',function(e){e.preventDefault();['first','last','phone','email','address','language','dob'].forEach(function(k){c[k]=f.elements[k].value.trim();});S.save(data);$('profileMsg').textContent='Saved (demo). Your changes are stored only in this browser’s local storage.';});
 wireReset();
}
if(page==='owner-dashboard'){
 function render(){
  var active=data.applications.filter(function(a){return a.status==='Active';}).length;
  var awaiting=data.applications.filter(function(a){return S.progress(data,a)<100;}).length;
  $('kpis').innerHTML=[['Revenue','$12,400 — sample demo figure'],['Total clients',data.clients.length],['Active cases',active],['Awaiting documents',awaiting]].map(function(k){return '<article class="card"><p class="muted">'+k[0]+'</p><h2>'+esc(k[1])+'</h2><p><span class="demo-pill">Demo — sample data only</span></p></article>';}).join('');
  var counts={}; S.STATUSES.forEach(function(s){counts[s]=0;}); data.applications.forEach(function(a){counts[a.status]=(counts[a.status]||0)+1;});
  var max=Math.max.apply(null,Object.values(counts).concat([1]));
  $('chart').innerHTML=Object.keys(counts).map(function(k){var w=Math.round(counts[k]/max*100);return '<div style="margin:10px 0"><span>'+esc(k)+' ('+counts[k]+')</span><div class="bar" role="img" aria-label="'+esc(k)+': '+counts[k]+' cases"><i style="width:'+w+'%"></i></div></div>';}).join('')
   +'<table><caption class="muted">Cases by status (data table for the chart above)</caption><tr><th>Status</th><th>Cases</th></tr>'+Object.keys(counts).map(function(k){return '<tr><td>'+esc(k)+'</td><td>'+counts[k]+'</td></tr>';}).join('')+'</table>';
  var today=new Date().toISOString().slice(0,10);
  var overdue=data.applications.filter(function(a){return a.due<today&&a.status!=='Approved'&&a.status!=='Cancelled';});
  $('overdue').innerHTML=overdue.length?overdue.map(function(a){return '<li>'+esc(S.clientName(clientById(a.clientId)))+' — '+esc(a.type)+' · due '+esc(a.due)+' · '+esc(a.status)+'</li>';}).join(''):'<li>No overdue sample cases.</li>';
  $('recent').innerHTML=data.applications.slice().reverse().slice(0,10).map(function(a,i){return '<tr><td>'+(i+1)+'</td><td>'+esc(S.clientName(clientById(a.clientId)))+'</td><td>'+esc(a.type)+'</td><td>'+badge(a.status)+'</td><td>'+esc(a.due)+'</td></tr>';}).join('');
 }
 var sel=$('appClient'); sel.innerHTML=data.clients.map(function(c){return '<option value="'+c.id+'">'+esc(S.clientName(c))+'</option>';}).join('');
 $('addApp').addEventListener('submit',function(e){e.preventDefault();var a={id:'a-'+Date.now(),clientId:sel.value,type:$('appType').value,status:$('appStatus').value,date:new Date().toISOString().slice(0,10),due:$('appDue').value||'2026-12-31',progress:0};data.applications.push(a);S.save(data);render();$('addMsg').textContent='Added sample application for '+S.clientName(clientById(a.clientId))+'.';});
 render();
}
if(page==='clients'){
 var per=20, cur=1;
 function filtered(){var q=$('search').value.toLowerCase(), st=$('fStatus').value, ty=$('fType').value;
  return data.clients.filter(function(c){var apps=data.applications.filter(function(a){return a.clientId===c.id;});
   var name=S.clientName(c).toLowerCase();
   return (!q||name.indexOf(q)>-1||apps.some(function(a){return a.type.toLowerCase().indexOf(q)>-1;})) && (!st||apps.some(function(a){return a.status===st;})) && (!ty||apps.some(function(a){return a.type===ty;}));});}
 function render(){var list=filtered();var pages=Math.max(1,Math.ceil(list.length/per));if(cur>pages)cur=pages;var slice=list.slice((cur-1)*per,cur*per);
  $('clientRows').innerHTML=slice.map(function(c){var apps=data.applications.filter(function(a){return a.clientId===c.id;});var latest=apps[apps.length-1];return '<tr><td>'+esc(S.clientName(c))+'</td><td>'+esc(c.email)+'</td><td>'+esc(c.phone)+'</td><td>'+apps.length+'</td><td>'+(latest?esc(latest.type)+' · '+esc(latest.status):'—')+'</td></tr>';}).join('');
  $('pageInfo').textContent='Page '+cur+' of '+pages+' · '+list.length+' sample clients';
  $('prevPage').disabled=cur<=1; $('nextPage').disabled=cur>=pages;}
 ['search','fStatus','fType'].forEach(function(id){$(id).addEventListener('input',function(){cur=1;render();});});
 $('prevPage').addEventListener('click',function(){cur--;render();}); $('nextPage').addEventListener('click',function(){cur++;render();}); render();
}
if(page==='documents'){
 function render(){var ty=$('dType').value;var list=data.documents.filter(function(d){return !ty||d.type===ty;});
  $('docRows').innerHTML=list.map(function(d){return '<tr><td>'+esc(d.name)+'</td><td>'+esc(d.version)+'</td><td>'+esc(d.type)+'</td><td>'+esc(d.status)+'</td><td>'+esc(d.createdAt)+'</td><td>'+esc(d.updatedAt)+'</td><td>'+d.uploaded+'</td><td><button class="btn" data-edit="'+d.id+'">Edit</button></td></tr>';}).join('');
  document.querySelectorAll('[data-edit]').forEach(function(b){b.addEventListener('click',function(){var d=data.documents.find(function(x){return x.id===b.getAttribute('data-edit');});$('docId').value=d.id;$('docName').value=d.name;$('docTypeForm').value=d.type;$('docVersion').value=d.version;$('docStatus').value=d.status;});});}
 $('dType').addEventListener('input',render);
 $('docForm').addEventListener('submit',function(e){e.preventDefault();var today=new Date().toISOString().slice(0,10);var id=$('docId').value;
  if(id){var d=data.documents.find(function(x){return x.id===id;});d.name=$('docName').value;d.type=$('docTypeForm').value;d.version=$('docVersion').value;d.status=$('docStatus').value;d.updatedAt=today;$('docMsg').textContent='Updated sample document.';}
  else{data.documents.push({id:'d-'+Date.now(),name:$('docName').value,type:$('docTypeForm').value,version:$('docVersion').value||'v1.0',status:$('docStatus').value,createdAt:today,updatedAt:today,uploaded:0});$('docMsg').textContent='Added sample document.';}
  S.save(data);e.target.reset();$('docId').value='';render();});
 render();
}
})();
