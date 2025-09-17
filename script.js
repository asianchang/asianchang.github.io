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
        }, 300); // Use 300ms for clearer long press
      });
      element.addEventListener("touchend", () => clearTimeout(touchTimeout));
      element.addEventListener("touchmove", () => clearTimeout(touchTimeout));
    } else {
      element.addEventListener("click", callback);
    }
  }

  // Set up tab click handlers
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

  // Handle browser back/forward buttons
  window.addEventListener("popstate", (event) => {
    const tab = event.state?.tab || new URLSearchParams(window.location.search).get("tab") || "home";
    showTab(tab, false);
  });

  // On initial load: always default to "home" or the tab from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab") || "home";
  showTab(initialTab, false);

  // Now clean up URL to remove the ?tab= query param without reloading
  const cleanUrl = window.location.origin + window.location.pathname;
  history.replaceState({}, "", cleanUrl);

  // Comics Carousels
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
  initCarousel("carousel-4", ["on being seen.png"]);
  initCarousel("carousel-5", ["ive grown a lot.png"]);
});
