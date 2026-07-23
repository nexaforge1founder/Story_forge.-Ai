/* ============================================================
   STORY FORGE.AI DASHBOARD
============================================================ */


/* ============================================================
   BACKEND
============================================================ */

const BACKEND_URL =
    "https://story-forge-ai-backend.onrender.com";


/* ============================================================
   USER
============================================================ */

const storedUser =
    localStorage.getItem(
        "story_forge_user"
    );


let currentUser =
    storedUser
        ? JSON.parse(storedUser)
        : null;


/* ============================================================
   PROTECT DASHBOARD
============================================================ */

if (!currentUser) {

    window.location.href =
        "auth.html";

}


/* ============================================================
   ELEMENTS
============================================================ */

const sidebar =
    document.getElementById(
        "sidebar"
    );


const mobileOverlay =
    document.getElementById(
        "mobileOverlay"
    );


const mobileMenuButton =
    document.getElementById(
        "mobileMenuButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


const currentSectionName =
    document.getElementById(
        "currentSectionName"
    );


const userName =
    document.getElementById(
        "userName"
    );


const welcomeUserName =
    document.getElementById(
        "welcomeUserName"
    );


const userAvatar =
    document.getElementById(
        "userAvatar"
    );


const analyzeStoryButton =
    document.getElementById(
        "analyzeStoryButton"
    );


const uploadStoryButton =
    document.getElementById(
        "uploadStoryButton"
    );


const storyFileInput =
    document.getElementById(
        "storyFileInput"
    );


const fileNameDisplay =
    document.getElementById(
        "fileNameDisplay"
    );


const creationMessage =
    document.getElementById(
        "creationMessage"
    );


const analysisResult =
    document.getElementById(
        "analysisResult"
    );


const analysisResultGrid =
    document.getElementById(
        "analysisResultGrid"
    );


/* ============================================================
   DISPLAY USER
============================================================ */

function displayUser() {

    if (!currentUser) {

        return;

    }


    const name =
        currentUser.username ||
        currentUser.user_id ||
        "Creator";


    const displayName =
        String(name)
            .toUpperCase();


    if (userName) {

        userName.textContent =
            displayName;

    }


    if (welcomeUserName) {

        welcomeUserName.textContent =
            name;

    }


    if (userAvatar) {

        userAvatar.textContent =
            displayName
                .charAt(0);

    }

}


displayUser();


/* ============================================================
   NAVIGATION
============================================================ */

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const targetButtons =
    document.querySelectorAll(
        "[data-section-target]"
    );


const sections =
    document.querySelectorAll(
        ".content-section"
    );


function showSection(
    sectionName
) {

    sections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const targetSection =
        document.getElementById(
            `${sectionName}Section`
        );


    if (targetSection) {

        targetSection.classList.add(
            "active"
        );

    }


    navItems.forEach(
        item => {

            item.classList.toggle(
                "active",

                item.dataset.section ===
                    sectionName
            );

        }
    );


    if (currentSectionName) {

        currentSectionName.textContent =
            sectionName
                .replace(
                    "_",
                    " "
                )
                .toUpperCase();

    }


    closeMobileMenu();

}


navItems.forEach(
    item => {

        item.addEventListener(
            "click",

            () => {

                showSection(
                    item.dataset.section
                );

            }
        );

    }
);


targetButtons.forEach(
    button => {

        button.addEventListener(
            "click",

            () => {

                showSection(
                    button.dataset.sectionTarget
                );

            }
        );

    }
);


/* ============================================================
   MOBILE MENU
============================================================ */

function openMobileMenu() {

    sidebar.classList.add(
        "open"
    );

    mobileOverlay.classList.add(
        "visible"
    );

}


function closeMobileMenu() {

    sidebar.classList.remove(
        "open"
    );

    mobileOverlay.classList.remove(
        "visible"
    );

}


mobileMenuButton.addEventListener(
    "click",
    openMobileMenu
);


mobileOverlay.addEventListener(
    "click",
    closeMobileMenu
);


/* ============================================================
   LOGOUT
============================================================ */

logoutButton.addEventListener(

    "click",

    () => {

        localStorage.removeItem(
            "story_forge_user"
        );


        window.location.href =
            "auth.html";

    }

);


/* ============================================================
   UPLOAD STORY FILE
============================================================ */

uploadStoryButton.addEventListener(

    "click",

    () => {

        storyFileInput.click();

    }

);


storyFileInput.addEventListener(

    "change",

    async () => {

        const file =
            storyFileInput.files[0];


        if (!file) {

            return;

        }


        fileNameDisplay.textContent =
            file.name;


        const fileExtension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        if (
            fileExtension ===
                "txt" ||

            fileExtension ===
                "md"
        ) {

            const text =
                await file.text();


            document.getElementById(
                "storyContent"
            ).value =
                text;

        }

    }

);


/* ============================================================
   MESSAGE
============================================================ */

function showCreationMessage(
    message,
    type = ""
) {

    creationMessage.textContent =
        message;


    creationMessage.className =
        `creation-message ${type}`;

}


/* ============================================================
   ANALYZE STORY
============================================================ */

analyzeStoryButton.addEventListener(

    "click",

    async () => {


        const title =
            document.getElementById(
                "movieTitle"
            ).value.trim();


        const content =
            document.getElementById(
                "storyContent"
            ).value.trim();


        const genre =
            document.getElementById(
                "genreSelect"
            ).value;


        const contentType =
            document.getElementById(
                "contentTypeSelect"
            ).value;


        const language =
            document.getElementById(
                "languageSelect"
            ).value;


        if (!title) {

            showCreationMessage(
                "Please enter a movie title.",
                "error"
            );

            return;

        }


        if (!content) {

            showCreationMessage(
                "Please enter or upload a story.",
                "error"
            );

            return;

        }


        showCreationMessage(
            "The Forge is analyzing your story..."
        );


        analyzeStoryButton.disabled =
            true;


        try {


            const response =
                await fetch(

                    `${BACKEND_URL}/analyze/story`,

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

                                    title,

                                    content,

                                    genre,

                                    content_type:
                                        contentType,

                                    language,

                                    owner_id:
                                        currentUser
                                            ?.user_id

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
                    "Story analysis failed."
                );

            }


            displayAnalysis(
                data
            );


            showCreationMessage(
                "Story analysis completed successfully.",
                "success"
            );


        }

        catch (error) {

            showCreationMessage(
                error.message,
                "error"
            );

        }

        finally {

            analyzeStoryButton.disabled =
                false;

        }

    }

);


/* ============================================================
   DISPLAY ANALYSIS
============================================================ */

function displayAnalysis(
    data
) {


    const analysis =
        data.analysis ||
        data;


    const characters =
        analysis.characters
            ? Object.keys(
                analysis.characters
            ).length
            : 0;


    const scenes =
        analysis.scenes
            ? analysis.scenes.length
            : 0;


    const figures =
        analysis.figures_of_speech
            ? analysis.figures_of_speech.length
            : 0;


    analysisResultGrid.innerHTML = `

        <div class="result-item">

            <span>
                CHARACTERS DISCOVERED
            </span>

            <strong>
                ${characters}
            </strong>

        </div>


        <div class="result-item">

            <span>
                SCENES IDENTIFIED
            </span>

            <strong>
                ${scenes}
            </strong>

        </div>


        <div class="result-item">

            <span>
                FIGURATIVE EXPRESSIONS
            </span>

            <strong>
                ${figures}
            </strong>

        </div>

    `;


    analysisResult.classList.add(
        "visible"
    );


    analysisResult.scrollIntoView(
        {
            behavior:
                "smooth"
        }
    );

}


/* ============================================================
   INITIALIZE
============================================================ */

showSection(
    "dashboard"
);
