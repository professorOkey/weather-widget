const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fry", "Sat"];
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const locationContainer = document.querySelector(".location-container");
const dateNameTarget = document.querySelector(".date-dayname");
const fullDateTarget = document.querySelector(".date-day");
const cityAndCountryTarget = document.querySelector(".location");
const weatherIconsTarget = document.querySelectorAll(".weather-icon");
const titleTemperatureTarget = document.querySelector(".weather-temp");
const titleDescriptionTarget = document.querySelector(".weather-desc");
const dayNameShort = document.querySelectorAll(".day-name");
const feelsLikeTarget = document.querySelector(".feelsLikeValue");
const humidityTarget = document.querySelector(".humidityValue");
const windSpeedTarget = document.querySelector(".windSpeedValue");
const changeLocationButton = document.querySelector(".location-button");
const APP_ID = "9541b46bb2d74d82d21ae02660c56c36";
const API_URL = "https://api.openweathermap.org/";

async function fetchToWeather(lat, lon) {
  let response = await fetch(
    `${API_URL}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}`
  );
  let data = await response.json();
  const city = data.name;
  const countryTag = data.sys.country;
  const date = new Date(data.dt * 1000);
  const dayOfTheWeek = days[date.getDay()];
  // const dayOfTheWeekShorted = shortDays[date.getDay()]
  const fullDate =
    date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear();
  const temperature = Math.floor(data.main.temp - 273) + "°C";
  const temperatureFeels = Math.floor(data.main.feels_like - 273) + "°C";
  let weatherDescription = data.weather[0].main;
  const windSpeed = data.wind.speed + " " + "m/s";
  const humidity = data.main.humidity + " " + "%";

  dataTransfer(
    city,
    countryTag,
    fullDate,
    dayOfTheWeek,
    date,
    temperature,
    weatherDescription,
    windSpeed,
    humidity,
    temperatureFeels
  );
}

function dataTransfer(
  city,
  countryTag,
  fullDate,
  dayOfTheWeek,
  date,
  temperature,
  weatherDescription,
  windSpeed,
  humidity,
  temperatureFeels
) {
  dateNameTarget.innerText = dayOfTheWeek;
  fullDateTarget.innerText = fullDate;
  cityAndCountryTarget.innerText = `${city}, ${countryTag}`;
  titleTemperatureTarget.innerText = temperature;
  titleDescriptionTarget.innerText = weatherDescription;
  feelsLikeTarget.innerText = temperatureFeels;
  humidityTarget.innerText = humidity;
  windSpeedTarget.innerText = windSpeed;

  weatherIconsTarget.forEach((icon) => {
    weatherDescription == "Clouds" ? (icon.src = "/img/Clouds.svg") : "";
    weatherDescription == "Rain" ? (icon.src = "/img/Rain.svg") : "";
    weatherDescription == "Snow" ? (icon.src = "/img/Snow.svg") : "";
    weatherDescription == "Clear" ? (icon.src = "/img/Sunny.svg") : "";
  });
}

function buildInput() {
  locationContainer.insertAdjacentHTML(
    "beforeend",
    `
    <div class='input'>
    <input type='text' class='city-input' placeholder='enter the city you need'>
    <input type='submit' class='submit-button' value='Choose location'>
    </div>
    `
  );
  changeLocationButton.removeEventListener("click", buildInput);
  const submitLocationButton = document.querySelector(".submit-button");
  const cityInput = document.querySelector(".city-input");
  const search = document.querySelector(".input");

  submitLocationButton.addEventListener("click", async function () {
    let response = await fetch(
      `${API_URL}geo/1.0/direct?q=${cityInput.value}&limit=1&appid=${APP_ID}`
    );
    let data = await response.json();
    const cityLat = data[0].lat - 0.01; //50.43 30.52 KYIV "-0.02 погрешность сервера"
    const cityLon = data[0].lon;
    // 47.84 33.20 KRYVYI RIH
    fetchToWeather(cityLat, cityLon);
    locationContainer.removeChild(search);
    changeLocationButton.addEventListener("click", buildInput);
  });
}

changeLocationButton.addEventListener("click", buildInput);

// для первой загрузки => дефолтный контент
fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=47.84&lon=33.20&appid=9541b46bb2d74d82d21ae02660c56c36`
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const city = data.name;
    const countryTag = data.sys.country;
    const date = new Date(data.dt * 1000);
    const dayOfTheWeek = days[date.getDay()];
    const dayOfTheWeekShorted = shortDays[date.getDay()];
    const fullDate =
      date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear();
    const temperature = Math.floor(data.main.temp - 273) + "°C";
    const temperatureFeels = Math.floor(data.main.feels_like - 273) + "°C";
    let weatherDescription = data.weather[0].main;
    const windSpeed = data.wind.speed + " " + "m/s";
    const humidity = data.main.humidity + " " + "%";

    dataTransfer(
      city,
      countryTag,
      fullDate,
      dayOfTheWeek,
      dayOfTheWeekShorted,
      temperature,
      weatherDescription,
      windSpeed,
      humidity,
      temperatureFeels
    );
  });
