/* 公开首页渲染逻辑，内容全部来自 js/config.js */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function make(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function renderItem(item) {
  const type = item.type;

  if (type === "text") {
    const p = make("p");
    p.textContent = item.content;
    return p;
  }

  if (type === "list") {
    const ul = make("ul");
    (item.content || []).forEach(function (line) {
      const li = make("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    return ul;
  }

  if (type === "cards") {
    const grid = make("div", "card-grid");
    (item.content || []).forEach(function (card) {
      const inner = "<h3>" + esc(card.title) + "</h3><p>" + esc(card.desc || "") + "</p>";
      if (card.link) {
        const a = make("a", "card");
        a.href = card.link;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = inner;
        grid.appendChild(a);
      } else {
        const div = make("div", "card");
        div.innerHTML = inner;
        grid.appendChild(div);
      }
    });
    return grid;
  }

  if (type === "tags") {
    const tags = make("div", "tags");
    (item.content || []).forEach(function (t) {
      const span = make("span", "tag");
      span.textContent = t;
      tags.appendChild(span);
    });
    return tags;
  }

  if (type === "skills") {
    const skills = make("div", "skills");
    (item.content || []).forEach(function (s) {
      const lv = Math.max(0, Math.min(100, Number(s.level) || 0));
      const skill = make("div", "skill");
      const head = make("div", "skill-head");
      head.innerHTML =
        '<span class="skill-name">' + esc(s.name) + "</span>" +
        '<span class="skill-level">' + lv + "%</span>";
      const bar = make("div", "skill-bar");
      bar.innerHTML = '<div class="skill-fill" style="width:' + lv + '%"></div>';
      skill.appendChild(head);
      skill.appendChild(bar);
      skills.appendChild(skill);
    });
    return skills;
  }

  if (type === "timeline") {
    const tl = make("div", "timeline");
    (item.content || []).forEach(function (t) {
      const it = make("div", "tl-item");
      const time = make("div", "tl-time");
      time.textContent = t.time;
      const title = make("div", "tl-title");
      title.textContent = t.title;
      const desc = make("div", "tl-desc");
      desc.textContent = t.desc;
      it.appendChild(time);
      it.appendChild(title);
      it.appendChild(desc);
      tl.appendChild(it);
    });
    return tl;
  }

  if (type === "stats") {
    const stats = make("div", "stats");
    (item.content || []).forEach(function (s) {
      const stat = make("div", "stat");
      stat.innerHTML =
        '<div class="stat-number">' + esc(s.number) + "</div>" +
        '<div class="stat-label">' + esc(s.label) + "</div>";
      stats.appendChild(stat);
    });
    return stats;
  }

  return null;
}

function getPageIndex() {
  const m = location.search.match(/[?&]p=(\d+)/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

function buildSection(container, section, id) {
  const sec = make("section", "section");
  if (id) sec.id = id;
  const h2 = make("h2");
  h2.textContent = section.title;
  sec.appendChild(h2);
  (section.items || []).forEach(function (item) {
    const node = renderItem(item);
    if (node) sec.appendChild(node);
  });
  container.appendChild(sec);
  return sec;
}

function renderContact() {
  const contactEl = document.getElementById("contact");
  contactEl.innerHTML = "";
  const c = PUBLIC_CONTENT.contact || {};
  const ch2 = make("h2");
  ch2.textContent = "联系方式";
  contactEl.appendChild(ch2);

  let hasContact = false;
  if (c.email) {
    hasContact = true;
    const p = make("p");
    p.innerHTML = '邮箱：<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>";
    contactEl.appendChild(p);
  }
  if (c.phone) {
    hasContact = true;
    const p = make("p");
    const tel = String(c.phone).replace(/[^0-9+]/g, "");
    p.innerHTML = '电话：<a href="tel:' + esc(tel) + '">' + esc(c.phone) + "</a>";
    contactEl.appendChild(p);
  }
  if (c.links && c.links.length) {
    hasContact = true;
    const ul = make("ul", "links");
    c.links.forEach(function (link) {
      const li = make("li");
      li.innerHTML =
        '<a href="' + esc(link.url) + '" target="_blank" rel="noopener">' + esc(link.name) + "</a>";
      ul.appendChild(li);
    });
    contactEl.appendChild(ul);
  }
  if (!hasContact) {
    const p = make("p", "muted");
    p.textContent = "（待补充）联系方式";
    contactEl.appendChild(p);
  }
}

function setupScrollSpy(navEl, sectionsEl) {
  const navLinks = Array.prototype.slice.call(navEl.children);
  const sectionEls = Array.prototype.slice.call(sectionsEl.children);
  function setActive() {
    const threshold = 100;
    const y = window.scrollY + threshold;
    let activeIndex = 0;
    sectionEls.forEach(function (el, i) {
      if (el.offsetTop <= y) activeIndex = i + 1;
    });
    navLinks.forEach(function (a, i) {
      a.classList.toggle("active", i === activeIndex);
    });
  }
  window.addEventListener("scroll", setActive);
  setActive();
}

function renderPublic() {
  document.title = SITE_CONFIG.siteName;
  document.querySelector(".brand").textContent = SITE_CONFIG.siteName;
  document.getElementById("footer-brand").textContent = SITE_CONFIG.siteName;
  document.getElementById("year").textContent = new Date().getFullYear();

  // 左侧栏
  document.getElementById("hero-name").textContent = PUBLIC_CONTENT.name;
  document.getElementById("hero-title").textContent = PUBLIC_CONTENT.title;
  document.getElementById("signature").textContent = PUBLIC_CONTENT.signature || "";
  document.getElementById("intro").textContent = PUBLIC_CONTENT.intro;

  if (PUBLIC_CONTENT.photo) {
    const photoEl = document.getElementById("photo");
    const img = document.createElement("img");
    img.src = PUBLIC_CONTENT.photo;
    img.alt = PUBLIC_CONTENT.name;
    photoEl.innerHTML = "";
    photoEl.appendChild(img);
  }

  const sections = PUBLIC_CONTENT.sections || [];
  const pageIndex = getPageIndex(); // 1-based
  const single = pageIndex && pageIndex <= sections.length ? pageIndex : null;

  // 顶部导航（递增分页链接）
  const navEl = document.getElementById("main-nav");
  navEl.innerHTML = "";

  const home = make("a");
  home.href = "index.html";
  home.textContent = "首页";
  navEl.appendChild(home);

  sections.forEach(function (section, i) {
    const navA = make("a");
    navA.href = "index.html?p=" + (i + 1);
    navA.textContent = section.title;
    navEl.appendChild(navA);
  });

  // 内容区
  const sectionsEl = document.getElementById("sections");
  sectionsEl.innerHTML = "";

  // 单模块页隐藏顶部介绍卡片，首页保留
  const introCard = document.querySelector(".intro-card");
  if (introCard) introCard.style.display = single ? "none" : "";

  if (single) {
    document.title = sections[single - 1].title + " · " + SITE_CONFIG.siteName;
    buildSection(sectionsEl, sections[single - 1]);
    navEl.children[single].classList.add("active");
  } else {
    sections.forEach(function (section, i) {
      buildSection(sectionsEl, section, "sec-" + i);
    });
    setupScrollSpy(navEl, sectionsEl);
  }

  renderContact();
}

renderPublic();
