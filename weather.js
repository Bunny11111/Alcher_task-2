function askForGeolocationPermission() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert('Geolocation is not supported in this browser.');
    }
  }
  
  function onSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherData(latitude, longitude);
  }
  
  function onError(error) {
    alert('Failed to get user location. Please allow location access to use this feature.');
  }
  
  askForGeolocationPermission();
  
async function getWeatherData(latitude, longitude) {
  const apiKey = '8f52322118b092e434adf65973288a59'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('API Response:', data); 

    if (data && data.main && data.main.temp && data.weather && data.weather.length > 0 && data.weather[0].description) {
    
      updateUI(data);
    } else {
      console.error('Error fetching weather data: Incomplete or unexpected response from API');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateUI(weatherData) {
  const weatherInfoDiv = document.getElementById('weather-info');

  const location = weatherData.name;
  const date = new Date(weatherData.dt * 1000).toDateString();
  const temperature = weatherData.main.temp.toFixed(1);
  const humidity = weatherData.main.humidity;
  const pressure = weatherData.main.pressure;
  const windSpeed = weatherData.wind.speed.toFixed(1);
  const windDirection = weatherData.wind.deg;
  const precipitation = weatherData.rain ? weatherData.rain['1h'] : (weatherData.snow ? weatherData.snow['1h'] : 0);
  const minTemp = weatherData.main.temp_min.toFixed(1);
  const maxTemp = weatherData.main.temp_max.toFixed(1);
  const feelsLike = weatherData.main.feels_like.toFixed(1);
  const visibility = weatherData.visibility / 1000;
  const weatherDescription = weatherData.weather[0].description;
  const uvIndex = weatherData.uvi;

  weatherInfoDiv.innerHTML = `
    <h2>${location}</h2>
    <br>
    <p>${date}</p>
    <p>${temperature}°C</p>
    <br><br>
    <p>Humidity: ${humidity}%</p>
    <p>Pressure: ${pressure} mb</p>
    <p>Wind Speed: ${windSpeed} kph</p>
    <p>Wind Direction: ${getWindDirection(windDirection)}</p>
    <p>Precipitation: ${precipitation} mm</p>
    <p>${minTemp}°/${maxTemp}° Feels like ${feelsLike}°</p>
    <p>Visibility: ${visibility} km</p>
    <p>${weatherDescription}</p>
    <p>UV Index: ${uvIndex}</p>
  `;
}

function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}


