(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const money = (n) =>
    SITE.currency === "£" && n > 0 && n < 1
      ? Math.round(n * 100) + "p"
      : SITE.currency + Number(n).toFixed(2).replace(/\.00$/, "");
  const charityShare = (price) => Math.round(price * SITE.charityPercent) / 100;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---------- Site-wide text ---------- */
  $$("[data-charity-percent]").forEach((el) => (el.textContent = SITE.charityPercent));
  $$("[data-charity-name]").forEach((el) => (el.textContent = SITE.charityName));
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Gallery ---------- */
  const grid = $("#gallery-grid");
  const tilts = [-2, 1.5, -1, 2, -1.5, 1];
  const tapes = ["#ffd84d", "#9be7c4", "#ffb3d1", "#a9d6ff", "#ffc48a"];

  function renderGallery(filter) {
    const items = ARTWORKS.filter((a) =>
      filter === "all" ? true :
      filter === "available" ? !a.sold :
      a.artist === filter
    );

    if (!items.length) {
      grid.innerHTML = '<p class="empty">No drawings here yet… check back soon! ✏️</p>';
      return;
    }

    grid.innerHTML = items.map((art, i) => {
      const artist = ARTISTS[art.artist] || { name: art.artist, emoji: "🎨", colour: "#888" };
      const idx = ARTWORKS.indexOf(art);
      return `
        <article class="card ${art.sold ? "is-sold" : ""}"
                 style="--tilt:${tilts[i % tilts.length]}deg; --tape:${tapes[i % tapes.length]}; --artist:${artist.colour}">
          <button class="card-img" data-open="${idx}" aria-label="See ${escapeHtml(art.title)} bigger">
            <img src="${escapeHtml(art.image)}" alt="${escapeHtml(art.title)} by ${escapeHtml(artist.name)}" loading="lazy">
            ${art.sold ? '<span class="sold-stamp">SOLD!</span>' : ""}
          </button>
          <div class="card-body">
            <h3>${escapeHtml(art.title)}</h3>
            <p class="by">by <span>${artist.emoji} ${escapeHtml(artist.name)}</span></p>
            <p class="caption">${escapeHtml(art.caption)}</p>
            <div class="card-foot">
              <span class="price">${money(art.price)}</span>
              ${art.sold
                ? '<span class="sold-note">Already has a new home</span>'
                : `<button class="btn btn-small" data-buy="${idx}">I want it!</button>`}
            </div>
            <p class="charity-note">💛 ${money(charityShare(art.price))} goes to charity</p>
          </div>
        </article>`;
    }).join("");
  }

  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderGallery(chip.dataset.filter);
    })
  );

  /* ---------- Lightbox ---------- */
  const lightbox = $("#lightbox");

  grid.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    const buyBtn = e.target.closest("[data-buy]");

    if (openBtn) {
      const art = ARTWORKS[openBtn.dataset.open];
      const artist = ARTISTS[art.artist] || { name: art.artist };
      $("#lightbox-img").src = art.image;
      $("#lightbox-img").alt = art.title;
      $("#lightbox-title").textContent = `${art.title} — by ${artist.name}`;
      $("#lightbox-caption").textContent = art.caption;
      lightbox.showModal();
    }

    if (buyBtn) {
      const art = ARTWORKS[buyBtn.dataset.buy];
      const artist = ARTISTS[art.artist] || { name: art.artist };
      $("#f-artist").value = artist.name;
      goToForm(GALLERY_OPTION, `Hi! I'd love to buy "${art.title}" by ${artist.name} (${money(art.price)}).`);
    }
  });

  function goToForm(type, message) {
    showForm();
    $("#f-type").value = type;
    $("#f-message").value = message;
    $("#request").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#f-name").focus({ preventScroll: true }), 600);
  }

  /* ---------- Commissions price list ---------- */
  const GALLERY_OPTION = "A drawing from the gallery";
  const OTHER_OPTION = "Something else";
  const commissionLabel = (c) => `${c.name} (${money(c.price)})`;

  $("#f-type").innerHTML = [GALLERY_OPTION, ...COMMISSIONS.map(commissionLabel), OTHER_OPTION]
    .map((opt) => `<option>${escapeHtml(opt)}</option>`).join("");

  const commissionColours = ["#ffd84d", "#9be7c4", "#ffb3d1", "#a9d6ff", "#ffc48a", "#d4c2ff"];
  $("#commissions-grid").innerHTML = COMMISSIONS.map((c, i) => `
    <article class="commission" style="--accent:${commissionColours[i % commissionColours.length]}">
      <div class="commission-emoji">${c.emoji}</div>
      <h3>${escapeHtml(c.name)}</h3>
      <p class="commission-desc">${escapeHtml(c.description)}</p>
      <p class="price">${money(c.price)}</p>
      <p class="charity-note">💛 ${money(charityShare(c.price))} goes to charity</p>
      <button class="btn btn-small" data-commission="${i}">Ask for this</button>
    </article>`).join("");

  $("#commissions-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-commission]");
    if (!btn) return;
    const c = COMMISSIONS[btn.dataset.commission];
    goToForm(commissionLabel(c), `Hi! I'd like a commission: ${c.name}.\nHere's what I'd like drawn: `);
  });

  $("#lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Request form (sent via Formspree) ---------- */
  const form = $("#request-form");
  const done = $("#form-done");
  const errorBox = $("#form-error");

  function showForm() {
    form.hidden = false;
    done.hidden = true;
  }

  const submitBtn = $("#form-submit");

  function showError(text) {
    errorBox.textContent = text;
    errorBox.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const problems = [];
    if (!name) problems.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push("a proper email address");
    if (!message) problems.push("a short message");

    if (problems.length) {
      showError("Oops! Please add " + problems.join(" and ") + ". 🙂");
      return;
    }
    errorBox.hidden = true;

    const data = new FormData(form);
    data.append("_subject", `Kids Who Draw: ${form.type.value} (from ${name})`);

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending… ✈️";

    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Formspree returned " + res.status);

      form.reset();
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      console.error(err);
      showError("Oh no, your request didn't send. Please check your internet connection and try again. 🙏");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send my request 🚀";
    }
  });

  $("#form-again").addEventListener("click", showForm);

  /* ---------- Charity jar ---------- */
  const pct = Math.max(0, Math.min(100, (SITE.raisedForCharity / SITE.charityGoal) * 100 || 0));
  $("#raised-amount").textContent = money(SITE.raisedForCharity);
  $("#goal-amount").textContent = money(SITE.charityGoal);
  $("#progress").setAttribute("aria-valuenow", Math.round(pct));
  // Animate when scrolled into view
  const jarObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      $("#jar-fill").style.height = Math.max(pct, 4) + "%";
      $("#progress-bar").style.width = Math.max(pct, 2) + "%";
      jarObserver.disconnect();
    }
  }, { threshold: 0.3 });
  jarObserver.observe($("#charity"));

  /* ---------- Artists ---------- */
  $("#artists-grid").innerHTML = Object.entries(ARTISTS).map(([key, a]) => {
    const count = ARTWORKS.filter((w) => w.artist === key).length;
    return `
      <article class="artist" style="--artist:${a.colour}">
        <div class="artist-avatar">${a.emoji}</div>
        <h3>${escapeHtml(a.name)}</h3>
        <p>${escapeHtml(a.bio)}</p>
        <p class="small"><strong>Favourite tools:</strong> ${escapeHtml(a.favourite)}</p>
        <p class="small"><strong>Drawings in the gallery:</strong> ${count}</p>
      </article>`;
  }).join("");

  renderGallery("all");
})();
