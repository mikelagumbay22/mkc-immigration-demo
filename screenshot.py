from playwright.sync_api import sync_playwright
import pathlib, json
shots=pathlib.Path("/workspace/sites/mkc-immigration/screenshots"); URL="http://localhost:8765"; R={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
 pg=b.new_page(viewport={"width":1440,"height":1000})
 pg.goto(URL+"/login.html"); pg.fill("#email","owner@demo.ca"); pg.fill("#password","owner123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/owner/dashboard.html"); R["owner_login"]="PASS"
 pg.goto(URL+"/owner/documents.html"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"documents.png"),full_page=True)
 headers=pg.locator("thead th").all_inner_texts(); R["table_headers"]=headers; R["no_type_column"]="PASS" if not any("Application type" in h for h in headers) else "FAIL"
 pg.click("#addDocBtn"); pg.wait_for_timeout(200)
 R["modal_no_type_field"]="PASS" if pg.locator("#docTypeForm").count()==0 else "FAIL"
 pg.fill("#docName","ZZ Test Document"); pg.fill("#docVersion","v9.0"); pg.screenshot(path=str(shots/"documents-modal.png"))
 pg.click("#docForm button[type=submit]"); pg.wait_for_timeout(250)
 R["add_doc_appears"]="PASS" if "ZZ Test Document" in pg.inner_text("#docRows") else "FAIL"
 def stored():
    return pg.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('mkc_demo_v2'));return d.documents.find(x=>x.name.startsWith('ZZ Test'))})()")
 s=stored(); R["stored_no_type_on_add"]="PASS" if s and ('type' not in s and 'applicationType' not in s) else str(s)
 # edit it
 did=s['id']; pg.click(f"[data-edit='{did}']"); pg.wait_for_timeout(200)
 R["edit_modal_no_type"]="PASS" if pg.locator("#docTypeForm").count()==0 else "FAIL"
 pg.fill("#docName","ZZ Test Document Edited"); pg.click("#docForm button[type=submit]"); pg.wait_for_timeout(200); pg.reload(); pg.wait_for_timeout(300)
 R["edit_persists"]="PASS" if "ZZ Test Document Edited" in pg.inner_text("#docRows") else "FAIL"
 s=stored(); R["stored_no_type_after_edit"]="PASS" if s and ('type' not in s and 'applicationType' not in s) else str(s)
 # legacy strip: inject a legacy typed doc, reload (load strips+saves), check gone
 pg.evaluate("(()=>{const k='mkc_demo_v2';const d=JSON.parse(localStorage.getItem(k));d.documents[0].type='Work Permit';d.documents[0].applicationType='Work Permit';localStorage.setItem(k,JSON.stringify(d));})()")
 pg.reload(); pg.wait_for_timeout(300); s0=pg.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('mkc_demo_v2'));return d.documents[0]})()")
 R["legacy_type_stripped_on_load"]="PASS" if ('type' not in s0 and 'applicationType' not in s0) else str(s0)
 # pick new doc into Work Permit visa
 pg.goto(URL+"/owner/visas.html"); pg.wait_for_timeout(300)
 pg.click("[data-edit-visa='v-work']"); pg.wait_for_timeout(200)
 pg.locator("#availList li[data-doc='"+did+"']").click(); pg.click("#moveRight"); pg.wait_for_timeout(150)
 R["picked_into_visa"]="PASS" if pg.locator("#reqList li[data-doc='"+did+"']").count()==1 else "FAIL"
 pg.screenshot(path=str(shots/"visa-picker.png"))
 # also set date newest for sort regression
 pg.fill("#visaDate","2029-01-01"); pg.click("#visaForm button[type=submit]"); pg.wait_for_timeout(250)
 first=pg.locator("#visaRows tr").first.locator("td").first.inner_text(); R["visas_sort_newest_top"]="PASS" if "Work Permit" in first else first
 # delete regression (d14)
 pg.goto(URL+"/owner/documents.html"); pg.wait_for_timeout(300); pg.click("[data-del='d14']"); pg.wait_for_timeout(150); pg.click("#confirmDelete"); pg.wait_for_timeout(200)
 R["doc_delete"]="PASS" if "Consultation notes" not in pg.inner_text("#docRows") else "FAIL"
 pg.click("[data-signout]"); pg.wait_for_timeout(300)
 # client sees new doc in a1 (Work Permit) checklist + upload it
 pg.goto(URL+"/login.html"); pg.fill("#email","client@demo.ca"); pg.fill("#password","client123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/client/dashboard.html"); R["client_login"]="PASS"
 pg.goto(URL+"/client/application.html?id=a1"); pg.wait_for_timeout(300)
 labels=pg.locator(".req-main strong").all_inner_texts(); idx=[i for i,x in enumerate(labels) if "ZZ Test Document Edited" in x]
 R["client_checklist_has_new_doc"]="PASS" if idx else str(labels)
 if idx:
    pg.locator(f"input[data-upload='{idx[0]}']").set_input_files("/tmp/sample-doc.pdf") if pathlib.Path("/tmp/sample-doc.pdf").exists() else None
    pg.wait_for_timeout(250); R["client_upload_new_doc"]="PASS" if "ZZ Test Document Edited" in pg.inner_text("#appDetail") and "Done" in pg.inner_text("#appDetail") else "FAIL"
 pg.screenshot(path=str(shots/"client-checklist.png"),full_page=True)
 b.close()
print(json.dumps(R,indent=2))
