/* 个人端：登录校验 + 私密内容渲染 */

const AUTH_KEY = "personal_site_auth";
const AUTH_TS_KEY = "personal_site_auth_ts";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(function (b) { return b.toString(16).padStart(2, "0"); })
    .join("");
}

function isLoggedIn() {
  const ts = Number(localStorage.getItem(AUTH_TS_KEY) || 0);
  const hours = SITE_CONFIG.loginDurationHours || 24;
  if (Date.now() - ts > hours * 60 * 60 * 1000) {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TS_KEY);
    return false;
  }
  return localStorage.getItem(AUTH_KEY) === "true";
}

function renderPrivate() {
  document.querySelector(".brand").textContent = SITE_CONFIG.siteName;
  document.title = "个人端 · " + SITE_CONFIG.siteName;

  document.getElementById("greeting").textContent = PRIVATE_CONTENT.greeting;

  const notesEl = document.getElementById("notes");
  notesEl.innerHTML = "";
  (PRIVATE_CONTENT.notes || []).forEach(function (n) {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML =
      '<div class="note-time">' + esc(n.time) + "</div>" +
      '<div class="note-content">' + esc(n.content) + "</div>";
    notesEl.appendChild(div);
  });

  const todosEl = document.getElementById("todos");
  todosEl.innerHTML = "";
  (PRIVATE_CONTENT.todos || []).forEach(function (t) {
    const li = document.createElement("li");
    if (t.done) li.className = "done";
    li.textContent = t.content;
    todosEl.appendChild(li);
  });
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function showView(loggedIn) {
  document.getElementById("login-view").hidden = loggedIn;
  document.getElementById("private-view").hidden = !loggedIn;
  if (loggedIn) renderPrivate();
}

document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const input = document.getElementById("password").value;
  const hash = await sha256(input);
  if (hash === SITE_CONFIG.privatePasswordHash) {
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(AUTH_TS_KEY, String(Date.now()));
    document.getElementById("password").value = "";
    document.getElementById("login-error").hidden = true;
    showView(true);
  } else {
    document.getElementById("login-error").hidden = false;
  }
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_TS_KEY);
  showView(false);
});

showView(isLoggedIn());
