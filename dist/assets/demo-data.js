/* MKC DEMO data store v2 — client-side only, sample data, no backend, no security.
   Stores ONLY sample text, filenames (never file contents/dataURLs), checklist/task state.
   Visas are the source of truth: a client application's checklist is derived from its visa type's required documents.
   Migration: mkc_demo_v1 data (if present) is migrated once — clients/applications kept, types aliased
   (Permanent Resident -> Permanent Residence, Student -> Student Visa), checklist Done/filename state carried
   over by keyword (passport/forms/photos/supporting/fee). Otherwise v2 seeds fresh. Reset clears v2 and reseeds. */
(function(){
"use strict";
var KEY='mkc_demo_v2', OLDKEY='mkc_demo_v1';
var TYPES=['Work Permit','Visitor Visa','Tourist Visa','Permanent Residence','Student Visa','Citizenship','General Consulting'];
var STATUSES=['New','Active','Submitted','Approved','Denied','Cancelled'];
var ALIAS={'Permanent Resident':'Permanent Residence','Student':'Student Visa','Permanent Residence ':'Permanent Residence'};
function alias(t){return ALIAS[t]||t;}
function today(){return new Date().toISOString().slice(0,10);}
function docsSeed(){return [
 {id:'d1',name:'Passport information page (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-01',updatedAt:'2026-09-01',uploaded:8,sampleFileName:''},
 {id:'d2',name:'Government forms — signed (sample)',version:'v1.2',status:'Active',createdAt:'2026-09-03',updatedAt:'2026-09-20',uploaded:6,sampleFileName:''},
 {id:'d3',name:'Photos meeting specifications (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-05',updatedAt:'2026-09-05',uploaded:5,sampleFileName:''},
 {id:'d4',name:'Supporting letters (sample)',version:'v0.9',status:'Draft',createdAt:'2026-09-10',updatedAt:'2026-10-02',uploaded:2,sampleFileName:''},
 {id:'d5',name:'Fee receipts (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-12',updatedAt:'2026-09-12',uploaded:4,sampleFileName:''},
 {id:'d6',name:'Study documents checklist (sample)',version:'v0.5',status:'Draft',createdAt:'2026-09-15',updatedAt:'2026-10-01',uploaded:0,sampleFileName:''},
 {id:'d7',name:'Travel itinerary (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-18',updatedAt:'2026-09-18',uploaded:3,sampleFileName:''},
 {id:'d8',name:'Employment letter (sample)',version:'v1.1',status:'Active',createdAt:'2026-09-22',updatedAt:'2026-10-05',uploaded:7,sampleFileName:''},
 {id:'d9',name:'Proof of funds (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-24',updatedAt:'2026-09-24',uploaded:2,sampleFileName:''},
 {id:'d10',name:'Invitation letter (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-25',updatedAt:'2026-09-25',uploaded:3,sampleFileName:''},
 {id:'d11',name:'Language test results (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-26',updatedAt:'2026-09-26',uploaded:2,sampleFileName:''},
 {id:'d12',name:'Residence history summary (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-27',updatedAt:'2026-09-27',uploaded:1,sampleFileName:''},
 {id:'d13',name:'School acceptance letter (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-28',updatedAt:'2026-09-28',uploaded:2,sampleFileName:''},
 {id:'d14',name:'Consultation notes (sample)',version:'v1.0',status:'Active',createdAt:'2026-09-29',updatedAt:'2026-09-29',uploaded:1,sampleFileName:''}];}
function visasSeed(){function v(id,name,eff,notes,docIds){return {id:id,name:name,effective:eff,notes:notes,docIds:docIds,createdAt:'2026-09-01',updatedAt:'2026-10-01'};}
 return [v('v-work','Work Permit','2026-01-01','Sample visa entry for demo purposes.',['d1','d2','d8','d5']),
 v('v-visitor','Visitor Visa','2026-01-01','Sample visa entry for demo purposes.',['d1','d3','d10','d9']),
 v('v-tourist','Tourist Visa','2026-01-01','Sample visa entry for demo purposes.',['d1','d7','d9','d3']),
 v('v-pr','Permanent Residence','2026-01-01','Sample visa entry for demo purposes.',['d1','d11','d4','d5']),
 v('v-student','Student Visa','2026-01-01','Sample visa entry for demo purposes.',['d1','d13','d6','d9']),
 v('v-cit','Citizenship','2026-01-01','Sample visa entry for demo purposes.',['d1','d5','d12','d3']),
 v('v-general','General Consulting','2026-01-01','Sample entry for general consulting demos.',['d1','d14'])]}
function seed(){
 var clients=[{id:'c-demo',first:'Sample',middle:'',last:'Client',email:'client@demo.ca',phone:'(905) 555-0101',address:'',language:'',dob:'',createdAt:'2026-09-01',updatedAt:'2026-09-01'}];
 for(var i=1;i<=24;i++){clients.push({id:'c'+i,first:'Sample Client',middle:'',last:String(i).padStart(2,'0'),email:'sample'+String(i).padStart(2,'0')+'@demo.ca',phone:'(905) 555-01'+String(i).padStart(2,'0'),address:'',language:'',dob:'',createdAt:'2026-09-01',updatedAt:'2026-09-01'});}
 var apps=[{id:'a1',clientId:'c-demo',type:'Work Permit',visaId:'v-work',effectiveDate:'2026-01-01',status:'Active',date:'2026-09-15',due:'2026-11-15',createdAt:'2026-09-15',updatedAt:'2026-09-15'},
 {id:'a2',clientId:'c-demo',type:'Visitor Visa',visaId:'v-visitor',effectiveDate:'2026-01-01',status:'Submitted',date:'2026-08-20',due:'2026-12-01',createdAt:'2026-08-20',updatedAt:'2026-08-20'}];
 var types=['Work Permit','Visitor Visa','Permanent Residence','Citizenship','General Consulting','Work Permit','Permanent Residence'];
 var stats=['New','Active','Submitted','Approved','Active','Submitted','Denied','Active','Cancelled','Approved'];
 for(var j=1;j<=24;j++){var dt='2026-0'+((j%9)+1)+'-'+String((j%27)+1).padStart(2,'0');apps.push({id:'a-s'+j,clientId:'c'+j,type:types[j%types.length],visaId:({'Work Permit':'v-work','Visitor Visa':'v-visitor','Permanent Residence':'v-pr','Citizenship':'v-cit','General Consulting':'v-general'})[types[j%types.length]],effectiveDate:'2026-01-01',status:stats[j%stats.length],date:dt,due:(j%4===0?'2026-09-':'2026-12-')+String((j%27)+1).padStart(2,'0'),createdAt:dt,updatedAt:dt,progress:[20,45,60,80,35,90,100,55][j%8]});}
 return {version:2,clients:clients,applications:apps,
  checklists:{a2:[{docId:'d1',done:true,filename:'sample-passport-info.pdf'},{docId:'d3',done:true,filename:'sample-photo.jpg'},{docId:'d10',done:true,filename:'sample-invitation.pdf'}]},
  tasks:[{id:'t1',title:'Sample owner task: review uploaded documents',due:'2026-12-10',done:false,appId:'a1'},{id:'t2',title:'Sample owner task: confirm next appointment by phone',due:'2026-10-10',done:false,appId:'a2'},{id:'t3',title:'Sample owner task: prepare consultation notes',due:'2026-12-20',done:true,appId:'a1'}],
  announcements:[{date:'2026-10-15',title:'Sample announcement: office hours reminder',body:'Sample update for demo purposes only. Listed hours are Mon–Fri 8:00 a.m.–5:00 p.m. — please call to confirm.'},{date:'2026-10-01',title:'Sample announcement: welcome to the demo portal',body:'This demo dashboard uses sample data only. No real case information is shown or stored here.'}],
  documents:docsSeed(),visas:visasSeed()};}
function migrate(old){
 var s=seed(); try{
  if(old.clients&&old.clients.length)s.clients=old.clients.map(function(c){c.middle=c.middle||'';c.createdAt=c.createdAt||c.date||'2026-09-01';c.updatedAt=c.updatedAt||c.createdAt;return c;});
  if(old.applications&&old.applications.length)s.applications=old.applications.map(function(a){a.type=alias(a.type);a.createdAt=a.createdAt||a.date||today();a.updatedAt=a.updatedAt||a.createdAt;return a;});
  if(old.documents&&old.documents.length)s.documents=old.documents.map(function(d){delete d.type;delete d.applicationType;d.sampleFileName=d.sampleFileName||'';return d;});
  if(old.tasks)s.tasks=old.tasks; if(old.announcements)s.announcements=old.announcements;
  // carry checklist state by keyword -> docId
  var kw=[['passport','d1'],['form','d2'],['photo','d3'],['support','d4'],['fee','d5']];
  s.checklists={};
  Object.keys(old.checklists||{}).forEach(function(appId){var out={};(old.checklists[appId]||[]).forEach(function(r){if(!r.done)return;var lab=(r.label||'').toLowerCase();kw.forEach(function(k){if(lab.indexOf(k[0])>-1)out[k[1]]={docId:k[1],done:true,filename:r.filename||''};});});s.checklists[appId]=Object.values(out);});
 }catch(e){}
 return s;
}
function stripDocTypes(d){var changed=false;(d.documents||[]).forEach(function(doc){if('type' in doc){delete doc.type;changed=true;}if('applicationType' in doc){delete doc.applicationType;changed=true;}});return changed;}
function load(){try{var raw=localStorage.getItem(KEY);if(raw){var d=JSON.parse(raw);if(d&&d.version===2){var ch=stripDocTypes(d);if(migrateApps(d))ch=true;if(ch)save(d);return d;}}
 var oldRaw=localStorage.getItem(OLDKEY); if(oldRaw){var m=migrate(JSON.parse(oldRaw)); save(m); return m;}}catch(e){} var s=seed();save(s);return s;}
function save(d){localStorage.setItem(KEY,JSON.stringify(d));}
function reset(){localStorage.removeItem(KEY);localStorage.removeItem(OLDKEY);return load();}
function visaFor(data,app){if(app.visaId){var byId=(data.visas||[]).find(function(v){return v.id===app.visaId;});if(byId)return byId;}return (data.visas||[]).find(function(v){return v.name===app.type;});}
function distinctTypes(data){var seen={},out=[];(data.visas||[]).forEach(function(v){if(!seen[v.name]){seen[v.name]=1;out.push(v.name);}});return out;}
function visasOfType(data,type){return (data.visas||[]).map(function(v,i){return {v:v,i:i};}).filter(function(x){return x.v.name===type;}).sort(function(a,b){var ta=Date.parse(a.v.effective),tb=Date.parse(b.v.effective);var va=!isNaN(ta),vb=!isNaN(tb);if(va&&vb)return (tb-ta)||(a.i-b.i);if(va)return -1;if(vb)return 1;return a.i-b.i;}).map(function(x){return x.v;});}
function effectiveDateOf(data,app){if(app.effectiveDate&&!isNaN(Date.parse(app.effectiveDate)))return app.effectiveDate;var v=visaFor(data,app);if(v&&v.effective&&!isNaN(Date.parse(v.effective)))return v.effective;return '';}
/* Legacy migration: apps without visaId get the first visa record matching their type + its effective date.
   The legacy `due` field is KEPT only as an internal field on seeded demo apps for the owner overdue demo; new apps never get one. */
function migrateApps(data){var changed=false;(data.applications||[]).forEach(function(a){if(!a.visaId){var v=(data.visas||[]).find(function(x){return x.name===a.type;});if(v){a.visaId=v.id;if(!a.effectiveDate&&v.effective)a.effectiveDate=v.effective;changed=true;}}});return changed;}
function docById(data,id){return (data.documents||[]).find(function(d){return d.id===id;});}
/* Sync an application's checklist to its visa's required docs, preserving Done/filename by docId. Mutates data.checklists. */
function ensureChecklist(data,app){
 var visa=visaFor(data,app); var stored={}; (data.checklists[app.id]||[]).forEach(function(r){stored[r.docId]=r;});
 var ids=visa?visa.docIds:[];
 var out=ids.map(function(id){var doc=docById(data,id);var prev=stored[id]||{};return {docId:id,label:doc?doc.name:('Sample document '+id),done:!!prev.done,filename:prev.filename||''};});
 data.checklists[app.id]=out; return out;}
function progress(data,app){var visa=visaFor(data,app);if(visa){if(!visa.docIds.length)return 100;var stored={};(data.checklists[app.id]||[]).forEach(function(r){stored[r.docId]=r;});var done=visa.docIds.filter(function(id){return stored[id]&&stored[id].done;}).length;return Math.round(done/visa.docIds.length*100);}return typeof app.progress==='number'?app.progress:0;}
function clientName(c){return [c.first,c.middle,c.last].filter(Boolean).join(' ');}
window.MKCStore={KEY:KEY,OLDKEY:OLDKEY,TYPES:TYPES,STATUSES:STATUSES,today:today,alias:alias,load:load,save:save,reset:reset,progress:progress,clientName:clientName,visaFor:visaFor,distinctTypes:distinctTypes,visasOfType:visasOfType,effectiveDateOf:effectiveDateOf,docById:docById,ensureChecklist:ensureChecklist,esc:function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}};
})();
