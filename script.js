document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");
  const thumbnails = document.querySelectorAll(".home-thumbnail");

  /**
   * Show the requested tab
   * @param {string} targetTab - name of tab (e.g., 'films')
   * @param {boolean} updateUrl - whether to update URL (default true)
   */
  function showTab(targetTab, updateUrl = true) {
    const targetId = "tab-" + targetTab;

    // Hide all tabs
    tabContents.forEach(content => {
      content.classList.add("hidden");
    });

    // Show selected tab
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.remove("hidden");
    }

    // Update tab highlighting
    tabs.forEach(t => t.classList.remove("active"));
    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    // Save last tab
    localStorage.setItem("lastTab", targetTab);

    // Update URL
    if (updateUrl) {
      const newUrl = new URL(window.location);
      newUrl.searchParams.set("tab", targetTab);
      history.pushState({ tab: targetTab }, "", newUrl);
    }
  }

  /**
   * Set up tab click/touch handlers
   */
  tabs.forEach(tab => {
    const handler = () => {
      const target = tab.getAttribute("data-tab");
      if (target) showTab(target);
    };
    tab.addEventListener("click", handler);
    tab.addEventListener("touchend", handler);
  });

  /**
   * Name title ("aidan sky chang") goes to 'home'
   */
  if (nameTitle) {
    const handler = () => showTab("home");
    nameTitle.addEventListener("click", handler);
    nameTitle.addEventListener("touchend", handler);
  }

  /**
   * Thumbnails on home grid go to respective tabs
   */
  thumbnails.forEach(thumbnail => {
    const handler = () => {
      const target = thumbnail.getAttribute("data-tab-target");
      if (target) showTab(target);
    };
    thumbnail.addEventListener("click", handler);
    thumbnail.addEventListener("touchend", handler);
  });

  /**
   * Handle browser back/forward buttons
   */
  window.addEventListener("popstate", (event) => {
    const tab = event.state?.tab || new URLSearchParams(window.location.search).get("tab") || "home";
    showTab(tab, false); // Don't push new URL
  });

  /**
   * Initial page load: get tab from URL, fallback to lastTab or 'home'
   */
  const urlParams = new URLSearchParams(window.location.search);
  const urlTab = urlParams.get("tab");
  const lastTab = localStorage.getItem("lastTab") || "home";
  const initialTab = urlTab || lastTab;

  showTab(initialTab, false); // Initial load — don't push URL again
});
