var APIKey = "655eb0423f2259c97a977110605cab13";
var cityName = "";
var geoCode = "";
var queryURLTest = "";
var todaysDate = dayjs().format('DD/MM/YY');

// Variable to select the div which will hold today's forecast
var todaysWeatherBox = document.getElementById('today');

// get the searched value and generate the results
var searchButton = document.getElementById('search-button');
var searchedValue = document.getElementById('search-input');

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  cityName = searchedValue.value;
  console.log(searchedValue.value);
  console.log(cityName);
  getLatLon();
}); 

// Declare variables to hold the lat and lon once retrieved via the geoCode API
var convertLatitude = "";
var convertLongitude = "";

// function to convert Kelvin temperature to Celsius
function kelvinToCelsius (kelvinTemp) {
  return (kelvinTemp - 273.15).toFixed(1);
}

// Use the geocode API to get the long/lat of a searched city name
function getLatLon() { 

  // Query URL for retrieving latitude and longitude
geoCode = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

fetch(geoCode)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {
    console.log(data);
    convertLatitude = data[0].lat;
    convertLongitude = data[0].lon;
    // displayCoords();
    getForecast();
    fiveDayForecast();
  });
}

// test to see the coordinates
// function displayCoords() {
// console.log(convertLatitude);
// console.log(convertLongitude);
// }


function getForecast() {
// test using the weather API to get the forecast, using the derived long/lat above
  queryURLTest = "https://api.openweathermap.org/data/2.5/weather?lat=" + convertLatitude + "&lon=" + convertLongitude + "&appid=" + APIKey;

  todaysWeatherBox.innerHTML = "";

  fetch(queryURLTest)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {
    console.log(data);
    // Display City Name
    var searchedCity = document.createElement('h2')
    searchedCity.textContent = data.name;
    todaysWeatherBox.appendChild(searchedCity);
    // Display today's date
    var dateContainer = document.createElement('p');
    dateContainer.textContent = todaysDate;
    searchedCity.appendChild(dateContainer);
    // Display Weather Icon
    var weatherImage = document.createElement('img');
    var weatherImageCode = data.weather[0].icon;
    var weatherImageURL = "http://openweathermap.org/img/w/" + weatherImageCode + ".png";
    weatherImage.setAttribute('src', weatherImageURL);
    searchedCity.appendChild(weatherImage);
    // Display temp
    var temp = document.createElement('p');
    temp.textContent = "Temperature: " + kelvinToCelsius(data.main.temp) + "°C";
    searchedCity.appendChild(temp);
    // Display wind
    var wind = document.createElement('p');
    wind.textContent = "Wind Speed: " + data.wind.speed + "KPH";
    searchedCity.appendChild(wind);
    // Display humidity 
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    searchedCity.appendChild(humidity);
    todaysWeatherBox.setAttribute('style', 'border: 1px solid black');
    // add button to stored buttons
    // style that button
    // make button repeat the search for that city
    // save button in local storage
    // pull existing buttons from local storage on load

    // create header for 5 day forecast

  });

}

function fiveDayForecast() {
  
  var fiveDayTest = "https://api.openweathermap.org/data/2.5/forecast?lat=" + convertLatitude + "&lon=" + convertLongitude + "&appid=" + APIKey;

  fetch(fiveDayTest)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {
    console.log(data);
  });
}

// loop through the objects for records matching 12:00?
// create a new array of only those objects?
// loop through those to populate five-day forecast?

