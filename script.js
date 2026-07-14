// Clock Utility
let is24Hour = false;
const clockToggle = document.getElementById("clock-toggle");

clockToggle.addEventListener("click", () => {
    is24Hour = !is24Hour;
    clockToggle.textContent = is24Hour ? "Switch to 12h" : "Switch to 24h";
    updateClock();
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = "";

    if (!is24Hour) {
        ampm = hours >= 12 ? " PM" : " AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    document.getElementById("time").textContent = `${hours}:${minutes}${ampm}`;
    document.getElementById("date").textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric"
    });
}

setInterval(updateClock, 1000);
updateClock();

// Form Input Mapping
const searchEngineSelect = document.getElementById("search-engine");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchEngineSelect.addEventListener("change", (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    searchForm.action = selectedOption.value;
    searchInput.name = selectedOption.getAttribute("data-name");
    searchInput.placeholder = `Search ${selectedOption.text}`;
});

// Weather Request (Location parameters are completely private/hidden)
const weatherText = document.getElementById("weather");
const temperatureText = document.getElementById("temperature");

function getWeatherName(code) {
    const weather = {
        0: "Clear Sky",
        1: "Mostly Clear",
        2: "Partly Cloudy",
        3: "Cloudy",
        45: "Fog", 48: "Fog",
        51: "Light Rain", 53: "Rain", 55: "Heavy Rain",
        61: "Rain", 63: "Rain", 65: "Heavy Rain",
        71: "Snow", 73: "Snow", 75: "Heavy Snow",
        95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
    };
    return weather[code] || "Unknown Conditions";
}

navigator.geolocation.getCurrentPosition(
    async function(position) {
        try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
            );
            const data = await response.json();
            const temp = data.current.temperature_2m;
            const code = data.current.weather_code;

            temperatureText.textContent = `${Math.round(temp)}°C`;
            weatherText.textContent = getWeatherName(code);
        } catch (err) {
            weatherText.textContent = "Weather Unavailable";
        }
    },
    function() {
        weatherText.textContent = "Location Blocked";
    }
);