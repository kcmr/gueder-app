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

getGeolocation()
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(err => console.log(err.message));