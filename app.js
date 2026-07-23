const BACKEND_URL =
    "https://story-forge-ai-backend.onrender.com";


/* =========================
   SCREEN ELEMENTS
========================= */

const welcomeScreen =
    document.getElementById("welcomeScreen");

const authScreen =
    document.getElementById("authScreen");

const dashboardScreen =
    document.getElementById("dashboardScreen");


/* =========================
   AUTH PANELS
========================= */

const loginPanel =
    document.getElementById("loginPanel");

const signupPanel =
    document.getElementById("signupPanel");

const forgotPanel =
    document.getElementById("forgotPanel");


/* =========================
   BUTTONS
========================= */

const enterForgeButton =
    document.getElementById("enterForgeButton");

const backToWelcome =
    document.getElementById("backToWelcome");

const showSignupButton =
    document.getElementById("showSignupButton");

const showLoginButton =
    document.getElementById("showLoginButton");

const forgotPasswordButton =
    document.getElementById("forgotPasswordButton");

const backToLoginButton =
    document.getElementById("backToLoginButton");

const logoutButton =
    document.getElementById("logoutButton");


/* =========================
   SCREEN FUNCTIONS
========================= */

function showAuth() {

    welcomeScreen.classList.add("hidden");

    dashboardScreen.classList.add("hidden");

    authScreen.classList.remove("hidden");

    showLogin();

}


function showWelcome() {

    authScreen.classList.add("hidden");

    dashboardScreen.classList.add("hidden");

    welcomeScreen.classList.remove("hidden");

}


function showDashboard() {

    welcomeScreen.classList.add("hidden");

    authScreen.classList.add("hidden");

    dashboardScreen.classList.remove("hidden");

}


/* =========================
   AUTH PANEL FUNCTIONS
========================= */

function showLogin() {

    loginPanel.classList.remove("hidden");

    signupPanel.classList.add("hidden");

    forgotPanel.classList.add("hidden");

}


function showSignup() {

    loginPanel.classList.add("hidden");

    signupPanel.classList.remove("hidden");

    forgotPanel.classList.add("hidden");

}


function showForgotPassword() {

    loginPanel.classList.add("hidden");

    signupPanel.classList.add("hidden");

    forgotPanel.classList.remove("hidden");

}


/* =========================
   EVENT LISTENERS
========================= */

enterForgeButton.addEventListener(
    "click",
    showAuth
);


backToWelcome.addEventListener(
    "click",
    showWelcome
);


showSignupButton.addEventListener(
    "click",
    showSignup
);


showLoginButton.addEventListener(
    "click",
    showLogin
);


forgotPasswordButton.addEventListener(
    "click",
    showForgotPassword
);


backToLoginButton.addEventListener(
    "click",
    showLogin
);


/* =========================
   SIGNUP
========================= */

const signupForm =
    document.getElementById("signupForm");


signupForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const username =
            document.getElementById(
                "signupUsername"
            ).value.trim();

        const email =
            document.getElementById(
                "signupEmail"
            ).value.trim();

        const password =
            document.getElementById(
                "signupPassword"
            ).value;

        const message =
            document.getElementById(
                "signupMessage"
            );

        message.textContent =
            "Creating your forge...";


        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/signup`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })

                    }
                );


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                message.textContent =
                    "Account created successfully.";

                setTimeout(
                    showLogin,
                    1200
                );

            } else {

                message.textContent =
                    result.error ||
                    "Signup failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the Story Forge server.";

        }

    }

);


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const username =
            document.getElementById(
                "loginUsername"
            ).value.trim();

        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        const message =
            document.getElementById(
                "loginMessage"
            );

        message.textContent =
            "Entering the forge...";


        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })

                    }
                );


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                localStorage.setItem(
                    "storyForgeUser",
                    JSON.stringify(result)
                );

                showDashboard();

            } else {

                message.textContent =
                    result.error ||
                    "Login failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the Story Forge server.";

        }

    }

);


/* =========================
   FORGOT PASSWORD
========================= */

const forgotForm =
    document.getElementById("forgotForm");


forgotForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "forgotEmail"
            ).value.trim();


        const message =
            document.getElementById(
                "forgotMessage"
            );

        message.textContent =
            "Contacting the forge...";


        try {

            const response =
                await fetch(
                    `${BACKEND_URL}/forgot-password`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email
                        })

                    }
                );


            const result =
                await response.json();


            if (
                response.ok &&
                result.success
            ) {

                message.textContent =
                    "Password reset request created.";

            } else {

                message.textContent =
                    result.error ||
                    "Password reset failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    }

);


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "storyForgeUser"
        );

        showWelcome();

    }

);


/* =========================
   BACKEND CONNECTION TEST
========================= */

async function testBackend() {

    try {

        const response =
            await fetch(
                BACKEND_URL
            );


        const result =
            await response.json();


        console.log(
            "Story Forge.AI backend:",
            result
        );


    } catch (error) {

        console.error(
            "Backend connection failed:",
            error
        );

    }

}


testBackend();
