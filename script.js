// Setting global variables
var searchCity = ""
var searchHistory = []
var apiKey = "c07496268c5150b816624d60892d5521"

// First API call, calls by city to grab the coordinates and store info as a localStorage object
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

// Gets all wether data by coordinates from initial API call
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
    // Store additional values in city object under key today, creating new keys under today for each piece of data
    // Convert EPOCH time to normal datetime format to get date
    city["today"]["datetime"] = moment.unix(response.current.dt).format('M/D/YYYY')
    // Convert Kelvin to Farenheight
    city["today"]["temp"] = ((Number(response.current.temp) - 273.15) * 9/5 + 32).toFixed(1)
    city["today"]["humidity"] = response.current.humidity
    city["today"]["windspeed"] = response.current.wind_speed
    city["today"]["uvi"] = response.current.uvi
    city["today"]["wicon"] = "https://openweathermap.org/img/w/"+response.current.weather[0].icon+".png"
    city["today"]["wdesc"] = response.current.weather[0].description
     // Store 5 day forecast data with i being the unique key name
     // Start i at 1 as 0 is the forecast for today
    for (var i  = 1; i < response.daily.length; i++){
        // Create new object to append data to
        city[i] = {}
        // Convert EPOCH time to normal datetime format to get date
        city[i]["datetime"] = moment.unix(response.daily[i].dt).format('M/D/YYYY')
        city[i]["wicon"] = "https://openweathermap.org/img/w/"+response.daily[i].weather[0].icon+".png"
        city[i]["wdesc"] = response.daily[i].weather[0].description
        // Convert Kelvin to Farenheight
        city[i]["temp"] = ((Number(response.daily[i].temp.day) - 273.15) * 9/5 + 32).toFixed(1)
        city[i]["humidity"] = response.daily[i].humidity
    }
    // Storing Object under the name of the city
    localStorage.setItem(city["today"]["city"], JSON.stringify(city))
});
};

// Creates HTML elements to display the data for Today in the specified city
function displayToday(cityName){
    // Clear initial data from any previous data displayed
    $("#todayforecast").empty()
    // Parse the data into an Object from localStorage
    city = JSON.parse(localStorage.getItem(cityName.toLowerCase()))
    // Display data
    $("#todayforecast").addClass("border border-dark rounded bg-light")
    cityString = city["today"]["city"][0].toUpperCase() + city["today"]["city"].slice(1)
    $("#todayforecast").append("<h3>"+ cityString + "  (" + city["today"]["datetime"]+ ")</h3>")
    $("#todayforecast").append("<div><img src='"+city["today"]["wicon"]+"'</img><b>"+ city["today"]["wdesc"].toUpperCase() +"</b></div>")
    $("#todayforecast").append("<div class='my-1'>Temperature: "+ city["today"]["temp"] +"℉</div>")
    $("#todayforecast").append("<div class='my-1'>Humidity: "+ city["today"]["humidity"] +"%</div>")
    $("#todayforecast").append("<div class='my-1'>Wind Speed: "+ city["today"]["windspeed"] +"MPH</div>")
    $("#todayforecast").append("<div class='ml-1' id='uvindex'>UV Index: "+"<div id='uvi'>" +city["today"]["uvi"] +"</div></div>")
    // Color UVI data based on the current value of UV Index
    uviStyle(city["today"]["uvi"])
}

