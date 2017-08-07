const GeoApp = new Vue({
  el: '#app',
  data: {
    API_KEY: '7e1fd95cfe31530bc20639de15507835',
    weatherEndpoint: 'https://api.darksky.net/forecast/',
    language: 'es',
    message: 'Finding you...'
  },
  methods: {
    getGeolocation: function() {
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
    getWeather: function({lat, lng}) {
      let weatherUrl = `${this.weatherEndpoint}${this.API_KEY}/${lat},${lng}?language=${this.language}&units=auto&callback=GeoApp.getWeather.parseData`;
      let script = document.createElement('script');
      script.src = weatherUrl;
      document.getElementsByTagName('head')[0].appendChild(script);
  
      return new Promise((resolve, reject) => {
        this.getWeather.parseData = data => {
          resolve(JSON.parse(JSON.stringify(data)));
        };
  
        script.onerror = err => reject(err);
      });
    }    
  },
  created: function() {
    this.getGeolocation()
      .then(location => {
        this.message = 'Getting weather';
        return this.getWeather(location);
      })
      .then(weather => {
        console.log(weather.currently);
        this.message = `Temperature: ${Math.round(weather.currently.temperature)} °C`;
      })
      .catch(err => console.log(err.message));
  }
});
