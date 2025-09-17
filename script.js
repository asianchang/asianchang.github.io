document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");
  const thumbnails = document.querySelectorAll(".home-thumbnail");

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function showTab(targetTab, updateUrl = true) {
    const targetId = "tab-" + targetTab;

    // Hide all tab content
    tabContents.forEach(content => content.classList.add("hidden"));

    // Show the target tab content
    const targetContent = document.getElementById(targetId);
    if (targetContent) targetContent.classList.remove("hidden");

    // Update active tab classes
    tabs.forEach(t => t.classList.remove("active"));
    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) activeTab.classList.add("active");

    // Update URL if needed
    if (updateUrl) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("tab", targetTab);
      history.pushState({ tab: targetTab }, "", newUrl);
    }
  }

  function addInstantClickHandler(element, callback) {
    if (isTouchDevice) {
      element.addEventListener("touchend", (e) => {
        e.preventDefault();
        callback();
      });
    } else {
      element.addEventListener("click", callback);
    }
  }

  function addDelayedPressHandler(element, callback) {
    if (isTouchDevice) {
      let touchTimeout;
      element.addEventListener("touchstart", () => {
        touchTimeout = setTimeout(() => {
          callback();
        }, 50);
      });
      element.addEventListener("touchend", () => clearTimeout(touchTimeout));
      element.addEventListener("touchmove", () => clearTimeout(touchTimeout));
    } else {
      element.addEventListener("click", callback);
    }
  }

  // Set up main tab click handlers
  tabs.forEach(tab => {
    addInstantClickHandler(tab, () => {
      const target = tab.getAttribute("data-tab");
      if (target) showTab(target);
    });
  });
  // Set up nameTitle click (go to home)
  if (nameTitle) {
    addInstantClickHandler(nameTitle, () => {
      showTab("home");
    });
  }

  // Set up delayed press for home thumbnails
  thumbnails.forEach(thumbnail => {
    addDelayedPressHandler(thumbnail, () => {
      const target = thumbnail.getAttribute("data-tab-target");
      if (target) showTab(target);
    });
  });

  // Set up delayed press for clickable drawings
  clickableDrawings.forEach(drawing => {
    addDelayedPressHandler(drawing, () => {
      const target = drawing.getAttribute("data-tab-target");
      if (target) showTab(target);
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", (event) => {
    const tab = event.state?.tab || new URLSearchParams(window.location.search).get("tab") || "home";
    showTab(tab, false);
  });

  const isReload = performance.getEntriesByType("navigation")[0].type // 0 = Reload

  const urlParams = new URLSearchParams(window.location.search);
  let initialTab = urlParams.get("tab");

  if (isReload || !initialTab) {
    initialTab = "home";
  }

  showTab(initialTab, false);

  // Clean URL, but preserve state
  const cleanUrl = window.location.origin + window.location.pathname;
  history.replaceState({ tab: initialTab }, "", cleanUrl);

  // ========== DRAWING SUBTAB NAVIGATION ==========
  const drawingClickableItems = document.querySelectorAll('.drawing-item.clickable');
  const allDrawingSubtabs = document.querySelectorAll('[id^="drawing-subtab-"]');

  drawingClickableItems.forEach(item => {
    item.addEventListener('click', () => {
      const subtabId = item.getAttribute('data-subtab');
      if (!subtabId) return;

      // Hide all tabs and subtabs
      tabContents.forEach(tab => tab.classList.add('hidden'));
      allDrawingSubtabs.forEach(subtab => subtab.classList.add('hidden'));

      const target = document.getElementById(`drawing-subtab-${subtabId}`);
      if (target) {
        target.classList.remove('hidden');
      }
    });
  });

  // BACK BUTTON in subtab
  const backButtons = document.querySelectorAll('.back-button');
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-target-tab');
      if (!targetTab) return;

      // Hide all subtabs
      allDrawingSubtabs.forEach(subtab => subtab.classList.add('hidden'));

      // Show the main drawings tab
      const tab = document.getElementById(`tab-${targetTab}`);
      if (tab) {
        tab.classList.remove('hidden');
        tab.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== COMIC CAROUSELS ==========
  function initCarousel(containerId, imageList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const slide = container.querySelector(".carousel-slide");
    const prevBtn = container.querySelector(".carousel-arrow.left");
    const nextBtn = container.querySelector(".carousel-arrow.right");

    if (!slide) return;

    const hasArrows = prevBtn && nextBtn;

    let currentIndex = 0;

    // Clear previous images if any
    slide.innerHTML = "";

    imageList.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = "res/" + src;
      img.alt = `Image ${index + 1}`;
      img.classList.add("carousel-image");
      if (index === 0) img.classList.add("active");
      slide.appendChild(img);
    });

    const images = slide.querySelectorAll(".carousel-image");

    if (images.length <= 1 && hasArrows) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }

    function showImage(index) {
      if (index < 0 || index >= images.length) return;

      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });

      currentIndex = index;

      if (hasArrows) {
        prevBtn.style.display = (currentIndex === 0 && images.length > 1) ? "none" : "";
        nextBtn.style.display = (currentIndex === images.length - 1 && images.length > 1) ? "none" : "";
      }
    }

    function nextImage() {
      if (currentIndex < images.length - 1) {
        currentIndex++;
        showImage(currentIndex);
      }
    }

    function prevImage() {
      if (currentIndex > 0) {
        currentIndex--;
        showImage(currentIndex);
      }
    }

    if (hasArrows) {
      nextBtn.addEventListener("click", nextImage);
      prevBtn.addEventListener("click", prevImage);
    }

    // Show the first image initially
    showImage(0);
  }

  initCarousel("carousel-1", ["friends-1.png", "friends-2.png", "friends-3.png"]);
  initCarousel("carousel-2", ["job1.png", "job2.png", "job3.png"]);
  initCarousel("carousel-3", ["openly.png"]);
  initCarousel("carousel-4", ["seen.png"]);
  initCarousel("carousel-5", ["grown.png"]);
  initCarousel("drawing-carousel-1", [])
});
