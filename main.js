const city = document.querySelector("#city");
const form = document.querySelector("form");
const searchBtn = document.querySelector("button");
const errorMsg = document.querySelector("#error-msg");
const errorText = document.querySelector("#error-text");

// ─── UI Utilities ─────────────────────────────────────────────────────────────

/**
 * The above functions handle showing and clearing error messages, as well as setting loading state for
 * a search button in a JavaScript application.
 * @param message - The `message` parameter is a string that represents the error message to be
 * displayed to the user.
 */
function showError(message) {
  errorText.textContent = message;
  errorMsg.classList.remove("hidden");
}

function clearError() {
  errorMsg.classList.add("hidden");
  errorText.textContent = "";
}

function setLoading(isLoading) {
  if (isLoading) {
    searchBtn.classList.add("loading");
    searchBtn.disabled = true;
  } else {
    searchBtn.classList.remove("loading");
    searchBtn.disabled = false;
  }
}

// ─── Initialisation ───────────────────────────────────────────────────────────

/* The code snippet `window.addEventListener("load", () => { ... });` is adding an event listener to
the `load` event of the `window` object. When the window has finished loading (i.e., when all
resources on the page have been loaded), the callback function inside the event listener is
executed. */
window.addEventListener("load", () => {
  const defaultCity = "Dhaka";
  document.querySelector("#curr-city").textContent = defaultCity;
  findLocation(defaultCity);
});

// ─── Search Form ──────────────────────────────────────────────────────────────

/* This code snippet is adding an event listener to the form element for the `submit` event. When the
form is submitted (e.g., by clicking a submit button), the following actions are taken: */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const query = city.value.trim();

  if (!query) {
    showError("Please enter a city name.");
    return;
  }

  clearError();
  findLocation(query);
  form.reset();
});

// ─── API: Geocoding ───────────────────────────────────────────────────────────

/**
 * The function `findLocation` asynchronously fetches the geolocation data for a given city using the
 * OpenWeatherMap API and handles errors accordingly.
 * @param city - The `findLocation` function is an asynchronous function that takes a `city` parameter
 * as input. This function is responsible for fetching the geolocation data for the specified city
 * using the OpenWeatherMap API. Here's a breakdown of the function:
 * @returns The `findLocation` function is returning a Promise.
 */
async function findLocation(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c00ffc5e5041e452338f7b030ce4b484`;

  setLoading(true);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error (${response.status})`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      showError(
        `City "${city}" not found. Please check the spelling and try again.`,
      );
      return;
    }

    document.querySelector("#curr-city").textContent = city;
    await findWeather(data[0].lat, data[0].lon);
  } catch (error) {
    if (error instanceof TypeError) {
      showError("Network error. Please check your internet connection.");
    } else {
      showError(error.message || "Failed to find location. Please try again.");
    }
    console.error("[findLocation]", error);
  } finally {
    setLoading(false);
  }
}

// ─── API: Weather ─────────────────────────────────────────────────────────────

/**
 * The function `findWeather` fetches weather data based on latitude and longitude coordinates and
 * updates the webpage with the current, hourly, and daily forecast.
 * @param lat - Latitude of the location for which weather data is being requested.
 * @param lon - Longitude is a geographic coordinate that specifies the east-west position of a point
 * on the Earth's surface. It is measured in degrees, with values ranging from -180 to 180.
 */
