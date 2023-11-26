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

// variable to hold the loop start point, in order to ensure the 12:00 forecasts for the next five days are returned regardless of time of search
var loopStartPoint = 0;

// Retrieve previous searches from local storage and create buttons
function showPastSearches() {
  if (pastSearches !== "") {
    var pastSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
    for (var i = 0; i < pastSearches.length; i++) {
      var pastSearch =  document.createElement('button')
      pastSearch.setAttribute('class', 'searchedCity');
      pastSearch.textContent = pastSearches[i];
      searchHistoryBox.appendChild(pastSearch);
      }
  }
}
showPastSearches();

// get the searched value and generate the results
var searchButton = document.getElementById('search-button');
var searchedValue = document.getElementById('search-input');

searchButton.addEventListener('click', function(event) {
  event.preventDefault();
  cityName = searchedValue.value;

  // Add the search to local storage
  var previousSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
  previousSearches.push(cityName);
  localStorage.setItem('savedSearches', JSON.stringify(previousSearches));

  // create buttons for the searches undertaken
  var savedSearch = document.createElement('button')
  savedSearch.setAttribute('class', 'searchedCity');
  savedSearch.textContent = searchedValue.value;
  searchHistoryBox.appendChild(savedSearch);

  getLatLon();
});

// Listeners for buttons representing previous searches, so they can be repeated when clicked

searchHistoryBox.addEventListener('click', function(event) {
  event.preventDefault();
  cityName = event.target.textContent;
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
    dateContainer.textContent = data.list[0].dt_txt;  
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
    
    // add border to current forecast
    todaysWeatherBox.setAttribute('style', 'border: 1px solid black');

    // create header & container for 5 day forecast
    fiveDaySection.innerHTML = "";
    var fiveDayContainer = document.createElement('div');
    fiveDayContainer.setAttribute('style', 'display:flex; flex-direction: row;')
    fiveDaySection.appendChild(fiveDayContainer);

    // set start point for five-day forecast loop, so that the 12:00 forecasts are always returned
    function determineLoopStartPoint() {
      if (data.list[0].dt_txt.includes("00:00:00")) {
        loopStartPoint = 12;
      } else if (data.list[0].dt_txt.includes("03:00:00")) {
        loopStartPoint = 11;
      } else if (data.list[0].dt_txt.includes("06:00:00")) {
      loopStartPoint = 10;
      } else if (data.list[0].dt_txt.includes("09:00:00")) {
        loopStartPoint = 9;
      } else if (data.list[0].dt_txt.includes("12:00:00")) {
        loopStartPoint = 8;
      } else if (data.list[0].dt_txt.includes("15:00:00")) {
        loopStartPoint = 7;
      } else if (data.list[0].dt_txt.includes("18:00:00")) {
        loopStartPoint = 6;
      } else if (data.list[0].dt_txt.includes("21:00:00")) {
        loopStartPoint = 5;
      }
    }
    // invoke function to determine the loop start point
    determineLoopStartPoint();

    // create five-day forecast elements

    for (let i = loopStartPoint; i < 40; i += 8) {

      var futureForecastBox = document.createElement('div');
      futureForecastBox.setAttribute('style', 'background-color: steelblue; color: white; padding: 5px; margin: 5px;');
      fiveDayContainer.appendChild(futureForecastBox);

      var futureDate = document.createElement('p');
      futureDate.textContent = data.list[i].dt_txt;
      futureForecastBox.appendChild(futureDate);
      
      var futureWeatherImage = document.createElement('img');
      var futureWeatherImageCode = data.list[i].weather[0].icon;
      var futureWeatherImageURL = "http://openweathermap.org/img/w/" + futureWeatherImageCode + ".png";
      futureWeatherImage.setAttribute('src', futureWeatherImageURL);
      futureForecastBox.appendChild(futureWeatherImage);

      var futureTemp = document.createElement('p');
      futureTemp.textContent = "Temperature: " + kelvinToCelsius(data.list[i].main.temp) + "°C";
      futureForecastBox.appendChild(futureTemp);

      var futureWind = document.createElement('p');
      futureWind.textContent = "Wind Speed: " + data.list[i].wind.speed + "KPH";
      futureForecastBox.appendChild(futureWind);

      var futureHumidity = document.createElement('p');
      futureHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";
      futureForecastBox.appendChild(futureHumidity);
    }
  });
}

