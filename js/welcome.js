/* ============================================================
   STORY FORGE.AI WELCOME EXPERIENCE
============================================================ */


/* ============================================================
   ELEMENTS
============================================================ */

const rider = document.getElementById("rider");

const techBike = document.getElementById("techBike");

const forgeButton = document.getElementById("forgeButton");

const sceneStatus = document.getElementById("sceneStatus");

const skipButton = document.getElementById("skipButton");


/* ============================================================
   SCENE STATE
============================================================ */

let sceneSkipped = false;


/* ============================================================
   STATUS MESSAGE
============================================================ */

function updateStatus(message) {

    if (sceneStatus) {

        sceneStatus.textContent =
            message;

    }

}


/* ============================================================
   REVEAL BIKE
============================================================ */

function revealBike() {

    if (sceneSkipped) {

        return;

    }


    updateStatus(
        "The Forge is awakening..."
    );


    rider.classList.add(
        "waving"
    );


    setTimeout(() => {

        techBike.classList.add(
            "revealed"
        );

        updateStatus(
            "Technology detected."
        );

    }, 1500);


    setTimeout(() => {

        forgeButton.classList.add(
            "visible"
        );

        updateStatus(
            "The Forge is ready."
        );

    }, 3500);

}


/* ============================================================
   SKIP INTRO
============================================================ */

function skipIntro() {

    sceneSkipped = true;


    rider.style.animation =
        "none";

    rider.style.transform =
        "translateX(0) scale(1)";


    rider.classList.add(
        "waving"
    );


    techBike.classList.add(
        "revealed"
    );


    forgeButton.classList.add(
        "visible"
    );


    updateStatus(
        "The Forge is ready."
    );

}


/* ============================================================
   ENTER THE FORGE
============================================================ */

function enterForge() {

    window.location.href =
        "auth.html";

}


/* ============================================================
   START CINEMATIC SEQUENCE
============================================================ */

setTimeout(() => {

    revealBike();

}, 5000);


/* ============================================================
   EVENTS
============================================================ */

if (skipButton) {

    skipButton.addEventListener(
        "click",
        skipIntro
    );

}


if (forgeButton) {

    forgeButton.addEventListener(
        "click",
        enterForge
    );

}
