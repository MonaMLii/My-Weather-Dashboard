
var APIKey = 'dd152ac68476b1494bf25ba1730d6edf';
var todayEl = $('#current-date');
var cityNameEl = $("#city-input");
var savedSearches
var ulEl = $('#ul-el');
var futureWeather = $('#future-weather-container');
var todaysDate = dayjs();
//todayEl.text(todaysDate.format('dddd, MMMM D, YYYY'));


var saveSearch = $('#search-history');

var historyList = function(cityName) {
    savedSearches = JSON.parse(localStorage.getItem("savedSearches")) || [];

    for (var i = 0; i < savedSearches.length; i++) {
        var liTag = document.createElement("li");
        liTag.textContent = savedSearches[i].cityName;
        $(ulEl).append(liTag);
        $(liTag).append(cityName);
    }
}
historyList();



//add city to the url

var getCoordinates = function (cityName) {
    console.log(cityName);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${APIKey}`)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var liTag = document.createElement("li");

            savedSearches.push(cityName)
            localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
            $(ulEl).append(liTag);
            $(liTag).append(cityName)

            showCurrentWeathert(cityName, data);
            getFiveDays(data.coord.lat, data.coord.lon);
        })
}


// get data from lat n lon

var getFiveDays = function (lat, lon) {
    console.log(lat, lon);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=b88df4fcabf5b35cee7f00e569859183`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fiveDaysCards(data);
            
        })
}

// current weather container

var showCurrentWeathert = function (cityName, data) {
    var iconUrl = "https://openweathermap.org/img/w/";

    var weatherHTML = `
    <div class="card-body">
        <h2 id="weather-now">current weather in <span>${cityName}</span></h2>
        <p>${todaysDate.format('dddd, MMMM D, YYYY')}</p>
        <img src='${iconUrl+data.weather[0].icon+'.png'}'/>
        <p>Temp: ${data.main.temp}\u00B0F</p>
        <p>Humidity:${data.main.humidity}%</p>
        <p>Wind:${data.wind.speed} MPH</p>
    </div>
    `
    console.log(data);
    $("#weather-container").html(weatherHTML)
}

var searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', function (e) {
    console.log(cityNameEl[0].value);
    getCoordinates(cityNameEl[0].value);
})


// 5 days weather container 

var fiveDaysCards = function (forecastData) {
    console.log(forecastData);
    var iconUrl = "https://openweathermap.org/img/w/";
    var weatherForecast = ''

    for (var i = 1; i <= 5; i++) {
        console.log(dayjs.unix(forecastData.daily[i].dt).format('dddd, MMMM D, YYYY'));

        weatherForecast += `
        <div class="future-card-body">
        <p>${dayjs.unix(forecastData.daily[i].dt).format('dddd, MMMM D, YYYY')}</p>
        <img src='${iconUrl+forecastData.daily[i].weather[0].icon+'.png'}'/>
        <p>Temp: ${forecastData.daily[i].temp.day}\u00B0F</p>
        <p>Humidity: ${forecastData.daily[i].humidity}%</p>
        <p>Wind: ${forecastData.daily[i].wind_speed} MPH</p>
        <p>UV-Index: ${forecastData.daily[i].uvi}</p>
        </div>
        `
    } 
    console.log(weatherForecast);

    $('#future-weather-container').html(weatherForecast);

}

