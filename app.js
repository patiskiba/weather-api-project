//  https://www.weather.gov/documentation/services-web-api
//  /points/{latitude},{longitude}  -> Returns metadata about a given latitude/longitude point
// /gridpoints/{wfo}/{x},{y}/forecast   -> Returns a textual forecast for a 2.5km grid area



let latitude;
let longitude;
let myCity;
let myState;
let pointData;

const locationStatus = document.getElementById("location-status");
const displayLatitude = document.getElementById("my-latitude");
const displayLongitude = document.getElementById("my-longitude");
const displayCity = document.getElementById("my-city");
const displayState = document.getElementById("my-state");

//! Today section DOM
const todayName = document.getElementById("today-name");
const todayIcon = document.getElementById("today-icon-img");
const todayTempNum = document.getElementById("today-temp-num");
const todayTempUnit = document.getElementById("today-temp-unit");
const todayShortForecast = document.getElementById("today-short-forecast");

//! Week section DOM


//! GET COORDINATES FUNCTION
//! need to wrap the geolocation call in a Promise so we can use await with it in displayCoords().
const findMe = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      locationStatus.textContent = "Geolocation is not supported.";
      reject(new Error("Geolocation is not supported."));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationStatus.textContent = "Success";
          const { latitude, longitude } = position.coords;
          console.log(position.coords);
          resolve({ latitude, longitude });
        },
        (err) => {
          locationStatus.textContent = "Unable to retrieve your location.";
          reject(err);
        }
      );
    }
  });
};

//! DISPLAY COORDINATES
async function displayCoords() {
  try {
    const coords = await findMe(); // Wait for geolocation result from findMe function
    latitude = coords.latitude;
    longitude = coords.longitude;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    // Display
    displayLatitude.textContent = latitude
    displayLongitude.textContent = longitude
  } catch (error) {
    console.error("Geolocation error:", error.message);
  }
}

//! GET LOCATION METADATA (using coordinates) /points/{latitude},{longitude}  -> Returns metadata about a given latitude/longitude point
async function getLocationMetadata() {
  try {
    const coords = await findMe(); // Wait for geolocation result from findMe function
    latitude = coords.latitude;
    longitude = coords.longitude;
    let metadataURL = `https://api.weather.gov/points/${latitude},${longitude}`;
    await fetch(metadataURL)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        forecastEndpoint = data.properties.forecast;
        console.log("forecast data found at: ", forecastEndpoint);
        myCity = data.properties.relativeLocation.properties.city;
        myState = data.properties.relativeLocation.properties.state;
        console.log(myCity, myState);
      })
      .catch(error => {
        console.log("Could not fetch weather API data: ", error)
      });

  } catch (error) {
    console.log("Weather API error: ", error.message);
  }
};

//! GET WEATHER DATA 
//? required endpoint URL from getLocationMetadata
//? endpoint URL matches this format: /gridpoints/{wfo}/{x},{y}/forecast 
async function getWeatherData() {
  try {
    await getLocationMetadata();
    const response = await fetch(forecastEndpoint);
    const data = await response.json();
    const forecastObjects = data.properties.periods;
    console.log(forecastObjects);
    return forecastObjects;
  } catch (error) {
    console.log("Weather API error: ", error,message)
  }
};

//! DISPLAY LOCATION METADATA
async function displayLocationMetadata() {
  await getLocationMetadata();
  displayCity.textContent = myCity;
  displayState.textContent = myState;
};

//! DISPLAY WEATHER DATA
async function displayWeatherData() {
  let weatherData = await getWeatherData();
  // Today's weather information always at index 0
  let todaysForecast = weatherData[0];
  console.log("Today's data: ", todaysForecast);
  // Week's information
  let weeksForecast = [];
  for (let i = 2; i < weatherData.length; i+=2) {
    weeksForecast.push(weatherData[i]);
  }
  console.log("Week's data: ", weeksForecast);
  // Display:
  //? each day: name, icon, temperature, temperatureUnit, shortForecast, 
  todayName.textContent = todaysForecast.name;
  todayIcon.src = todaysForecast.icon;
  todayTempNum.textContent = todaysForecast.temperature;
  todayTempUnit.textContent = todaysForecast.temperatureUnit;
  todayShortForecast.textContent = todaysForecast.shortForecast;
};

displayCoords();

displayLocationMetadata();
displayWeatherData();
