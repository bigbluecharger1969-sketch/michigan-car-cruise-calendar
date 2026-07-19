/***********************************************************************
 *
 * Michigan Car Cruise Calendar
 *
 * sheets.js
 *
 * Version 2.0
 *
 * Reads the Google Sheet and converts every row into an Event object.
 *
 ***********************************************************************/


//============================================================
// GOOGLE SHEET CSV
//============================================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQQIifWAOAY5pFv7TnTfg7ZJxuEFIWtUXb-kExeaSW5LoZK9CpIBXBerrrTuauLt5P_zJBdbr-R9Sba/pub?output=csv";


//============================================================
// MASTER EVENT ARRAY
//============================================================

let events = [];


//============================================================
// APPLICATION STARTUP
//============================================================

document.addEventListener("DOMContentLoaded", function ()
{

    loadEvents();

});


//============================================================
// DOWNLOAD GOOGLE SHEET
//============================================================

function loadEvents()
{

    console.log("Loading Michigan Car Cruise Calendar...");

    Papa.parse(SHEET_URL,
    {

        download: true,

        header: true,

        skipEmptyLines: true,

        dynamicTyping: false,

        complete: function(results)
        {

            console.log(
                "Rows Downloaded:",
                results.data.length
            );

            buildEventObjects(results.data);

        },

        error: function(error)
        {

            console.error(error);

        }

    });

}



//============================================================
// BUILD EVENT OBJECTS
//============================================================

function buildEventObjects(rows)
{

    events = [];

    rows.forEach(function(row)
    {

        //----------------------------------------------------
        // Ignore archived events
        //----------------------------------------------------

        if(
            String(row["Archived"])
            .toLowerCase()
            .trim()
            ===
            "yes"
        )
        {
            return;
        }

        //----------------------------------------------------
        // Ignore blank rows
        //----------------------------------------------------

        if(
            !row["Event Name"]
        )
        {
            return;
        }

        //----------------------------------------------------
        // Create Event Object
        //----------------------------------------------------

        let event =
        {

            //------------------------------------------------
            // IDs
            //------------------------------------------------

            id:
                clean(row["Event ID"]),

            status:
                clean(row["Status"]),

            //------------------------------------------------
            // Event
            //------------------------------------------------

            name:
                clean(row["Event Name"]),

            type:
                clean(row["Event Type"]),

            organizer:
                clean(row["Organizer"]),

            venue:
                clean(row["Venue"]),

            description:
                clean(row["Description"]),

            //------------------------------------------------
            // Address
            //------------------------------------------------

            street:
                clean(row["Street"]),

            city:
                clean(row["City"]),

            state:
                clean(row["State"]),

            zip:
                clean(row["ZIP"]),

            county:
                clean(row["County"]),

            latitude:
                parseFloat(
                    row["Latitude"]
                ),

            longitude:
                parseFloat(
                    row["Longitude"]
                ),

            //------------------------------------------------
            // Date
            //------------------------------------------------

            dateString:
                clean(row["Date"]),

            day:
                clean(row["Day"]),

            startTime:
                clean(row["Start Time"]),

            endTime:
                clean(row["End Time"]),

            recurring:
                clean(row["Recurring"]),

            recurrence:
                clean(row["Recurrence Pattern"]),

            //------------------------------------------------
            // Costs
            //------------------------------------------------

            entryFee:
                clean(row["Entry Fee"]),

            spectatorFee:
                clean(row["Spectator Fee"]),

            //------------------------------------------------
            // Links
            //------------------------------------------------

            website:
                clean(row["Website"]),

            facebook:
                clean(row["Facebook"]),

            contact:
                clean(row["Contact"]),

            flyer:
                clean(row["Flyer Link"]),

            //------------------------------------------------
            // Features
            //------------------------------------------------

            featured:
                yesNo(
                    row["Featured Event"]
                ),

            food:
                yesNo(
                    row["Food"]
                ),

            dj:
                yesNo(
                    row["DJ"]
                ),

            liveMusic:
                yesNo(
                    row["Live Music"]
                ),

            awards:
                yesNo(
                    row["Awards"]
                ),

            fiftyFifty:
                yesNo(
                    row["50/50"]
                ),

            doorPrizes:
                yesNo(
                    row["Door Prizes"]
                ),

            familyFriendly:
                yesNo(
                    row["Family Friendly"]
                ),

            burnouts:
                yesNo(
                    row["Burnouts Allowed"]
                ),

            weatherPolicy:
                clean(
                    row["Weather Policy"]
                ),

            //------------------------------------------------
            // Administrative
            //------------------------------------------------

            verified:
                yesNo(
                    row["Verified"]
                ),

            source:
                clean(row["Source"]),

            notes:
                clean(row["Notes"])

        };

        //----------------------------------------------------
        // Build a real JavaScript Date
        //----------------------------------------------------

        event.date = parseDate(
            event.dateString
        );

        //----------------------------------------------------
        // Store Event
        //----------------------------------------------------

        events.push(event);

    });

    //--------------------------------------------------------
    // Sort by Date
    //--------------------------------------------------------

    events.sort(function(a,b)
    {

        return a.date - b.date;

    });

    console.log(
        "Events Loaded:",
        events.length
    );

    //--------------------------------------------------------
    // Part 2 starts here
    //--------------------------------------------------------

    initializeWebsite();

}



