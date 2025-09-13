document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");
  const thumbnails = document.querySelectorAll(".home-thumbnail");

  function showTab(targetTab) {
    const targetId = "tab-" + targetTab;

    // Hide all tab contents
    tabContents.forEach(content => {
      content.classList.add("hidden");
    });

    // Show selected tab content
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.remove("hidden");
    }

    // Remove 'active' class from all tabs
    tabs.forEach(t => t.classList.remove("active"));

    // Add 'active' class to the matching tab
    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    // Save the selected tab to localStorage
    localStorage.setItem("lastTab", targetTab);
  }

  // Tab clicks
  tabs.forEach(tab => {
    const handler = () => {
      const target = tab.getAttribute("data-tab");
      if (target) showTab(target);
    };
    tab.addEventListener("click", handler);
    tab.addEventListener("touchend", handler);
  });

  // Title click → go to home tab
  if (nameTitle) {
    const handler = () => showTab("home");
    nameTitle.addEventListener("click", handler);
    nameTitle.addEventListener("touchend", handler);
  }

  // Thumbnail clicks → go to matching tab
  thumbnails.forEach(thumbnail => {
    const handler = () => {
      const target = thumbnail.getAttribute("data-tab-target");
      if (target) showTab(target);
    };
    thumbnail.addEventListener("click", handler);
    thumbnail.addEventListener("touchend", handler);
  });

  // On load → restore last tab or default to home
  const lastTab = localStorage.getItem("lastTab") || "home";
  showTab(lastTab);
});
