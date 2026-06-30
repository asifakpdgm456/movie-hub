// OpenWeatherMap API Configuration
const API_KEY = 'a54c58d6e01d04bf9a7cc8ce1f3b1d3d'; // Free tier API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0';

// State Management
let state = {
  city: 'London',
  lat: 51.5074,
  lon: -0.1278,
  units: 'metric',
  isDarkMode: false,
  weatherData: null,
  forecastData: null,
  hourlyData: null,
  alerts: []
};

// DOM Elements
const elements = {
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  geoBtn: document.getElementById('geoBtn'),
  themeToggle: document.getElementById('themeToggle'),
  unitsToggle: document.getElementById('unitsToggle'),
  cityName: document.getElementById('cityName'),
  dateTime: document.getElementById('dateTime'),
  temperature: document.getElementById('temperature'),
  weatherIcon: document.getElementById('weatherIcon'),
  weatherDescription: document.getElementById('weatherDescription'),
  feelsLike: document.getElementById('feelsLike'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('windSpeed'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  uvIndex: document.getElementById('uvIndex'),
  precipitation: document.getElementById('precipitation'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  moonrise: document.getElementById('moonrise'),
  moonset: document.getElementById('moonset'),
  forecastCards: document.getElementById('forecastCards'),
  hourlyCards: document.getElementById('hourlyCards'),
  alertsContainer: document.getElementById('alertsContainer'),
  navLinks: document.querySelectorAll('.nav-link'),
  views: document.querySelectorAll('.view')
};

// Initialize
window.addEventListener('load', () => {
  loadTheme();
  fetchWeatherData();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  elements.searchBtn.addEventListener('click', handleSearch);
  elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  elements.geoBtn.addEventListener('click', getGeolocation);
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.unitsToggle.addEventListener('click', toggleUnits);
  
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(e.target.closest('.nav-link').dataset.view);
    });
  });
}

// Search Handler
async function handleSearch() {
  const query = elements.searchInput.value.trim();
  if (!query) return;
  
  try {
    const response = await axios.get(`${GEOCODING_URL}/direct?q=${query}&limit=1&appid=${API_KEY}`);
    if (response.data.length > 0) {
      const { lat, lon, name } = response.data[0];
      state.lat = lat;
      state.lon = lon;
      state.city = name;
      fetchWeatherData();
      elements.searchInput.value = '';
    } else {
      alert('City not found');
    }
  } catch (error) {
    console.error('Search error:', error);
    alert('Error searching for city');
  }
}

// Geolocation
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      state.lat = position.coords.latitude;
      state.lon = position.coords.longitude;
      fetchWeatherData();
      showNotification('Location found!');
    }, (error) => {
      console.error('Geolocation error:', error);
      alert('Error getting your location');
    });
  } else {
    alert('Geolocation not supported');
  }
}

// Fetch Weather Data
async function fetchWeatherData() {
  try {
    // Current weather
    const currentResponse = await axios.get(
      `${BASE_URL}/weather?lat=${state.lat}&lon=${state.lon}&units=${state.units}&appid=${API_KEY}`
    );
    state.weatherData = currentResponse.data;
    
    // Forecast (5 day)
    const forecastResponse = await axios.get(
      `${FORECAST_URL}?lat=${state.lat}&lon=${state.lon}&units=${state.units}&appid=${API_KEY}`
    );
    state.forecastData = forecastResponse.data;
    
    // Update city name if not already set by search
    if (!state.city || state.city === 'London') {
      state.city = currentResponse.data.name;
    }
    
    updateCurrentWeather();
    updateForecast();
    updateHourly();
  } catch (error) {
    console.error('Weather fetch error:', error);
    showNotification('Error fetching weather data', 'error');
  }
}

