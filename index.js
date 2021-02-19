console.log('JS is ready!');
const citySelector = document.getElementById('city-select');
const okBtn = document.getElementById('okBtn');
const weatherDescription = document.getElementById('weather-description');
const iconWrapper = document.getElementById('icon-wrapper');
let icon = document.getElementById('icon');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const tempInterval = document.getElementById('temp-interval');
const humidity = document.getElementById('humidity');
const tempFeels = document.getElementById('temp-feels');
const html = document.querySelector('html');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const plusBtn = document.getElementById('plusBtn');
const overlaySelectPanel = document.getElementById('overlay_select');
const minunBtn = document.getElementById('minunBtn');


const state = { //stato interno applicazione
  config: {
    api_key: 'f374d6e877e628652593bde3efc47541',
    base_Url: 'https://api.openweathermap.org/data/2.5/weather?q='
  },
  forecast: null
}

function utilityFilterJson(item) {
  return {
    name: item.name,
    temp: parseInt(item.main.temp),
    temp_max: parseInt(item.main.temp_max),
    temp_min: parseInt(item.main.temp_min),
    temp_feels: parseInt(item.main.feels_like),
    humidity: item.main.humidity,
    weather: item.weather[0].description,
    weather_id: item.weather[0].id,
    weather_icon: item.weather[0].icon,
    icon: null,
    wind: item.wind.speed,
    pressure: item.main.pressure,
    sunrise: item.sys.sunrise,
    sunset: item.sys.sunset
  }
}
function convertMsToTime(millisecond) {
  let date = new Date(millisecond * 1000);
  value = new Intl.DateTimeFormat('it-IT', { timeStyle: 'short' }).format(date)
  return value;
}
console.log(convertMsToTime(1613666513));


function colorSwitchMode() {
  let now = new Date();
  // let now = new Date('December 17, 1995 19:24:00');
  hour = now.getHours();
  if (hour > 5 & hour < 18) {
    html.classList.remove('night');
  }
}
// creo una funzione utility per comporre l'URL
function utilityGetUrl(cityName) {
  return `${state.config.base_Url}${cityName}&appid=${state.config.api_key}&units=metric&lang=it`
}



async function loadForecast() {

  const citiesPathName = citySelector.value;
  const cityUrl = utilityGetUrl(citiesPathName);

  try {
    const response = await fetch(cityUrl);

    if (!response.ok) {
      const errorMessage = await response.json();
      throw errorMessage
    }

    const dataJson = await response.json();
    console.log(dataJson);
    state.forecast = utilityFilterJson(dataJson);
    console.log(state);
    renderForecast();
    colorSwitchMode();
  } catch (errorMessage) {
    console.error(errorMessage);
  }
}
function renderForecast() {

  //state.forecast.weather[0].toUpperCase();
  weatherDescription.textContent = state.forecast.weather;

  cityName.textContent = state.forecast.name;
  temperature.textContent = `${state.forecast.temp}°`;

  tempInterval.textContent = `${state.forecast.temp_max}°/${state.forecast.temp_min}°`;

  humidity.textContent = `${state.forecast.humidity}%`;
  tempFeels.textContent = `${state.forecast.temp_feels}`;

  wind.textContent = `${state.forecast.wind} m/s`;
  pressure.textContent = `${state.forecast.pressure} hPa`

  sunrise.textContent = convertMsToTime(state.forecast.sunrise);
  sunset.textContent = convertMsToTime(state.forecast.sunset);

  // state.forecast.icon = `http://openweathermap.org/img/wn/${state.forecast.weather_icon}@2x.png`;
  state.forecast.icon = `300ppi/${state.forecast.weather_icon}.png`;
  iconWrapper.classList.add('forecast-icon');
  if (state.forecast.icon) {
    //const forecastImage = document.createElement("img");
    icon.classList.add('icon-image');
    icon.src = state.forecast.icon;
    //iconWrapper.appendChild(forecastImage);
  } else {
    iconWrapper.classList.add('no-icon');
  }

}
function showCityPanel() {
  overlaySelectPanel.classList.toggle('no_opacity');
  setTimeout(() => {
    overlaySelectPanel.classList.toggle('overlay__is-visible')
  }, 0);
}
function hideCityPanel() {
  overlaySelectPanel.classList.toggle('overlay__is-visible')
  setTimeout(() => {
    overlaySelectPanel.classList.toggle('no_opacity');
  }, 500);
  loadForecast();
}


okBtn.addEventListener('click', hideCityPanel);
document.addEventListener('DOMContentLoaded', loadForecast, { once: true });
plusBtn.addEventListener('click', showCityPanel);
minunBtn.addEventListener('click', hideCityPanel);