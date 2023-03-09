const Island = require('./manageDBConnection')
const ExifReader = require('exifreader')
const reverseGeoCodeURL = 'https://geocode.maps.co/reverse'

// Get image from main
const newRawMedia = require('./app')

async function getReverseGeoData(latitude, longitude) {
    const response = await fetch(reverseGeoCodeURL + '?' + new URLSearchParams({
        lat: latitude,
        lon: longitude
    }))
    return response.json() // parses JSON response into native JavaScript objects
  }
  
newRawMedia.forEach (
    media => {
          // Instantiate document
        let metadata = {
            name: media, //.substring(img.lastIndexOf('/'), img.lastIndexOf('.')),
            dateTime: new Date(),
            location: { type: "", coordinates: [] },
            altitude: "",
            country: "", // JSON data parsed by `data.json()` call
            city: "",
            postalCode: "",
            suburb: "",
            road: "",
        }
        
        // Get the exif data
        ExifReader.load(media).then((data) => {
            if(data.DateTimeOriginal) {
                let [year, mon, day, hour, min, sec] = data.DateTimeOriginal.description
                    .split(" ").flatMap(e1 => e1.split(":")).map(e2 => parseInt(e2))
                const correctedMonth = mon == 1 ? 12 : mon - 1
                metadata.dateTime = new Date(Date.UTC(year, correctedMonth, day, hour, min, sec))
            }
            if(data.GPSAltitude) {
                metadata.altitude = data.GPSAltitude.description
            }
            if(data.GPSLatitude && data.GPSLongitude) {
                let latitude = data.GPSLatitude.description
                let longitude = data.GPSLongitude.description
                metadata.location.type = "Point"
                metadata.location.coordinates[0] = latitude
                metadata.location.coordinates[1] = longitude
                getReverseGeoData(latitude, longitude).then(
                    data => {
                        // Get the reverse geo data
                        metadata.country =  data.address.country // JSON data parsed by `data.json()` call
                        metadata.city = data.address.city
                        metadata.postalCode = data.address.postcode
                        metadata.suburb = data.address.suburb
                        metadata.road = data.address.road
                        // Feed metadata into Mongoose model
                        const document = new Island(metadata)
                        console.log(metadata)
                        document.save()
                    }
                )
            }
          })
        }
)