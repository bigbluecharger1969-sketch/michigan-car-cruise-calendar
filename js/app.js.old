/**********************************************************************
 *
 * Michigan Car Cruise Calendar
 *
 * app.js
 *
 * Version 2.0
 *
 * Main Application Controller
 *
 **********************************************************************/


//============================================================
// APPLICATION
//============================================================

let applicationReady = false;


//============================================================
// START APPLICATION
//============================================================

function startApplication()
{

    console.log("--------------------------------");

    console.log("Michigan Car Cruise Calendar");

    console.log("--------------------------------");

    applicationReady = true;

    initializeNavigation();

    initializeButtons();

    initializeSearch();

    initializeDatePicker();

    updateStatistics();

    updateFeaturedEvent();

    populateEventTable(events);

    updatePageTitle();

    console.log(

        "Application Ready"

    );

}



//============================================================
// PAGE TITLE
//============================================================

function updatePageTitle()
{

    document.title =

        "Michigan Car Cruise Calendar (" +

        events.length +

        " Events)";

}



//============================================================
// UPDATE STATISTICS
//============================================================

function updateStatistics()
{

    let totalEvents = events.length;

    let showCount = 0;

    let cruiseCount = 0;

    let coffeeCount = 0;



    events.forEach(function(event)
    {

        let type = event.type.toLowerCase();



        if(type.includes("show"))

            showCount++;



        if(type.includes("cruise"))

            cruiseCount++;



        if(type.includes("coffee"))

            coffeeCount++;

    });



    document.getElementById("eventCount").textContent =

        totalEvents;



    document.getElementById("showCount").textContent =

        showCount;



    document.getElementById("cruiseCount").textContent =

        cruiseCount;



    document.getElementById("coffeeCount").textContent =

        coffeeCount;

}



//============================================================
// FEATURED EVENT
//============================================================

function updateFeaturedEvent()
{

    let featured =

        getFeaturedEvent();



    if(featured === null)

    {

        if(events.length === 0)

            return;



        featured = events[0];

    }



    document.getElementById(

        "featuredTitle"

    ).textContent =

        featured.name;



    document.getElementById(

        "featuredDescription"

    ).textContent =

        featured.description;



    document.getElementById(

        "featuredButton"

    ).onclick =

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

    const links =

        document.querySelectorAll(

            ".main-nav a"

        );



    links.forEach(function(link)
    {

        link.addEventListener(

            "click",

            function(e)
            {

                const href =

                    this.getAttribute("href");



                if(

                    href.startsWith("#")

                )

                {

                    e.preventDefault();



                    scrollToSection(

                        href.substring(1)

                    );

                }

            }

        );

    });

}



//============================================================
// SCROLL
//============================================================

function scrollToSection(id)
{

    let section =

        document.getElementById(id);



    if(!section)

        return;



    section.scrollIntoView(

    {

        behavior:"smooth",

        block:"start"

    });

}



//============================================================
// TODAY
//============================================================

function setToday()
{

    const picker =

        document.getElementById(

            "selectedDate"

        );



    if(!picker)

        return;



    const today =

        new Date()

        .toISOString()

        .substring(0,10);



    picker.value =

        today;

}



//============================================================
// DATE PICKER
//============================================================

function initializeDatePicker()
{

    setToday();

}



//============================================================
// BUTTONS
//============================================================

function initializeButtons()
{

    const buttons =

        document.querySelectorAll(

            ".btn"

        );



    buttons.forEach(function(button)
    {

        button.addEventListener(

            "mouseenter",

            function()
            {

                this.style.transform =

                    "translateY(-2px)";

            }

        );



        button.addEventListener(

            "mouseleave",

            function()
            {

                this.style.transform =

                    "";

            }

        );

    });

}



//============================================================
// SEARCH
//============================================================

function initializeSearch()
{

    const box =

        document.getElementById(

            "searchBox"

        );



    if(!box)

        return;



    box.placeholder =

        "Search Events, Cities, Venues...";

}



//============================================================
// WINDOW RESIZE
//============================================================

window.addEventListener(

    "resize",

    function()
    {

        console.log(

            "Window:",

            window.innerWidth,

            "x",

            window.innerHeight

        );

    }

);
/**********************************************************************
 *
 * PART 2
 *
 * Event Table & Event Details
 *
 **********************************************************************/


