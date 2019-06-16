const request = require('request')

const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places'

const geocode = (address, callback) => {
  request({
    uri: `${url}/${encodeURIComponent(address)}.json`,
    qs: { access_token: process.env.MAPBOX_TOKEN, limit: '1'},
    json: true
  }, (err, {statusCode, body}) => {
    if (err) {
      // catch network trouble
      callback('Unable to connect to mapbox service');
    } else if (statusCode !== 200) {
      // catch error responses from mapbox
      callback(body.message)
    } else if (body.features.length === 0) {
      console.log(body);
      // here the query does not return a single feature
      callback('No location found for ' + address)
    } else {
      const feature = body.features[0];
      const [lon, lat] = feature.center
      const location = feature.place_name
      console.log(`Location for "${address}": ${lat}, ${lon}`)

      callback(undefined, {lat, lon, location})
    }
  })
}

module.exports = {geocode}