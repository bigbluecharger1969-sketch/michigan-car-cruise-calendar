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

}

