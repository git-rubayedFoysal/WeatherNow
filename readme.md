# WeatherNow ⛅

A clean, responsive weather web app that shows real-time current conditions, hourly forecast, and a 7-day daily forecast for any city in the world.

🔗 **Live Demo:** [https://wxnow-weather.vercel.app/](https://wxnow-weather.vercel.app/)

---

## 📸 Preview

> Search any city → get live weather data with day/night mode, hourly strips, and a 7-day forecast panel.

---

## 🌐 Live APIs

| API | Purpose |
|---|---|
| [OpenWeatherMap Geocoding](https://openweathermap.org/api/geocoding-api) | Convert city name → latitude & longitude |
| [Open-Meteo](https://open-meteo.com/) | Fetch weather data (free, no key required) |

---

## ✨ Features

- 🔍 **City search** — type any city name and get instant weather data
- 🌡️ **Current conditions** — temperature, feels like, humidity, wind speed, UV index
- 🕐 **Hourly forecast** — next 24 hours with precipitation probability and rainfall
- 📅 **7-day forecast** — daily high/low temperatures, weather icon, UV index
- 🌙 **Auto day/night mode** — switches based on the searched city's local time using `is_day` from the API
- ⚠️ **Error handling** — user-friendly messages for invalid city, network failure, empty input
- ⏳ **Loading state** — search button disables while fetching
- 📱 **Responsive** — desktop-first layout, adapts at 1024px (tablet) and 600px (mobile)

---

## 🗂️ Project Structure

```
WeatherNow/
├── index.html      # App markup and template elements
├── style.css       # Glassmorphism UI, day/night mode, responsive breakpoints
└── main.js         # All API calls, DOM rendering, error handling
```

---

## ⚙️ How It Works

```
User types city name
        ↓
findLocation(city)
  → OpenWeatherMap Geocoding API
  → returns { lat, lon }
        ↓
findWeather(lat, lon)
  → Open-Meteo Forecast API
  → returns current + hourly + daily data
        ↓
fillCurrentWeather(data)   → left panel
fillHourForcast(data)      → hourly strip
fillDailyForecase(data)    → 7-day cards
```

---

## 🧩 Key Functions

| Function | Description |
|---|---|
| `findLocation(city)` | Geocodes a city name to lat/lon via OpenWeatherMap |
| `findWeather(lat, lon)` | Fetches full forecast from Open-Meteo |
| `fillCurrentWeather(data)` | Renders current conditions panel |
| `fillHourForcast(data)` | Renders next 24-hour forecast strip |
| `fillDailyForecase(data)` | Renders 7-day daily forecast cards |
| `getWeatherInfo(code, isDay)` | Maps WMO weather code → emoji icon, color, description |
| `getUVRiskAndColor(uv)` | Maps UV index → risk label and color |
| `showError(message)` | Displays error banner below search form |
| `setLoading(bool)` | Disables/enables search button during fetch |

---

## 🐛 Bugs Fixed During Development

| # | Bug | Fix |
|---|-----|-----|
| 1 | Hourly index used clock hour as array index | Used `findIndex()` to match `current.time` in hourly array |
| 2 | Old cards not cleared on new search | Removed only `.card-hour` / `.card-day`, not `innerHTML` |
| 3 | `innerHTML = ""` destroyed `<template>` tags | Switched to `querySelectorAll().forEach(el => el.remove())` |
| 4 | `findIndex` failed on mid-hour times | Round `current.time` down with `.slice(0, 13) + ":00"` |
| 5 | Daily date off by one day in UTC+6 | Parse date manually with `new Date(year, month-1, day)` |
| 6 | Night mode CSS selector `body.night body` never matched | Fixed to `body.night` |
| 7 | Night mode checked browser hour instead of city's | Used `data.current.is_day` from API |
| 8 | City name updated before API confirmed city exists | Moved `#curr-city` update to after geocoding succeeds |
| 9 | Hardcoded `"London"` flashed on first paint | Changed default to `"Dhaka"` matching JS |
| 10 | Color chain in `getWeatherInfo` had ordering conflict | Reordered `else if` chain to prevent range overlaps |

---

## 🚀 Getting Started

No build tools or dependencies needed. Just open in a browser.

```bash
# Clone or download the project
git clone https://github.com/git-rubayedFoysal/weathernow.git

# Open in browser
open index.html
```

Or simply drag `index.html` into any browser.

---

## 🔑 API Keys

The OpenWeatherMap API key is hardcoded in `main.js` for the geocoding step:

```js
const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=YOUR_API_KEY`;
```

Get a free key at [openweathermap.org](https://openweathermap.org/api). Open-Meteo requires no key.

> ⚠️ **Note:** Never expose API keys in client-side code in production. Use a backend proxy or environment variables instead.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic markup, `<template>` for card cloning |
| CSS3 | Glassmorphism, CSS variables, Grid, Flexbox |
| Vanilla JavaScript | Async/await, Fetch API, DOM manipulation |
| Google Fonts | Outfit + DM Sans |
| Font Awesome | Weather and stat icons |

---

## 👨‍💻 Author

**Rubayed Ahmed Foysal**
GitHub: [@git-rubayedFoysal](https://github.com/git-rubayedFoysal)

---

## 📄 License

MIT — free to use and modify.