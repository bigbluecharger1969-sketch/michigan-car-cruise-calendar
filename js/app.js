/**********************************************************************
 *
 * Michigan Car Cruise Calendar
 *
 * app.js
 *
 * Version 2.1
 *
 * Main Application Controller
 *
 **********************************************************************/

//============================================================
// APPLICATION
//============================================================

let applicationReady = false;
let currentEvents = [];

//============================================================
// START APPLICATION
//============================================================

function startApplication()
{
    console.log("--------------------------------");
    console.log("Michigan Car Cruise Calendar");
    console.log("Version 2.1");
    console.log("--------------------------------");

    applicationReady = true;

    currentEvents = [...events];

    initializeNavigation();
    initializeButtons();
    initializeSearch();
    initializeDatePicker();

    updateStatistics();
    updateFeaturedEvent();
    populateEventTable(currentEvents);

    updatePageTitle();

    hideLoading();

    console.log("Application Ready");
}

//============================================================
// PAGE TITLE
//============================================================

function updatePageTitle()
{
    document.title =
        `Michigan Car Cruise Calendar (${currentEvents.length} Events)`;
}

//============================================================
// UPDATE STATISTICS
//============================================================

function animateCounter(id, value)
{
    const element = document.getElementById(id);

    if(!element)
        return;

    const start = Number(element.textContent) || 0;
    const duration = 600;
    const startTime = performance.now();

    function step(time)
    {
        const progress =
            Math.min((time - startTime) / duration, 1);

        element.textContent =
            Math.round(start + ((value - start) * progress));

        if(progress < 1)
            requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function updateStatistics()
{
    let showCount = 0;
    let cruiseCount = 0;
    let coffeeCount = 0;

    currentEvents.forEach(function(event)
    {
        const type = (event.type || "").toLowerCase();

        if(type.includes("show"))
            showCount++;

        if(type.includes("cruise"))
            cruiseCount++;

        if(type.includes("coffee"))
            coffeeCount++;
    });

    animateCounter("eventCount", currentEvents.length);
    animateCounter("showCount", showCount);
    animateCounter("cruiseCount", cruiseCount);
    animateCounter("coffeeCount", coffeeCount);
}

//============================================================
// FEATURED EVENT
//============================================================

function updateFeaturedEvent()
{
    let featured = null;

    if(typeof getFeaturedEvent === "function")
        featured = getFeaturedEvent();

    if(!featured)
        featured = getNextUpcomingEvent();

    if(!featured && currentEvents.length)
        featured = currentEvents[0];

    if(!featured)
        return;

    document.getElementById("featuredTitle").textContent =
        featured.name || "Upcoming Event";

    document.getElementById("featuredDescription").textContent =
        featured.description || "";

    document.getElementById("featuredButton").onclick =
        function()
        {
            showEvent(featured);
        };
}

//============================================================
// INITIALIZE NAVIGATION
//============================================================

function initializeNavigation()
{
    document
        .querySelectorAll(".main-nav a")
        .forEach(function(link)
        {
            link.addEventListener("click", function(e)
            {
                const href = this.getAttribute("href");

                if(!href.startsWith("#"))
                    return;

                e.preventDefault();

                scrollToSection(href.substring(1));
            });
        });
}

//============================================================
// SCROLL
//============================================================

function scrollToSection(id)
{
    const section = document.getElementById(id);

    if(!section)
        return;

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

//============================================================
// DATE PICKER
//============================================================

function initializeDatePicker()
{
    const picker =
        document.getElementById("selectedDate");

    if(!picker)
        return;

    picker.value =
        new Date()
            .toISOString()
            .substring(0,10);

    picker.addEventListener("change", function()
    {
        const selected =
            this.value;

        currentEvents =
            events.filter(function(event)
            {
                return event.date
                    .toISOString()
                    .substring(0,10) === selected;
            });

        populateEventTable(currentEvents);
        updateStatistics();
    });
}

//============================================================
// BUTTONS
//============================================================

function initializeButtons()
{
    document
        .querySelectorAll(".btn")
        .forEach(function(button)
        {
            button.addEventListener("mouseenter",
                function()
                {
                    this.style.transform =
                        "translateY(-2px)";
                });

            button.addEventListener("mouseleave",
                function()
                {
                    this.style.transform = "";
                });
        });

    document
        .getElementById("todayButton")
        ?.addEventListener("click", function()
        {
            const today =
                new Date()
                    .toISOString()
                    .substring(0,10);

            document.getElementById("selectedDate").value =
                today;

            currentEvents =
                events.filter(e =>
                    e.date.toISOString().substring(0,10) === today);

            populateEventTable(currentEvents);
            updateStatistics();
        });

    document
        .getElementById("weekendButton")
        ?.addEventListener("click", function()
        {
            currentEvents =
                events.filter(function(e)
                {
                    const d = e.date.getDay();

                    return d === 0 || d === 6;
                });

            populateEventTable(currentEvents);
            updateStatistics();
        });

    document
        .getElementById("allEventsButton")
        ?.addEventListener("click", function()
        {
            currentEvents = [...events];

            populateEventTable(currentEvents);
            updateStatistics();
        });
}

//============================================================
// SEARCH
//============================================================

function initializeSearch()
{
    const box =
        document.getElementById("searchBox");

    if(!box)
        return;

    box.placeholder =
        "Search Events, Cities, Venues...";

    box.addEventListener("input", function()
    {
        const search =
            this.value.toLowerCase().trim();

        if(search === "")
        {
            currentEvents = [...events];
        }
        else
        {
            currentEvents =
                events.filter(function(event)
                {
                    return (
                        (event.name || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.city || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.venue || "")
                            .toLowerCase()
                            .includes(search)

                        ||

                        (event.organizer || "")
                            .toLowerCase()
                            .includes(search)
                    );
                });
        }

        populateEventTable(currentEvents);
        updateStatistics();
    });
}

/**********************************************************************
 *
 * SECTION 2
 *
 * Event Table & Event Details
 *
 **********************************************************************/

//============================================================
// TABLE
//============================================================

function populateEventTable(eventList)
{
    const tbody =
        document.querySelector("#eventsTable tbody");

    if(!tbody)
        return;

    tbody.innerHTML = "";

    if(eventList.length === 0)
    {
        tbody.innerHTML = `
        <tr>
            <td colspan="6" class="no-events">
                No events found.
            </td>
        </tr>`;

        return;
    }

    eventList
        .sort((a,b)=>a.date-b.date)
        .forEach(function(event)
        {

            const row =
                document.createElement("tr");

            row.innerHTML = `

            <td>

                ${formatDate(event.date)}

            </td>

            <td>

                <strong>${event.name}</strong>

                <br>

                <small>${event.venue || ""}</small>

            </td>

            <td>

                ${event.city || ""}

            </td>

            <td>

                ${buildBadge(event.type)}

            </td>

            <td>

                ${formatTime(event.startTime)}

            </td>

            <td>

                <button
                    class="btn btn-secondary details-button">

                    Details

                </button>

            </td>

            `;

            row.querySelector(".details-button")
                .addEventListener("click",

                function()
                {

                    showEvent(event);

                });

            tbody.appendChild(row);

        });
}

//============================================================
// DATE
//============================================================

function formatDate(date)
{
    if(!(date instanceof Date))
        return "";

    return date.toLocaleDateString(
        "en-US",
        {
            weekday:"short",
            month:"short",
            day:"numeric"
        });
}

//============================================================
// BADGE
//============================================================

function buildBadge(type)
{
    if(!type)
        return "";

    const value =
        type.toLowerCase();

    if(value.includes("show"))
        return '<span class="badge badge-show">Car Show</span>';

    if(value.includes("cruise"))
        return '<span class="badge badge-cruise">Cruise Night</span>';

    if(value.includes("coffee"))
        return '<span class="badge badge-coffee">Cars & Coffee</span>';

    if(value.includes("swap"))
        return '<span class="badge badge-swap">Swap Meet</span>';

    if(value.includes("charity"))
        return '<span class="badge badge-charity">Charity</span>';

    return `<span class="badge">${type}</span>`;
}

//============================================================
// EVENT DETAILS MODAL
//============================================================

function createModal()
{
    if(document.getElementById("eventModal"))
        return;

    document.body.insertAdjacentHTML("beforeend",`

<div id="eventModal"
     class="modal-overlay">

<div class="modal-window">

<div class="modal-header">

<h2 id="modalTitle"></h2>

<button
id="closeModal"
class="btn btn-secondary">

Close

</button>

</div>

<div
id="modalBody"
class="modal-body">

</div>

</div>

</div>

`);

    document
        .getElementById("closeModal")
        .addEventListener("click",hideEvent);

    document
        .getElementById("eventModal")
        .addEventListener("click",

        function(e)
        {
            if(e.target===this)
                hideEvent();
        });

}

createModal();

//============================================================
// SHOW EVENT
//============================================================

function showEvent(event)
{

    document.getElementById("modalTitle").textContent =
        event.name;

    let html = "";

    html += `
    <p>

    <strong>Date:</strong>

    ${formatDate(event.date)}

    </p>`;

    html += `
    <p>

    <strong>Time:</strong>

    ${formatTime(event.startTime)}

    </p>`;

    html += `
    <p>

    <strong>Venue:</strong>

    ${event.venue || ""}

    </p>`;

    html += `
    <p>

    <strong>Address:</strong>

    ${event.street || ""}

    ${event.city || ""},

    ${event.state || ""}

    </p>`;

    if(event.description)
    {
        html += `
        <hr>

        <p>

        ${event.description}

        </p>`;
    }

    html += `<hr>`;

    html += `<div class="hero-buttons">`;

    html += `

<button
class="btn btn-primary"
onclick='openDirections(currentModalEvent)'>

Directions

</button>

`;

    if(event.website)
    {
        html += `

<button
class="btn btn-secondary"
onclick='openWebsite(currentModalEvent)'>

Website

</button>

`;
    }

    if(event.facebook)
    {
        html += `

<button
class="btn btn-facebook"
onclick='openFacebook(currentModalEvent)'>

Facebook

</button>

`;
    }

    html += `</div>`;

    window.currentModalEvent =
        event;

    document.getElementById("modalBody").innerHTML =
        html;

    document
        .getElementById("eventModal")
        .classList.add("show");

}

//============================================================
// CLOSE
//============================================================

function hideEvent()
{
    document
        .getElementById("eventModal")
        .classList.remove("show");
}

//============================================================
// REFRESH
//============================================================

function refreshTable()
{
    populateEventTable(currentEvents);
}

//============================================================
// NEXT EVENT
//============================================================

function getNextUpcomingEvent()
{
    const now = new Date();

    return events.find(e=>e.date>=now);
}

console.log("Section 2 Loaded");

/**********************************************************************
 *
 * SECTION 3
 *
 * Utilities & UI Helpers
 *
 **********************************************************************/

//============================================================
// LOADING
//============================================================

function showLoading(message = "Loading...")
{
    const overlay =
        document.getElementById("loadingOverlay");

    if(!overlay)
        return;

    overlay.classList.remove("hidden");

    const text =
        overlay.querySelector(".loading-message");

    if(text)
        text.textContent = message;
}

function hideLoading()
{
    const overlay =
        document.getElementById("loadingOverlay");

    if(!overlay)
        return;

    overlay.classList.add("hidden");
}

//============================================================
// TOAST
//============================================================

function showToast(message,
                   type = "info",
                   timeout = 3000)
{
    const toast =
        document.getElementById("toast");

    if(!toast)
    {
        console.log(message);
        return;
    }

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    toast.textContent = message;

    clearTimeout(toast.timer);

    toast.timer = setTimeout(function()
    {
        toast.classList.remove("show");

    }, timeout);
}

//============================================================
// GOOGLE MAPS
//============================================================

function openDirections(event)
{
    if(!event)
        return;

    const address = [

        event.street,

        event.city,

        event.state,

        event.zip

    ]

    .filter(Boolean)

    .join(", ");

    if(address === "")
    {
        showToast("No address available.","error");

        return;
    }

    window.open(

        "https://www.google.com/maps/search/?api=1&query=" +

        encodeURIComponent(address),

        "_blank"

    );
}

//============================================================
// WEBSITE
//============================================================

function openWebsite(event)
{
    if(!event || !event.website)
    {
        showToast("No website available.","error");
        return;
    }

    window.open(event.website,"_blank");
}

//============================================================
// FACEBOOK
//============================================================

function openFacebook(event)
{
    if(!event || !event.facebook)
    {
        showToast("No Facebook page available.","error");
        return;
    }

    window.open(event.facebook,"_blank");
}

//============================================================
// COPY ADDRESS
//============================================================

async function copyAddress(event)
{
    if(!event)
        return;

    const address = [

        event.street,

        event.city,

        event.state,

        event.zip

    ]

    .filter(Boolean)

    .join(", ");

    if(address === "")
    {
        showToast("No address available.","error");

        return;
    }

    try
    {
        await navigator.clipboard.writeText(address);

        showToast("Address copied.","success");
    }
    catch
    {
        showToast("Unable to copy address.","error");
    }
}

//============================================================
// FORMATTERS
//============================================================

function formatTime(time)
{
    if(!time)
        return "TBA";

    return time;
}

function formatMoney(value)
{
    if(value === undefined ||
       value === null ||
       value === "")
    {
        return "Free";
    }

    return value;
}

//============================================================
// REFRESH WEBSITE
//============================================================

function refreshWebsite()
{
    currentEvents = [...events];

    populateEventTable(currentEvents);

    updateStatistics();

    updateFeaturedEvent();

    updatePageTitle();
}

//============================================================
// SCROLL TO TOP
//============================================================

function scrollTopSmooth()
{
    window.scrollTo({

        top:0,

        behavior:"smooth"

    });
}

//============================================================
// HERO PARALLAX
//============================================================

window.addEventListener("scroll",function()
{
    const hero =
        document.querySelector(".hero");

    if(!hero)
        return;

    const offset =
        window.pageYOffset;

    hero.style.backgroundPositionY =
        `${offset * 0.35}px`;
});

//============================================================
// STICKY NAV
//============================================================

window.addEventListener("scroll",function()
{
    const nav =
        document.querySelector(".main-nav");

    if(!nav)
        return;

    if(window.scrollY > 80)
    {
        nav.classList.add("scrolled");
    }
    else
    {
        nav.classList.remove("scrolled");
    }
});

//============================================================
// KEYBOARD SHORTCUTS
//============================================================

document.addEventListener("keydown",

function(e)
{

    if(e.key === "/")
    {
        e.preventDefault();

        document

        .getElementById("searchBox")

        ?.focus();
    }

    if(e.key === "Escape")
    {
        hideEvent();
    }

});

//============================================================
// DEBUG
//============================================================

function printEventSummary()
{
    console.table(currentEvents);
}

//============================================================
// APPLICATION READY
//============================================================

console.log("--------------------------------");
console.log("Michigan Car Cruise Calendar");
console.log("Version 2.1 Loaded");
console.log("--------------------------------");

