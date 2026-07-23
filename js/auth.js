/* ============================================================
   STORY FORGE.AI AUTHENTICATION
============================================================ */


/*
    IMPORTANT:

    This is your Render backend.

    Do NOT use localhost here when the frontend is hosted.
*/

const BACKEND_URL =
    "https://story-forge-ai-backend.onrender.com";


/* ============================================================
   ELEMENTS
============================================================ */

const loginTab =
    document.getElementById(
        "loginTab"
    );


const signupTab =
    document.getElementById(
        "signupTab"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const signupForm =
    document.getElementById(
        "signupForm"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const signupMessage =
    document.getElementById(
        "signupMessage"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );


/* ============================================================
   SHOW LOGIN
============================================================ */

function showLogin() {

    loginTab.classList.add(
        "active"
    );

    signupTab.classList.remove(
        "active"
    );


    loginForm.classList.add(
        "active"
    );

    signupForm.classList.remove(
        "active"
    );

}


/* ============================================================
   SHOW SIGNUP
============================================================ */

function showSignup() {

    signupTab.classList.add(
        "active"
    );

    loginTab.classList.remove(
        "active"
    );


    signupForm.classList.add(
        "active"
    );

    loginForm.classList.remove(
        "active"
    );

}


/* ============================================================
   DISPLAY MESSAGE
============================================================ */

function showMessage(
    element,
    message,
    type
) {

    element.textContent =
        message;

    element.className =
        `auth-message ${type}`;

}


/* ============================================================
   LOGIN
============================================================ */

async function loginUser(
    event
) {

    event.preventDefault();


    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    showMessage(
        loginMessage,
        "Connecting to the Forge...",
        ""
    );


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/auth/login`,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            {
                                username,
                                password
                            }
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Login failed."
            );

        }


        /*
            Store the user information
            for the dashboard.
        */

        localStorage.setItem(
            "story_forge_user",
            JSON.stringify(
                data
            )
        );


        showMessage(
            loginMessage,
            "Login successful. Entering the Forge...",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            800
        );


    }

    catch (error) {

        showMessage(
            loginMessage,
            error.message,
            "error"
        );

    }

}


/* ============================================================
   SIGNUP
============================================================ */

async function signupUser(
    event
) {

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


    const confirmPassword =
        document.getElementById(
            "signupConfirmPassword"
        ).value;


    if (
        password !==
        confirmPassword
    ) {

        showMessage(
            signupMessage,
            "Passwords do not match.",
            "error"
        );

        return;

    }


    showMessage(
        signupMessage,
        "Creating your Forge...",
        ""
    );


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/auth/signup`,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            {
                                username,
                                email,
                                password
                            }
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Account creation failed."
            );

        }


        showMessage(
            signupMessage,
            "Account created. Entering the Forge...",
            "success"
        );


        localStorage.setItem(
            "story_forge_user",
            JSON.stringify(
                data
            )
        );


        setTimeout(
            () => {

                window.location.href =
                    "dashboard.html";

            },
            1000
        );


    }

    catch (error) {

        showMessage(
            signupMessage,
            error.message,
            "error"
        );

    }

}


/* ============================================================
   FORGOT PASSWORD
============================================================ */

async function forgotPassword() {

    const email =
        prompt(
            "Enter your account email:"
        );


    if (
        !email
    ) {

        return;

    }


    showMessage(
        loginMessage,
        "Processing request...",
        ""
    );


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/auth/forgot-password`,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify(
                            {
                                email
                            }
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Password reset failed."
            );

        }


        showMessage(
            loginMessage,
            data.message,
            "success"
        );

    }

    catch (error) {

        showMessage(
            loginMessage,
            error.message,
            "error"
        );

    }

}


/* ============================================================
   BACK TO WELCOME
============================================================ */

function goBack() {

    window.location.href =
        "index.html";

}


/* ============================================================
   EVENTS
============================================================ */

loginTab.addEventListener(
    "click",
    showLogin
);


signupTab.addEventListener(
    "click",
    showSignup
);


loginForm.addEventListener(
    "submit",
    loginUser
);


signupForm.addEventListener(
    "submit",
    signupUser
);


forgotPasswordButton.addEventListener(
    "click",
    forgotPassword
);


backButton.addEventListener(
    "click",
    goBack
);
