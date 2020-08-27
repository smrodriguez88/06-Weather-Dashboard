var searchCity = ""
var searchHistory = []
var apiKey = "c07496268c5150b816624d60892d5521"

function getCoords(){
    var apiCity = "https://api.openweathermap.org/data/2.5/weather?q="+searchCity+"&appid="+apiKey+""
    var searchSettings = {
        "url": apiCity,
        "method": "GET",
        "async": false, // It would've been awesome to learn how callbacks work but I 
                        // didn't have time for this assignmnet setting async to false instead
    }
$.ajax(searchSettings).done(function (response) {
    // console.log(response);
    city = { 
        "today" : {
            "city" : response.name.toLowerCase(),
            "coordLat" : response.coord.lat,
            "coordLon" : response.coord.lon,
    }}
    localStorage.setItem(city["today"]["city"], JSON.stringify(city))
});
};

function getWeatherbyCoords(){
    city = JSON.parse(localStorage.getItem(searchCity))
    // console.log(city)
    var apiCoords = "https://api.openweathermap.org/data/2.5/onecall?lat="+city.today.coordLat+"&lon="+city.today.coordLon+"&appid="+apiKey+""
    var searchSettings = {
        "url": apiCoords,
        "method": "GET",
        "async": false, // It would've been awesome to learn how callbacks work but I 
                        // didn't have time for this assignmnet setting async to false instead
    }
$.ajax(searchSettings).done(function (response) {
    console.log(response);
    city["today"]["datetime"] = moment.unix(response.current.dt).format('M/D/YYYY')
    city["today"]["temp"] = ((Number(response.current.temp) - 273.15) * 9/5 + 32).toFixed(1)
    city["today"]["humidity"] = response.current.humidity
    city["today"]["windspeed"] = response.current.wind_speed
    city["today"]["uvi"] = response.current.uvi
    city["today"]["wicon"] = "http://openweathermap.org/img/w/"+response.current.weather[0].icon+".png"
    city["today"]["wdesc"] = response.current.weather[0].description
    for (var i  = 1; i < response.daily.length; i++){
        city[i] = {}
        city[i]["datetime"] = moment.unix(response.daily[i].dt).format('M/D/YYYY')
        city[i]["wicon"] = "http://openweathermap.org/img/w/"+response.daily[i].weather[0].icon+".png"
        city[i]["wdesc"] = response.daily[i].weather[0].description
        city[i]["temp"] = ((Number(response.daily[i].temp.day) - 273.15) * 9/5 + 32).toFixed(1)
        city[i]["humidity"] = response.daily[i].humidity
    }
    // console.log(city)
    localStorage.setItem(city["today"]["city"], JSON.stringify(city))
});
};

function displayToday(){
    $("#todayforecast").empty()
    city = JSON.parse(localStorage.getItem($("#searchForm").val().toLowerCase()))
    $("#allforecast").addClass("border")
    $("#allforecast").addClass("border-primary")
    $("#allforecast").addClass("rounded")
    cityString = city["today"]["city"][0].toUpperCase() + city["today"]["city"].slice(1)
    $("#todayforecast").append("<h3>"+ cityString + "  (" + city["today"]["datetime"]+ ")</h3>")
    $("#todayforecast").append("<div><img src='"+city["today"]["wicon"]+"'</img><b>"+ city["today"]["wdesc"].toUpperCase() +"</b></div>")
    $("#todayforecast").append("<div>Temperature: "+ city["today"]["temp"] +"℉</div>")
    $("#todayforecast").append("<div>Humidity: "+ city["today"]["humidity"] +"%</div>")
    $("#todayforecast").append("<div>Wind Speed: "+ city["today"]["windspeed"] +"MPH</div>")
    $("#todayforecast").append("<div id='uvindex'>UV Index: "+ city["today"]["uvi"] +"</div>")
}

function display5day(){
    $("#5dayforecast").empty()
    city = JSON.parse(localStorage.getItem($("#searchForm").val().toLowerCase()))

}

function setSearchHistory(){
    searchCity = $("#searchForm").val().toLowerCase()
    if (searchHistory.indexOf(searchCity) == -1){
        searchHistory.push(searchCity)
    }
    $("#searchHistoryUL").empty()
    searchHistory.forEach(element => {
        stringElement = element[0].toUpperCase() + element.slice(1)
        $("#searchHistoryUL").prepend("<li>"+stringElement+"</li>")
    });
}
// History function based on localstorage objects

// Create Page Elements
$("#search").append("<div class='input-group'><input type='text' class='form-control' id='searchForm' placeholder='Search by City'><div class='input-group-append'><button class='btn btn-primary' type='submit' id='searchBtn'>Search</button></div></div>")
$("#searchHistory").append("<ul id=searchHistoryUL style='list-style: none'</ul>")


$("#searchBtn").on("click", function(){
    setSearchHistory()
    getCoords()
    getWeatherbyCoords()
    displayToday()
})