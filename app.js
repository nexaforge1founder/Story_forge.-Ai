window.App = {
  showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");
    window.scrollTo(0, 0);
  },

  showDashboard(username = "Storyteller") {
    document.getElementById("profileName").textContent = username;
    document.getElementById("dashboardGreeting").textContent = `Welcome, ${username}.`;
    this.showPage("dashboardPage");
  },

  toast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("storyForgeUser");
  if (saved) {
    try {
      const user = JSON.parse(saved);
      // Do not automatically force the user into the dashboard on every visit.
      // The welcome page remains the entry point.
      document.getElementById("profileName").textContent = user.username || "Storyteller";
    } catch (_) {}
  }
});