//============================================================
// HELPER FUNCTIONS
//============================================================

function clean(value)
{

    if(value === undefined)
        return "";

    if(value === null)
        return "";

    return String(value).trim();

}



function yesNo(value)
{

    value = clean(value).toLowerCase();

    return (
        value === "yes" ||
        value === "true" ||
        value === "y" ||
        value === "1"
    );

}



function parseDate(dateString)
{

    if(!dateString)
    {
        return new Date(2100,0,1);
    }

    let d = new Date(dateString);

    if(isNaN(d))
    {
        return new Date(2100,0,1);
    }

    return d;

}

/***********************************************************************
 *
 * PART 2
 *
 * Website Initialization
 *
 ***********************************************************************/


//============================================================
// INITIALIZE WEBSITE
//============================================================

function initializeWebsite()
{

    console.log("Initializing Website...");

    updateStatistics();

    updateFeaturedEvent();

    populateEventTable(events);

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
        {
            showCount++;
        }

        if(type.includes("cruise"))
        {
            cruiseCount++;
        }

        if(type.includes("coffee"))
        {
            coffeeCount++;
        }

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
        events.find(event => event.featured);

    if(!featured)
    {

        featured = events[0];

    }

    if(!featured)
    {

        return;

    }

    document.getElementById("featuredTitle").textContent =
        featured.name;

    document.getElementById("featuredDescription").textContent =
        featured.description;

    document
        .getElementById("featuredButton")
        .onclick =
        function()
        {

            showEvent(featured);

        };

}



//============================================================
// BUILD TABLE
//============================================================

function populateEventTable(eventList)
{

    const tbody =
        document.querySelector("#eventsTable tbody");

    tbody.innerHTML = "";

    //--------------------------------------------------------
    // No Events
    //--------------------------------------------------------

    if(eventList.length === 0)
    {

        tbody.innerHTML =

        `<tr>

            <td colspan="6"
                class="no-events">

                No events found.

            </td>

        </tr>`;

        return;

    }

    //--------------------------------------------------------
    // Add Events
    //--------------------------------------------------------

    eventList.forEach(function(event)
    {

        let row =
            document.createElement("tr");

        row.innerHTML =

        `

        <td class="event-date">

            ${formatDate(event.date)}

        </td>

        <td>

            <div class="event-name">

                ${event.name}

            </div>

        </td>

        <td class="event-city">

            ${event.city}

        </td>

        <td>

            ${buildBadge(event.type)}

        </td>

        <td class="event-time">

            ${event.startTime}

        </td>

        <td>

            <button
                class="details-button">

                Details

            </button>

        </td>

        `;

        row
        .querySelector(".details-button")
        .onclick =
        function()
        {

            showEvent(event);

        };

        tbody.appendChild(row);

    });

}



//============================================================
// FORMAT DATE
//============================================================

