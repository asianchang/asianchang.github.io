document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");
  const thumbnails = document.querySelectorAll(".home-thumbnail");

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function showTab(targetTab, updateUrl = true) {
    const targetId = "tab-" + targetTab;

    tabContents.forEach(content => content.classList.add("hidden"));

    const targetContent = document.getElementById(targetId);
    if (targetContent) targetContent.classList.remove("hidden");

    tabs.forEach(t => t.classList.remove("active"));
    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) activeTab.classList.add("active");

    localStorage.setItem("lastTab", targetTab);

    if (updateUrl) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("tab", targetTab);
      history.pushState({ tab: targetTab }, "", newUrl);
    }
  }

  // Regular click or touch handler without delay
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

  // Delayed press handler (300ms press required)
  function addDelayedPressHandler(element, callback) {
    if (isTouchDevice) {
      let touchTimeout;
      element.addEventListener("touchstart", (e) => {
        touchTimeout = setTimeout(() => {
          callback();
        }, 50); 
      });
      element.addEventListener("touchend", (e) => {
        clearTimeout(touchTimeout);
      });
      element.addEventListener("touchmove", (e) => {
        clearTimeout(touchTimeout);
      });
    } else {
      element.addEventListener("click", callback);
    }
  }

  // Apply regular click to tabs and nameTitle
  tabs.forEach(tab => {
    addInstantClickHandler(tab, () => {
      const target = tab.getAttribute("data-tab");
      if (target) showTab(target);
    });
  });

  if (nameTitle) {
    addInstantClickHandler(nameTitle, () => {
      showTab("home");
    });
  }

  // Apply delayed press only to home thumbnails
  thumbnails.forEach(thumbnail => {
    addDelayedPressHandler(thumbnail, () => {
      const target = thumbnail.getAttribute("data-tab-target");
      if (target) showTab(target);
    });
  });

  window.addEventListener("popstate", (event) => {
    const tab = event.state?.tab || new URLSearchParams(window.location.search).get("tab") || "home";
    showTab(tab, false);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlTab = urlParams.get("tab");
  const lastTab = localStorage.getItem("lastTab") || "home";
  const initialTab = urlTab || lastTab;

  showTab(initialTab, false);
});
