/***********************************************************************
 *
 * Michigan Car Cruise Calendar
 *
 * ui.js
 *
 * User Interface Manager
 *
 **********************************************************************/

//============================================================
// UI STATE
//============================================================

let currentEvent = null;


//============================================================
// INITIALIZE UI
//============================================================

document.addEventListener("DOMContentLoaded", function ()
{

    createEventModal();

});


//============================================================
// CREATE MODAL
//============================================================

function createEventModal()
{

    //--------------------------------------------------------
    // Already Exists?
    //--------------------------------------------------------

    if(document.getElementById("eventModal"))
        return;

    //--------------------------------------------------------
    // Build Modal
    //--------------------------------------------------------

    const modal = document.createElement("div");

    modal.id = "eventModal";

    modal.className = "event-modal hidden";

    modal.innerHTML = `

<div class="modal-overlay">

<div class="modal-window">

<div class="modal-header">

<h2 id="modalTitle">

Event

</h2>

<button

id="closeModal"

class="close-button">

<i class="fa-solid fa-xmark"></i>

</button>

</div>

<div

class="modal-body"

id="modalBody">

</div>

<div

class="modal-footer">

<button

id="directionsButton"

class="btn btn-primary">

<i class="fa-solid fa-location-arrow"></i>

Directions

</button>

<button

id="facebookButton"

class="btn btn-facebook">

<i class="fa-brands fa-facebook"></i>

Facebook

</button>

<button

id="websiteButton"

class="btn btn-secondary">

<i class="fa-solid fa-globe"></i>

Website

</button>

</div>

</div>

</div>

`;

    document.body.appendChild(modal);

    initializeModalButtons();

}


//============================================================
// INITIALIZE BUTTONS
//============================================================

function initializeModalButtons()
{

    document

    .getElementById("closeModal")

    .addEventListener(

        "click",

        closeEventModal

    );



    document

    .querySelector(".modal-overlay")

    .addEventListener(

        "click",

        function(e)
        {

            if(

                e.target === this

            )

            {

                closeEventModal();

            }

        }

    );



    document

    .getElementById("directionsButton")

    .addEventListener(

        "click",

        function()
        {

            if(currentEvent)

                openDirections(currentEvent);

        }

    );



    document

    .getElementById("facebookButton")

    .addEventListener(

        "click",

        function()
        {

            if(currentEvent)

                openFacebook(currentEvent);

        }

    );



    document

    .getElementById("websiteButton")

    .addEventListener(

        "click",

        function()
        {

            if(currentEvent)

                openWebsite(currentEvent);

        }

    );

}


//============================================================
// OPEN MODAL
//============================================================

function showEvent(event)
{

    currentEvent = event;

    document.getElementById(

        "modalTitle"

    ).textContent =

        event.name;

    renderEvent(event);

    document

    .getElementById("eventModal")

    .classList.remove("hidden");

}



//============================================================
// CLOSE MODAL
//============================================================

function closeEventModal()
{

    document

    .getElementById("eventModal")

    .classList.add("hidden");

}



//============================================================
// ESC KEY
//============================================================

document.addEventListener(

"keydown",

function(e)
{

    if(

        e.key === "Escape"

    )

    {

        closeEventModal();

    }

});



//============================================================
// RENDER EVENT
//============================================================

