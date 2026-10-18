from playwright.sync_api import sync_playwright
import pathlib, json
base=pathlib.Path("/workspace/sites/mkc-immigration"); shots=base/"screenshots"; shots.mkdir(exist_ok=True)
URL="http://localhost:8765"
R={}
pathlib.Path("/tmp/test-upload.pdf").write_bytes(b"%PDF-1.4 sample demo")
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--autoplay-policy=no-user-gesture-required"])
    ctx=b.new_context(viewport={"width":1440,"height":1000})
    pg=ctx.new_page()
    # guard without login
    pg.goto(URL+"/client/dashboard.html"); pg.wait_for_timeout(400); R["guard_redirect"]="PASS" if "login.html" in pg.url else pg.url
    # home + login screenshots
    pg.goto(URL+"/index.html")
    try: pg.wait_for_function("document.getElementById('heroVideo')&&document.getElementById('heroVideo').currentTime>1", timeout=8000)
    except Exception: pass
    pg.screenshot(path=str(shots/"home-desktop.png"), full_page=True)
    pg.screenshot(path=str(shots/"desktop.png"), full_page=True)
    pg.goto(URL+"/login.html"); pg.screenshot(path=str(shots/"login.png"))
    # wrong login
    pg.fill("#email","wrong@demo.ca"); pg.fill("#password","nope"); pg.click("#loginForm button[type=submit]"); pg.wait_for_timeout(200)
    R["wrong_login"]="PASS" if "Incorrect demo" in pg.inner_text("#loginError") else "FAIL"
    # client login
    pg.fill("#email","client@demo.ca"); pg.fill("#password","client123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/client/dashboard.html"); pg.wait_for_timeout(400)
    R["client_login"]="PASS" if "Sample Client" in pg.inner_text("body") else "FAIL"
    pg.screenshot(path=str(shots/"client-dashboard.png"), full_page=True)
    # tasks before uploads
    pg.click("a[href='tasks.html']"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"tasks.png"), full_page=True)
    R["tasks_missing_listed"]="PASS" if "Missing:" in pg.inner_text("#autoTasks") else "FAIL"
    # application detail + uploads
    pg.goto(URL+"/client/application.html?id=a1"); pg.wait_for_timeout(300)
    for i in range(5):
        inp=pg.locator(f"input[data-upload='{i}']")
        inp.set_input_files("/tmp/test-upload.pdf"); pg.wait_for_timeout(250)
        if i==0:
            txt=pg.inner_text("#appDetail"); R["upload_first_done_progress"]="PASS" if ("Done" in txt and "20% complete" in txt) else txt[:200]
    txt=pg.inner_text("#appDetail"); R["upload_all_complete"]="PASS" if ("100% complete" in txt and "Checklist status: Complete" in txt) else txt[:250]
    pg.screenshot(path=str(shots/"application-detail.png"), full_page=True)
    # localStorage safety
    ls=pg.evaluate("(()=>{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k)}return o})()")
    R["localstorage_keys"]=list(ls.keys())
    joined=" ".join(ls.values()); R["no_file_contents"]="PASS" if ("data:" not in joined and "%PDF" not in joined and "test-upload.pdf" in joined) else "FAIL"
    # sign out from client
    pg.click("[data-signout]"); pg.wait_for_timeout(400); R["signout_client"]="PASS" if pg.url.rstrip("/").endswith("index.html") or pg.url.endswith(":8765/") else pg.url
    # owner login
    pg.goto(URL+"/login.html"); pg.fill("#email","owner@demo.ca"); pg.fill("#password","owner123"); pg.click("#loginForm button[type=submit]"); pg.wait_for_url("**/owner/dashboard.html"); pg.wait_for_timeout(400)
    R["owner_login"]="PASS" if "Owner dashboard" in pg.inner_text("body") else "FAIL"
    pg.screenshot(path=str(shots/"owner-dashboard.png"), full_page=True)
    # add application
    pg.select_option("#appClient","c1"); pg.select_option("#appType","Citizenship"); pg.select_option("#appStatus","New"); pg.fill("#appDue","2027-01-15"); pg.click("#addApp button[type=submit]"); pg.wait_for_timeout(300)
    R["add_application"]="PASS" if "Citizenship" in pg.inner_text("#recent") else "FAIL"
    # clients pagination/search/filter
    pg.click("a[href='clients.html']"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"clients.png"), full_page=True)
    pg.click("#nextPage"); pg.wait_for_timeout(200); R["clients_page2"]="PASS" if "Page 2 of 2" in pg.inner_text("#pageInfo") else pg.inner_text("#pageInfo")
    pg.fill("#search","Sample Client 05"); pg.wait_for_timeout(200); R["clients_search"]="PASS" if "Sample Client 05" in pg.inner_text("#clientRows") else "FAIL"
    pg.fill("#search",""); pg.select_option("#fStatus","Active"); pg.wait_for_timeout(200); R["clients_filter_status"]="PASS" if "Active" in pg.inner_text("#clientRows") else "FAIL"
    # documents filter + add
    pg.goto(URL+"/owner/documents.html"); pg.wait_for_timeout(300); pg.screenshot(path=str(shots/"documents.png"), full_page=True)
    pg.select_option("#dType","Work Permit"); pg.wait_for_timeout(200); rows=pg.inner_text("#docRows"); R["documents_filter"]="PASS" if ("Work Permit" in rows and "Tourist Visa" not in rows) else "FAIL"
    pg.select_option("#dType",""); pg.fill("#docName","Sample Added Document"); pg.select_option("#docTypeForm","Citizenship"); pg.fill("#docVersion","v2.0"); pg.click("#docForm button[type=submit]"); pg.wait_for_timeout(200)
    R["documents_add"]="PASS" if "Sample Added Document" in pg.inner_text("#docRows") else "FAIL"
    # reset data via client profile? test reset: clear storage to restore seeds for final screenshots state
    pg.evaluate("localStorage.removeItem('mkc_demo_v1')")
    # sign out owner
    pg.click("[data-signout]"); pg.wait_for_timeout(300); R["signout_owner"]="PASS" if "index.html" in pg.url else pg.url
    # chat on inner public page
    pg.goto(URL+"/services.html"); pg.wait_for_timeout(300); pg.click("#mkcChatOpen"); pg.wait_for_timeout(200); pg.fill("#mkcChatInput","What are your fees?"); pg.click(".mkc-chat-form button[type=submit]"); pg.wait_for_timeout(200)
    R["chat_inner_page"]="PASS" if "Fees are confirmed at consultation" in pg.inner_text("#mkcChatLog") else "FAIL"
    pg.screenshot(path=str(shots/"chat-open.png"))
    ctx.close()
    # mobile shots
    mctx=b.new_context(viewport={"width":390,"height":844}, is_mobile=True)
    mp=mctx.new_page(); mp.goto(URL+"/index.html"); mp.wait_for_timeout(1200); mp.screenshot(path=str(shots/"home-mobile.png"), full_page=True); mp.screenshot(path=str(shots/"mobile.png"), full_page=True)
    mp.goto(URL+"/login.html"); mp.fill("#email","client@demo.ca"); mp.fill("#password","client123"); mp.click("#loginForm button[type=submit]"); mp.wait_for_url("**/client/dashboard.html"); mp.wait_for_timeout(300); mp.screenshot(path=str(shots/"client-dashboard-mobile.png"), full_page=True)
    mp.click("[data-menu]"); mp.wait_for_timeout(200); mp.click("[data-signout]"); mp.wait_for_timeout(300); mp.goto(URL+"/login.html"); mp.fill("#email","owner@demo.ca"); mp.fill("#password","owner123"); mp.click("#loginForm button[type=submit]"); mp.wait_for_url("**/owner/dashboard.html"); mp.wait_for_timeout(300); mp.screenshot(path=str(shots/"owner-dashboard-mobile.png"), full_page=True)
    # overflow check
    R["mobile_no_h_overflow"]=mp.evaluate("document.documentElement.scrollWidth<=390?'PASS':'FAIL '+document.documentElement.scrollWidth")
    mctx.close(); b.close()
print(json.dumps(R,indent=2))
