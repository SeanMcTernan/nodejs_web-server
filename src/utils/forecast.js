const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'https://api.darksky.net/forecast/fefa427dc1d22f485167ddcb224462b4/' + lat + ',' + long + '?units=si'
    
    request({ url, json: true }, (error, { body }) => {
        
        if (error) {
            callback('Unable to connect to weather service.')
        }
        else if (body.error) {
            callback('Unable to find location.')
        } 
        else {
            const temp = body.currently.temperature
            const percip = body.currently.precipProbability
            callback(undefined, body.daily.data[0].summary + ` It is currenty ${temp} out. There is a ${percip} percent chance of rain.`)
        }
    })

}

module.exports = forecast


