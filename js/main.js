const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timeZoneEl = document.getElementById('timezone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY = '827310dcb67d9a1534243a9ec0d257ee'

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    // const hour = time.getHours();
    // const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    // const minutes = time.getMinutes();
    // const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    // timeEl.innerHTML = hoursIn12HrFormat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day] + ', ' + months[month] + ' ' + date
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude} = success.coords;
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data);
        showWeatherData(data);
        });
    });
}

function showWeatherData (data) {
    let {temp, feels_like, humidity, pressure, wind_speed, uvi, sunrise, sunset} = data.current;
    let {description} = data.current.weather[0]

    timeZoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + ' ' + data.lon + ' '

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item" id="weather-item">
        <div>${description}</div>
    </div>
    <div class="weather-item" id="weather-item">
        <div>Temperature &nbsp; &nbsp;</div>
        <div>${temp.toFixed()}&#176; F</div>
    </div>
    <div class="weather-item">
        <div>Feels Like</div>
        <div>${feels_like.toFixed()}&#176; F</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${(pressure/33.864).toFixed(2)} Hg</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed.toFixed()} mph</div>
    </div>
    <div class="weather-item">
        <div>UV Index</div>
        <div>${uvi}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('h:mm A')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('h:mm A')}</div>
    </div>`;

    let otherDayForcast = ''
    
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = 
            `   <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day - ${day.temp.day.toFixed()}&#176; F</div>
                <div class="temp">Night - ${day.temp.night.toFixed()}&#176; F</div>
                <div class="desc">${day.weather[0].description}</div>
            </div>`
        } else (
            otherDayForcast +=
            `<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day - ${day.temp.day.toFixed()}&#176; F</div>
                <div class="temp">Night - ${day.temp.night.toFixed()}&#176; F</div>
                <div class="desc">${day.weather[0].description}</div>
            </div>`
        )
    })

    weatherForecastEl.innerHTML = otherDayForcast;
}