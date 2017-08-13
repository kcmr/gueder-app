new Vue({
  el: '#app',
  data: {
    API_KEY: '7e1fd95cfe31530bc20639de15507835',
    weatherEndpoint: 'https://api.darksky.net/forecast/',
    language: 'es',
    message: 'Finding you...',
    temperature: null,
    icon: ''
  },
  computed: {
    tempClassName() {
      const tempClassMap = {
        0: 't-0-5',
        5: 't-5-10',
        10: 't-10-20',
        20: 't-20-30',
        30: 't-30-40'
      };

      const matches = Object.keys(tempClassMap).filter(key => Math.round(this.temperature) >= Number(key));
      return this.temperature ? tempClassMap[matches.pop()] : 'default';
    }
  },
  methods: {
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
      let weatherUrl = `${this.weatherEndpoint}${this.API_KEY}/${lat},${lng}?language=${this.language}&units=auto`;
      return new Promise((resolve, reject) => {
        this.$http.jsonp(weatherUrl)
          .then(
            response => resolve(response.body),
            error => reject(error)
          );
      });
    }
  },
  created() {
    this.getGeolocation()
      .then(location => {
        this.message = 'Getting weather';
        return this.getWeather(location);
      })
      .then(weather => {
        console.log(weather.currently);
        this.temperature = weather.currently.temperature;
        this.icon = `#${weather.currently.icon}`;
        this.message = `Temperature: ${Math.round(weather.currently.temperature)} °C`;
      })
      .catch(err => console.log(err.message || err));
  }
});