async function findWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&hourly=temperature_2m,weather_code,precipitation_probability,precipitation&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,weather_code,apparent_temperature&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error (${response.status})`);
    }

    const data = await response.json();

    if (data.current.is_day === 0) {
      document.body.classList.add("night");
    } else {
      document.body.classList.remove("night");
    }

    fillCurrentWeather(data);
    fillHourForcast(data);
    fillDailyForecase(data);
  } catch (error) {
    if (error instanceof TypeError) {
      showError("Network error. Please check your internet connection.");
    } else {
      showError(
        error.message || "Failed to load weather data. Please try again.",
      );
    }
    console.error("[findWeather]", error);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * The above JavaScript functions provide weather information based on weather code and UV index risk
 * level.
 * @param code - The `code` parameter in the `getWeatherInfo` function represents the weather condition
 * code that is used to determine the weather icon, color, and description for a specific weather
 * condition. The code is used to map to different weather conditions such as clear sky, fog, rain,
 * snow, thunderstorm
 * @param isDay - The `isDay` parameter in the `getWeatherInfo` function is a boolean value that
 * indicates whether it is daytime or nighttime. It is used to determine the appropriate weather icon
 * for the given weather condition. If `isDay` is `true`, daytime weather icons are displayed;
 * otherwise, nighttime
 * @returns The `getWeatherInfo` function returns an object with properties `icon`, `color`, and
 * `description` based on the weather `code` and whether it is day or night. The `getUVRiskAndColor`
 * function returns an object with properties `risk` and `color` based on the UV index provided as
 * input.
 */
function getWeatherInfo(code, isDay) {
  let icon = "❓";
  let color = "#546E7A";
  let description = "Unknown";

  if (code === 0) icon = isDay ? "☀️" : "🌙";
  else if (code === 1 || code === 2) icon = isDay ? "🌤️" : "🌥️";
  else if (code === 3) icon = "☁️";
  else if (code === 45 || code === 48) icon = "🌫️";
  else if (code >= 51 && code <= 55) icon = "🌦️";
  else if (code >= 61 && code <= 65) icon = isDay ? "🌦️" : "🌧️";
  else if (code >= 71 && code <= 75) icon = "❄️";
  else if (code >= 80 && code <= 82) icon = "🌦️";
  else if (code >= 85 && code <= 86) icon = "❄️";
  else if (code >= 95) icon = "⛈️";

  if (code === 0) color = "#FFC107";
  else if (code === 1) color = "#FFD54F";
  else if (code === 2) color = "#B0BEC5";
  else if (code === 3) color = "#90A4AE";
  else if (code === 45 || code === 48) color = "#B0BEC5";
  else if (code >= 51 && code <= 57) color = "#4FC3F7";
  else if (code >= 71 && code <= 77) color = "#B3E5FC";
  else if (code >= 85 && code <= 86) color = "#81D4FA";
  else if (code >= 61 && code <= 67) color = "#2196F3";
  else if (code >= 80 && code <= 82) color = "#1E88E5";
  else if (code >= 95 && code <= 99) color = "#7E57C2";

  const weatherMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    61: "Rain",
    71: "Snow",
    80: "Rain showers",
    95: "Thunderstorm",
  };
  description = weatherMap[code] || "Unknown";

  return { icon, color, description };
}

function getUVRiskAndColor(uv) {
  if (uv <= 2) return { risk: "Low", color: "green" };
  if (uv <= 5) return { risk: "Moderate", color: "yellow" };
  if (uv <= 7) return { risk: "High", color: "orange" };
  if (uv <= 10) return { risk: "Very High", color: "red" };
  return { risk: "Extreme", color: "purple" };
}

// ─── Renderers ────────────────────────────────────────────────────────────────

/**
 * The function `fillCurrentWeather` populates the current weather information on a webpage using data
 * retrieved from an API.
 * @param data - The `data` parameter in the `fillCurrentWeather` function seems to contain weather
 * information fetched from an API. It includes various properties such as current weather code,
 * temperature, humidity, UV index, wind speed, and other related data points. The function then
 * extracts specific data from the `data`
 */
function fillCurrentWeather(data) {
  const currIcon = document.querySelector("#curr-icon");
  const description = document.querySelector("#des");
  const currTemp = document.querySelector("#curr-temp");
  const feels = document.querySelector("#feels");
  const humidity = document.querySelector("#humidity");
  const uv = document.querySelector("#uv");
  const risk = document.querySelector(".risk");
  const wind = document.querySelector("#wind");

  const code = data.current.weather_code;
  const day = data.current.is_day;

  const weatherInfo = getWeatherInfo(code, day);
  currIcon.textContent = weatherInfo.icon;
  currIcon.style.color = weatherInfo.color;
  description.textContent = weatherInfo.description;
  currTemp.textContent = Math.round(data.current.temperature_2m);
  feels.textContent = Math.round(data.current.apparent_temperature);
  humidity.textContent = Math.round(data.current.relative_humidity_2m);
  wind.textContent = data.current.wind_speed_10m;

  const todayUv = getUVRiskAndColor(data.daily.uv_index_max[0]);
  uv.textContent = Math.round(data.daily.uv_index_max[0]);
  risk.textContent = todayUv.risk;
  risk.style.color = todayUv.color;
}

/**
 * The function `fillHourForcast` populates an hourly weather forecast section on a webpage using data
 * provided.
 * @param data - The `fillHourForcast` function takes in a `data` object as a parameter. This `data`
 * object likely contains information about the current weather conditions and hourly forecast data.
 * The function uses this data to populate an hourly forecast section on a webpage.
 * @returns The function `fillHourForcast` is returning the hourly forecast data for the next 25 hours
 * based on the input data provided. It populates the hourly forecast section on a webpage with
 * information such as time, temperature, weather icon, precipitation probability, and precipitation
 * amount for each hour.
 */
function fillHourForcast(data) {
  const template = document.querySelector("#hour-templete");
  const parent = document.querySelector("#hourly");

  parent.querySelectorAll(".card-hour").forEach((el) => el.remove());

  const roundedTime = data.current.time.slice(0, 13) + ":00";
  const startIndex = data.hourly.time.findIndex((t) => t === roundedTime);

  if (startIndex === -1) {
    console.error(
      "[fillHourForcast] Could not match current time:",
      roundedTime,
    );
    showError("Could not render hourly forecast. Please try again.");
    return;
  }

  const endIndex = Math.min(startIndex + 25, data.hourly.time.length);

  for (let i = startIndex; i < endIndex; i++) {
    const clone = template.content.cloneNode(true);
    const time = clone.querySelector(".time");
    const icon = clone.querySelector(".hour-icon");
    const temp = clone.querySelector("#hourly-temp");
    const probability = clone.querySelector("#pro");
    const sum = clone.querySelector("#rainmm");

    const date = new Date(data.hourly.time[i]);
    let hours = parseInt(
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: data.timezone,
      }),
    );

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    time.textContent = i === startIndex ? "Now" : `${hours} ${ampm}`;
    temp.textContent = `${Math.round(data.hourly.temperature_2m[i])}`;
    icon.textContent = getWeatherInfo(data.hourly.weather_code[i], 1).icon;
    probability.textContent = `${data.hourly.precipitation_probability[i]}%`;
    sum.textContent = `${data.hourly.precipitation[i]}mm`;

    parent.appendChild(clone);
  }
}
/**
 * The `fillDailyForecase` function populates a daily weather forecast template with data provided,
 * including day names, weather icons, temperatures, and UV index.
 * @param data - The `fillDailyForecast` function takes a `data` object as a parameter. This `data`
 * object seems to contain daily weather forecast information such as time, weather code, temperature,
 * and UV index for each day. The function uses this data to populate a template with daily weather
 * forecast information and
 */

function fillDailyForecase(data) {
  const template = document.querySelector("#day-templete");
  const parent = document.querySelector("#daily");

  parent.querySelectorAll(".card-day").forEach((el) => el.remove());

  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const maxDay = data.daily.time.length;

  for (let i = 0; i < maxDay; i++) {
    const clone = template.content.cloneNode(true);

    const day = clone.querySelector(".day");
    const icon = clone.querySelector(".day-icon");
    const max = clone.querySelector("#max");
    const min = clone.querySelector("#min");
    const uv = clone.querySelector(".uv");

    const [year, month, dayNum] = data.daily.time[i].split("-").map(Number);
    const days = new Date(year, month - 1, dayNum).getDay();

    day.textContent = dayName[days];
    icon.textContent = getWeatherInfo(data.daily.weather_code[i], 1).icon;
    max.textContent = Math.round(data.daily.temperature_2m_max[i]);
    min.textContent = Math.round(data.daily.temperature_2m_min[i]);
    uv.textContent = `UV Index: ${data.daily.uv_index_max[i]}`;

    parent.append(clone);
  }
}

/* The above code is importing the `inject` function from the `@vercel/analytics` package and then
calling the `inject` function. The purpose of the `inject` function is to inject analytics tracking
code into the current webpage. */
import { inject } from "@vercel/analytics";

inject();
