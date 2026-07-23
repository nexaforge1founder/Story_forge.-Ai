/* =========================================================
   STORY FORGE.AI FRONTEND APPLICATION
========================================================= */


/* =========================================================
   BACKEND CONFIGURATION
========================================================= */

const BACKEND_URL =
    "https://story-forge-ai-backend.onrender.com";


/* =========================================================
   API ROUTES
========================================================= */

const API = {

    signup:
        `${BACKEND_URL}/auth/signup`,

    login:
        `${BACKEND_URL}/auth/login`,

    forgotPassword:
        `${BACKEND_URL}/auth/forgot-password`,

    verifyEmail:
        `${BACKEND_URL}/auth/verify-email`,

    health:
        `${BACKEND_URL}/health`

};


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {

    currentPage: "welcome",

    authenticated: false,

    user: null

};


/* =========================================================
   DOM HELPERS
========================================================= */

function getElement(id) {

    return document.getElementById(id);

}


function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    const target = getElement(pageId);

    if (!target) {

        console.error(
            `Page not found: ${pageId}`
        );

        return;

    }


    target.classList.add("active-page");

    state.currentPage = pageId;

}


function showNotification(message) {

    const notification =
        getElement("notification");


    notification.textContent = message;

    notification.classList.add("show");


    setTimeout(() => {

        notification.classList.remove("show");

    }, 4000);

}


function setAuthStatus(message, isError = false) {

    const status =
        getElement("auth-status");


    status.textContent = message;


    if (isError) {

        status.style.color =
            "#ff173d";

    } else {

        status.style.color =
            "#f5d76e";

    }

}


function setDashboardStatus(message) {

    const status =
        getElement("dashboard-status");


    status.textContent = message;

}


/* =========================================================
   API REQUEST FUNCTION
========================================================= */

async function apiRequest(

    url,

    method = "GET",

    body = null

) {

    const options = {

        method,

        headers: {

            "Content-Type":
                "application/json",

            "Accept":
                "application/json"

        }

    };


    if (body !== null) {

        options.body =
            JSON.stringify(body);

    }


    let response;


    try {

        response =
            await fetch(url, options);

    } catch (error) {

        throw new Error(
            "The frontend could not connect to the backend. " +
            "The backend may be sleeping, unavailable, " +
            "or the URL may be incorrect."
        );

    }


    let data;


    try {

        data =
            await response.json();

    } catch {

        data = {};

    }


    if (!response.ok) {

        const message =

            data.detail ||

            data.error ||

            data.message ||

            `Backend error: ${response.status}`;


        throw new Error(message);

    }


    return data;

}


/* =========================================================
   CHECK BACKEND
========================================================= */

async function checkBackend() {

    try {

        const response =
            await fetch(API.health);


        if (!response.ok) {

            throw new Error();

        }


        console.log(
            "Story Forge.AI backend is online."
        );


    } catch {

        console.warn(

            "Story Forge.AI backend is currently " +
            "unavailable or the health route does not exist."

        );

    }

}


/* =========================================================
   AUTH PANELS
========================================================= */

function showAuthPanel(panelId) {

    const panels =
        document.querySelectorAll(".auth-panel");


    panels.forEach(panel => {

        panel.classList.remove(
            "active-panel"
        );

    });


    const target =
        getElement(panelId);


    if (target) {

        target.classList.add(
            "active-panel"
        );

    }


    setAuthStatus("");

}


/* =========================================================
   WELCOME ANIMATION
========================================================= */

function startWelcomeAnimation() {

    const rider =
        getElement("rider");

    const bike =
        getElement("future-bike");

    const title =
        getElement("falling-title");

    const wave =
        getElement("wave-message");


    /*
        Timeline:

        0s - 7s:
        Rider arrives.

        Around 7s:
        Rider stops and waves.

        Around 8s:
        Welcome message appears.

        Around 9s:
        Bike becomes visible.

        Around 10s:
        Title falls from the sky.
    */


    setTimeout(() => {

        wave.classList.add(
            "show-wave"
        );

    }, 7200);


    setTimeout(() => {

        bike.classList.add(
            "bike-reveal"
        );

    }, 8500);


    setTimeout(() => {

        title.classList.add(
            "title-fall"
        );

    }, 9500);

}


/* =========================================================
   ENTER THE FORGE
========================================================= */

function enterForge() {

    showPage("auth-page");

    showAuthPanel("login-panel");

}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(

    username,

    password

) {

    setAuthStatus(
        "Connecting to your forge..."
    );


    try {

        const result =
            await apiRequest(

                API.login,

                "POST",

                {

                    username,

                    password

                }

            );


        if (!result.success) {

            throw new Error(

                result.error ||

                "Login failed."

            );

        }


        state.authenticated =
            true;


        state.user = {

            user_id:
                result.user_id,

            username:
                result.username ||

                username

        };


        localStorage.setItem(

            "story_forge_user",

            JSON.stringify(
                state.user
            )

        );


        getElement(
            "dashboard-username"
        ).textContent =

            state.user.username
                .toUpperCase();


        showPage(
            "dashboard-page"
        );


        showNotification(
            "Welcome back to your Forge."
        );


    } catch (error) {

        setAuthStatus(

            error.message,

            true

        );

    }

}


/* =========================================================
   SIGNUP
========================================================= */

