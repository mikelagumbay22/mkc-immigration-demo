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
var STATUSES=['New','Active','Submitted','Review','Approved','Denied','Cancelled'];
var ALIAS={'Permanent Resident':'Permanent Residence','Student':'Student Visa','Permanent Residence ':'Permanent Residence'};
function alias(t){return ALIAS[t]||t;}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
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
function load(){try{var raw=localStorage.getItem(KEY);if(raw){var d=JSON.parse(raw);if(d&&d.version===2){var ch=stripDocTypes(d);if(migrateApps(d))ch=true;if(migrateDocs(d))ch=true;if(migrateMetrics(d))ch=true;if(migrateSamples(d))ch=true;if(migrateNames(d))ch=true;if(migrateAll(d))ch=true;if(ch)save(d);return d;}}
 var oldRaw=localStorage.getItem(OLDKEY); if(oldRaw){var m=migrate(JSON.parse(oldRaw)); migrateNames(m);migrateAll(m);save(m); return m;}}catch(e){} var s=seed();migrateDocs(s);migrateMetrics(s);migrateSamples(s);migrateNames(s);migrateAll(s);save(s);return s;}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d));return true;}catch(e){if(window.console)console.warn('MKC: could not save (storage full?)');return false;}}
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
 var out=ids.map(function(id){var doc=docById(data,id);var prev=stored[id]||{};var r={docId:id,label:doc?doc.name:('Document '+id),done:!!prev.done};if(Array.isArray(prev.files)){r.files=prev.files;r.seq=prev.seq||prev.files.length;r.done=prev.files.length>0;}else if(data.filesV>=1){r.files=[];r.seq=0;r.done=false;}else if(prev.filename)r.filename=prev.filename;if(prev.status)r.status=prev.status;if(prev.submittedAt)r.submittedAt=prev.submittedAt;return r;});
 data.checklists[app.id]=out; return out;}
/* Document submissions (v2, docsV:1). Each checklist row may carry status ('received'|'pending review'|'approved')
   and submittedAt (YYYY-MM-DD). Rows that are not done are 'missing'. Safe, one-time migration:
   - rows already Done keep their filename; missing status/date get defaults ('received', the app's updated/created date)
   - an application with NO submitted rows gets a few sample submissions (filenames only) — rows a user has touched are never changed */
