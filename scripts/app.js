// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('./service-worker.js')
//     .then(() => {
//       console.log('Service Worker registered');
//     });
// }

const GuederApp = {
  API_KEY: '7e1fd95cfe31530bc20639de15507835',
  weatherEndpoint: 'https://api.darksky.net/forecast/',
  language: 'es',

  getGeolocation() {
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
  },

  getWeather({lat, lng}) {
    let weatherUrl = `${this.weatherEndpoint}${this.API_KEY}/${lat},${lng}?language=${this.language}&units=auto&callback=GuederApp.getWeather.parseData`;
    let script = document.createElement('script');
    script.src = weatherUrl;
    document.getElementsByTagName('head')[0].appendChild(script);

    return new Promise((resolve, reject) => {
      this.getWeather.parseData = data => {
        resolve(JSON.parse(JSON.stringify(data)));
      };

      script.onerror = err => reject(err);
    });
  },

  setText(element, text) {
    document.querySelector(element).innerText = text;
  },

  init() {
    this.getGeolocation()
      .then(location => {
        this.setText('#loadingMessage', 'Getting weather');
        return this.getWeather(location);
      })
      .then(weather => {
        console.log(weather.currently);
        this.setText('#loadingMessage', `Temperature: ${Math.round(weather.currently.temperature)} °C`);
      })
      .catch(err => console.log(err.message));
  }
};

GuederApp.init();