function renderEvent(event)
{

    const body =

        document.getElementById(

            "modalBody"

        );

    body.innerHTML =

    `

<div class="event-detail">

<h3>

${event.name}

</h3>

<p>

<i class="fa-solid fa-location-dot"></i>

${event.venue}

</p>

<p>

${event.street}

</p>

<p>

${event.city},

${event.state}

${event.zip}

</p>

<hr>

<p>

<strong>Date:</strong>

${formatDate(event.date)}

</p>

<p>

<strong>Time:</strong>

${event.startTime}

${event.endTime ?

" - " + event.endTime : ""}

</p>

<hr>

<p>

${event.description || "No description available."}

</p>

</div>

`;
/***********************************************************************
 *
 * ui.js
 *
 * PART 2
 *
 * Event Rendering
 *
 **********************************************************************/


//============================================================
// BUILD FEATURE BADGES
//============================================================

function buildBadges(event)
{

    let html = "";

    if(event.featuredEvent)
        html += `<span class="modal-badge">⭐ Featured Event</span>`;

    if(event.familyFriendly)
        html += `<span class="modal-badge">👨‍👩‍👧 Family Friendly</span>`;

    if(event.food)
        html += `<span class="modal-badge">🍔 Food</span>`;

    if(event.dj)
        html += `<span class="modal-badge">🎵 DJ</span>`;

    if(event.liveMusic)
        html += `<span class="modal-badge">🎸 Live Music</span>`;

    if(event.awards)
        html += `<span class="modal-badge">🏆 Awards</span>`;

    if(event.doorPrizes)
        html += `<span class="modal-badge">🎁 Door Prizes</span>`;

    if(event.fifty50)
        html += `<span class="modal-badge">💵 50 / 50</span>`;

    if(event.burnoutsAllowed)
        html += `<span class="modal-badge">🔥 Burnouts Allowed</span>`;

    if(html === "")
        return "";

    return `

<div class="modal-badges">

${html}

</div>

`;

}



//============================================================
// BUILD INFORMATION GRID
//============================================================

function buildInformationGrid(event)
{

    return `

<div class="feature-grid">

<div class="feature">

<i class="fa-solid fa-calendar"></i>

<strong>Date</strong>

<br>

${formatDate(event.date)}

</div>


<div class="feature">

<i class="fa-regular fa-clock"></i>

<strong>Time</strong>

<br>

${event.startTime || "TBA"}

${event.endTime ? "<br>" + event.endTime : ""}

</div>


<div class="feature">

<i class="fa-solid fa-dollar-sign"></i>

<strong>Entry</strong>

<br>

${formatMoney(event.entryFee)}

</div>


<div class="feature">

<i class="fa-solid fa-eye"></i>

<strong>Spectators</strong>

<br>

${formatMoney(event.spectatorFee)}

</div>

</div>

`;

}



//============================================================
// BUILD LOCATION
//============================================================

function buildLocation(event)
{

    return `

<h3>

<i class="fa-solid fa-location-dot"></i>

Location

</h3>

<p>

<strong>${event.venue || ""}</strong>

</p>

<p>

${event.street || ""}

</p>

<p>

${event.city || ""},

${event.state || ""}

${event.zip || ""}

</p>

`;

}



//============================================================
// BUILD DESCRIPTION
//============================================================

function buildDescription(event)
{

    return `

<h3>

<i class="fa-solid fa-circle-info"></i>

Description

</h3>

<p>

${event.description || "No description available."}

</p>

`;

}



//============================================================
// BUILD ORGANIZER
//============================================================

function buildOrganizer(event)
{

    if(!event.organizer && !event.contact)
        return "";

    return `

<h3>

<i class="fa-solid fa-user-group"></i>

Organizer

</h3>

<p>

${event.organizer || ""}

</p>

<p>

${event.contact || ""}

</p>

`;

}



//============================================================
// BUILD WEATHER
//============================================================

function buildWeather(event)
{

    if(!event.weatherPolicy)
        return "";

    return `

<h3>

<i class="fa-solid fa-cloud-sun"></i>

Weather Policy

</h3>

<p>

${event.weatherPolicy}

</p>

`;

}



//============================================================
// BUILD LINKS
//============================================================

function buildLinks(event)
{

    let html = "";

    if(event.website)
    {

        html += `

<p>

<i class="fa-solid fa-globe"></i>

<a href="${event.website}"

target="_blank">

Website

</a>

</p>

`;

    }

    if(event.facebook)
    {

        html += `

<p>

<i class="fa-brands fa-facebook"></i>

<a href="${event.facebook}"

target="_blank">

Facebook

</a>

</p>

`;

    }

    if(html === "")
        return "";

    return `

<h3>

Links

</h3>

${html}

`;

}



//============================================================
// RENDER EVENT
//============================================================

function renderEvent(event)
{

    const body = document.getElementById("modalBody");

    body.innerHTML = `

${event.flyerLink ?

`

<div style="margin-bottom:25px;">

<img

src="${event.flyerLink}"

alt="${event.name}"

style="width:100%;border-radius:12px;">

</div>

`

: ""}

${buildBadges(event)}

${buildInformationGrid(event)}

<hr>

${buildLocation(event)}

<hr>

${buildDescription(event)}

${buildOrganizer(event)}

${buildWeather(event)}

${buildLinks(event)}

`;



    //---------------------------------------------------------
    // Enable / Disable Buttons
    //---------------------------------------------------------

    document.getElementById("facebookButton").disabled =
        !event.facebook;

    document.getElementById("websiteButton").disabled =
        !event.website;

}
}

