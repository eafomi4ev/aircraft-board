const Latitude = 1;
const Longitude = 2;
const Direction = 3;
const Altitude = 4;
const Speed = 5;
const Departure = 11;
const Arrival = 12;
const Number = 13;

loadData();
const intervalId = setInterval(loadData, 3000);


function loadData() {
    fetch('https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds=56.84,55.27,33.48,41.48')
        .then(response => response.json())
        .then(data => {
            const total = data.full_count;
            delete data.full_count;
            delete data.version;
            let normalizedData = normalizeData(data);
            setDataToTable(normalizedData, total);
        })
}


function setDataToTable(data, total) {
    let table = document.getElementsByClassName('board')[0];
    let tbodyOld = table.getElementsByTagName('tbody')[0];
    let tbodyNew = document.createElement('tbody');
    
    for (let aircraft of data) {
        let tr = createTr(aircraft);
        tbodyNew.appendChild(tr);
    }
    
    tbodyOld.parentNode.replaceChild(tbodyNew, tbodyOld);
}


function createTd(text) {
    let td = document.createElement('td');
    td.innerHTML = text || '-';
    return td;
}


function createTr(aircraft) {
    let tr = document.createElement('tr');
    
    tr.appendChild(createTd(aircraft.latlon));
    tr.appendChild(createTd(aircraft.speed));
    tr.appendChild(createTd(aircraft.direction));
    tr.appendChild(createTd(aircraft.altitude));
    tr.appendChild(createTd(aircraft.departure));
    tr.appendChild(createTd(aircraft.arrival));
    tr.appendChild(createTd(aircraft.number));
    
    return tr;
}


function normalizeData(data) {
    let result = [];
    for (let code of Object.keys(data)) {
        let aircraft = data[code];
        result.push({
            latlon: `${aircraft[Latitude]}, ${aircraft[Longitude]}`,
            direction: aircraft[Direction],
            altitude: ftToM(aircraft[Altitude]),
            speed: knotToKmh(aircraft[Speed]),
            departure: aircraft[Departure],
            arrival: aircraft[Arrival],
            number: aircraft[Number],
        });
    }
    result.sort(function (a, b) {
        if (a.altitude < b.altitude) {
            return 1;
        }
        if (a.altitude > b.altitude) {
            return -1;
        }
        return 0;
    });
    return result;
}


function ftToM(ft) {
    return +(ft / 3.2808).toFixed(2);
}


function knotToKmh(knot) {
    return +(knot * 1.852).toFixed(2);
}
