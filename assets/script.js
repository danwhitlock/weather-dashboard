var APIKey = "655eb0423f2259c97a977110605cab13";
var cityName = "";
var geoCode = "";
var forecastQueryURL = "";
var todaysDate = dayjs().format('DD/MM/YY');

// Variable to select the div which will hold today's forecast
var todaysWeatherBox = document.getElementById('today');

// variable to select the div which will hold the previous searches
var searchHistoryBox = document.getElementById('history');

// variable to select the div which will hold the five-day forecast
var fiveDaySection = document.getElementById('forecast');

// get the searched value and generate the results
var searchButton = document.getElementById('search-button');
var searchedValue = document.getElementById('search-input');

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  cityName = searchedValue.value;
  var savedSearch = document.createElement('button')
  savedSearch.textContent = searchedValue.value;
  searchHistoryBox.appendChild(savedSearch);
  getLatLon();
});

// Listeners for previous searches - NOT WORKING!!

searchHistoryBox.addEventListener('click', function(event) {
  event.preventDefault();
  cityName = this.value;
  getLatLon();
});

// Declare variables to hold the lat and lon once retrieved via the geoCode API
var convertLatitude = "";
var convertLongitude = "";

// function to convert Kelvin temperature to Celsius
function kelvinToCelsius (kelvinTemp) {
  return (kelvinTemp - 273.15).toFixed(0);
}

// Use the geocode API to get the long/lat of a searched city name
function getLatLon() { 

  geoCode = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

  fetch(geoCode)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data);
      convertLatitude = data[0].lat;
      convertLongitude = data[0].lon;
      getForecast();
    });
}

// query the forecast API & display the forecast

function getForecast() {

  forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + convertLatitude + "&lon=" + convertLongitude + "&appid=" + APIKey;
  todaysWeatherBox.innerHTML = "";

  fetch(forecastQueryURL)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {
    console.log(data);
    // Display City Name
    var searchedCity = document.createElement('h2')
    searchedCity.textContent = data.city.name;
    todaysWeatherBox.appendChild(searchedCity);
    // Display today's date
    var dateContainer = document.createElement('p');
    dateContainer.textContent = todaysDate;
    searchedCity.appendChild(dateContainer);
    // Display Weather Icon
    var weatherImage = document.createElement('img');
    var weatherImageCode = data.list[0].weather[0].icon;
    var weatherImageURL = "http://openweathermap.org/img/w/" + weatherImageCode + ".png";
    weatherImage.setAttribute('src', weatherImageURL);
    searchedCity.appendChild(weatherImage);
    // Display temp
    var temp = document.createElement('p');
    temp.textContent = "Temperature: " + kelvinToCelsius(data.list[0].main.temp) + "°C";
    searchedCity.appendChild(temp);
    // Display wind
    var wind = document.createElement('p');
    wind.textContent = "Wind Speed: " + data.list[0].wind.speed + "KPH";
    searchedCity.appendChild(wind);
    // Display humidity 
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + data.list[0].main.humidity + "%";
    searchedCity.appendChild(humidity);
    
    // add border to current forecast & five-day forecast containers
    todaysWeatherBox.setAttribute('style', 'border: 1px solid black');
    fiveDaySection.setAttribute('style', 'border: 1px solid black');

    // create header & container for 5 day forecast

    var fiveDayContainer = document.createElement('div');
    fiveDaySection.appendChild(fiveDayContainer);

    // create five-day forecast elements individually

    
    var futureForecastBox = document.createElement('div');
    futureForecastBox.setAttribute('style', 'background-color: steelblue; color: white; padding: 5px;');
    fiveDayContainer.appendChild(futureForecastBox);

    var futureDate = document.createElement('p');
    futureDate.textContent = todaysDate;            // FIX DATE
    futureForecastBox.appendChild(futureDate);
    
    var futureWeatherImage = document.createElement('img');
    var futureWeatherImageCode = data.list[6].weather[0].icon;
    var futureWeatherImageURL = "http://openweathermap.org/img/w/" + futureWeatherImageCode + ".png";
    futureWeatherImage.setAttribute('src', futureWeatherImageURL);
    futureForecastBox.appendChild(futureWeatherImage);

    var futureTemp = document.createElement('p');
    futureTemp.textContent = "Temperature: " + kelvinToCelsius(data.list[6].main.temp) + "°C";
    futureForecastBox.appendChild(futureTemp);

    var futureWind = document.createElement('p');
    futureWind.textContent = "Wind Speed: " + data.list[6].wind.speed + "KPH";
    futureForecastBox.appendChild(futureWind);

    var futureHumidity = document.createElement('p');
    futureHumidity.textContent = "Humidity: " + data.list[6].main.humidity + "%";
    futureForecastBox.appendChild(futureHumidity);

  });
}

// loop through the objects for records matching 12:00?
// create a new array of only those objects?
// loop through those to populate five-day forecast?

