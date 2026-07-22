const API_URL = https://story-forge-ai-backend.onrender.com/


// =====================================================
// SCREEN MANAGEMENT
// =====================================================

function showScreen(screenId) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.add("hidden");

        });


    document
        .getElementById(screenId)
        .classList.remove("hidden");

}


// =====================================================
// WELCOME → AUTHENTICATION
// =====================================================

document
    .getElementById("enter-button")
    .addEventListener("click", () => {

        showScreen("auth-screen");

    });


// =====================================================
// AUTHENTICATION TABS
// =====================================================

const loginTab =
    document.getElementById("login-tab");

const signupTab =
    document.getElementById("signup-tab");

const loginForm =
    document.getElementById("login-form");

const signupForm =
    document.getElementById("signup-form");


loginTab.addEventListener("click", () => {

    loginTab.classList.add("active-tab");

    signupTab.classList.remove("active-tab");

    loginForm.classList.remove("hidden");

    signupForm.classList.add("hidden");

});


signupTab.addEventListener("click", () => {

    signupTab.classList.add("active-tab");

    loginTab.classList.remove("active-tab");

    signupForm.classList.remove("hidden");

    loginForm.classList.add("hidden");

});


// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener("submit", async event => {

    event.preventDefault();


    const username =
        document.getElementById(
            "login-username"
        ).value;


    const password =
        document.getElementById(
            "login-password"
        ).value;


    try {

        const response =
            await fetch(
                `${API_URL}/login`,
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


        const data =
            await response.json();


        if (data.success) {

            showScreen("dashboard-screen");

        }

        else {

            showAuthMessage(
                data.error
            );

        }

    }

    catch (error) {

        showAuthMessage(
            "Unable to connect to the backend."
        );

    }

});


// =====================================================
// SIGNUP
// =====================================================

signupForm.addEventListener("submit", async event => {

    event.preventDefault();


    const username =
        document.getElementById(
            "signup-username"
        ).value;


    const email =
        document.getElementById(
            "signup-email"
        ).value;


    const password =
        document.getElementById(
            "signup-password"
        ).value;


    try {

        const response =
            await fetch(
                `${API_URL}/signup`,
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


        const data =
            await response.json();


        if (data.success) {

            showAuthMessage(
                "Account created successfully. You can now log in."
            );

            loginTab.click();

        }

        else {

            showAuthMessage(
                data.error
            );

        }

    }

    catch (error) {

        showAuthMessage(
            "Unable to connect to the backend."
        );

    }

});


function showAuthMessage(message) {

    document
        .getElementById("auth-message")
        .textContent = message;

}


// =====================================================
// CREATE MOVIE
// =====================================================

document
    .getElementById("create-movie-button")
    .addEventListener("click", () => {

        showScreen("create-screen");

    });


// =====================================================
// BACK TO DASHBOARD
// =====================================================

document
    .getElementById("back-dashboard")
    .addEventListener("click", () => {

        showScreen("dashboard-screen");

    });


// =====================================================
// LOGOUT
// =====================================================

document
    .getElementById("logout-button")
    .addEventListener("click", () => {

        showScreen("auth-screen");

    });
