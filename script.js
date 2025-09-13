document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");

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

    // Add 'active' class to the clicked tab
    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    // Save the selected tab to localStorage
    localStorage.setItem("lastTab", targetTab);
  }

  // Add click event to each tab
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      showTab(target);
    });
  });

  // Add click event to name-title to go to home tab
  if (nameTitle) {
    nameTitle.addEventListener("click", () => {
      showTab("home");
    });
  }

  // On page load, restore last tab or default to "home"
  const lastTab = localStorage.getItem("lastTab") || "home";
  showTab(lastTab);
});
