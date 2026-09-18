/* 个人端：登录校验 + 私密内容渲染
   支持：密码登录 + 指纹登录（WebAuthn / Touch ID） */

const AUTH_KEY = "personal_site_auth";
const AUTH_TS_KEY = "personal_site_auth_ts";
const FP_ID_KEY = "personal_site_fp_id";
const FP_PK_KEY = "personal_site_fp_pk";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(function (b) { return b.toString(16).padStart(2, "0"); })
    .join("");
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function bufToB64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBuf(b64) {
  const b64u = b64.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64u.length % 4 ? "=".repeat(4 - (b64u.length % 4)) : "";
  const bin = atob(b64u + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
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

function showView(loggedIn) {
  document.getElementById("login-view").hidden = loggedIn;
  document.getElementById("private-view").hidden = !loggedIn;
  if (loggedIn) renderPrivate();
}

/* ---------- 指纹登录（WebAuthn） ---------- */
function webAuthnSupported() {
  return !!(window.PublicKeyCredential && navigator.credentials);
}

async function registerFingerprint() {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  sessionStorage.setItem("webauthn_challenge", bufToB64url(challenge.buffer));

  const userHandle = new Uint8Array(16);
  crypto.getRandomValues(userHandle);

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: challenge.buffer,
      rp: { name: SITE_CONFIG.siteName || "我的个人主页", id: location.hostname },
      user: {
        id: userHandle.buffer,
        name: "owner",
        displayName: PUBLIC_CONTENT.name || "我",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        residentKey: "discouraged",
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "none",
    },
  });

  localStorage.setItem(FP_ID_KEY, bufToB64url(credential.rawId));
  if (credential.response.getPublicKey) {
    localStorage.setItem(FP_PK_KEY, bufToB64url(credential.response.getPublicKey()));
  }
}

async function loginFingerprint() {
  const id = localStorage.getItem(FP_ID_KEY);
  if (!id) return false;

  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  sessionStorage.setItem("webauthn_challenge", bufToB64url(challenge.buffer));

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: challenge.buffer,
      rpId: location.hostname,
      allowCredentials: [{ type: "public-key", id: b64urlToBuf(id) }],
      userVerification: "required",
      timeout: 60000,
    },
  });

  // 轻量校验：rpIdHash + 用户验证标志 + challenge
  const authData = new Uint8Array(assertion.response.authenticatorData);
  const rpIdHashBytes = hexToBytes(await sha256(location.hostname));
  for (let i = 0; i < 32; i++) {
    if (authData[i] !== rpIdHashBytes[i]) return false;
  }
  const flags = authData[32];
  if ((flags & 0x04) === 0) return false; // UV：指纹/面容验证标志

  const cdj = JSON.parse(new TextDecoder().decode(assertion.response.clientDataJSON));
  const expected = sessionStorage.getItem("webauthn_challenge");
  if (expected && cdj.challenge !== expected) return false;

  return true;
}

/* ---------- 事件 ---------- */
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

document.getElementById("fingerprint-btn").addEventListener("click", async function () {
  const status = document.getElementById("fp-status");
  status.textContent = "";
  if (!webAuthnSupported()) {
    status.textContent = "当前环境不支持指纹登录（请在 HTTPS 网页上使用）。";
    return;
  }
  try {
    if (!localStorage.getItem(FP_ID_KEY)) {
      status.textContent = "首次使用：请在系统弹窗中录入指纹…";
      await registerFingerprint();
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_TS_KEY, String(Date.now()));
      document.getElementById("login-error").hidden = true;
      status.textContent = "";
      showView(true);
      return;
    }
    const ok = await loginFingerprint();
    if (ok) {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_TS_KEY, String(Date.now()));
      document.getElementById("login-error").hidden = true;
      showView(true);
    }
  } catch (err) {
    if (err && err.name === "NotAllowedError") {
      status.textContent = "已取消，或未通过指纹验证。";
    } else {
      status.textContent = "指纹登录失败：" + (err && err.message ? err.message : "未知错误");
    }
  }
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_TS_KEY);
  showView(false);
});

showView(isLoggedIn());
