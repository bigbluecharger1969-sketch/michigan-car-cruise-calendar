/**********************************************************************
 *
 * Michigan Car Cruise Calendar
 *
 * filters.js
 *
 * Search & Filtering
 *
 **********************************************************************/

//============================================================
// FILTER STATE
//============================================================

let filteredEvents = [];


//============================================================
// INITIALIZE FILTERS
//============================================================

document.addEventListener("DOMContentLoaded", function ()
{
    initializeFilters();
});



function initializeFilters()
{
    initializeSearchFilter();
    initializeDateFilter();
    initializeQuickFilters();
}



//============================================================
// SEARCH
//============================================================

function initializeSearchFilter()
{
    const searchBox = document.getElementById("searchBox");

    if (!searchBox)
        return;

    searchBox.addEventListener("input", applyFilters);
}



//============================================================
// DATE PICKER
//============================================================

function initializeDateFilter()
{
    const picker = document.getElementById("selectedDate");

    if (!picker)
        return;

    picker.addEventListener("change", applyFilters);
}



//============================================================
// QUICK FILTER BUTTONS
//============================================================

function initializeQuickFilters()
{
    const todayButton = document.getElementById("todayButton");

    if (todayButton)
    {
        todayButton.addEventListener("click", function ()
        {
            const picker = document.getElementById("selectedDate");

            if (!picker)
                return;

            picker.value = new Date().toISOString().substring(0, 10);

            applyFilters();
        });
    }

    const allButton = document.getElementById("allEventsButton");

    if (allButton)
    {
        allButton.addEventListener("click", function ()
        {
            const picker = document.getElementById("selectedDate");

            if (picker)
                picker.value = "";

            const searchBox = document.getElementById("searchBox");

            if (searchBox)
                searchBox.value = "";

            applyFilters();
        });
    }
}



//============================================================
// APPLY FILTERS
//============================================================

function applyFilters()
{
    const searchText =
        getSearchText();

    const selectedDate =
        getSelectedDate();

    filteredEvents = events.filter(function (event)
    {
        if (!matchesSearch(event, searchText))
            return false;

        if (!matchesDate(event, selectedDate))
            return false;

        return true;
    });

    populateEventTable(filteredEvents);
}



//============================================================
// SEARCH MATCH
//============================================================

function matchesSearch(event, searchText)
{
    if (searchText === "")
        return true;

    const text = [

        event.name,
        event.city,
        event.venue,
        event.description,
        event.type

    ].join(" ").toLowerCase();

    return text.includes(searchText);
}



//============================================================
// DATE MATCH
//============================================================

function matchesDate(event, selectedDate)
{
    if (selectedDate === "")
        return true;

    const eventDate =
        event.date.toISOString().substring(0, 10);

    return eventDate === selectedDate;
}



//============================================================
// HELPERS
//============================================================

function getSearchText()
{
    const box = document.getElementById("searchBox");

    if (!box)
        return "";

    return box.value.trim().toLowerCase();
}



function getSelectedDate()
{
    const picker = document.getElementById("selectedDate");

    if (!picker)
        return "";

    return picker.value;
}



//============================================================
// PUBLIC FUNCTIONS
//============================================================

function clearFilters()
{
    const searchBox = document.getElementById("searchBox");

    if (searchBox)
        searchBox.value = "";

    const picker = document.getElementById("selectedDate");

    if (picker)
        picker.value = "";

    applyFilters();
}



function refreshFilters()
{
    applyFilters();
}
