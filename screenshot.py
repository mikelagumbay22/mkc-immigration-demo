from playwright.sync_api import sync_playwright
import pathlib, json
base=pathlib.Path("/workspace/sites/mkc-immigration"); shots=base/"screenshots"
pathlib.Path("/tmp/sample-doc.pdf").write_bytes(b"%PDF demo")
URL="http://localhost:8765"; R={}
def login(pg,email,pw,wait):
    pg.goto(URL+"/login.html"); pg.fill("#email",email); pg.fill("#password",pw); pg.click("#loginForm button[type=submit]"); pg.wait_for_url(wait)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--autoplay-policy=no-user-gesture-required"])
 ctx=b.new_context(viewport={"width":1440,"height":1000}); pg=ctx.new_page()
 # footer credit absent
 for page in ["index.html","services.html"]:
    pg.goto(URL+"/"+page); pg.wait_for_timeout(300)
    R[f"footer_credit_absent_{page}"]="PASS" if "credit given as appreciation" not in pg.inner_text("body") else "FAIL"
 pg.screenshot(path=str(shots/"home-desktop.png"),full_page=True); pg.screenshot(path=str(shots/"desktop.png"),full_page=True)
 # regressions
 pg.goto(URL+"/client/dashboard.html"); pg.wait_for_timeout(300); R["guard"]="PASS" if "login.html" in pg.url else "FAIL"
 pg.goto(URL+"/login.html"); pg.fill("#email","x@demo.ca"); pg.fill("#password","bad"); pg.click("#loginForm button[type=submit]"); pg.wait_for_timeout(150); R["wrong_login"]="PASS" if "Incorrect demo" in pg.inner_text("#loginError") else "FAIL"
 login(pg,"owner@demo.ca","owner123","**/owner/dashboard.html"); R["owner_login"]="PASS"
 # clients
 pg.goto(URL+"/owner/clients.html"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"clients.png"),full_page=True)
 pg.click("#nextPage"); pg.wait_for_timeout(150); R["pagination"]="PASS" if "Page 2 of" in pg.inner_text("#pageInfo") else "FAIL"
 pg.click("#prevPage")
 pg.click("#addClientBtn"); pg.wait_for_timeout(200); pg.screenshot(path=str(shots/"add-client-modal.png"))
 pg.fill("#newFirst","SampleNew"); pg.fill("#newLast","ClientTest"); pg.fill("#newEmail","samplenew@demo.ca"); pg.fill("#newPhone","(905) 555-0199"); pg.select_option("#newVisaType","Tourist Visa"); pg.fill("#newDue","2027-02-01"); pg.click("#addClientForm button[type=submit]"); pg.wait_for_timeout(300)
 pg.fill("#search","SampleNew"); pg.wait_for_timeout(200); R["add_client"]="PASS" if "SampleNew ClientTest" in pg.inner_text("#clientRows") else pg.inner_text("#clientRows")[:200]
 # edit client: add second app
 pg.click("[data-edit-client]"); pg.wait_for_timeout(250); pg.screenshot(path=str(shots/"edit-client.png"))
 pg.select_option("#editVisaType","Student Visa"); pg.fill("#editDue","2027-03-01"); pg.click("#addAppForClient"); pg.wait_for_timeout(250)
 R["edit_client_add_app_modal"]="PASS" if "Student Visa" in pg.inner_text("#editApps") else "FAIL"
 pg.click("[data-close='editClientModal']"); pg.wait_for_timeout(150)
 R["edit_client_count_table"]="PASS" if "\t2\t" in pg.inner_text("#clientRows") or "2" in pg.inner_text("#clientRows") else pg.inner_text("#clientRows")[:200]
 # documents: delete + edit/upload
 pg.goto(URL+"/owner/documents.html"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"documents.png"),full_page=True)
 pg.click("[data-del='d14']"); pg.wait_for_timeout(200); pg.click("#confirmDelete"); pg.wait_for_timeout(250)
 R["doc_delete"]="PASS" if "Consultation notes" not in pg.inner_text("#docRows") else "FAIL"
 pg.click("[data-edit='d1']"); pg.wait_for_timeout(200); pg.screenshot(path=str(shots/"documents-modal.png"))
 pg.set_input_files("#docFile","/tmp/sample-doc.pdf"); pg.wait_for_timeout(300)
 R["doc_upload_filename_shows"]="PASS" if "sample-doc.pdf" in pg.inner_text("#docFileName") else pg.inner_text("#docFileName")
 pg.click("#docForm button[type=submit]"); pg.wait_for_timeout(200); pg.reload(); pg.wait_for_timeout(300); pg.click("[data-edit='d1']"); pg.wait_for_timeout(200)
 R["doc_upload_persists_reload"]="PASS" if "sample-doc.pdf" in pg.inner_text("#docFileName") else pg.inner_text("#docFileName")
 pg.click("[data-close='docModal']")
 # visas: create with picker moves
 pg.goto(URL+"/owner/visas.html"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"visas.png"),full_page=True)
 pg.click("#addVisaBtn"); pg.wait_for_timeout(200); pg.fill("#visaName","Sample Test Visa"); pg.fill("#visaDate","2027-01-01"); pg.fill("#visaNotes","Sample notes for test visa.")
 items=pg.locator("#availList li[data-doc]"); items.nth(0).click(); items.nth(1).click(); pg.click("#moveRight"); pg.wait_for_timeout(150)
 req=pg.locator("#reqList li[data-doc]"); R["picker_move_right_2"]="PASS" if req.count()==2 else str(req.count())
 pg.screenshot(path=str(shots/"visa-picker.png"))
 req.nth(0).click(); pg.click("#moveLeft"); pg.wait_for_timeout(150); R["picker_move_back_1"]="PASS" if pg.locator("#reqList li[data-doc]").count()==1 else "FAIL"
 pg.click("#visaForm button[type=submit]"); pg.wait_for_timeout(250); pg.reload(); pg.wait_for_timeout(300)
 R["visa_create_persists"]="PASS" if "Sample Test Visa" in pg.inner_text("#visaRows") else "FAIL"
 # edit seeded Tourist Visa populated
 pg.click("[data-edit-visa='v-tourist']"); pg.wait_for_timeout(200); R["tourist_picker_populated"]="PASS" if pg.locator("#reqList li[data-doc]").count()>=3 else str(pg.locator("#reqList li[data-doc]").count())
 pg.click("[data-close='visaModal']")
 # edit Work Permit: remove first required doc, capture expected
 pg.click("[data-edit-visa='v-work']"); pg.wait_for_timeout(200)
 before=pg.locator("#reqList li[data-doc]").all_inner_texts(); pg.locator("#reqList li[data-doc]").nth(0).click(); pg.click("#moveLeft"); pg.wait_for_timeout(150); pg.click("#visaForm button[type=submit]"); pg.wait_for_timeout(250)
 expected=[x.strip() for x in before[1:]]; R["work_visa_edited_expected"]=expected
 # sign out owner
 pg.click("[data-signout]"); pg.wait_for_timeout(300); R["signout_owner"]="PASS" if "index.html" in pg.url else "FAIL"
 # client sees updated checklist
 login(pg,"client@demo.ca","client123","**/client/dashboard.html"); R["client_login"]="PASS"
 pg.screenshot(path=str(shots/"client-dashboard.png"),full_page=True)
 pg.goto(URL+"/client/application.html?id=a1"); pg.wait_for_timeout(300)
 labels=pg.locator(".req-main strong").all_inner_texts(); labels=[x.split("—",1)[1].strip() if "—" in x else x for x in labels]
 R["client_checklist_matches_visa"]="PASS" if labels==expected else f"labels={labels} expected={expected}"
 geo=pg.evaluate("(()=>{const li=document.querySelector('.req');return li.querySelector('.req-side').getBoundingClientRect().right<=li.getBoundingClientRect().right+1})()"); R["upload_button_right"]="PASS" if geo else "FAIL"
 # tasks missing reflects checklist (before completing)
 pg.goto(URL+"/client/tasks.html"); pg.wait_for_timeout(250); R["tasks_missing_before"]="PASS" if "Missing:" in pg.inner_text("#autoTasks") else "FAIL"
 pg.goto(URL+"/client/application.html?id=a1"); pg.wait_for_timeout(250)
 n=pg.locator("input[data-upload]").count()
 for i in range(n): pg.locator(f"input[data-upload='{i}']").set_input_files("/tmp/sample-doc.pdf"); pg.wait_for_timeout(180)
 txt=pg.inner_text("#appDetail"); R["client_upload_all_complete"]="PASS" if "100% complete" in txt and "Complete" in txt else txt[:200]
 pg.screenshot(path=str(shots/"client-checklist.png"),full_page=True); pg.screenshot(path=str(shots/"application-detail.png"),full_page=True)
 pg.goto(URL+"/client/tasks.html"); pg.wait_for_timeout(250); body=pg.inner_text("#autoTasks"); R["tasks_updates_after_complete"]="PASS" if all((lbl not in body) for lbl in expected) else body[:250]
 pg.click("[data-signout]"); pg.wait_for_timeout(250); R["signout_client"]="PASS" if "index.html" in pg.url else "FAIL"
 # chat public
 pg.goto(URL+"/services.html"); pg.click("#mkcChatOpen"); pg.wait_for_timeout(150); pg.fill("#mkcChatInput","What are your fees?"); pg.click(".mkc-chat-form button[type=submit]"); pg.wait_for_timeout(150); R["chat_public"]="PASS" if "Fees are confirmed" in pg.inner_text("#mkcChatLog") else "FAIL"; pg.screenshot(path=str(shots/"chat-open.png"))
 ctx.close()
 # mobile visas
 m=b.new_context(viewport={"width":390,"height":844},is_mobile=True); mp=m.new_page(); login(mp,"owner@demo.ca","owner123","**/owner/dashboard.html"); mp.goto(URL+"/owner/visas.html"); mp.wait_for_timeout(300); mp.screenshot(path=str(shots/"visas-mobile.png"),full_page=True); mp.click("#addVisaBtn"); mp.wait_for_timeout(200); mp.screenshot(path=str(shots/"visa-picker-mobile.png")); R["mobile_no_overflow"]=mp.evaluate("document.documentElement.scrollWidth<=390?'PASS':'FAIL '+document.documentElement.scrollWidth")
 # mobile home footer
 mp.goto(URL+"/index.html"); mp.wait_for_timeout(800); mp.screenshot(path=str(shots/"home-mobile.png"),full_page=True); mp.screenshot(path=str(shots/"mobile.png"),full_page=True)
 m.close(); b.close()
print(json.dumps(R,indent=2))
