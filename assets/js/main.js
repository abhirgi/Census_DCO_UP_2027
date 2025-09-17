let currentLang = "en"; // default English

document.addEventListener("DOMContentLoaded", () => {
  renderAll();

  // ✅ Toggle button
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "hi" : "en";
      langBtn.textContent = currentLang === "en" ? "हिंदी" : "English";
      renderAll();
    });
  }
});

// ------------------ RENDER FUNCTION ------------------
function renderAll() {
  fetch("assets/js/data.json")
    .then(res => res.json())
    .then(data => {
      // ✅ Headings translation
      const headings = data.headings[currentLang];
      document.getElementById("nav-title").innerText = headings.navTitle;
      document.getElementById("latest-news-title").innerText = headings.latestNews;
      document.getElementById("view-all-btn").innerText = headings.viewAll;
      document.getElementById("supporting-docs-title").innerText = headings.supportingDocs;
      document.getElementById("circulars-title").innerText = headings.circulars;
      document.getElementById("manuals-title").innerText = headings.manuals;
      document.getElementById("tutorials-title").innerText = headings.tutorials;
      document.getElementById("follow-us-title").innerText = headings.followUs;
      document.getElementById("all-news-title").innerText = headings.allNews;
      document.getElementById("pdf-placeholder").innerText = headings.pdfPlaceholder;
      document.getElementById("achievement-section").innerText = headings.achievements;


      // ✅ Content rendering
      loadNews(data.news[currentLang]);
      loadCyclicCarousel(data.achievements[currentLang]);
      loadDocs("circulars-list", data.circulars[currentLang]);
      loadDocs("manuals-list", data.manuals[currentLang]);
      loadTutorials(data.tutorials[currentLang]);
      loadSocialLinks(data.socialMedia);
    });
}

// ------------------ NEWS ------------------
function loadNews(news) {
  const list = document.getElementById("news-list");
  list.className = "list-group";
  list.innerHTML = "";
  const modalList = document.getElementById("all-news-list");
  modalList.innerHTML = "";

  const today = new Date();
  const cutoff = new Date();
  cutoff.setMonth(today.getMonth() - 3); // last 3 months

  news.forEach(item => {
    const newsDate = new Date(item.date);
    const isNew = !isNaN(newsDate) && newsDate >= cutoff;
    const badge = isNew ? `<span class="badge bg-danger ms-2">NEW</span>` : "";

    let a = document.createElement("a");
    a.href = item.link;
    a.target = "_blank";
    a.className = "list-group-item list-group-item-action d-flex align-items-center";
    a.innerHTML = `<i class="bi bi-newspaper me-2"></i> ${item.title} ${badge}`;
    list.appendChild(a);

    let m = a.cloneNode(true);
    modalList.appendChild(m);
  });
}

// ------------------ SOCIAL MEDIA ------------------
function loadSocialLinks(socialLinks) {
  const container = document.getElementById("social-links");
  container.innerHTML = "";

  socialLinks.forEach(link => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "mx-2 fs-4 text-dark";
    if (link.iconSvg) {
      a.innerHTML = link.iconSvg;
    } else {
      a.innerHTML = `<i class="${link.icon}"></i>`;
    }
    container.appendChild(a);
  });
}

// ------------------ ACHIEVEMENTS ------------------
function loadCyclicCarousel(achievements) {
  const carouselInner = document.querySelector("#achievementsCarousel .carousel-inner");
  const carouselIndicators = document.querySelector("#achievementsCarousel .carousel-indicators");

  if (!carouselInner || !carouselIndicators) return;

  // clear old data
  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  achievements.forEach((ach, index) => {
    // Add item
    const div = document.createElement("div");
    div.className = `carousel-item text-center ${index === 0 ? "active" : ""}`;
    div.innerHTML = `
      <a href="${ach.url || '#'}" target="_blank">
        <img src="${ach.image}" class="d-block mx-auto carousel-img "
             alt="${ach.title}"
             style="max-height:300px; object-fit:contain;">
      </a>
      <p class="mt-2 fw-semibold">${ach.title}</p>
    `;
    carouselInner.appendChild(div);

    // Add indicator
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-bs-target", "#achievementsCarousel");
    button.setAttribute("data-bs-slide-to", index);
    button.setAttribute("aria-label", `Slide ${index + 1}`);
    if (index === 0) {
      button.className = "active";
      button.setAttribute("aria-current", "true");
    }
    carouselIndicators.appendChild(button);
  });
}



// ------------------ DOCUMENTS ------------------
function loadDocs(containerId, docs) {
  const list = document.getElementById(containerId);
  const pdfFrame = document.getElementById("pdf-frame");
  const pdfPlaceholder = document.getElementById("pdf-placeholder");

  list.innerHTML = "";

  docs.forEach(doc => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.innerHTML = `<i class="bi bi-file-earmark-pdf-fill text-danger me-2"></i>${doc.title}`;

    li.onclick = () => {
      pdfFrame.src = doc.pdfUrl;
      pdfFrame.style.display = "block";
      pdfPlaceholder.style.display = "none";
    };

    list.appendChild(li);
  });

  pdfFrame.src = "";
  pdfFrame.style.display = "none";
  pdfPlaceholder.style.display = "flex";
}

// ------------------ TUTORIALS ------------------
function loadTutorials(tutorials) {
  const container = document.getElementById("tutorials-list");
  container.className = "d-flex justify-content-center flex-wrap gap-3";
  container.innerHTML = "";

  tutorials.forEach(tut => {
    let iframe = document.createElement("iframe");
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = tut.videoUrl;
    iframe.title = tut.title;
    iframe.allowFullscreen = true;
    iframe.className = "shadow rounded";
    container.appendChild(iframe);
  });
}
