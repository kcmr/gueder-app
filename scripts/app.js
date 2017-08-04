// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('./service-worker.js')
//     .then(() => {
//       console.log('Service Worker registered');
//     });
// }

function getGeolocation() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      }, err => reject(err));
    } else {
      throw new Error('Your browser does not support geolocation :(');
    }
  });
}

function getWeather(lat, lng) {
  const API_KEY = '7e1fd95cfe31530bc20639de15507835';
  let weatherUrl = `https://api.darksky.net/forecast/${API_KEY}/${lat},${lng}?language=es&units=auto&callback=getWeather.parseData`;
  let script = document.createElement('script');
  script.src = weatherUrl;
  document.getElementsByTagName('head')[0].appendChild(script);

  return new Promise((resolve, reject) => {
    getWeather.parseData = data => {
      resolve(JSON.parse(JSON.stringify(data)));
    };

    script.onerror = err => reject(err);
  });
}

function setText(element, text) {
  document.querySelector(element).innerText = text;
}

getGeolocation()
  .then(location => {
    setText('#loadingMessage', 'Getting weather');
    return getWeather(location.lat, location.lng);
  })
  .then(weather => {
    console.log(weather.currently);
    setText('#loadingMessage', `Temperature: ${Math.round(weather.currently.temperature)} °C`);
  })
  .catch(err => console.log(err.message));