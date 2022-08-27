var apiKey = "0a1cf54009aa74cd34cd8068722976e4";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
//var uviURL = "https://api.openweathermap.org/data/3.0/onecall?q=";
var uviURL = "https://api.openweathermap.org/data/2.5/uvi?";
var fullToday = new Date(); //Todays date object
var todayMonth = fullToday.getMonth(); //Current Month
var allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; //All Months array in 3 letter format
var fullStandardDate = "(" + fullToday.getDate() + " " + allMonths[todayMonth] + " " + fullToday.getFullYear() +")"; //Standard Date Format for Page title DD MMM YYYY

$(document).ready(function(){
    //getWeather();
    $("#search-btn").click(function() {
        var city = $("#cityQuery").val();
        generateData(city);

        $("#cityQuery").val("");
        $(".history-wrapper").append('<div class="cityHistory" style="border:1px solid #000;border-radius:5px;width:100%;height:20px;text-align:center;margin-top:5px;">'+ city +'</div>');
    });

    $(".history-wrapper").on("click", ".cityHistory", function() {
        var city = $(this).html();
        generateData(city);
    });
});

function generateData(city) {
    //Query Forecast and Lat/Lon
    var url = forecastURL + city + "&cnt=6&units=imperial&appid=" + apiKey;
    var forecastQuery = getWeather(url);
    var lat = forecastQuery.city.coord.lat;
    var lon = forecastQuery.city.coord.lon;
    console.log(forecastQuery);

    //Query UVI
    url = uviURL + "lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    var uviQuery = getWeather(url);
    //console.log(uviQuery)

    //Append date to HTML
    appendData(forecastQuery, uviQuery);
}

function appendData(forecastQuery, uviQuery) {
    //Todays weather information
    $("#main-city-display").html(forecastQuery.city.name);
    $("#todaysdate").html(fullStandardDate);
    $("#main-image").attr("src","https://openweathermap.org/img/wn/" + (forecastQuery.list[0].weather[0].icon)+".png");
    $("#main-city-temp").html(Number(forecastQuery.list[0].main.temp).toFixed(1)+"°");
    $("#main-city-wind").html(Number(forecastQuery.list[0].wind.speed).toFixed(1)+" mph");
    $("#main-city-humidity").html(Number(forecastQuery.list[0].main.humidity).toFixed(1)+" %");
    $("#main-city-UVindex").html(Number(uviQuery.value).toFixed(0));
    
    forecastQuery.list.shift();
    $(forecastQuery.list).each(function(i, item) {
        $('#day' + (i+1)+ 'img').attr("src","https://openweathermap.org/img/wn/" + (item.weather[0].icon)+".png");
        $('#day' + (i+1)+ 'temp').html(Number(item.main.temp).toFixed(1)+"°");
        $('#day' + (i+1)+ 'wind').html(Number(item.wind.speed).toFixed(1)+" mph");
        $('#day' + (i+1)+ 'humidity').html(Number(item.main.humidity).toFixed(1)+" %");
    })

}

function getWeather(url){
	var tempData = [];
	$.ajax({
		url: url,
		method: "GET",
		async: false,
		headers: { "Accept": "application/json; odata=verbose" },
		success: function(data) {
			data: JSON.stringify(data);
			tempData = data;
		}
	});
	return tempData;
}