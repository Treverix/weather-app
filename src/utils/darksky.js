const request = require('request')

const forecast = (lat, lon, callback) => {
  request({
    url: `https://api.darksky.net/forecast/${process.env.DARKSKY_TOKEN}/${lat},${lon}`,
    qs: {units: 'si'},
    json: true
  }, (error, {statusCode, message, body}) => {
    if (error) {
      // catch network trouble
      callback("Unable to connect to weather service")
    } else if (statusCode !== 200) {
      // catch error responses from darksky
      callback(message)
    } else {
      callback(undefined, body)
    }
  });
}

module.exports = {forecast}