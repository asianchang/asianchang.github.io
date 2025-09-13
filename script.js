document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll("#tabs > div");
  const nameTitle = document.querySelector(".name-title.tab");  // require .tab here, or query separately

  function showTab(targetTab) {
    const targetId = "tab-" + targetTab;

    tabContents.forEach(content => {
      content.classList.add("hidden");
    });

    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.remove("hidden");
    }

    tabs.forEach(t => t.classList.remove("active"));

    const activeTab = Array.from(tabs).find(t => t.getAttribute("data-tab") === targetTab);
    if (activeTab) {
      activeTab.classList.add("active");
    }

    localStorage.setItem("lastTab", targetTab);
  }

  tabs.forEach(tab => {
    const handler = (event) => {
      event.preventDefault();  // in case default behavior interferes
      const target = tab.getAttribute("data-tab");
      if (target) {
        showTab(target);
      }
    };

    tab.addEventListener("click", handler);
    tab.addEventListener("touchend", handler);
  });

  if (nameTitle) {
    nameTitle.addEventListener("click", () => {
      showTab("home");
    });
    nameTitle.addEventListener("touchend", () => {
      showTab("home");
    });
  }

  const lastTab = localStorage.getItem("lastTab") || "home";
  showTab(lastTab);
});
