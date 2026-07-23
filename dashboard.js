document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".side-link[data-panel]");
  const panels = document.querySelectorAll(".dashboard-panel");

  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
      panels.forEach(panel => panel.classList.remove("active"));
      document.getElementById(`${link.dataset.panel}Panel`).classList.add("active");
    });
  });

  const createMovie = () => window.App.toast("Movie creation workspace will be connected next.");

  document.getElementById("createMovieBtn").addEventListener("click", createMovie);
  document.getElementById("createMovieSecondary").addEventListener("click", createMovie);

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("storyForgeUser");
    window.App.showPage("welcomePage");
  });
});