async function signupUser(

    username,

    email,

    password

) {

    setAuthStatus(

        "Creating your forge..."

    );


    try {

        const result =
            await apiRequest(

                API.signup,

                "POST",

                {

                    username,

                    email,

                    password

                }

            );


        if (!result.success) {

            throw new Error(

                result.error ||

                "Account creation failed."

            );

        }


        setAuthStatus(

            "Account created. You can now log in."

        );


        showAuthPanel(
            "login-panel"
        );


        getElement(
            "login-username"
        ).value = username;


        showNotification(

            "Your Forge has been created."

        );


    } catch (error) {

        setAuthStatus(

            error.message,

            true

        );

    }

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

async function forgotPassword(

    email

) {

    setAuthStatus(

        "Creating password recovery request..."

    );


    try {

        const result =
            await apiRequest(

                API.forgotPassword,

                "POST",

                {

                    email

                }

            );


        if (!result.success) {

            throw new Error(

                result.error ||

                "Password recovery failed."

            );

        }


        setAuthStatus(

            result.message ||

            "Password reset request created."

        );


    } catch (error) {

        setAuthStatus(

            error.message,

            true

        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logoutUser() {

    state.authenticated =
        false;


    state.user =
        null;


    localStorage.removeItem(

        "story_forge_user"

    );


    showPage(
        "welcome-page"
    );


    showNotification(

        "You have left the Forge."

    );


    startWelcomeAnimation();

}


/* =========================================================
   RESTORE SESSION
========================================================= */

function restoreSession() {

    const storedUser =
        localStorage.getItem(

            "story_forge_user"

        );


    if (!storedUser) {

        return;

    }


    try {

        state.user =
            JSON.parse(
                storedUser
            );


        state.authenticated =
            true;


        getElement(
            "dashboard-username"
        ).textContent =

            state.user.username
                .toUpperCase();


        /*
            IMPORTANT:

            We do NOT automatically open
            the dashboard here.

            This prevents the dashboard
            from opening incorrectly after
            a bad or expired session.
        */


    } catch {

        localStorage.removeItem(

            "story_forge_user"

        );

    }

}


/* =========================================================
   DASHBOARD SECURITY
========================================================= */

function openDashboard() {

    if (!state.authenticated) {

        showNotification(

            "Please log in first."

        );


        showPage(
            "auth-page"
        );


        showAuthPanel(
            "login-panel"
        );


        return;

    }


    showPage(
        "dashboard-page"
    );

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /*
        WELCOME
    */

    getElement(
        "enter-forge-button"
    ).addEventListener(

        "click",

        enterForge

    );


    getElement(
        "back-to-welcome"
    ).addEventListener(

        "click",

        () => {

            showPage(
                "welcome-page"
            );

        }

    );


    /*
        AUTH PANEL SWITCHING
    */

    getElement(
        "show-signup-button"
    ).addEventListener(

        "click",

        () => {

            showAuthPanel(
                "signup-panel"
            );

        }

    );


    getElement(
        "show-login-button"
    ).addEventListener(

        "click",

        () => {

            showAuthPanel(
                "login-panel"
            );

        }

    );


    getElement(
        "forgot-password-button"
    ).addEventListener(

        "click",

        () => {

            showAuthPanel(
                "forgot-panel"
            );

        }

    );


    getElement(
        "return-login-button"
    ).addEventListener(

        "click",

        () => {

            showAuthPanel(
                "login-panel"
            );

        }

    );


    /*
        LOGIN
    */

    getElement(
        "login-form"
    ).addEventListener(

        "submit",

        async event => {

            event.preventDefault();


            const username =

                getElement(
                    "login-username"
                ).value.trim();


            const password =

                getElement(
                    "login-password"
                ).value;


            await loginUser(

                username,

                password

            );

        }

    );


    /*
        SIGNUP
    */

    getElement(
        "signup-form"
    ).addEventListener(

        "submit",

        async event => {

            event.preventDefault();


            const username =

                getElement(
                    "signup-username"
                ).value.trim();


            const email =

                getElement(
                    "signup-email"
                ).value.trim();


            const password =

                getElement(
                    "signup-password"
                ).value;


            await signupUser(

                username,

                email,

                password

            );

        }

    );


    /*
        FORGOT PASSWORD
    */

    getElement(
        "forgot-form"
    ).addEventListener(

        "submit",

        async event => {

            event.preventDefault();


            const email =

                getElement(
                    "forgot-email"
                ).value.trim();


            await forgotPassword(

                email

            );

        }

    );


    /*
        LOGOUT
    */

    getElement(
        "logout-button"
    ).addEventListener(

        "click",

        logoutUser

    );


    /*
        CREATE MOVIE
    */

    getElement(
        "create-movie-button"
    ).addEventListener(

        "click",

        () => {

            if (!state.authenticated) {

                openDashboard();

                return;

            }


            setDashboardStatus(

                "Movie creation workspace coming next."

            );


            showNotification(

                "The movie creation forge is ready for the next module."

            );

        }

    );


    /*
        DASHBOARD MODULES
    */

    document
        .querySelectorAll(
            ".module-card"
        )
        .forEach(card => {


            card.addEventListener(

                "click",

                () => {

                    const module =
                        card.dataset.module;


                    setDashboardStatus(

                        `${module.toUpperCase()} module selected.`

                    );

                }

            );

        });

}


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        setupEventListeners();

        restoreSession();

        startWelcomeAnimation();

        checkBackend();

    }

);
