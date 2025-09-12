document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");

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

  // 🔁 On page load, restore the last tab or default to "films"
  const lastTab = localStorage.getItem("lastTab") || "films";
  showTab(lastTab);
});
