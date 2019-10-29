const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup Handlebars Engine & Views Location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup Static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sean Mc Ternan'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Sean Mc Ternan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is the help page', 
        title: 'Help',
        name: 'Sean Mc Ternan'
    })
})


app.get('/weather', (req, res) => {
    const address = req.query.address
    
if (address) {
    geoCode(address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
             return res.send({ error })
            }
    forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                 return  res.send({ error })
                }
    
                res.send(
                    {   
                        forecast: forecastData,
                        location,
                        address
                    }
                )
              })
            })
    }
    else {
        res.send(
        {
            error: 'You must provide an address.'
        }
    )
    }
    }) 


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send(
            {
                error: 'You must provide a search term'
            }
        )
    }

    console.log(req.query.search)
    res.send({
        products: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Sean Mc Ternan',
        errorMessage: 'Help article not found'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: 'Help',
        name: 'Sean Mc Ternan',
        errorMessage: 'Page not found'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000!')
})  

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  }); 