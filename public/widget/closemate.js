/* CloseMate embeddable chat widget.
 * Install on any site with one line:
 *   <script src="https://YOUR-CLOSEMATE-URL/widget/closemate.js" defer></script>
 * Optional attributes: data-api="https://YOUR-CLOSEMATE-URL" data-color="#0f6f5c"
 */
(function () {
  "use strict";
  var script = document.currentScript;
  var API = (script && script.getAttribute("data-api")) || (script ? new URL(script.src).origin : "");
  var COLOR = (script && script.getAttribute("data-color")) || "#0f6f5c";
  var STORE_KEY = "closemate_history_v1";
  var VID_KEY = "closemate_vid";

  var visitorId = localStorage.getItem(VID_KEY);
  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(VID_KEY, visitorId);
  }

  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE_KEY) || "[]"); } catch (e) {}

  var cfg = { agentName: "our team", greeting: "Hi! How can I help you today?" };

  // ---------- styles ----------
  var css = [
    ".cm-btn{position:fixed;bottom:22px;right:22px;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;",
    "background:" + COLOR + ";color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.25);z-index:99998;display:flex;align-items:center;justify-content:center;transition:transform .15s}",
    ".cm-btn:hover{transform:scale(1.07)}",
    ".cm-panel{position:fixed;bottom:96px;right:22px;width:360px;max-width:calc(100vw - 32px);height:520px;max-height:calc(100vh - 130px);",
    "background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);z-index:99999;display:none;flex-direction:column;overflow:hidden;",
    "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
    ".cm-panel.open{display:flex}",
    ".cm-head{background:" + COLOR + ";color:#fff;padding:14px 18px;font-weight:600;font-size:15px;display:flex;justify-content:space-between;align-items:center}",
    ".cm-head small{display:block;font-weight:400;opacity:.85;font-size:12px;margin-top:2px}",
    ".cm-close{background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1}",
    ".cm-msgs{flex:1;overflow-y:auto;padding:14px;background:#f6f7f8}",
    ".cm-m{max-width:82%;padding:9px 13px;border-radius:14px;margin-bottom:8px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}",
    ".cm-m.bot{background:#fff;border:1px solid #e5e7e9;border-bottom-left-radius:4px}",
    ".cm-m.user{background:" + COLOR + ";color:#fff;margin-left:auto;border-bottom-right-radius:4px}",
    ".cm-typing{display:inline-block;padding:10px 14px}",
    ".cm-typing span{display:inline-block;width:6px;height:6px;margin:0 1.5px;background:#b6bcc2;border-radius:50%;animation:cmb 1.2s infinite}",
    ".cm-typing span:nth-child(2){animation-delay:.15s}.cm-typing span:nth-child(3){animation-delay:.3s}",
    "@keyframes cmb{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}",
    ".cm-inp{display:flex;border-top:1px solid #e5e7e9;background:#fff}",
    ".cm-inp input{flex:1;border:none;outline:none;padding:14px;font-size:14px}",
    ".cm-inp button{border:none;background:none;color:" + COLOR + ";font-weight:700;padding:0 16px;cursor:pointer;font-size:14px}",
    ".cm-foot{text-align:center;font-size:10px;color:#9aa1a8;padding:4px 0 6px;background:#fff}",
  ].join("");
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- DOM ----------
  var btn = document.createElement("button");
  btn.className = "cm-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var panel = document.createElement("div");
  panel.className = "cm-panel";
  panel.innerHTML =
    '<div class="cm-head"><div><span class="cm-title">Chat with us</span><small>Typically replies instantly &middot; 24/7</small></div>' +
    '<button class="cm-close" aria-label="Close chat">&times;</button></div>' +
    '<div class="cm-msgs"></div>' +
    '<form class="cm-inp"><input type="text" placeholder="Type your message..." autocomplete="off" maxlength="1500"/>' +
    '<button type="submit">Send</button></form>' +
    '<div class="cm-foot">Powered by CloseMate</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgsEl = panel.querySelector(".cm-msgs");
  var form = panel.querySelector("form");
  var input = panel.querySelector("input");
  var opened = false;

  function addMsg(role, text) {
    var el = document.createElement("div");
    el.className = "cm-m " + (role === "user" ? "user" : "bot");
    el.textContent = text;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }
  function addTyping() {
    var el = document.createElement("div");
    el.className = "cm-m bot cm-typing";
    el.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }
  function persist() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(history.slice(-60))); } catch (e) {}
  }

  function openPanel() {
    panel.classList.add("open");
    input.focus();
    if (!opened) {
      opened = true;
      if (history.length) {
        history.forEach(function (m) { addMsg(m.role, m.content); });
      } else {
        addMsg("assistant", cfg.greeting);
        history.push({ role: "assistant", content: cfg.greeting });
        persist();
      }
    }
  }
  btn.addEventListener("click", function () {
    panel.classList.contains("open") ? panel.classList.remove("open") : openPanel();
  });
  panel.querySelector(".cm-close").addEventListener("click", function () {
    panel.classList.remove("open");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMsg("user", text);
    history.push({ role: "user", content: text });
    persist();

    var typing = addTyping();
    fetch(API + "/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history, visitorId: visitorId }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        typing.remove();
        var reply = data.reply || "Sorry, something went wrong — please try again.";
        addMsg("assistant", reply);
        history.push({ role: "assistant", content: reply });
        persist();
      })
      .catch(function () {
        typing.remove();
        addMsg("assistant", "I'm having connection trouble. Please try again in a moment.");
      });
  });

  // Fetch per-deployment config (agent name, greeting)
  fetch(API + "/api/widget-config")
    .then(function (r) { return r.json(); })
    .then(function (c) {
      cfg = Object.assign(cfg, c);
      var title = panel.querySelector(".cm-title");
      if (c.agentName) title.textContent = "Chat with " + c.agentName.split(" ")[0];
    })
    .catch(function () {});
})();
