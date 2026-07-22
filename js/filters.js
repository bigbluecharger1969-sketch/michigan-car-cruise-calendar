/* Event collection searching, filtering, and sorting. */
const Filters = (() => {
    let events = [];
    let criteria = { search: "", type: "all", date: "", weekendOnly: false };
    let filteredEvents = [];

    const dateKey = (date) => date instanceof Date && !Number.isNaN(date) ? date.toISOString().slice(0, 10) : "";
    const normalize = (value) => String(value || "").toLowerCase();
    const sortByDate = (items) => [...items].sort((first, second) => {
        if (!first.date) return 1;
        if (!second.date) return -1;
        return first.date - second.date;
    });
    const matchesSearch = (event, search) => !search || [event.name, event.city, event.venue, event.organizer, event.description, event.type]
        .some((value) => normalize(value).includes(search));
    const matchesType = (event, type) => type === "all" || normalize(event.type) === normalize(type);
    const matchesDate = (event, date) => !date || dateKey(event.date) === date;
    const matchesWeekend = (event) => !criteria.weekendOnly || (event.date && [0, 6].includes(event.date.getDay()));

    const apply = () => {
        filteredEvents = sortByDate(events.filter((event) =>
            matchesSearch(event, criteria.search) &&
            matchesType(event, criteria.type) &&
            matchesDate(event, criteria.date) &&
            matchesWeekend(event)
        ));
        return filteredEvents;
    };

    const initialize = (eventCollection) => {
        events = sortByDate(eventCollection);
        criteria = { search: "", type: "all", date: "", weekendOnly: false };
        return apply();
    };
    const setSearch = (search) => { criteria.search = normalize(search).trim(); criteria.weekendOnly = false; return apply(); };
    const setType = (type) => { criteria.type = type || "all"; criteria.weekendOnly = false; return apply(); };
    const setDate = (date) => { criteria.date = date || ""; criteria.weekendOnly = false; return apply(); };
    const showWeekend = () => { criteria = { ...criteria, date: "", weekendOnly: true }; return apply(); };
    const reset = () => { criteria = { search: "", type: "all", date: "", weekendOnly: false }; return apply(); };
    const getFeaturedEvent = () => events.find((event) => event.featured) || null;
    const getNextUpcomingEvent = () => events.find((event) => event.date && event.date >= new Date()) || null;
    const getCriteria = () => ({ ...criteria });
    const getEvents = () => [...filteredEvents];

    return { initialize, setSearch, setType, setDate, showWeekend, reset, getEvents, getCriteria, getFeaturedEvent, getNextUpcomingEvent };
})();
