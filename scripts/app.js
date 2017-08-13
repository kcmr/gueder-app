new Vue({
  el: '#app',
  data: {
    API_KEY: '7e1fd95cfe31530bc20639de15507835',
    weatherEndpoint: 'https://api.darksky.net/forecast/',
    language: 'es',
    message: '',
    icon: '',
    tempClassName: '',
    temperature: null,
    weather: null,
    weatherAvailable: false,
    bottomGraphPaths: {
      ascending: 'M0,43 C53.3256793,27.6666667 106.656408,20 159.992188,20 C213.327967,20 266.663904,27.6666667 320,43 L320,165 L0,165 L0,43 Z',
      descending: 'M0,23 C53.3256793,34.3333333 106.656408,40 159.992188,40 C213.327967,40 266.663904,34.3333333 320,23 L320,165 L0,165 L0,23 Z'
    }
  },
  watch: {
    weather: function() {
      this.weatherAvailable = true;
      this.temperature = Math.round(this.weather.currently.temperature);
      this.icon = `#${this.weather.currently.icon}`;
      this.message = `${this.temperature}°C`;
      this._setTempClassName();

      const direction = Math.round(this.weather.hourly.data[1].temperature) > this.temperature
        ? this.bottomGraphPaths.ascending
        : this.bottomGraphPaths.descending;
      this._setBottomGraph(direction);
    }
  },
  methods: {
    _setTempClassName() {
      if (this.weather.currently.icon.match('-night')) {
        this.tempClassName = 't-night';
        return;
      }

      const tempClassMap = {
        0: 't-0-5',
        5: 't-5-10',
        10: 't-10-20',
        20: 't-20-30',
        30: 't-30-40'
      };

      const matches = Object.keys(tempClassMap).filter(key => this.temperature >= Number(key));
      this.tempClassName = tempClassMap[matches.pop()];
    },
    _setBottomGraph(direction) {
      anime({
        targets: '.bottom-graph path',
        duration: 2000,
        easing: 'linear',
        opacity: 1,
        d: direction
      });
    },
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
      .then(location => this.getWeather(location))
      .then(weather => this.weather = weather)
      .catch(err => console.log(err.message || err));
  }
});
