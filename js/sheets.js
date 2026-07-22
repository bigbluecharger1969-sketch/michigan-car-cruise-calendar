/* Google Sheets data source and event normalization. */
const Sheets = (() => {
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQIifWAOAY5pFv7TnTfg7ZJxuEFIWtUXb-kExeaSW5LoZK9CpIBXBerrrTuauLt5P_zJBdbr-R9Sba/pub?output=csv";

    const clean = (value) => value == null ? "" : String(value).trim();
    const isYes = (value) => ["yes", "true", "y", "1"].includes(clean(value).toLowerCase());
    const numberOrNull = (value) => {
        const parsed = Number.parseFloat(clean(value));
        return Number.isFinite(parsed) ? parsed : null;
    };

    const createLocalDate = (year, month, day) => {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
    };

    const parseDate = (value) => {
        const dateText = clean(value);
        if (!dateText) return null;

        const numericDate = dateText.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
        if (numericDate) {
            const year = Number(numericDate[3].length === 2 ? `20${numericDate[3]}` : numericDate[3]);
            return createLocalDate(year, Number(numericDate[1]), Number(numericDate[2]));
        }

        const isoDate = dateText.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoDate) return createLocalDate(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]));

        const date = new Date(dateText);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const createEvent = (row, index) => {
        const dateString = clean(row.Date);
        const date = parseDate(dateString);
        const name = clean(row["Event Name"]);

        if (!name || isYes(row.Archived)) return null;

        return {
            id: clean(row["Event ID"]) || `event-${index}`,
            status: clean(row.Status),
            name,
            type: clean(row["Event Type"]),
            organizer: clean(row.Organizer),
            venue: clean(row.Venue),
            description: clean(row.Description),
            street: clean(row.Street),
            city: clean(row.City),
            state: clean(row.State),
            zip: clean(row.ZIP),
            county: clean(row.County),
            latitude: numberOrNull(row.Latitude),
            longitude: numberOrNull(row.Longitude),
            dateString,
            date,
            day: clean(row.Day),
            startTime: clean(row["Start Time"]),
            endTime: clean(row["End Time"]),
            recurring: clean(row.Recurring),
            recurrence: clean(row["Recurrence Pattern"]),
            entryFee: clean(row["Entry Fee"]),
            spectatorFee: clean(row["Spectator Fee"]),
            website: clean(row.Website),
            facebook: clean(row.Facebook),
            contact: clean(row.Contact),
            flyerLink: clean(row["Flyer Link"]),
            featured: isYes(row["Featured Event"]),
            food: isYes(row.Food),
            dj: isYes(row.DJ),
            liveMusic: isYes(row["Live Music"]),
            awards: isYes(row.Awards),
            fiftyFifty: isYes(row["50/50"]),
            doorPrizes: isYes(row["Door Prizes"]),
            familyFriendly: isYes(row["Family Friendly"]),
            burnouts: isYes(row["Burnouts Allowed"]),
            weatherPolicy: clean(row["Weather Policy"]),
            verified: isYes(row.Verified),
            source: clean(row.Source),
            notes: clean(row.Notes)
        };
    };

    const normalizeRows = (rows) => rows
        .map(createEvent)
        .filter(Boolean)
        .sort((first, second) => {
            if (!first.date) return 1;
            if (!second.date) return -1;
            return first.date - second.date;
        });

    const load = () => new Promise((resolve, reject) => {
        if (!window.Papa) {
            reject(new Error("PapaParse could not be loaded."));
            return;
        }

        Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: ({ data, errors }) => {
                if (errors.length) console.warn("Some sheet rows could not be read.", errors);
                resolve(normalizeRows(data));
            },
            error: reject
        });
    });

    return { load, normalizeRows };
})();
