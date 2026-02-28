const form = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const statusEl = document.querySelector("#status");
const cardEl = document.querySelector("#card");


const API_KEY = "63fcbfa56ffa7355cca8a7468436fecd";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
  return res.json();
}

async function getCoordsByCity(city) {
  const url =
    `https://api.openweathermap.org/geo/1.0/direct` +
    `?q=${encodeURIComponent(city)}` +
    `&limit=1` +
    `&appid=${API_KEY}`;

  const results = await fetchJSON(url);
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No encontré esa ciudad. Prueba con 'Ciudad, CO' o 'Ciudad, ES'.");
  }
  return results[0];
}

async function getCurrentWeather(lat, lon) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${lat}&lon=${lon}` +
    `&appid=${API_KEY}` +
    `&units=metric` +
    `&lang=es`;

  return fetchJSON(url);
}

function renderWeather(location, weather) {
  const desc = weather.weather?.[0]?.description ?? "—";
  const temp = weather.main?.temp;
  const feels = weather.main?.feels_like;
  const hum = weather.main?.humidity;
  const wind = weather.wind?.speed;

  cardEl.innerHTML = `
    <div class="small">
      <b>${location.name}</b>${location.state ? `, ${location.state}` : ""} (${location.country})
    </div>
    <div class="big">${temp?.toFixed?.(1) ?? temp} °C</div>
    <div class="small">Sensación térmica: ${feels?.toFixed?.(1) ?? feels} °C</div>
    <div class="small">Descripción: ${desc}</div>
    <div class="small">Humedad: ${hum}% · Viento: ${wind} m/s</div>
  `;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const city = cityInput.value.trim();
    if (!API_KEY || API_KEY.includes("PON_AQUI")) {
      throw new Error("Te falta pegar tu API_KEY en app.js");
    }
    if (!city) return;

    statusEl.textContent = "Buscando ciudad...";
    cardEl.innerHTML = "";

    const location = await getCoordsByCity(city);

    statusEl.textContent = "Consultando clima actual...";
    const weather = await getCurrentWeather(location.lat, location.lon);

    renderWeather(location, weather);
    statusEl.textContent = "Listo ✅";
  } catch (err) {
    statusEl.textContent = `Error: ${err.message}`;
  }
});