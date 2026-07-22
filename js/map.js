/* Lightweight, dependency-free event map. Coordinates come from the Google Sheet. */
const MapPage = (() => {
    const MICHIGAN_BOUNDS = { north: 48.5, south: 41.6, west: -90.5, east: -82.0 };
    // The Sheet can later provide exact latitude/longitude. Until then, city centers
    // keep the map useful without relying on a third-party geocoding service.
    const CITY_COORDINATES = {
        "brighton": [42.5295, -83.7802], "clinton township": [42.8445, -82.9498],
        "commerce township": [42.5922, -83.4891], "ecorse": [42.2445, -83.1458],
        "flint": [43.0125, -83.6875], "hillsdale": [41.9201, -84.6305],
        "inkster": [42.2942, -83.3099], "livonia": [42.3684, -83.3527],
        "milford": [42.8359, -83.6952], "monroe": [41.9164, -83.3977],
        "northville": [42.4312, -83.4833], "richmond": [42.8095, -82.7555],
        "romulus": [42.2223, -83.3966], "royal oak": [42.4895, -83.1446],
        "southgate": [42.2131, -83.1938], "waterford township": [42.6930, -83.4050],
        "wayne": [42.2814, -83.3863], "woodhaven": [42.1389, -83.2416]
    };
    const byId = (id) => document.getElementById(id);
    const dateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
    let mappedEvents = [];
    let activeEventId = null;

    const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const coordinatesFor = (event) => {
        if (Number.isFinite(event.latitude) && Number.isFinite(event.longitude)) return [event.latitude, event.longitude];
        return CITY_COORDINATES[String(event.city || "").trim().toLowerCase()] || null;
    };
    const hasCoordinates = (event) => {
        const coordinates = coordinatesFor(event);
        return coordinates && coordinates[0] >= MICHIGAN_BOUNDS.south && coordinates[0] <= MICHIGAN_BOUNDS.north && coordinates[1] >= MICHIGAN_BOUNDS.west && coordinates[1] <= MICHIGAN_BOUNDS.east;
    };
    const mapPosition = (event) => {
        const [latitude, longitude] = coordinatesFor(event);
        return { left: ((longitude - MICHIGAN_BOUNDS.west) / (MICHIGAN_BOUNDS.east - MICHIGAN_BOUNDS.west)) * 100, top: ((MICHIGAN_BOUNDS.north - latitude) / (MICHIGAN_BOUNDS.north - MICHIGAN_BOUNDS.south)) * 100 };
    };
    const eventDate = (event) => event.date ? dateFormatter.format(event.date) : "Date TBA";
    const selectEvent = (event) => {
        activeEventId = event.id;
        document.querySelectorAll(".map-marker, .map-event-card").forEach((element) => element.classList.toggle("active", element.dataset.eventId === event.id));
        document.querySelector(`[data-event-id="${CSS.escape(event.id)}"].map-event-card`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    const render = () => {
        const events = Filters.getEvents();
        mappedEvents = events.filter(hasCoordinates);
        if (!mappedEvents.some((event) => event.id === activeEventId)) activeEventId = null;

        byId("mapSummary").textContent = `${events.length} event${events.length === 1 ? "" : "s"} match the filters; ${mappedEvents.length} are shown on the map.`;
        byId("mapMarkers").replaceChildren(...mappedEvents.map((event) => {
            const position = mapPosition(event);
            const marker = document.createElement("button");
            marker.className = "map-marker";
            marker.type = "button";
            marker.dataset.eventId = event.id;
            marker.style.left = `${position.left}%`;
            marker.style.top = `${position.top}%`;
            marker.title = `${event.name} — ${event.city}`;
            marker.setAttribute("aria-label", marker.title);
            marker.addEventListener("click", () => selectEvent(event));
            return marker;
        }));

        const list = byId("mapEventList");
        if (!events.length) { list.innerHTML = '<p class="map-empty">No events match these filters.</p>'; return; }
        list.innerHTML = events.map((event) => `<article class="map-event-card ${event.id === activeEventId ? "active" : ""}" data-event-id="${escapeHtml(event.id)}"><p class="map-date">${eventDate(event)}</p><h3>${escapeHtml(event.name)}</h3><p>${escapeHtml([event.city, event.type].filter(Boolean).join(" · "))}</p>${hasCoordinates(event) ? "" : '<p>Location coordinates are not available yet.</p>'}</article>`).join("");
        list.querySelectorAll(".map-event-card").forEach((card) => card.addEventListener("click", () => { const event = events.find((item) => item.id === card.dataset.eventId); if (event) selectEvent(event); }));
    };
    const apply = (action) => { action(); render(); };
    const initializeControls = () => {
        byId("mapDate").addEventListener("change", (event) => apply(() => Filters.setDate(event.target.value)));
        byId("mapType").addEventListener("change", (event) => apply(() => Filters.setType(event.target.value)));
        byId("mapToday").addEventListener("click", () => { const date = new Date().toISOString().slice(0, 10); byId("mapDate").value = date; apply(() => Filters.setDate(date)); });
        byId("mapAllEvents").addEventListener("click", () => { byId("mapDate").value = ""; byId("mapType").value = "all"; apply(() => Filters.reset()); });
    };
    const start = async () => {
        try {
            const events = await Sheets.load();
            Filters.initialize(events);
            initializeControls();
            render();
        } catch (error) {
            console.error("Unable to load map events.", error);
            byId("mapSummary").textContent = "Event locations could not be loaded. Please try again later.";
        } finally {
            byId("mapLoading").classList.add("hidden");
        }
    };
    return { start };
})();

document.addEventListener("DOMContentLoaded", () => MapPage.start());
