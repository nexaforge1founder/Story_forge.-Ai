document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const message = document.getElementById("authMessage");

  function setMessage(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "#ff6d78" : "#c5a35b";
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const signup = tab.dataset.auth === "signup";
      loginForm.classList.toggle("hidden", signup);
      signupForm.classList.toggle("hidden", !signup);
      setMessage("");
    });
  });

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    setMessage("Connecting to the forge...");
    try {
      const result = await API.login(
        document.getElementById("loginUsername").value.trim(),
        document.getElementById("loginPassword").value
      );
      localStorage.setItem("storyForgeUser", JSON.stringify(result));
      window.App.showDashboard(result.username || document.getElementById("loginUsername").value);
    } catch (error) {
      setMessage(error.message, true);
    }
  });

  signupForm.addEventListener("submit", async event => {
    event.preventDefault();
    setMessage("Creating your forge account...");
    try {
      const result = await API.signup(
        document.getElementById("signupUsername").value.trim(),
        document.getElementById("signupEmail").value.trim(),
        document.getElementById("signupPassword").value
      );
      localStorage.setItem("storyForgeUser", JSON.stringify(result));
      window.App.showDashboard(result.username || document.getElementById("signupUsername").value);
    } catch (error) {
      setMessage(error.message, true);
    }
  });

  document.getElementById("forgotBtn").addEventListener("click", async () => {
    const email = prompt("Enter your account email:");
    if (!email) return;
    setMessage("Requesting password reset...");
    try {
      const result = await API.forgotPassword(email);
      setMessage(result.message || "Password reset request created.");
    } catch (error) {
      setMessage(error.message, true);
    }
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => window.App.showPage(button.dataset.go));
  });
});
