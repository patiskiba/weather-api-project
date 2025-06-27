//  https://www.weather.gov/documentation/services-web-api
//  /points/{latitude},{longitude}  -> Returns metadata about a given latitude/longitude point
// /gridpoints/{wfo}/{x},{y}/forecast   -> Returns a textual forecast for a 2.5km grid area

//TODO  Display current location info using geolocation API
//TODO  Display current location's (current) weather forecast
//TODO  Display current location's (week) weather forecast
//TODO  Take user location

let latitude;
let longitude;

const locationStatus = document.getElementById("location-status");
const myLatitude = document.getElementById("my-latitude");
const myLongitude = document.getElementById("my-longitude");
const myCity = document.getElementById("my-city");


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
    const coords = await findMe(); // Wait for geolocation result
    latitude = coords.latitude;
    longitude = coords.longitude;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    // Optional: Display in your HTML elements
    myLatitude.textContent = latitude
    myLongitude.textContent = longitude
  } catch (error) {
    console.error("Geolocation error:", error.message);
  }
}


displayCoords();
