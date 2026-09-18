/* 公开首页渲染逻辑，内容全部来自 js/config.js */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function renderPublic() {
  document.title = SITE_CONFIG.siteName;
  document.querySelector(".brand").textContent = SITE_CONFIG.siteName;
  document.getElementById("footer-brand").textContent = SITE_CONFIG.siteName;
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("hero-name").textContent = PUBLIC_CONTENT.name;
  document.getElementById("hero-title").textContent = PUBLIC_CONTENT.title;
  document.getElementById("intro").textContent = PUBLIC_CONTENT.intro;

  // 照片：填了路径就显示图片，否则保留占位框
  if (PUBLIC_CONTENT.photo) {
    const photoEl = document.getElementById("photo");
    const img = document.createElement("img");
    img.src = PUBLIC_CONTENT.photo;
    img.alt = PUBLIC_CONTENT.name;
    photoEl.innerHTML = "";
    photoEl.appendChild(img);
  }

  const sectionsEl = document.getElementById("sections");
  sectionsEl.innerHTML = "";

  (PUBLIC_CONTENT.sections || []).forEach(function (section) {
    const sec = document.createElement("section");
    sec.className = "section";

    const h2 = document.createElement("h2");
    h2.textContent = section.title;
    sec.appendChild(h2);

    (section.items || []).forEach(function (item) {
      if (item.type === "text") {
        const p = document.createElement("p");
        p.textContent = item.content;
        sec.appendChild(p);
      } else if (item.type === "list") {
        const ul = document.createElement("ul");
        (item.content || []).forEach(function (line) {
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        });
        sec.appendChild(ul);
      } else if (item.type === "cards") {
        const grid = document.createElement("div");
        grid.className = "card-grid";
        (item.content || []).forEach(function (card) {
          const inner = "<h3>" + esc(card.title) + "</h3><p>" + esc(card.desc || "") + "</p>";
          if (card.link) {
            const a = document.createElement("a");
            a.className = "card";
            a.href = card.link;
            a.target = "_blank";
            a.rel = "noopener";
            a.innerHTML = inner;
            grid.appendChild(a);
          } else {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = inner;
            grid.appendChild(div);
          }
        });
        sec.appendChild(grid);
      }
    });

    sectionsEl.appendChild(sec);
  });

  // 联系方式
  const contactEl = document.getElementById("contact");
  const c = PUBLIC_CONTENT.contact || {};
  const ch2 = document.createElement("h2");
  ch2.textContent = "联系方式";
  contactEl.appendChild(ch2);

  let hasContact = false;
  if (c.email) {
    hasContact = true;
    const p = document.createElement("p");
    p.innerHTML = '邮箱：<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>";
    contactEl.appendChild(p);
  }
  if (c.links && c.links.length) {
    hasContact = true;
    const ul = document.createElement("ul");
    ul.className = "links";
    c.links.forEach(function (link) {
      const li = document.createElement("li");
      li.innerHTML =
        '<a href="' + esc(link.url) + '" target="_blank" rel="noopener">' + esc(link.name) + "</a>";
      ul.appendChild(li);
    });
    contactEl.appendChild(ul);
  }
  if (!hasContact) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "（待补充）联系方式";
    contactEl.appendChild(p);
  }
}

renderPublic();
