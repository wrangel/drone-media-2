const ExifReader = require('exifreader')

// Get Mongoose model
const Island = require(__path.join(__middlewarePath, 'manageDb'))

// Define REST constants
const reverseGeoCodeURL = 'https://geocode.maps.co/reverse'
const panoFirstImageName = 'DJI_0001'
const url = 'https://app.zipcodebase.com/api/v1/search'
const apiKey = 'f9a4b680-bf90-11ed-b04f-f5f79e90e953'

// Get media from main
const newRawMedia = require('./manageBooks')

// Get reverse geo data
async function getReverseGeoData(latitude, longitude) {
    const response = await fetch(reverseGeoCodeURL + '?' + new URLSearchParams({
        lat: latitude,
        lon: longitude
    }))
    return response.json() // parses JSON response into native JavaScript objects
  }

// Get missing cities
async function getCity(postalCode) {
    const response = await fetch(url + '?' + new URLSearchParams({
        apikey: apiKey,
        codes: postalCode,
        country: 'CH'
    }))
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
            location: {
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
                if(data.DateTimeOriginal) {
                    metadata.dateTime = prepareDate(data.DateTimeOriginal.description)
                }
                if(data.GPSAltitude) {
                    metadata.altitude = data.GPSAltitude.description
                }
                if(data.GPSLatitude && data.GPSLongitude) {
                    let latitude = data.GPSLatitude.description
                    let longitude = data.GPSLongitude.description
                    metadata.location.type = "Point"
                    metadata.location.coordinates.latitude = latitude
                    metadata.location.coordinates.longitude = longitude
                    getReverseGeoData(latitude, longitude).then(
                        data => {
                            // Get the reverse geo data
                            metadata.country =  data.address.country // JSON data parsed by `data.json()` call
                            metadata.city = data.address.city ? undefined : "lalallsslsllslsl"
                            metadata.postalCode = data.address.postcode
                            metadata.suburb = data.address.suburb
                            metadata.road = data.address.road
                            // Feed metadata into Mongoose model
                            const document = new Island(metadata)
                            // Save document to DB
                            document.save()
                        }
                    )
                }
            })
        }
)