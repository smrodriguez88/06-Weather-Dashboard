var searchCity = encodeURI("Austin")
var searchState = encodeURI("Tx")
var apiKey = "c07496268c5150b816624d60892d5521"
var apiCity = "https://api.openweathermap.org/data/2.5/weather?q="+searchCity+"&appid="+apiKey+""
// var apiCity = "https://api.openweathermap.org/data/2.5/weather?q="+searchCity+","+searchState+"&appid="+apiKey+""
var apiCoords = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={YOUR API KEY}"
var searchSettings = {
	"url": apiCity,
	"method": "GET",
}
function getWeather(apiCall){
$.ajax(apiCall).done(function (response) {
	console.log(response);
});
};

// API's needed

// API Key: c07496268c5150b816624d60892d5521
// API Endpoint City/State: api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={your api key}
// API Endpoint Coords: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&
// exclude={part}&appid={YOUR API KEY} 
// Current Day
// 5 Day
// UV-index