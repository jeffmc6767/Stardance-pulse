function updateClock() {

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    document.getElementById("time").textContent =
        `${hours}:${minutes}`;

    document.getElementById("date").textContent =
        now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
}

setInterval(updateClock, 1000);
updateClock();

const weatherText = document.getElementById("weather");
const temperatureText = document.getElementById("temperature");
const locationText = document.getElementById("location");


function getWeatherName(code) {

    const weather = {

        0: "Clear Sky ☀️",
        1: "Mostly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Cloudy ☁️",

        45: "Fog 🌫️",
        48: "Fog 🌫️",

        51: "Light Rain 🌧️",
        53: "Rain 🌧️",
        55: "Heavy Rain 🌧️",

        61: "Rain 🌧️",
        63: "Rain 🌧️",
        65: "Heavy Rain 🌧️",

        71: "Snow ❄️",
        73: "Snow ❄️",
        75: "Heavy Snow ❄️",

        95: "Thunderstorm ⛈️",
        96: "Thunderstorm ⛈️",
        99: "Thunderstorm ⛈️"

    };

    return weather[code] || "Unknown";
}

function changeBackground(code) {

    const background =
        document.getElementById("background");


    background.className = "";


    if (
        code >= 51 &&
        code <= 67 ||
        code >= 80 &&
        code <= 82
    ) {

        background.classList.add("rainy");

        createRain();

    }


    else if (
        code >= 71 &&
        code <= 77
    ) {

        background.classList.add("snowy");

    }

    else if (
        code >= 2 &&
        code <= 3
    ) {

        background.classList.add("cloudy");

    }

    else {

        const hour = new Date().getHours();

        if(hour >= 20 || hour < 6){

            background.classList.add("night");

        }

        else{

            background.classList.add("sunny");
        }
    }
}


function createRain(){

    const rain =
        document.getElementById("rain");

    rain.innerHTML = "";

    for(let i = 0; i < 100; i++){
        let drop =
            document.createElement("div");

        drop.className="drop";

        drop.style.left =
            Math.random()*100+"%";

        drop.style.animationDuration =
            (0.5 + Math.random())+"s";

        drop.style.animationDelay =
            Math.random()*2+"s";

        rain.appendChild(drop);
    }
}

navigator.geolocation.getCurrentPosition(

    async function(position){

        const lat =
            position.coords.latitude x
        const lon =
            position.coords.longitude;

        const response =
        await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );


        const data =
            await response.json();

        const temp =
            data.current.temperature_2m;
        const code =
            data.current.weather_code;

        temperatureText.textContent =
            `${Math.round(temp)}°C`;

        weatherText.textContent =
            getWeatherName(code);


        locationText.textContent =
            "Your Location";

        changeBackground(code);
    },


    function(){
        locationText.textContent =
            "Location blocked";

        weatherText.textContent =
            "Enable location for weather";
    }
);