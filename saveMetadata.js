const Island = require('./manageDBConnection')
const ExifImage = require('exif').ExifImage
const reverseGeoCodeURL = 'https://geocode.maps.co/reverse'

// Get image from main
const img = require('./app')

// Convert bow to decimal
function toDecimal(gpsValueRef, gpsValue) {
    // degrees, minutes and seconds to decimal: Degrees + Minutes/60 + Seconds/3600, *1 if N or E, *-1 if S or W
    return (gpsValue[0] + gpsValue[1]/60 + gpsValue[2]/3600) * (['N', 'E'].includes(gpsValueRef) ? 1 : -1)
}

// Fetch reverse geo data
async function getReverseGeoData(latitude, longitude) {
    const response = await fetch(reverseGeoCodeURL + '?' + new URLSearchParams({
        lat: latitude,
        lon: longitude
    }))
    return response.json() // parses JSON response into native JavaScript objects
  }

// Get image metadata
try {
    new ExifImage({ image: img }, function (error, exifData) {
        if (error)
            console.log('Error: ' + error.message)
        else {
            // Prepare metadata
            let [year, mon, day, hour, min, sec] = exifData.exif.DateTimeOriginal
                .split(" ").flatMap(e1 => e1.split(":")).map(e2 => parseInt(e2))
            let gps = exifData.gps
            let latitude = toDecimal(gps.GPSLatitudeRef, gps.GPSLatitude)
            let longitude = toDecimal(gps.GPSLongitudeRef, gps.GPSLongitude)
            // Handle async fetch call
            getReverseGeoData(latitude, longitude).then(data => {
                // Fill in metadata into Mongoose model
                const document = new Island(
                    {
                        name: img.substring(0, img.lastIndexOf('.')),
                        datetime: new Date(Date.UTC(year, mon, day, hour, min, sec)),
                        coordinates: { type: "Point", coordinates: [longitude, latitude] },
                        country: data.address.country, // JSON data parsed by `data.json()` call
                        city: data.address.city,
                        postCode: data.address.postcode,
                        road: data.address.road,
                        houseNumber: data.address.house_number
                    }
                  )
                document.save()
             })
        }
    })
} catch (error) {
    console.log('Error: ' + error.message)
}
