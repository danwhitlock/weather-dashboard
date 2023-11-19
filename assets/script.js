var APIKey = "655eb0423f2259c97a977110605cab13";
var cityName = "London";
var todaysDate = dayjs().format('DD/MM/YY');
var geoCodeTest = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

var convertLatitude = "";
var convertLongitude = "";

var todaysWeatherBox = document.getElementById('today');

// test using the geocode API to get the long/lat of a searched city name
function getLatLon() { 
fetch(geoCodeTest)
  .then(function (response) {
    return response.json();
  })

  .then(function (data) {
    console.log(data);
    convertLatitude = data[0].lat;
    convertLongitude = data[0].lon;
    displayCoords();
    getForecast();
  });
}

function displayCoords() {
console.log(convertLatitude);
console.log(convertLongitude);
}

function getForecast() {
// test using the weather API to ge the forecast, using the derived long/lat above
var queryURLTest = "https://api.openweathermap.org/data/2.5/weather?lat=" + convertLatitude + "&lon=" + convertLongitude + "&appid=" + APIKey;

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
    temp.textContent = "Temperature: " + data.main.temp;
    searchedCity.appendChild(temp);
    // Display wind
    var wind = document.createElement('p');
    wind.textContent = "Wind Speed: " + data.wind.speed + "KPH";
    searchedCity.appendChild(wind);
    // Display humidity 
    var humidity = document.createElement('p');
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    searchedCity.appendChild(humidity);
  });

}
getLatLon();