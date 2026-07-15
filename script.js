const csvURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQQIifWAOAY5pFv7TnTfg7ZJxuEFIWtUXb-kExeaSW5LoZK9CpIBXBerrrTuauLt5P_zJBdbr-R9Sba/pub?output=csv";

fetch(csvURL)

.then(response => response.text())

.then(data => {

const rows = data.split("\n");

const table = document.querySelector("#eventsTable tbody");

for(let i=1;i<rows.length;i++){

const cols = rows[i].split(",");

if(cols.length<8) continue;

const tr=document.createElement("tr");

tr.innerHTML=`

<td>${cols[2]}</td>

<td>${cols[13]}</td>

<td>${cols[7]}</td>

`;

table.appendChild(tr);

}

});
