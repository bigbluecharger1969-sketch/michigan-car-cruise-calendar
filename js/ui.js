/* DOM rendering and interface interactions. */
const UI = (() => {
    let handlers = {};
    let activeEvent = null;
    let lastFocusedElement = null;
    let toastTimer = null;

    const byId = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value ?? "")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const formatDate = (date) => date instanceof Date && !Number.isNaN(date)
        ? date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        : "Date TBA";
    const formatMoney = (value) => value || "Free";
    const formatTime = (value) => value || "TBA";
    const badgeClass = (type) => {
        const value = String(type || "").toLowerCase();
        if (value.includes("show")) return "badge-show";
        if (value.includes("cruise")) return "badge-cruise";
        if (value.includes("coffee")) return "badge-coffee";
        if (value.includes("swap")) return "badge-swap";
        if (value.includes("charity")) return "badge-charity";
        return "";
    };
    const buildBadge = (type) => type ? `<span class="badge ${badgeClass(type)}">${escapeHtml(type)}</span>` : "";
    const addressFor = (event) => [event.street, event.city, event.state, event.zip].filter(Boolean).join(", ");

    const renderTable = (events) => {
        const body = document.querySelector("#eventsTable tbody");
        if (!body) return;
        if (!events.length) {
            body.innerHTML = '<tr><td colspan="6" class="no-events">No events found.</td></tr>';
            return;
        }

        const fragment = document.createDocumentFragment();
        events.forEach((event) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td class="event-date">${formatDate(event.date)}</td>
                <td><div class="event-name">${escapeHtml(event.name)}</div><small>${escapeHtml(event.venue)}</small></td>
                <td class="event-city">${escapeHtml(event.city)}</td>
                <td>${buildBadge(event.type)}</td><td class="event-time">${escapeHtml(formatTime(event.startTime))}</td>
                <td><button class="btn btn-secondary details-button" type="button">Details</button></td>`;
            row.querySelector(".details-button").addEventListener("click", () => showEvent(event));
            fragment.appendChild(row);
        });
        body.replaceChildren(fragment);
    };

    const renderStatistics = (events) => {
        const countByType = (term) => events.filter((event) => String(event.type).toLowerCase().includes(term)).length;
        [["eventCount", events.length], ["showCount", countByType("show")], ["cruiseCount", countByType("cruise")], ["coffeeCount", countByType("coffee")]]
            .forEach(([id, value]) => { const element = byId(id); if (element) element.textContent = value; });
    };

    const renderFeaturedEvent = (event) => {
        const title = byId("featuredTitle");
        const description = byId("featuredDescription");
        const button = byId("featuredButton");
        if (!title || !description || !button) return;
        title.textContent = event ? event.name : "Michigan Car Cruise Calendar";
        description.textContent = event ? event.description || "Event details are coming soon." : "Featured events will appear here as they are added.";
        button.disabled = !event;
        button.onclick = () => event && showEvent(event);
    };

    const render = ({ events, featuredEvent }) => {
        renderTable(events);
        renderStatistics(events);
        renderFeaturedEvent(featuredEvent);
        document.title = `Michigan Car Cruise Calendar (${events.length} Events)`;
    };

    const createModal = () => {
        if (byId("eventModal")) return;
        document.body.insertAdjacentHTML("beforeend", `<div id="eventModal" class="event-modal hidden" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-overlay"><div class="modal-window"><div class="modal-header"><h2 id="modalTitle">Event</h2>
            <button id="closeModal" class="close-button" type="button" aria-label="Close event details"><i class="fa-solid fa-xmark"></i></button></div>
            <div id="modalBody" class="modal-body"></div><div class="modal-footer">
            <button id="directionsButton" class="btn btn-primary" type="button">Directions</button>
            <button id="facebookButton" class="btn btn-facebook" type="button">Facebook</button>
            <button id="websiteButton" class="btn btn-secondary" type="button">Website</button></div></div></div></div>`);
        byId("closeModal").addEventListener("click", closeEventModal);
        document.querySelector("#eventModal .modal-overlay").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeEventModal(); });
        byId("directionsButton").addEventListener("click", () => openDirections(activeEvent));
        byId("facebookButton").addEventListener("click", () => openLink(activeEvent?.facebook, "No Facebook page available."));
        byId("websiteButton").addEventListener("click", () => openLink(activeEvent?.website, "No website available."));
    };

    const badges = (event) => [[event.featured, "Featured Event"], [event.familyFriendly, "Family Friendly"], [event.food, "Food"], [event.dj, "DJ"], [event.liveMusic, "Live Music"], [event.awards, "Awards"], [event.doorPrizes, "Door Prizes"], [event.fiftyFifty, "50 / 50"], [event.burnouts, "Burnouts Allowed"]]
        .filter(([enabled]) => enabled).map(([, label]) => `<span class="modal-badge">${label}</span>`).join("");
    const optionalSection = (heading, content) => content ? `<h3>${heading}</h3><p>${escapeHtml(content)}</p>` : "";

    const showEvent = (event) => {
        activeEvent = event;
        lastFocusedElement = document.activeElement;
        byId("modalTitle").textContent = event.name;
        const flyer = event.flyerLink ? `<img src="${escapeHtml(event.flyerLink)}" alt="${escapeHtml(event.name)} flyer" style="width:100%;border-radius:12px;">` : "";
        const eventBadges = badges(event);
        byId("modalBody").innerHTML = `${flyer}${eventBadges ? `<div class="modal-badges">${eventBadges}</div>` : ""}
            <div class="feature-grid"><div class="feature"><strong>Date</strong><br>${formatDate(event.date)}</div><div class="feature"><strong>Time</strong><br>${escapeHtml(formatTime(event.startTime))}${event.endTime ? `<br>${escapeHtml(event.endTime)}` : ""}</div><div class="feature"><strong>Entry</strong><br>${escapeHtml(formatMoney(event.entryFee))}</div><div class="feature"><strong>Spectators</strong><br>${escapeHtml(formatMoney(event.spectatorFee))}</div></div><hr>
            <h3>Location</h3><p><strong>${escapeHtml(event.venue)}</strong><br>${escapeHtml(addressFor(event))}</p><hr>
            ${optionalSection("Description", event.description || "No description available.")}${optionalSection("Organizer", [event.organizer, event.contact].filter(Boolean).join(" — "))}${optionalSection("Weather Policy", event.weatherPolicy)}`;
        byId("directionsButton").disabled = !addressFor(event);
        byId("facebookButton").disabled = !event.facebook;
        byId("websiteButton").disabled = !event.website;
        byId("eventModal").classList.remove("hidden");
        document.body.classList.add("modal-open");
        byId("closeModal").focus();
    };
    const closeEventModal = () => {
        const modal = byId("eventModal");
        if (!modal || modal.classList.contains("hidden")) return;
        modal.classList.add("hidden");
        document.body.classList.remove("modal-open");
        lastFocusedElement?.focus();
    };
    const openLink = (url, fallback) => url ? window.open(url, "_blank", "noopener") : showToast(fallback, "error");
    const openDirections = (event) => {
        const address = event && addressFor(event);
        if (!address) return showToast("No address available.", "error");
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank", "noopener");
    };
    const showToast = (message, type = "info") => {
        const toast = byId("toast");
        if (!toast) return;
        toast.className = `${type} show`;
        toast.textContent = message;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
    };
    const syncControls = (criteria) => {
        const search = byId("searchBox"); const date = byId("selectedDate");
        if (search) search.value = criteria.search;
        if (date) date.value = criteria.date;
        document.querySelectorAll(".filterButton").forEach((button) => button.classList.toggle("active", button.dataset.filter === criteria.type));
    };
    const initialize = (callbacks) => {
        handlers = callbacks;
        createModal();
        byId("searchBox")?.addEventListener("input", (event) => handlers.onSearch(event.target.value));
        byId("selectedDate")?.addEventListener("change", (event) => handlers.onDate(event.target.value));
        byId("todayButton")?.addEventListener("click", () => handlers.onDate(new Date().toISOString().slice(0, 10)));
        byId("weekendButton")?.addEventListener("click", () => handlers.onWeekend());
        byId("allEventsButton")?.addEventListener("click", () => handlers.onReset());
        document.querySelectorAll(".filterButton").forEach((button) => button.addEventListener("click", () => handlers.onType(button.dataset.filter)));
        document.querySelectorAll(".main-nav a[href^='#']").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); byId(link.getAttribute("href").slice(1))?.scrollIntoView({ behavior: "smooth" }); }));
        document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeEventModal(); if (event.key === "/" && document.activeElement?.tagName !== "INPUT") { event.preventDefault(); byId("searchBox")?.focus(); } });
    };
    const showLoading = (message = "Loading events...") => { const overlay = byId("loadingOverlay"); if (overlay) { overlay.classList.remove("hidden"); overlay.querySelector(".loading-message").textContent = message; } };
    const hideLoading = () => byId("loadingOverlay")?.classList.add("hidden");

    return { initialize, render, syncControls, showLoading, hideLoading, showToast };
})();
