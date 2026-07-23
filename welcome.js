document.addEventListener("DOMContentLoaded", () => {
  const bike = document.getElementById("techBike");
  const message = document.getElementById("waveMessage");

  // The rider enters first. The futuristic bike is intentionally invisible.
  setTimeout(() => {
    bike.classList.add("revealed");
    message.classList.add("show");
  }, 4200);

  document.getElementById("enterForgeBtn").addEventListener("click", () => {
    window.App.showPage("authPage");
  });

  document.getElementById("loginQuickBtn").addEventListener("click", () => {
    window.App.showPage("authPage");
  });
});
