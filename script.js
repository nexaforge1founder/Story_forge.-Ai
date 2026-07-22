/* =====================================================
   WELCOME ANIMATION

   Sequence:

   1. Boy is visible immediately.
   2. Boy moves across the screen.
   3. Boy stops.
   4. Boy waves.
   5. Bike reveals itself.
   6. Welcome message appears.
   7. Enter button appears.
===================================================== */


const boy = document.getElementById("boy");

const bike = document.getElementById("future-bike");

const wavingArm = document.getElementById("waving-arm");

const greeting = document.getElementById("greeting");

const enterButton = document.getElementById("enter-button");


/*

    The CSS animation lasts 9 seconds for the boy.

    The boy reaches his stopping point at
    approximately 65% of 9 seconds.

    That is approximately 5.85 seconds.

*/


setTimeout(() => {

    /*
        The boy has stopped.

        Now he waves.
    */

    wavingArm.classList.add("wave-animation");

}, 6000);


setTimeout(() => {

    /*
        The bike now reveals itself.

        It was completely invisible
        while the boy was moving.
    */

    bike.classList.add("bike-reveal");

}, 7000);


setTimeout(() => {

    greeting.classList.remove("hidden");

}, 8500);


setTimeout(() => {

    enterButton.classList.remove("hidden");

}, 10000);


/* =====================================================
   ENTER THE FORGE
===================================================== */

enterButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("welcome-screen")
            .classList
            .add("hidden");


        document
            .getElementById("auth-screen")
            .classList
            .remove("hidden");

    }
);


/* =====================================================
   LOGIN / SIGN UP TABS
===================================================== */

const loginTab =
    document.getElementById("login-tab");

const signupTab =
    document.getElementById("signup-tab");

const loginForm =
    document.getElementById("login-form");

const signupForm =
    document.getElementById("signup-form");


loginTab.addEventListener(
    "click",
    () => {

        loginTab.classList.add("active");

        signupTab.classList.remove("active");

        loginForm.classList.remove("hidden");

        signupForm.classList.add("hidden");

    }
);


signupTab.addEventListener(
    "click",
    () => {

        signupTab.classList.add("active");

        loginTab.classList.remove("active");

        signupForm.classList.remove("hidden");

        loginForm.classList.add("hidden");

    }
);


/* =====================================================
   API URL

   We will replace this with your actual Render
   backend URL when we connect the frontend.
===================================================== */


const API_URL =
    "https://YOUR-RENDER-BACKEND-URL.onrender.com";


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById("login-username")
                .value;


        const password =
            document
                .getElementById("login-password")
                .value;


        const message =
            document
                .getElementById("auth-message");


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


            const result =
                await response.json();


            if (!result.success) {

                message.textContent =
                    result.error ||
                    "Login failed.";

                return;

            }


            openDashboard();

        }

        catch (error) {

            message.textContent =
                "Unable to connect to server.";

            console.error(error);

        }

    }
);


/* =====================================================
   SIGN UP
===================================================== */

signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const username =
            document
                .getElementById("signup-username")
                .value;


        const email =
            document
                .getElementById("signup-email")
                .value;


        const password =
            document
                .getElementById("signup-password")
                .value;


        const message =
            document
                .getElementById("auth-message");


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


            const result =
                await response.json();


            if (!result.success) {

                message.textContent =
                    result.error ||
                    "Signup failed.";

                return;

            }


            openDashboard();

        }

        catch (error) {

            message.textContent =
                "Unable to connect to server.";

            console.error(error);

        }

    }
);


/* =====================================================
   OPEN DASHBOARD
===================================================== */

function openDashboard() {

    document
        .getElementById("auth-screen")
        .classList
        .add("hidden");


    document
        .getElementById("dashboard-screen")
        .classList
        .remove("hidden");

}


/* =====================================================
   LOGOUT
===================================================== */

document
    .getElementById("logout-button")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("dashboard-screen")
                .classList
                .add("hidden");


            document
                .getElementById("welcome-screen")
                .classList
                .remove("hidden");

        }
    );


/* =====================================================
   CREATE MOVIE
===================================================== */

document
    .getElementById("create-movie-button")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("dashboard-screen")
                .classList
                .add("hidden");


            document
                .getElementById("create-screen")
                .classList
                .remove("hidden");

        }
    );


/* =====================================================
   BACK TO DASHBOARD
===================================================== */

document
    .getElementById("back-dashboard")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("create-screen")
                .classList
                .add("hidden");


            document
                .getElementById("dashboard-screen")
                .classList
                .remove("hidden");

        }
    );
