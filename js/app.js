/* Application startup, state, and module communication. */
const App = (() => {
    const state = { events: [], filteredEvents: [], initialized: false };

    const render = () => {
        state.filteredEvents = Filters.getEvents();
        UI.syncControls(Filters.getCriteria());
        UI.render({
            events: state.filteredEvents,
            featuredEvent: Filters.getFeaturedEvent() || Filters.getNextUpcomingEvent() || state.events[0] || null
        });
    };
    const apply = (operation) => { operation(); render(); };
    const start = async () => {
        if (state.initialized) return;
        state.initialized = true;
        UI.showLoading();
        try {
            state.events = await Sheets.load();
            Filters.initialize(state.events);
            UI.initialize({
                onSearch: (value) => apply(() => Filters.setSearch(value)),
                onType: (value) => apply(() => Filters.setType(value)),
                onDate: (value) => apply(() => Filters.setDate(value)),
                onWeekend: () => apply(() => Filters.showWeekend()),
                onReset: () => apply(() => Filters.reset())
            });
            render();
        } catch (error) {
            console.error("Unable to load events.", error);
            UI.showToast("Events could not be loaded. Please try again later.", "error");
            UI.render({ events: [], featuredEvent: null });
        } finally {
            UI.hideLoading();
        }
    };
    return { start };
})();

document.addEventListener("DOMContentLoaded", () => {
    App.start();
});
