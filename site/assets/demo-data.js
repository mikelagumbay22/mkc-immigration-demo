/* MKC DEMO data store — client-side only, sample data, no backend, no security.
   Stores ONLY sample profile text, filenames (never file contents/dataURLs), checklist/task state. */
(function(){
"use strict";
var KEY='mkc_demo_v1';
var TYPES=['Work Permit','Visitor Visa','Permanent Residence','Citizenship','General Consulting'];
var STATUSES=['New','Active','Submitted','Approved','Denied','Cancelled'];
function genericChecklist(){return [
 {id:'r1',label:'Valid passport — information page (sample item)',done:false,filename:''},
 {id:'r2',label:'Government forms, signed (sample item)',done:false,filename:''},
 {id:'r3',label:'Photos meeting specifications (sample item)',done:false,filename:''},
 {id:'r4',label:'Supporting letters (sample item)',done:false,filename:''},
 {id:'r5',label:'Fee receipts (sample item)',done:false,filename:''}];}
function seed(){
 var clients=[{id:'c-demo',first:'Sample',last:'Client',email:'client@demo.ca',phone:'(905) 555-0101',address:'',language:'',dob:''}];
 for(var i=1;i<=24;i++){clients.push({id:'c'+i,first:'Sample Client',last:String(i).padStart(2,'0'),email:'sample'+String(i).padStart(2,'0')+'@demo.ca',phone:'(905) 555-01'+String(i).padStart(2,'0'),address:'',language:'',dob:''});}
 var apps=[
  {id:'a1',clientId:'c-demo',type:'Work Permit',status:'Active',date:'2026-09-15',due:'2026-11-15'},
  {id:'a2',clientId:'c-demo',type:'Visitor Visa',status:'Submitted',date:'2026-08-20',due:'2026-12-01'}];
 var types=['Work Permit','Visitor Visa','Permanent Residence','Citizenship','General Consulting','Work Permit','Permanent Residence'];
 var stats=['New','Active','Submitted','Approved','Active','Submitted','Denied','Active','Cancelled','Approved'];
 for(var j=1;j<=24;j++){apps.push({id:'a-s'+j,clientId:'c'+j,type:types[j%types.length],status:stats[j%stats.length],date:'2026-0'+((j%9)+1)+'-'+String((j%27)+1).padStart(2,'0'),due:(j%4===0?'2026-09-':'2026-12-')+String((j%27)+1).padStart(2,'0'),progress:[20,45,60,80,35,90,100,55][j%8]});}
 var checklists={}; checklists['a1']=genericChecklist(); checklists['a2']=genericChecklist();
 checklists['a2'][0].done=true; checklists['a2'][0].filename='sample-passport-info.pdf';
 checklists['a2'][1].done=true; checklists['a2'][1].filename='sample-forms.pdf';
 checklists['a2'][2].done=true; checklists['a2'][2].filename='sample-photo.jpg';
 return {version:1,clients:clients,applications:apps,checklists:checklists,
  tasks:[{id:'t1',title:'Sample owner task: review uploaded documents',due:'2026-12-10',done:false,appId:'a1'},{id:'t2',title:'Sample owner task: confirm next appointment by phone',due:'2026-10-10',done:false,appId:'a2'},{id:'t3',title:'Sample owner task: prepare consultation notes',due:'2026-12-20',done:true,appId:'a1'}],
  announcements:[{date:'2026-10-15',title:'Sample announcement: office hours reminder',body:'Sample update for demo purposes only. Listed hours are Mon–Fri 8:00 a.m.–5:00 p.m. — please call to confirm.'},{date:'2026-10-01',title:'Sample announcement: welcome to the demo portal',body:'This demo dashboard uses sample data only. No real case information is shown or stored here.'}],
  documents:[
   {id:'d1',name:'Passport information page (sample)',version:'v1.0',type:'Work Permit',status:'Active',createdAt:'2026-09-01',updatedAt:'2026-09-01',uploaded:8},
   {id:'d2',name:'Government forms — signed (sample)',version:'v1.2',type:'Work Permit',status:'Active',createdAt:'2026-09-03',updatedAt:'2026-09-20',uploaded:6},
   {id:'d3',name:'Photos meeting specifications (sample)',version:'v1.0',type:'Visitor Visa',status:'Active',createdAt:'2026-09-05',updatedAt:'2026-09-05',uploaded:5},
   {id:'d4',name:'Supporting letters (sample)',version:'v0.9',type:'Permanent Resident',status:'Draft',createdAt:'2026-09-10',updatedAt:'2026-10-02',uploaded:2},
   {id:'d5',name:'Fee receipts (sample)',version:'v1.0',type:'Citizenship',status:'Active',createdAt:'2026-09-12',updatedAt:'2026-09-12',uploaded:4},
   {id:'d6',name:'Study documents checklist (sample library item)',version:'v0.5',type:'Student',status:'Draft',createdAt:'2026-09-15',updatedAt:'2026-10-01',uploaded:0},
   {id:'d7',name:'Travel itinerary (sample)',version:'v1.0',type:'Tourist Visa',status:'Active',createdAt:'2026-09-18',updatedAt:'2026-09-18',uploaded:3},
   {id:'d8',name:'Employment letter (sample)',version:'v1.1',type:'Work Permit',status:'Active',createdAt:'2026-09-22',updatedAt:'2026-10-05',uploaded:7}]};
}
function load(){try{var raw=localStorage.getItem(KEY);if(raw){var d=JSON.parse(raw);if(d&&d.version===1)return d;}}catch(e){} var s=seed();save(s);return s;}
function save(d){localStorage.setItem(KEY,JSON.stringify(d));}
function reset(){localStorage.removeItem(KEY);return load();}
function progress(data,app){var cl=data.checklists[app.id];if(cl&&cl.length){return Math.round(cl.filter(function(x){return x.done;}).length/cl.length*100);}return typeof app.progress==='number'?app.progress:0;}
function clientName(c){return c.first+' '+c.last;}
window.MKCStore={KEY:KEY,TYPES:TYPES,STATUSES:STATUSES,genericChecklist:genericChecklist,load:load,save:save,reset:reset,progress:progress,clientName:clientName,esc:function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];});}};
})();
