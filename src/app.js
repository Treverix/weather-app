require('dotenv').config();

const path = require('path')

const express = require('express')
const hbs = require('hbs')

const {geocode} = require('./utils/mapbox')
const {forecast} = require('./utils/darksky')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Andreas Dolk'
  })  // renders the view index.hbs
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Andreas Dolk'
  })  // renders the view about.hbs
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'A help message',
    name: 'Andreas Dolk'
  })  // renders the view help.hbs
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(req.query.address, (error, {lat, lon} = {}) => {

    if (error) {
      res.send({error: 'Error: ' + error})
    } else {
      forecast(lat, lon, (error, {currently, daily} = {}) => {
        if (error) {
          res.send({error: 'Error: ' + error})
        } else {
          const today = daily.data[0]
          res.send({
            summary: today.summary,
            forecast: `It is currently ${currently.temperature}°C out. There is a ${currently.precipProbability * 100}% chance of rain.`
          })
        }
      })
    }
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'Help not found',
    message: 'The requested help page could not be found',
    name: 'Andreas Dolk'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Page not found',
    message: 'The requested page could not be found',
    name: 'Andreas Dolk'
  })
})

app.listen(3000, () => {
  console.log(`Server started and listening on port 3000`);
})