var DOC_STATUSES=['received','pending review','approved'];var FILE_STATUSES=['received','pending review','approved','rejected'];
function slug(t){return String(t||'document').toLowerCase().replace(/\(sample\)/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function addDays(d,n){var t=Date.parse(d);if(isNaN(t))return today();return new Date(t+n*864e5).toISOString().slice(0,10);}
function docStatus(r){return r&&r.done?(r.status||'received'):'missing';}
function migrateDocs(data){if(data.docsV>=1)return false;data.checklists=data.checklists||{};
 (data.applications||[]).forEach(function(a,ai){var cl=ensureChecklist(data,a);var base=a.createdAt||a.date||'2026-09-01';
  var any=cl.some(function(r){return r.done||r.filename;});
  if(any){cl.forEach(function(r){if(r.done){if(!r.status)r.status='received';if(!r.submittedAt)r.submittedAt=a.updatedAt||base;}});return;}
  if(a.status==='New'||!cl.length)return; // brand-new applications start with nothing submitted
  var n=Math.max(1,cl.length-1-(ai%2)); // leave 1–2 required docs missing
  cl.slice(0,n).forEach(function(r,i){r.done=true;r.filename='sample-'+slug(r.label)+'.pdf';r.status=DOC_STATUSES[(ai+i)%3];r.submittedAt=addDays(base,3+i*4);});});
 data.docsV=1;return true;}
/* Monthly metrics (docs: README). data.metrics = {v:1, revenue:{'YYYY-MM':dollars}, clients:{'YYYY-MM':month-end client total}}.
   No history exists in the sample data, so values are seeded ONCE from a fixed seed and stored; later months are filled
   deterministically from the month key. The CURRENT month's client total is always live (data.clients.length). Never overwrites stored months. */
function monthKeys(n,end){var d=end?new Date(end+'-01T12:00:00'):new Date();var out=[];for(var i=n-1;i>=0;i--){var x=new Date(d.getFullYear(),d.getMonth()-i,1);out.push(x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0'));}return out;}
function hash(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function seededRevenue(k){var r=hash('mkc-rev-'+k)%1000/1000;var m=+k.slice(5);var season=[0.82,0.86,1.0,1.08,1.12,1.04,0.96,0.9,1.15,1.2,1.06,0.88][m-1];return Math.round((7800+r*4200)*season/50)*50;}
function migrateMetrics(data){var ch=false;var M=data.metrics;if(!M||M.v!==1){M=data.metrics={v:1,revenue:{},clients:{}};ch=true;}
 var keys=monthKeys(12),n=(data.clients||[]).length;
 keys.forEach(function(k,i){if(M.revenue[k]==null){M.revenue[k]=seededRevenue(k);ch=true;}
  if(i<keys.length-1&&M.clients[k]==null){var prev=null;for(var j=i-1;j>=0;j--){if(M.clients[keys[j]]!=null){prev=M.clients[keys[j]];break;}}
   var base=prev==null?Math.max(1,Math.round(n*0.55)):prev;var step=hash('mkc-cli-'+k)%3;M.clients[k]=Math.min(n,base+step);ch=true;}});
 /* status history (added later): data.metrics.status{'YYYY-MM':{status:n}} for past months, seeded once; current month is live */
 if(!M.status){M.status={};ch=true;}
 var sts=STATUSES.slice();(data.applications||[]).forEach(function(a){if(a.status&&sts.indexOf(a.status)<0)sts.push(a.status);});
 var w={New:.14,Submitted:.2,Active:.3,Approved:.2,Denied:.08,Cancelled:.08};
 keys.forEach(function(k,i){if(i===keys.length-1||M.status[k])return;var tot=Math.max(4,Math.round((M.clients[k]||n)*1.05));var o={};
  sts.forEach(function(st){var j=(hash('mkc-st-'+k+'-'+st)%100)/100;o[st]=Math.max(0,Math.round(tot*(w[st]||.05)*(0.6+0.8*j)));});M.status[k]=o;ch=true;});
 return ch;}
/* Requirement samples (samplesV:1). doc.sample = {name,type,size,dataUrl,addedAt} or absent. Files are stored as data URLs in mkc_demo_v2
   (owner-attached, max SAMPLE_MAX bytes each). Migration: a legacy filename-only doc.sampleFileName becomes a metadata-only sample
   (no dataUrl); seeds from sample-seeds.js are added once to d1/d2/d8 if those docs exist and have no sample. */
var SAMPLE_MAX=1.5*1024*1024;
function migrateSamples(data){if(data.samplesV>=1)return false;var seeds=window.MKC_SAMPLE_SEEDS||{};
 (data.documents||[]).forEach(function(d){if(!d.sample&&d.sampleFileName){d.sample={name:d.sampleFileName,type:'',size:0,dataUrl:'',addedAt:d.updatedAt||today()};}
  if(!d.sample&&seeds[d.id]){var x=seeds[d.id];d.sample={name:x.name,type:x.type,size:x.size,dataUrl:x.dataUrl,addedAt:'2026-10-01'};}
  if('sampleFileName' in d)delete d.sampleFileName;});
 data.samplesV=1;return true;}

/* Standard file names (namesV:1). Uploaded files are renamed MKC-{clientCode}-{visaCode}-{docCode}-{YYYYMMDD}.{ext}.
   Codes live on client.code, visa.code and doc.code (uppercase); records without one get a code derived from their name. */
var VISA_CODES={'v-work':'WP','v-visitor':'VV','v-tourist':'TV','v-pr':'PR','v-student':'SP','v-cit':'CIT','v-general':'GEN'};
var DOC_CODES={d1:'PASSPORT',d2:'FORMS',d3:'PHOTOS',d4:'LETTERS',d5:'FEES',d6:'STUDY',d7:'ITINERARY',d8:'EMPLOYMENT',d9:'FUNDS',d10:'INVITATION',d11:'LANGUAGE',d12:'RESIDENCE',d13:'ACCEPTANCE',d14:'NOTES'};
function codeFrom(t,max){var w=String(t||'').replace(/\(sample\)/ig,'').toUpperCase().replace(/[^A-Z0-9 ]+/g,' ').trim().split(/\s+/)[0]||'DOC';return w.slice(0,max||12);}
function clientCode(c){if(!c)return 'C000';if(c.code)return c.code;if(c.id==='c-demo')return 'C001';var m=/^c(\d+)$/.exec(c.id||'');return m?'C'+String(Number(m[1])+1).padStart(3,'0'):codeFrom(c.id,8);}
function visaCode(v){return v?(v.code||VISA_CODES[v.id]||codeFrom(v.name,4)):'GEN';}
function docCode(d){return d?(d.code||DOC_CODES[d.id]||codeFrom(d.name,12)):'DOC';}
function stdName(data,app,docId,ext,date){var c=(data.clients||[]).find(function(x){return x.id===app.clientId;});
 var e=String(ext||'pdf').replace(/^\./,'').toLowerCase().replace(/[^a-z0-9]/g,'')||'pdf';
 return ['MKC',clientCode(c),visaCode(visaFor(data,app)),docCode(docById(data,docId)),String(date||today()).replace(/-/g,'')].join('-').toUpperCase()+'.'+e;}
function extOf(n){var m=/\.([A-Za-z0-9]{1,8})$/.exec(n||'');return m?m[1].toLowerCase():'pdf';}
function migrateNames(data){if(data.namesV>=1)return false;
 (data.clients||[]).forEach(function(c){if(!c.code)c.code=clientCode(c);});
 (data.visas||[]).forEach(function(v){if(!v.code)v.code=visaCode(v);});
 (data.documents||[]).forEach(function(d){if(!d.code)d.code=docCode(d);});
 (data.applications||[]).forEach(function(a){(data.checklists[a.id]||[]).forEach(function(r){if(r.filename)r.filename=stdName(data,a,r.docId,extOf(r.filename),r.submittedAt||a.updatedAt||a.createdAt);});});
 data.namesV=1;return true;}

/* ---- filesV:1 — multiple uploads per requirement. row.files=[{name,at,status}], row.seq = last -NN used (never reused),
   row.done = files.length>0, row.status/submittedAt mirror the newest file for older code. */
function fileName(data,app,r,ext,date){r.seq=(r.seq||0)+1;return stdName(data,app,r.docId,ext,date).replace(/(\.[a-z0-9]+)$/,'-'+String(r.seq).padStart(2,'0')+'$1');}
function syncRow(r){r.files=r.files||[];r.done=r.files.length>0;var last=r.files[r.files.length-1];if(last){r.status=last.status;r.submittedAt=last.at;}else{delete r.status;delete r.submittedAt;}}
/* Auto Review: every required doc has >=1 upload -> status 'Review' (previous status kept in reviewFrom); falls back when no longer complete. */
var REVIEWABLE=['New','Active','Submitted'];
function syncReview(data,app){var visa=visaFor(data,app);if(!visa||!visa.docIds.length)return false;var cl=ensureChecklist(data,app);
 var complete=cl.every(function(r){return r.files&&r.files.length;});
 if(complete&&REVIEWABLE.indexOf(app.status)>-1){app.reviewFrom=app.status;app.status='Review';app.updatedAt=today();return true;}
 if(!complete&&app.status==='Review'){app.status=app.reviewFrom||'Active';delete app.reviewFrom;app.updatedAt=today();return true;}
 return false;}
function migrateFiles(data){if(data.filesV>=1)return false;
 (data.applications||[]).forEach(function(a){(data.checklists[a.id]||[]).forEach(function(r){if(!Array.isArray(r.files)){r.files=[];if(r.filename){var m=/^(.*?)(\.[A-Za-z0-9]+)$/.exec(r.filename)||[0,r.filename,'.pdf'];r.files.push({name:m[1]+'-01'+m[2].toLowerCase(),at:r.submittedAt||a.updatedAt||today(),status:r.status||'received'});r.seq=1;}}delete r.filename;syncRow(r);});});
 data.filesV=1;return true;}
/* ---- copyV:1 — realistic names/notices, no 'Sample'/'demo' wording in user-visible data. ---- */
var NAMES=[['Amara','Okafor'],['Priya','Sharma'],['Mateo','Fernández'],['Wei','Chen'],['Fatima','Al-Sayed'],['Liam','O’Connor'],['Aiko','Tanaka'],['Kwame','Mensah'],['Sofia','Rossi'],['Arjun','Patel'],['Nadia','Haddad'],['Diego','Morales'],['Mei Lin','Wong'],['Oluwaseun','Adeyemi'],['Elena','Petrova'],['Hassan','Rahimi'],['Gabriela','Silva'],['Tomasz','Nowak'],['Ananya','Iyer'],['Jamal','Williams'],['Yuki','Nakamura'],['Carmen','Ortiz'],['Daniel','Kim'],['Leila','Moradi'],['Samuel','Osei']];
var IRCC_URL='https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html';
function announcementsSeed(){return [
 {date:'2026-10-15',title:'Office hours',body:'Our office is open Monday to Friday, 8:00 a.m. to 5:00 p.m. Messages received after hours or on weekends are answered the next business day.'},
 {date:'2026-10-12',title:'Holiday closure',body:'Our office will be closed on Friday, December 25 and Monday, December 28, 2026 (Boxing Day observed), and on Friday, January 1, 2027. Regular hours resume the next business day.'},
 {date:'2026-10-05',title:'IRCC processing times',body:'Processing times are set by IRCC and change often. For the current estimate for your application type, check IRCC’s official processing times page. We will let you know of any update on your file.',link:{href:IRCC_URL,text:'Check IRCC processing times'}}];}
function tasksSeed(){return [{id:'t1',title:'Review your uploaded documents',due:'2026-12-10',done:false,appId:'a1'},{id:'t2',title:'Confirm your next appointment by phone',due:'2026-10-10',done:false,appId:'a2'},{id:'t3',title:'Prepare questions for your consultation',due:'2026-12-20',done:true,appId:'a1'}];}
function cleanName(t){return String(t||'').replace(/\s*\(sample\)/ig,'').trim();}
function migrateCopy(data){if(data.copyV>=1)return false;
 (data.clients||[]).forEach(function(c){var idx=c.id==='c-demo'?0:(/^c(\d+)$/.exec(c.id)||[])[1];
  if(idx!==undefined&&/^Sample/.test(c.first||'')){var n=NAMES[Number(idx)]||NAMES[0];c.first=n[0];c.last=n[1];}});
 (data.documents||[]).forEach(function(d){d.name=cleanName(d.name);});
 Object.keys(data.checklists||{}).forEach(function(k){(data.checklists[k]||[]).forEach(function(r){r.label=cleanName(r.label);});});
 (data.visas||[]).forEach(function(v){if(/sample|demo/i.test(v.notes||''))v.notes='Core document checklist for this visa type.';});
 (data.tasks||[]).forEach(function(t){t.title=String(t.title||'').replace(/^Sample owner task:\s*/i,'');t.title=t.title.charAt(0).toUpperCase()+t.title.slice(1);});
 data.announcements=announcementsSeed();
 data.copyV=1;return true;}
/* emailsV:1 — seeded emails become firstname.lastname@example.com (lowercase ASCII; accents stripped, apostrophes/spaces dropped).
   Only rewrites emails still matching the old seeded pattern (client@demo.ca for c-demo, sampleNN@demo.ca for cN); edited emails are kept.
   Login is separate (hard-coded in login.html) and unaffected. */
function emailPart(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function migrateEmails(data){if(data.emailsV>=1)return false;
 (data.clients||[]).forEach(function(c){var old=c.id==='c-demo'?c.email==='client@demo.ca':/^sample\d{2}@demo\.ca$/.test(c.email||'');
  var f=emailPart(c.first),l=emailPart(c.last);if(old&&f&&l)c.email=f+'.'+l+'@example.com';});
 data.emailsV=1;return true;}
function migrateAll(d){var ch=false;if(migrateFiles(d))ch=true;if(migrateCopy(d))ch=true;if(migrateEmails(d))ch=true;if(!d.reviewV){(d.applications||[]).forEach(function(a){syncReview(d,a);});d.reviewV=1;ch=true;}return ch;}
/* save that reports quota failures instead of throwing */
function trySave(d){return save(d);}
function progress(data,app){var visa=visaFor(data,app);if(visa){if(!visa.docIds.length)return 100;var stored={};(data.checklists[app.id]||[]).forEach(function(r){stored[r.docId]=r;});var done=visa.docIds.filter(function(id){return stored[id]&&stored[id].done;}).length;return Math.round(done/visa.docIds.length*100);}return typeof app.progress==='number'?app.progress:0;}
function clientName(c){return [c.first,c.middle,c.last].filter(Boolean).join(' ');}
window.MKCStore={fileName:fileName,syncRow:syncRow,syncReview:syncReview,FILE_STATUSES:FILE_STATUSES,stdName:stdName,extOf:extOf,clientCode:clientCode,visaCode:visaCode,docCode:docCode,KEY:KEY,OLDKEY:OLDKEY,TYPES:TYPES,STATUSES:STATUSES,today:today,alias:alias,load:load,save:save,reset:reset,progress:progress,clientName:clientName,visaFor:visaFor,distinctTypes:distinctTypes,visasOfType:visasOfType,effectiveDateOf:effectiveDateOf,docById:docById,ensureChecklist:ensureChecklist,docStatus:docStatus,monthKeys:monthKeys,trySave:trySave,SAMPLE_MAX:SAMPLE_MAX,DOC_STATUSES:DOC_STATUSES,slug:slug,esc:function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}};
})();
