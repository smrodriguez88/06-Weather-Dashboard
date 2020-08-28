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
    // Create a "city" object and store the initial city name and coordinates for OneAPI call
    city = { 
        "today" : {
            "city" : response.name.toLowerCase(),
            "coordLat" : response.coord.lat,
            "coordLon" : response.coord.lon,
    }}

    // Store City object in localStorage with the "Key" being the name of the city, then I can call the key of city name later
    localStorage.setItem(city["today"]["city"], JSON.stringify(city))
});
};

function getWeatherbyCoords(){
    // Grab the localStorage item that is named after the city that is searched for and JSON.parse it back into an object
    city = JSON.parse(localStorage.getItem(searchCity))
    var apiCoords = "https://api.openweathermap.org/data/2.5/onecall?lat="+city.today.coordLat+"&lon="+city.today.coordLon+"&appid="+apiKey+""
    var searchSettings = {
        "url": apiCoords,
        "method": "GET",
        "async": false, // It would've been awesome to learn how callbacks work but I 
                        // didn't have time for this assignmnet setting async to false instead
    }
$.ajax(searchSettings).done(function (response) {
    console.log(response);
    // Store additional values in city object under key today, creating new keys under today for each piece of data
    city["today"]["datetime"] = moment.unix(response.current.dt).format('M/D/YYYY')
    city["today"]["temp"] = ((Number(response.current.temp) - 273.15) * 9/5 + 32).toFixed(1)
    city["today"]["humidity"] = response.current.humidity
    city["today"]["windspeed"] = response.current.wind_speed
    city["today"]["uvi"] = response.current.uvi
    city["today"]["wicon"] = "http://openweathermap.org/img/w/"+response.current.weather[0].icon+".png"
    city["today"]["wdesc"] = response.current.weather[0].description
     // Store 5 day forecast data with i being the unique key name
    for (var i  = 1; i < response.daily.length; i++){
        city[i] = {}
        city[i]["datetime"] = moment.unix(response.daily[i].dt).format('M/D/YYYY')
        city[i]["wicon"] = "http://openweathermap.org/img/w/"+response.daily[i].weather[0].icon+".png"
        city[i]["wdesc"] = response.daily[i].weather[0].description
        city[i]["temp"] = ((Number(response.daily[i].temp.day) - 273.15) * 9/5 + 32).toFixed(1)
        city[i]["humidity"] = response.daily[i].humidity
    }
    // console.log(city)
    // Storing Object under the name of the city
    localStorage.setItem(city["today"]["city"], JSON.stringify(city))
});
};

function displayCity(cityName){
    $("#todayforecast").empty()
    city = JSON.parse(localStorage.getItem(cityName.toLowerCase()))
    $("#todayforecast").addClass("border")
    $("#todayforecast").addClass("border-dark")
    $("#todayforecast").addClass("rounded")
    $("#todayforecast").addClass("bg-light")
    cityString = city["today"]["city"][0].toUpperCase() + city["today"]["city"].slice(1)
    $("#todayforecast").append("<h3>"+ cityString + "  (" + city["today"]["datetime"]+ ")</h3>")
    $("#todayforecast").append("<div><img src='"+city["today"]["wicon"]+"'</img><b>"+ city["today"]["wdesc"].toUpperCase() +"</b></div>")
    $("#todayforecast").append("<div class='my-1'>Temperature: "+ city["today"]["temp"] +"℉</div>")
    $("#todayforecast").append("<div class='my-1'>Humidity: "+ city["today"]["humidity"] +"%</div>")
    $("#todayforecast").append("<div class='my-1'>Wind Speed: "+ city["today"]["windspeed"] +"MPH</div>")
    $("#todayforecast").append("<div class='my-1' id='uvindex'>UV Index: "+ city["today"]["uvi"] +"</div>")
}

function display5day(cityName){
    $("#5dayforecast").empty()
    console.log(cityName)
    city = JSON.parse(localStorage.getItem(cityName))
    console.log(city)
    $("#5daytitle").html("<h5>5 Day Forecast: </h5>")
    for(let [k,v] of Object.entries(city)){
        if (k <= 5){
            var col = $("<div>").addClass("col-md-2 my-3")
            var card = $("<div>").addClass("card bg-primary text-white")
            var cbody = $("<div>").addClass("card-body")
            var ctitle = $("<h5>").addClass("card-title").text(v.datetime)
            var picon = $("<p>").addClass("card-text").html("<img src="+v.wicon+"></img>")
            var ptemp = $("<p>").addClass("card-text").text("Temp: "+v.temp+" ℉")
            var phumidity = $("<p>").addClass("card-text").text("Humidity: "+v.humidity)
            col.append(card.append(cbody.append(ctitle.append(picon.append(ptemp.append(phumidity.append()))))))
            $("#5dayforecast").append(col)
        }
        
    }
    
}

function setSearchHistory(){
    searchCity = $("#searchForm").val().toLowerCase()
    if (searchHistory.indexOf(searchCity) == -1){
        searchHistory.push(searchCity)
    }
    $("#searchHistoryUL").empty()
    searchHistory.forEach(element => {
        stringElement = element[0].toUpperCase() + element.slice(1)
        $("#searchHistoryUL").prepend("<li><button class='btn btn-danger rounded m-2 cityBtn' city="+stringElement+">"+stringElement+"</button></li>")
    });
    $(".cityBtn").on("click", function(){
        cityName = $(this).attr("city").toLowerCase()
        displayCity(cityName)
        display5day(cityName)
    })
}

// Create Page Elements
$("#search").append("<div class='input-group'><input type='text' class='form-control' id='searchForm' placeholder='Search by City'><div class='input-group-append'><button class='btn btn-primary' type='submit' id='searchBtn'>Search</button></div></div>")
$("#searchHistory").append("<ul id=searchHistoryUL style='list-style: none'</ul>")


$("#searchBtn").on("click", function(){
    setSearchHistory()
    getCoords()
    getWeatherbyCoords()
    displayCity($("#searchForm").val())
    display5day($("#searchForm").val())
})