//============================================================
// POPULATE EVENT TABLE
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

        tbody.innerHTML =

        `<tr>

            <td colspan="6" class="no-events">

                No events found.

            </td>

        </tr>`;

        return;

    }

    eventList.forEach(function(event)
    {

        const row =
            document.createElement("tr");

        row.innerHTML =

        `

        <td class="event-date">

            <i class="fa-solid fa-calendar-days"></i>

            ${formatDate(event.date)}

        </td>

        <td>

            <div class="event-name">

                ${event.name}

            </div>

            <div class="event-venue">

                ${event.venue}

            </div>

        </td>

        <td class="event-city">

            <i class="fa-solid fa-location-dot"></i>

            ${event.city}

        </td>

        <td>

            ${buildBadge(event.type)}

        </td>

        <td class="event-time">

            <i class="fa-regular fa-clock"></i>

            ${event.startTime}

        </td>

        <td>

            <button

                class="details-button"

                data-id="${event.id}">

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
// FORMAT DATE
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

        }

    );

}



//============================================================
// BADGES
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
// SHOW EVENT
//============================================================

function showEvent(event)
{

    let info = "";

    info += event.name + "\n\n";

    if(event.venue)
        info += event.venue + "\n";

    if(event.street)
        info += event.street + "\n";

    info += event.city;

    if(event.state)
        info += ", " + event.state;

    info += "\n\n";

    if(event.startTime)
        info += "Starts: " + event.startTime + "\n";

    if(event.endTime)
        info += "Ends: " + event.endTime + "\n";

    info += "\n";

    if(event.description)
        info += event.description + "\n\n";

    let features = [];

    if(event.food)
        features.push("Food");

    if(event.dj)
        features.push("DJ");

    if(event.liveMusic)
        features.push("Live Music");

    if(event.awards)
        features.push("Awards");

    if(event.fiftyFifty)
        features.push("50/50");

    if(event.doorPrizes)
        features.push("Door Prizes");

    if(event.familyFriendly)
        features.push("Family Friendly");

    if(features.length > 0)
    {

        info += "Features:\n";

        info += features.join(", ");

        info += "\n\n";

    }

    if(event.website)
    {

        info += "Website:\n";

        info += event.website + "\n\n";

    }

    if(event.facebook)
    {

        info += "Facebook:\n";

        info += event.facebook + "\n\n";

    }

    alert(info);

}



//============================================================
// REFRESH TABLE
//============================================================

function refreshTable()
{

    populateEventTable(events);

}



//============================================================
// HIGHLIGHT TODAY
//============================================================

function isToday(event)
{

    let today = new Date();

    return (

        event.date.getFullYear() === today.getFullYear()

        &&

        event.date.getMonth() === today.getMonth()

        &&

        event.date.getDate() === today.getDate()

    );

}



//============================================================
// TABLE READY
//============================================================

console.log("Event Table Loaded");

/**********************************************************************
 *
 * PART 3
 *
 * Utilities, Loading, Notifications & Future Map Support
 *
 **********************************************************************/


//============================================================
// LOADING INDICATOR
//============================================================

function showLoading(message = "Loading...")
{

    let loader = document.getElementById("loadingOverlay");

    if(!loader)
    {
        return;
    }

    loader.style.display = "flex";

    loader.querySelector(".loading-message").textContent = message;

}

function hideLoading()
{

    let loader = document.getElementById("loadingOverlay");

    if(loader)
    {
        loader.style.display = "none";
    }

}



//============================================================
// SIMPLE TOAST MESSAGE
//============================================================

function showToast(message, timeout = 3000)
{

    let toast = document.getElementById("toast");

    if(!toast)
    {
        console.log(message);
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function()
    {

        toast.classList.remove("show");

    }, timeout);

}



//============================================================
// GOOGLE MAPS
//============================================================

function openDirections(event)
{

    if(!event.street || !event.city)
    {

        showToast("No address available.");

        return;

    }

    const address =

        encodeURIComponent(

            event.street +

            ", " +

            event.city +

            ", " +

            event.state

        );

    window.open(

        "https://www.google.com/maps/search/?api=1&query=" +

        address,

        "_blank"

    );

}



//============================================================
// FACEBOOK
//============================================================

function openFacebook(event)
{

    if(!event.facebook)
    {

        showToast("No Facebook page available.");

        return;

    }

    window.open(event.facebook, "_blank");

}



//============================================================
// WEBSITE
//============================================================

function openWebsite(event)
{

    if(!event.website)
    {

        showToast("No website available.");

        return;

    }

    window.open(event.website, "_blank");

}



//============================================================
// COPY ADDRESS
//============================================================

function copyAddress(event)
{

    let address =

        event.street +

        ", " +

        event.city +

        ", " +

        event.state +

        " " +

        event.zip;

    navigator.clipboard.writeText(address);

    showToast("Address copied.");

}



//============================================================
// FORMAT TIME
//============================================================

function formatTime(time)
{

    if(!time)
        return "";

    return time;

}



//============================================================
// FORMAT MONEY
//============================================================

function formatMoney(value)
{

    if(!value)
        return "Free";

    return value;

}



//============================================================
// SCROLL TO TOP
//============================================================

function scrollTopSmooth()
{

    window.scrollTo(

    {

        top:0,

        behavior:"smooth"

    });

}



//============================================================
// REFRESH WEBSITE
//============================================================

function refreshWebsite()
{

    populateEventTable(events);

    updateStatistics();

    updateFeaturedEvent();

}



//============================================================
// GET NEXT EVENT
//============================================================

function getNextUpcomingEvent()
{

    const now = new Date();

    return events.find(function(event)
    {

        return event.date >= now;

    });

}



//============================================================
// FEATURED EVENT ROTATION
//============================================================

function rotateFeaturedEvent()
{

    let next = getNextUpcomingEvent();

    if(next)
    {

        document.getElementById("featuredTitle").textContent =
            next.name;

        document.getElementById("featuredDescription").textContent =
            next.description;

    }

}



//============================================================
// KEYBOARD SHORTCUTS
//============================================================

document.addEventListener("keydown",

function(e)
{

    if(e.key === "/")
    {

        e.preventDefault();

        const box = document.getElementById("searchBox");

        if(box)
        {

            box.focus();

        }

    }

});



//============================================================
// DEBUG
//============================================================

function printEventSummary()
{

    console.table(events);

}



//============================================================
// APPLICATION COMPLETE
//============================================================

console.log("----------------------------------");

console.log("Application Fully Initialized");

console.log("----------------------------------");
