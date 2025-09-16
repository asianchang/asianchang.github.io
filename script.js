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

  // On initial load: always default to "home"
  showTab("home", false);
});