// Displays 5-day forecast data for the specified city
function display5day(cityName){
    // Clear initial data from any previous data displayed
    $("#5dayforecast").empty()
    // Parse the data into an Object from localStorage
    city = JSON.parse(localStorage.getItem(cityName))
    // Display data
    $("#5daytitle").html("<h5>5 Day Forecast: </h5>")
    // For each key and value in the previously parse city object create HTML elements
    for(let [k,v] of Object.entries(city)){
        if (k <= 5){
            var col = $("<div>").addClass("col-md-2 my-3")
            var card = $("<div>").addClass("card bg-primary text-white")
            var cbody = $("<div>").addClass("card-body")
            var ctitle = $("<h5>").addClass("card-title").text(v.datetime)
            var picon = $("<p>").addClass("card-text").html("<img src="+v.wicon+"></img>")
            var ptemp = $("<p>").addClass("card-text").text("Temp: "+v.temp+" ℉")
            var phumidity = $("<p>").addClass("card-text").text("Humidity: "+v.humidity)
            // Append elements to live within one another
            col.append(card.append(cbody.append(ctitle.append(picon.append(ptemp.append(phumidity.append()))))))
            // Append merged element to 5-day forecast div id
            $("#5dayforecast").append(col)
            // NOTE TO GRADER: CHANGED STYLE FOR DISPLAYING DIVS FROM PREVIOUS STYLE AS IT WAS DIFFICULT TO NEST
            // DIVS WITHOUT USING THIS VARIABLE METHOD, DID NOT FIX PREVIOUS METHOD TO DISPLAY TODAY FORECAST
            // DATA DUE TO TIME CONSTRAINS.
        }
        
    }
    
}

// Style UVI based on UV Index value
function uviStyle(uvi){
    if (uvi <= 2){
        // style background green
        $("#uvi").attr("style","border-radius: 5px; background-color: #3CFF33; display: inline-block")
    } else if (uvi <= 5){
        // style background yellow
        $("#uvi").attr("style","border-radius: 5px; background-color: #F0FF33; display: inline-block")
    } else if (uvi <= 7){
        // style background orange
        $("#uvi").attr("style","border-radius: 5px; background-color: #FFBC48; display: inline-block")
    } else if (uvi <= 10){
        // style background red
        $("#uvi").attr("style","border-radius: 5px; background-color: #FF4D4D; display: inline-block")
    } else {
        // style background violet
        $("#uvi").attr("style","border-radius: 5px; background-color: #FF74EC; display: inline-block")
    }
}
    
// Create buttons for each city searched allowing for easy reference to display historical data (No additinal API calls needed)
function setSearchHistory(){
    // Set city name to lowercase for easy comparison when pulling localStorage keys as they are sotred in lowercase
    searchCity = $("#searchForm").val().toLowerCase()
    // Check to see if city exists in history list before adding
    if (searchHistory.indexOf(searchCity) == -1){
        searchHistory.push(searchCity)
    }
    // For each item in the searchHistory array create a new button for that city
    $("#searchHistoryUL").empty()
    searchHistory.forEach(element => {
        stringElement = element[0].toUpperCase() + element.slice(1)
        $("#searchHistoryUL").prepend("<li><button class='btn btn-danger rounded m-2 cityBtn' city="+stringElement+">"+stringElement+"</button></li>")
    });
    // Event Listener for each searchHistory city button
    $(".cityBtn").on("click", function(){
        // Set cityName to be lower as localStorage keys are all lowercase
        cityName = $(this).attr("city").toLowerCase()
        // Display data based off historical city data
        displayToday(cityName)
        display5day(cityName)
    })
}

// Create initial search and searchHistory elements
$("#search").append("<div class='input-group'><input type='text' class='form-control' id='searchForm' placeholder='Search by City'><div class='input-group-append'><button class='btn btn-primary' type='submit' id='searchBtn'>Search</button></div></div>")
$("#searchHistory").append("<ul id=searchHistoryUL style='list-style: none'</ul>")

// Event Listener for search button
$("#searchBtn").on("click", function(){
    // Sets search history if exists
    setSearchHistory()
    // Get coordinates of city via API call, set Obj in localStorage
    getCoords()
    // Gets full forecast data for city by coordinates via API call, appends data to Obj in LocalStorage
    getWeatherbyCoords()
    // Sets cityName to lowerCase as localStorage keys are lowercase
    cityName = $("#searchForm").val().toLowerCase()
    // Displays weather forecast data for today
    displayToday(cityName)
    // Displays weather forecast data for 5day
    display5day(cityName)
})