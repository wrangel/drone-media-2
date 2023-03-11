const ExifReader = require('exifreader')

// Get Mongoose model
const Island = require(__path.join(__middlewarePath, 'manageDb'))

// Define REST constants
const baseUrlElement1 = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const baseUrlElement2 = '.json?access_token='
const ACCESS_TOKEN = 'pk.eyJ1IjoiYmF0aGh1cnN0IiwiYSI6ImNsZjN0eDg1bjB2d2czeHIwMmxra2QyODQifQ.I_CDtcMoSDmCjQErpayFCQ'
const panoFirstImageName = 'DJI_0001'


// Get media from main
const newRawMedia = require('./manageBooks')

// Get reverse geo data (REST)
async function getReverseGeoData(latitude, longitude) {
    const response = await fetch (baseUrlElement1
              + longitude + ', ' + latitude
              + baseUrlElement2 + ACCESS_TOKEN
              )
    return response.json() // parses JSON response into native JavaScript objects
  }

// Prepare corrected date which is legible to MongoDB
const prepareDate = (originalDate) => {
    const [year, mon, day, hour, min, sec] = originalDate
        .split(" ").flatMap(e1 => e1.split(":")).map(e2 => parseInt(e2))
    // Correct month (JS starts at month 0)
    const correctedMonth = mon == 1 ? 12 : mon - 1
    return new Date(Date.UTC(year, correctedMonth, day, hour, min, sec))
}

// Construct a unique identifier on MongoDB based on DJIs internal media numbering
const prepareName = (filePath) => {
    const identifyer = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
    const correctedName = identifyer == panoFirstImageName ? __path.basename(__path.dirname(filePath)) : identifyer
    return correctedName
}

// Loop through media
newRawMedia.forEach (
    media => {
          // Instantiate document
        let metadata = {
            name: prepareName(media),
            dateTime: new Date(),
            geometry: {
                type: "", 
                coordinates: {} 
            },
            altitude: "",
            country: "", // JSON data parsed by `data.json()` call
            city: "",
            postalCode: "",
            suburb: "",
            road: "",
        }
        // Get the exif data
        ExifReader.load(media)
            .then(data => {
                metadata.dateTime = prepareDate(data.DateTimeOriginal.description)
                metadata.altitude = data.GPSAltitude.description
                let latitude = data.GPSLatitude.description
                let longitude = data.GPSLongitude.description
                metadata.geometry.type = "Point"
                metadata.geometry.coordinates.latitude = latitude
                metadata.geometry.coordinates.longitude = longitude
                getReverseGeoData(latitude, longitude).then(
                    data => {

/*
                        // Get the reverse geo data
                        metadata.country =  data.address.country // JSON data parsed by `data.json()` call
                        metadata.city = data.address.city
                        metadata.postalCode = data.address.postcode
                        metadata.suburb = data.address.suburb
                        metadata.road = data.address.road


*/

                        // Feed metadata into Mongoose model
                        const document = new Island(metadata)
                        // Save document to DB
                        document.save()




                    }
                )}
            )
        }
    )