// Update Current Weather Display
function updateCurrentWeather() {
  const data = state.weatherData;
  const unit = state.units === 'metric' ? 'C' : 'F';
  
  elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
  elements.dateTime.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  elements.temperature.textContent = Math.round(data.main.temp);
  elements.weatherDescription.textContent = data.weather[0].main;
  elements.feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°${unit}`;
  
  elements.humidity.textContent = `${data.main.humidity}%`;
  elements.windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
  elements.pressure.textContent = `${data.main.pressure} mb`;
  elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
  elements.precipitation.textContent = `${(data.rain?.['1h'] || 0).toFixed(1)} mm`;
  elements.uvIndex.textContent = 'N/A'; // Requires separate API call
  
  elements.sunrise.textContent = formatTime(data.sys.sunrise);
  elements.sunset.textContent = formatTime(data.sys.sunset);
  elements.moonrise.textContent = 'N/A';
  elements.moonset.textContent = 'N/A';
  
  updateWeatherIcon(data.weather[0].main);
}

// Update Weather Icon
function updateWeatherIcon(condition) {
  const iconMap = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-rain',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Smoke': 'fas fa-smog',
    'Haze': 'fas fa-eye',
    'Dust': 'fas fa-wind',
    'Fog': 'fas fa-smog',
    'Sand': 'fas fa-wind',
    'Ash': 'fas fa-smog',
    'Squall': 'fas fa-wind',
    'Tornado': 'fas fa-tornado'
  };
  
  const icon = iconMap[condition] || 'fas fa-cloud';
  elements.weatherIcon.className = icon;
}

// Update Forecast
function updateForecast() {
  elements.forecastCards.innerHTML = '';
  const forecastList = state.forecastData.list;
  const dailyData = {};
  
  // Group by date
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });
  
  // Get one forecast per day (noon)
  let count = 0;
  Object.keys(dailyData).forEach(date => {
    if (count >= 7) return;
    const dayData = dailyData[date];
    const noonData = dayData.find(d => new Date(d.dt * 1000).getHours() === 12) || dayData[0];
    
    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    const dayName = new Date(noonData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    
    forecastCard.innerHTML = `
      <div class="day">${dayName}</div>
      <div class="icon">${getWeatherEmoji(noonData.weather[0].main)}</div>
      <div class="temp-range">
        <span class="max-temp">${Math.round(noonData.main.temp_max)}°</span>
        <span class="min-temp">${Math.round(noonData.main.temp_min)}°</span>
      </div>
      <div class="condition">${noonData.weather[0].main}</div>
    `;
    
    elements.forecastCards.appendChild(forecastCard);
    count++;
  });
}

// Update Hourly
function updateHourly() {
  elements.hourlyCards.innerHTML = '';
  const hourlyList = state.forecastData.list.slice(0, 8); // First 8 items (24 hours)
  
  hourlyList.forEach(item => {
    const hourCard = document.createElement('div');
    hourCard.className = 'hourly-card';
    const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    hourCard.innerHTML = `
      <div class="time">${time}</div>
      <div class="icon">${getWeatherEmoji(item.weather[0].main)}</div>
      <div class="temp">${Math.round(item.main.temp)}°</div>
    `;
    
    elements.hourlyCards.appendChild(hourCard);
  });
}

// Get Weather Emoji
function getWeatherEmoji(condition) {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '💨',
    'Haze': '🌫️',
    'Dust': '💨',
    'Fog': '🌫️',
    'Sand': '💨',
    'Ash': '💨',
    'Squall': '💨',
    'Tornado': '🌪️'
  };
  
  return emojiMap[condition] || '🌤️';
}

// Toggle Theme
function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  document.body.classList.toggle('dark-mode');
  elements.themeToggle.innerHTML = state.isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
}

// Load Theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    state.isDarkMode = true;
    document.body.classList.add('dark-mode');
    elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Toggle Units
function toggleUnits() {
  state.units = state.units === 'metric' ? 'imperial' : 'metric';
  elements.unitsToggle.textContent = state.units === 'metric' ? '°C' : '°F';
  fetchWeatherData();
}

// Switch View
function switchView(viewName) {
  elements.views.forEach(v => v.classList.remove('active'));
  elements.navLinks.forEach(l => l.classList.remove('active'));
  
  document.getElementById(`${viewName}View`).classList.add('active');
  document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
}

// Format Time
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Show Notification
function showNotification(message, type = 'success') {
  console.log(`${type}: ${message}`);
  // You can enhance this with a toast notification library
}

// Initial data fetch
function initializeApp() {
  console.log('Weather Dashboard Initialized');
}