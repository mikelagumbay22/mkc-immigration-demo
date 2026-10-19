from playwright.sync_api import sync_playwright
import pathlib, json
shots=pathlib.Path("/workspace/sites/mkc-immigration/screenshots"); URL="http://localhost:8765"; R={}
pathlib.Path("/tmp/sample-doc.pdf").write_bytes(b"%PDF demo")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
 pg=b.new_page(viewport={"width":1440,"height":1000})
 # wrong login
 pg.goto(URL+"/login.html"); pg.fill("#email","x@demo.ca"); pg.fill("#password","bad"); pg.click("#loginForm button[type=submit]"); pg.wait_for_timeout(150); R["wrong_login"]="PASS" if "Incorrect" in pg.inner_text("#loginError") else "FAIL"
 pg.fill("#email","owner@demo.ca"); pg.fill("#password","owner123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/owner/dashboard.html"); R["owner_login"]="PASS"
 pg.screenshot(path=str(shots/"owner-dashboard.png"),full_page=True)
 R["dashboard_effective_select"]="PASS" if pg.locator("#appEffective option").count()>=1 and pg.locator("#appDue").count()==0 else "FAIL"
 # 1) Edit demo client: Tourist single date preselected
 pg.goto(URL+"/owner/clients.html"); pg.wait_for_timeout(300); pg.click("[data-edit-client='c-demo']"); pg.wait_for_timeout(200)
 pg.select_option("#editVisaType","Tourist Visa"); pg.wait_for_timeout(150)
 opts=pg.locator("#editEffective option").evaluate_all("els=>els.map(e=>({v:e.value,t:e.textContent}))"); R["tourist_effective_options"]=opts
 R["tourist_single_preselected"]="PASS" if len(opts)==1 and opts[0]['v']=='v-tourist' else "FAIL"
 pg.click("#addAppForClient"); pg.wait_for_timeout(250)
 lst=pg.inner_text("#editApps"); R["edit_list_shows_effective_not_due"]="PASS" if ("Effective" in lst and "· Due" not in lst) else lst[:200]
 pg.screenshot(path=str(shots/"edit-client.png")); pg.screenshot(path=str(shots/"add-application.png"))
 def latest_app(cid,typ):
    return pg.evaluate(f"(()=>{{const d=JSON.parse(localStorage.getItem('mkc_demo_v2'));const a=d.applications.filter(x=>x.clientId==='{cid}'&&x.type==='{typ}');return a[a.length-1]}})()")
 a=latest_app('c-demo','Tourist Visa'); R["stored_tourist_app"]=a; R["stored_visaId_effective_no_due"]="PASS" if a and a.get('visaId')=='v-tourist' and a.get('effectiveDate')=='2026-01-01' and 'due' not in a else "FAIL"
 pg.click("[data-close='editClientModal']"); pg.reload(); pg.wait_for_timeout(300); pg.click("[data-edit-client='c-demo']"); pg.wait_for_timeout(200); R["edit_list_persists"]="PASS" if "Tourist Visa" in pg.inner_text("#editApps") else "FAIL"; pg.click("[data-close='editClientModal']")
 # 2) Multiple dates: second Tourist record with newer date, docs=[d1 only]
 pg.goto(URL+"/owner/visas.html"); pg.wait_for_timeout(300); pg.click("#addVisaBtn"); pg.fill("#visaName","Tourist Visa"); pg.fill("#visaDate","2027-05-01"); pg.locator("#availList li[data-doc='d1']").click(); pg.click("#moveRight"); pg.click("#visaForm button[type=submit]"); pg.wait_for_timeout(250)
 rows=pg.locator("#visaRows tr").evaluate_all("els=>els.map(e=>e.querySelectorAll('td')[1].innerText.trim())"); R["visas_sort_newest_first"]="PASS" if rows[0]=="2027-05-01" else str(rows[:3])
 new_tourist_id=pg.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('mkc_demo_v2'));return d.visas.filter(v=>v.name==='Tourist Visa').sort((a,b)=>b.effective.localeCompare(a.effective))[0].id})()")
 # no-date visa type for blocking
 pg.click("#addVisaBtn"); pg.fill("#visaName","NoDate Test Visa"); pg.fill("#visaDate",""); pg.click("#visaForm button[type=submit]"); pg.wait_for_timeout(250)
 R["nodate_visa_created"]="PASS" if "NoDate Test Visa" in pg.inner_text("#visaRows") else "FAIL"
 # reopen edit client: Tourist lists both newest first
 pg.goto(URL+"/owner/clients.html"); pg.wait_for_timeout(300); pg.click("[data-edit-client='c-demo']"); pg.wait_for_timeout(200); pg.select_option("#editVisaType","Tourist Visa"); pg.wait_for_timeout(150)
 opts=pg.locator("#editEffective option").evaluate_all("els=>els.map(e=>({v:e.value,t:e.textContent}))"); R["multi_date_options"]=opts
 R["multi_date_newest_first"]="PASS" if len(opts)==2 and opts[0]['v']==new_tourist_id else "FAIL"
 # add app with newest record (preselected first)
 pg.click("#addAppForClient"); pg.wait_for_timeout(200)
 a2=latest_app('c-demo','Tourist Visa'); R["stored_multi_app"]=a2; R["multi_app_visaId"]="PASS" if a2 and a2.get('visaId')==new_tourist_id and 'due' not in a2 else "FAIL"
 new_app_id=a2['id'] if a2 else 'a1'
 # blocking: NoDate type
 before=pg.evaluate("JSON.parse(localStorage.getItem('mkc_demo_v2')).applications.length")
 pg.select_option("#editVisaType","NoDate Test Visa"); pg.wait_for_timeout(150)
 eff_txt=pg.locator("#editEffective option").first.inner_text(); pg.click("#addAppForClient"); pg.wait_for_timeout(200)
 after=pg.evaluate("JSON.parse(localStorage.getItem('mkc_demo_v2')).applications.length")
 R["nodate_blocking"]="PASS" if (eff_txt=="No effective date yet" and before==after and "effective date is needed" in pg.inner_text("#editAppError")) else f"{eff_txt} {before}->{after} err={pg.inner_text('#editAppError')}"
 pg.click("[data-close='editClientModal']")
 # 3) Add client modal same behaviour
 pg.click("#addClientBtn"); pg.wait_for_timeout(200); pg.select_option("#newVisaType","Work Permit"); pg.wait_for_timeout(100)
 R["addclient_effective_present"]="PASS" if pg.locator("#newEffective option").count()==1 and pg.locator("#newDue").count()==0 else "FAIL"
 pg.screenshot(path=str(shots/"add-client-modal.png"))
 pg.fill("#newFirst","EffFirst"); pg.fill("#newLast","EffLast"); pg.fill("#newEmail","eff@demo.ca"); pg.click("#addClientForm button[type=submit]"); pg.wait_for_timeout(300)
 c=pg.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('mkc_demo_v2'));const cl=d.clients.find(x=>x.email==='eff@demo.ca');const ap=d.applications.find(x=>x.clientId===cl.id);return {client:!!cl,app:ap}})()")
 R["addclient_creates_app_effective"]="PASS" if c['client'] and c['app'].get('visaId') and c['app'].get('effectiveDate') and 'due' not in c['app'] else str(c)
 # documents regression
 pg.goto(URL+"/owner/documents.html"); pg.wait_for_timeout(250); R["documents_no_type_field"]="PASS" if pg.locator("#docTypeForm").count()==0 else "FAIL"
 pg.click("[data-del='d14']"); pg.wait_for_timeout(150); pg.click("#confirmDelete"); pg.wait_for_timeout(200); R["doc_delete"]="PASS" if "Consultation notes" not in pg.inner_text("#docRows") else "FAIL"
 # sign out + client view of new app (visaId checklist = only Passport doc)
 pg.click("[data-signout]"); pg.wait_for_timeout(250)
 pg.goto(URL+"/login.html"); pg.fill("#email","client@demo.ca"); pg.fill("#password","client123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/client/dashboard.html"); R["client_login_legacy_loads"]="PASS" if "Effective" in pg.inner_text("#appCards") else "FAIL"
 pg.goto(URL+f"/client/application.html?id={new_app_id}"); pg.wait_for_timeout(300)
 labels=pg.locator(".req-main strong").all_inner_texts(); R["client_checklist_from_visaId"]=labels
 R["checklist_matches_record_box2"]="PASS" if len(labels)==1 and "Passport" in labels[0] else "FAIL"
 pg.locator("input[data-upload='0']").set_input_files("/tmp/sample-doc.pdf"); pg.wait_for_timeout(250)
 R["client_upload_done_complete"]="PASS" if "100% complete" in pg.inner_text("#appDetail") else pg.inner_text("#appDetail")[:200]
 pg.screenshot(path=str(shots/"client-checklist.png"),full_page=True); pg.screenshot(path=str(shots/"application-detail.png"),full_page=True)
 pg.click("[data-signout]"); pg.wait_for_timeout(200); R["signout"]="PASS" if "index.html" in pg.url else "FAIL"
 # chat + mobile overflow
 pg.goto(URL+"/services.html"); pg.click("#mkcChatOpen"); pg.wait_for_timeout(150); pg.fill("#mkcChatInput","hours?"); pg.click(".mkc-chat-form button[type=submit]"); pg.wait_for_timeout(150); R["chat"]="PASS" if "8:00" in pg.inner_text("#mkcChatLog") else "FAIL"
 m=b.new_context(viewport={"width":390,"height":844},is_mobile=True); mp=m.new_page(); mp.goto(URL+"/owner/clients.html"); mp.wait_for_timeout(300); R["mobile_redirect_or_overflow"]=mp.evaluate("document.documentElement.scrollWidth<=390?'PASS':'FAIL'")  # will redirect to login, still checks overflow
 b.close()
print(json.dumps(R,indent=2))