/***********************************************************************
 *
 * ui.js
 *
 * PART 3
 *
 * Modal Polish & Accessibility
 *
 **********************************************************************/

//============================================================
// MODAL STATE
//============================================================

let lastFocusedElement = null;

let focusableElements = [];



//============================================================
// OPEN MODAL
//============================================================

function showEvent(event)
{

    currentEvent = event;

    lastFocusedElement = document.activeElement;

    document.getElementById("modalTitle").textContent =
        event.name;

    renderEvent(event);

    const modal = document.getElementById("eventModal");

    modal.classList.remove("hidden");

    document.body.classList.add("modal-open");

    updateFooterButtons(event);

    initializeFocusTrap();

    const closeButton =
        document.getElementById("closeModal");

    if(closeButton)
    {
        closeButton.focus();
    }

}



//============================================================
// CLOSE MODAL
//============================================================

function closeEventModal()
{

    const modal = document.getElementById("eventModal");

    modal.classList.add("hidden");

    document.body.classList.remove("modal-open");

    if(lastFocusedElement)
    {
        lastFocusedElement.focus();
    }

}



//============================================================
// ENABLE / DISABLE BUTTONS
//============================================================

function updateFooterButtons(event)
{

    document.getElementById("facebookButton").disabled =
        !event.facebook;

    document.getElementById("websiteButton").disabled =
        !event.website;

    document.getElementById("directionsButton").disabled =
        !(event.street && event.city);

}



//============================================================
// FOCUS TRAP
//============================================================

function initializeFocusTrap()
{

    const modal =
        document.getElementById("eventModal");

    focusableElements =
        modal.querySelectorAll(

            "button, a[href], input, select, textarea"

        );

}



//============================================================
// KEYBOARD SUPPORT
//============================================================

document.addEventListener("keydown",

function(e)
{

    const modal =
        document.getElementById("eventModal");

    if(modal.classList.contains("hidden"))
        return;

    if(e.key === "Escape")
    {

        closeEventModal();

        return;

    }

    if(e.key !== "Tab")
        return;

    if(focusableElements.length === 0)
        return;

    const first =
        focusableElements[0];

    const last =
        focusableElements[
            focusableElements.length - 1
        ];

    if(e.shiftKey)
    {

        if(document.activeElement === first)
        {

            e.preventDefault();

            last.focus();

        }

    }
    else
    {

        if(document.activeElement === last)
        {

            e.preventDefault();

            first.focus();

        }

    }

});



//============================================================
// ESCAPE HTML
//============================================================

function escapeHtml(value)
{

    if(value === undefined || value === null)
        return "";

    return String(value)

        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;");

}



//============================================================
// SAFE TEXT
//============================================================

function safe(value)
{

    return escapeHtml(value);

}



//============================================================
// IMAGE FALLBACK
//============================================================

function initializeImages()
{

    document

    .querySelectorAll("#modalBody img")

    .forEach(function(img)
    {

        img.onerror = function()
        {

            this.style.display = "none";

        };

    });

}



//============================================================
// AFTER RENDER
//============================================================

const originalRenderEvent = renderEvent;

renderEvent = function(event)
{

    originalRenderEvent(event);

    initializeImages();

};



//============================================================
// SCROLL TO MODAL TOP
//============================================================

function scrollModalTop()
{

    const windowElement =
        document.querySelector(".modal-window");

    if(windowElement)
    {

        windowElement.scrollTop = 0;

    }

}



//============================================================
// FORMAT ADDRESS
//============================================================

function formattedAddress(event)
{

    return [

        event.street,

        event.city,

        event.state,

        event.zip

    ]

    .filter(Boolean)

    .join(", ");

}



//============================================================
// COPY ADDRESS
//============================================================

function copyEventAddress()
{

    if(!currentEvent)
        return;

    navigator.clipboard.writeText(

        formattedAddress(currentEvent)

    );

    showToast("Address copied.");

}



//============================================================
// PRINT EVENT
//============================================================

function printEvent()
{

    window.print();

}



//============================================================
// MODAL READY
//============================================================

console.log("ui.js initialized.");

