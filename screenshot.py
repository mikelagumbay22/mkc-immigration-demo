from playwright.sync_api import sync_playwright
import pathlib, json
base=pathlib.Path("/workspace/sites/mkc-immigration")
url=(base/"dist/index.html").as_uri()
results={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox","--autoplay-policy=no-user-gesture-required"])
    for name,w,h,mobile in [("desktop",1440,1000,False),("mobile",390,844,True)]:
        pg=b.new_page(viewport={"width":w,"height":h}, is_mobile=mobile)
        pg.goto(url)
        try:
            pg.wait_for_function("document.getElementById('heroVideo') && document.getElementById('heroVideo').currentTime>1.2", timeout=8000)
        except Exception as e: results[f"{name}_video_time"]="TIMEOUT"
        results[f"{name}_video"]=pg.evaluate("(()=>{const v=document.getElementById('heroVideo');return {t:v.currentTime,paused:v.paused,ready:v.readyState,w:v.videoWidth,h:v.videoHeight}})()")
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(base/f"screenshots/{name}.png"), full_page=True); pg.close()
    # chat-open desktop viewport (hero+video+logo visible)
    pg=b.new_page(viewport={"width":1440,"height":1000})
    pg.goto(url)
    try: pg.wait_for_function("document.getElementById('heroVideo').currentTime>1.2", timeout=8000)
    except Exception: pass
    pg.click("#mkcChatOpen"); pg.wait_for_timeout(250)
    pg.fill("#mkcChatInput","What services do you offer?"); pg.click(".mkc-chat-form button[type=submit]"); pg.wait_for_timeout(200)
    log=pg.inner_text("#mkcChatLog")
    results["chat_test"]="PASS" if "work permits" in log else "CHECK"
    results["chat_open_visible"]=str(pg.is_visible("#mkcChatPanel"))
    # FAB clickable / not blocked: panel opened above means FAB worked; also hero logo natural size
    results["logo"]=pg.evaluate("(()=>{const i=document.querySelector('.logo-lockup');const r=i.getBoundingClientRect();return {src:i.getAttribute('src'),w:r.width,h:r.height,complete:i.complete}})()")
    pg.screenshot(path=str(base/"screenshots/chat-open.png"))
    pg.close()
    # mobile open
    pg=b.new_page(viewport={"width":390,"height":844}, is_mobile=True)
    pg.goto(url); pg.wait_for_timeout(600); pg.click("#mkcChatOpen"); pg.wait_for_timeout(250)
    pg.screenshot(path=str(base/"screenshots/chat-open-mobile.png")); pg.close()
    # reduced motion: poster shown, video not playing / hidden
    pg=b.new_page(viewport={"width":1280,"height":800}, reduced_motion="reduce")
    pg.goto(url); pg.wait_for_timeout(800)
    results["reduced_motion"]=pg.evaluate("(()=>{const v=document.getElementById('heroVideo');return {paused:v.paused,t:v.currentTime,display:getComputedStyle(v).display,poster:v.poster.split('/').pop()}})()")
    pg.close(); b.close()
print(json.dumps(results,indent=2))
