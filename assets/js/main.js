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

      document.getElementById("all-news-title").innerText = headings.allNews;

      document.getElementById("achievement-section").innerText = headings.achievements;


      // ✅ Content rendering
      loadDistricts(data.districts);
      loadNews(data.news[currentLang]);
      loadCyclicCarousel(data.achievements[currentLang]);
      loadDocsGrid("circulars-list", data.circulars[currentLang]);
      loadDocsGrid("manuals-list", data.manuals[currentLang]);
      loadTutorials(data.tutorials[currentLang]);
      setupNotificationBell(data.notifications || []);
      const params = new URLSearchParams(window.location.search);
      if (params.has("district")) {
        showDistrict(params.get("district"));
      }

    });


}


function setupNotificationBell(notifications) {
  const badge = document.getElementById('notification-badge');
  const list = document.getElementById('notification-list');

  // Badge show/hide aur count set karo
  if (notifications && notifications.length > 0) {
    badge.style.display = 'inline-block';
    badge.textContent = notifications.length > 9 ? '9+' : notifications.length;
  } else {
    badge.style.display = 'none';
  }

  // Notification list populate karo
  if (!notifications || notifications.length === 0) {
    list.innerHTML = `<li class="dropdown-item text-center text-muted">No new notifications</li>`;
  } else {
    list.innerHTML = notifications
      .map(n => `<li class="dropdown-item">${n.message}</li>`)
      .join('');
  }
}




// Call setup after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  setupNotificationBell();
});

// Call this function after DOM loaded
document.addEventListener('DOMContentLoaded', setupNotificationBell);



// ------------------ NEWS ------------------
function loadDistricts(districts) {
  const dropdown = document.getElementById("district-dropdown");
  districts.forEach(d => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.href = `?district=${encodeURIComponent(d)}`;
    link.textContent = d;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", `?district=${encodeURIComponent(d)}`);
      showDistrict(d);
    });

    li.appendChild(link);
    dropdown.appendChild(li);
  });
}

// Show District Page dynamically
function showDistrict(district) {
  const section = document.getElementById("district-section"); // wahi section jo alert me hai
  const title = document.getElementById("district-title");
  const msg = document.getElementById("district-message");

  // Section visible karo
  section.style.display = "block";

  // Dynamic content set karo
  title.textContent = `Welcome District Incharge — ${district}`;
  msg.textContent = `This is the dedicated portal section for ${district} district.`;
}
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
function loadDocsGrid(containerId, docs, cols = 4) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear previous

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  let tr = document.createElement("tr");
  docs.forEach((doc, i) => {
    const td = document.createElement("td");
    td.textContent = doc.title;
    td.style.padding = "8px";

    td.style.cursor = "pointer";
    td.style.color = "#000000ff";
    td.style.textDecoration = "underline";

    td.onclick = () => window.open(doc.pdfUrl, "_blank");

    tr.appendChild(td);

    // After every 'cols' items, append the row and create new row
    if ((i + 1) % cols === 0) {
      table.appendChild(tr);
      tr = document.createElement("tr");
    }
  });

  // Append remaining row if any
  if (tr.children.length > 0) {
    table.appendChild(tr);
  }

  container.appendChild(table);
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
