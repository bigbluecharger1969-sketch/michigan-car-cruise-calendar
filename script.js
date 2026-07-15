const csvURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQQIifWAOAY5pFv7TnTfg7ZJxuEFIWtUXb-kExeaSW5LoZK9CpIBXBerrrTuauLt5P_zJBdbr-R9Sba/pub?output=csv";

Papa.parse(csvURL, {
    download: true,
    header: true,
    complete: function(results) {

        const tbody = document.querySelector("#eventsTable tbody");

        results.data.forEach(event => {

            if (!event["Event Name"]) return;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${event["Event Name"]}</td>
                <td>${event["Date"]}</td>
                <td>${event["City"]}</td>
            `;

            tbody.appendChild(row);

        });

    }
});