function formatDate(date)
{

    if(!(date instanceof Date))
    {

        return "";

    }

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
// EVENT TYPE BADGE
//============================================================

function buildBadge(type)
{

    if(!type)
    {

        return "";

    }

    let t =
        type.toLowerCase();

    if(t.includes("show"))
    {

        return '<span class="badge badge-show">Car Show</span>';

    }

    if(t.includes("cruise"))
    {

        return '<span class="badge badge-cruise">Cruise Night</span>';

    }

    if(t.includes("coffee"))
    {

        return '<span class="badge badge-coffee">Cars & Coffee</span>';

    }

    if(t.includes("swap"))
    {

        return '<span class="badge badge-swap">Swap Meet</span>';

    }

    if(t.includes("charity"))
    {

        return '<span class="badge badge-charity">Charity</span>';

    }

    return
        `<span class="badge">${type}</span>`;

}



//============================================================
// EVENT DETAILS
//============================================================

function showEvent(event)
{

    // We'll replace this with a nice popup window later.

    alert(

`${event.name}

${event.venue}

${event.street}

${event.city}, ${event.state}

${event.startTime}

${event.description}`

    );

}

/***********************************************************************
 *
 * PART 3
 *
 * Search, Date Filtering and Public Event API
 *
 ***********************************************************************/


//============================================================
// CURRENT FILTERS
//============================================================

let currentSearch = "";
let currentType = "all";
let currentDate = null;


//============================================================
// WIRE UP CONTROLS
//============================================================

document.addEventListener("DOMContentLoaded", function ()
{

    //--------------------------------------------------------
    // Search Box
    //--------------------------------------------------------

    const searchBox = document.getElementById("searchBox");

    if(searchBox)
    {

        searchBox.addEventListener("input", function()
        {

            currentSearch = this.value.toLowerCase();

            applyFilters();

        });

    }


    //--------------------------------------------------------
    // Date Picker
    //--------------------------------------------------------

    const selectedDate =
        document.getElementById("selectedDate");

    if(selectedDate)
    {

        selectedDate.addEventListener("change", function()
        {

            currentDate = this.value;

            applyFilters();

        });

    }


    //--------------------------------------------------------
    // Today Button
    //--------------------------------------------------------

    const todayButton =
        document.getElementById("todayButton");

    if(todayButton)
    {

        todayButton.addEventListener("click", function()
        {

            let today = new Date();

            currentDate =
                today.toISOString().substring(0,10);

            selectedDate.value = currentDate;

            applyFilters();

        });

    }


    //--------------------------------------------------------
    // View All
    //--------------------------------------------------------

    const allButton =
        document.getElementById("allEventsButton");

    if(allButton)
    {

        allButton.addEventListener("click", function()
        {

            currentSearch = "";
            currentDate = null;
            currentType = "all";

            document.getElementById("searchBox").value = "";
            document.getElementById("selectedDate").value = "";

            clearFilterButtons();

            document
                .querySelector('[data-filter="all"]')
                .classList.add("active");

            applyFilters();

        });

    }


    //--------------------------------------------------------
    // Weekend Button
    //--------------------------------------------------------

    const weekendButton =
        document.getElementById("weekendButton");

    if(weekendButton)
    {

        weekendButton.addEventListener("click", function()
        {

            showWeekend();

        });

    }


    //--------------------------------------------------------
    // Filter Buttons
    //--------------------------------------------------------

    document
    .querySelectorAll(".filterButton")
    .forEach(function(button)
    {

        button.addEventListener("click", function()
        {

            clearFilterButtons();

            button.classList.add("active");

            currentType =
                button.dataset.filter;

            applyFilters();

        });

    });

});


//============================================================
// APPLY FILTERS
//============================================================

function applyFilters()
{

    let filtered =
        events.filter(function(event)
        {

            //------------------------------------------------
            // Search
            //------------------------------------------------

            if(currentSearch !== "")
            {

                let haystack =
                    (

                        event.name + " " +

                        event.city + " " +

                        event.venue + " " +

                        event.organizer

                    ).toLowerCase();

                if(!haystack.includes(currentSearch))
                {

                    return false;

                }

            }


            //------------------------------------------------
            // Type
            //------------------------------------------------

            if(currentType !== "all")
            {

                if(
                    event.type.toLowerCase()
                    !==
                    currentType.toLowerCase()
                )
                {

                    return false;

                }

            }


            //------------------------------------------------
            // Date
            //------------------------------------------------

            if(currentDate)
            {

                let d =
                    event.date
                    .toISOString()
                    .substring(0,10);

                if(d !== currentDate)
                {

                    return false;

                }

            }

            return true;

        });


    populateEventTable(filtered);

}



//============================================================
// WEEKEND FILTER
//============================================================

function showWeekend()
{

    let filtered =
        events.filter(function(event)
        {

            let day =
                event.date.getDay();

            return (
                day === 6 ||
                day === 0
            );

        });

    populateEventTable(filtered);

}



//============================================================
// CLEAR FILTER BUTTONS
//============================================================

function clearFilterButtons()
{

    document
    .querySelectorAll(".filterButton")
    .forEach(function(button)
    {

        button.classList.remove("active");

    });

}



//============================================================
// PUBLIC FUNCTIONS
//============================================================

function getAllEvents()
{

    return events;

}



function getEventsForDate(date)
{

    return events.filter(function(event)
    {

        return (

            event.date
            .toISOString()
            .substring(0,10)

            ===

            date

        );

    });

}



function getFeaturedEvent()
{

    let featured =
        events.find(event => event.featured);

    return featured || null;

}



function getCruiseNights()
{

    return events.filter(function(event)
    {

        return event.type
        .toLowerCase()
        .includes("cruise");

    });

}



function getCarShows()
{

    return events.filter(function(event)
    {

        return event.type
        .toLowerCase()
        .includes("show");

    });

}



function getCarsAndCoffee()
{

    return events.filter(function(event)
    {

        return event.type
        .toLowerCase()
        .includes("coffee");

    });

}



//============================================================
// READY
//============================================================

console.log("Michigan Car Cruise Calendar Ready");

