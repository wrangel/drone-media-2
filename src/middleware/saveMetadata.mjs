import ExifReader from 'exifreader'
import Constants from './constants.mjs'
import { Island } from './manageConnections.mjs'

/*  Converts the timestamp string into a GMT / Local date (that is what exifr is doing wrong!)
    https://stackoverflow.com/questions/43083993/javascript-how-to-convert-exif-date-time-data-to-timestamp
*/
const getDate = str => { 
    const [year, month, date, hour, min, sec] = str.split(/\D/) 
    return new Date(year, month - 1 ,date, hour, min, sec) 
}

// Converts the altitude into meter-above-sea
const getAltitude = altitudeString => {
    let altitude
    if (altitudeString.endsWith('m')) {
        altitude = parseFloat(altitudeString.replace('m', ''))
    } else {
        const components = altitudeString.split('/').map(component => parseFloat(component))
        altitude = components[0] / components[1]
    }
    return altitude
}

// Convert GPS, if string is returned
const getCoordinates = coordString => {
    let coord
    try {
        coord = parseFloat(coordString)
    } catch {
        coord = coordString.match(/[0-9]/g)
    }
    return coord
}

// Save the data to the db
async function save(media) {

    // Get exif data for the new files
    const base = await Promise.all( 
        media.map(async medium => {
            const exif = await ExifReader.load(medium.sigUrl) // Slow, but reliable (exifr is fast, but omits timezone offset)
            return {
                    key: medium.key,
                    path: medium.path,
                    exif_datetime: exif.DateTimeOriginal.description,
                    exif_longitude: getCoordinates(exif.GPSLongitude.description),
                    exif_latitude: getCoordinates(exif.GPSLatitude.description),
                    exif_altitude: getAltitude(exif.GPSAltitude.description)
            }
        })
    )

        console.log(base)

    // Get the urls for the reverse engineering call
    const reverseUrls = base.map (
        exif => Constants.REVERSE_GEO_URL_ELEMENTS[0] + exif.exif_longitude + ', ' + exif.exif_latitude + 
                    Constants.REVERSE_GEO_URL_ELEMENTS[1] + Constants.REVERSE_GEO_ACCESS_TOKEN 
    )

    // Get the jsons from the reverse engineering call
    const jsons = await Promise.all(
        reverseUrls.map(async reverseUrl => {
            const resp = await fetch(reverseUrl)
            return await resp.json()
        })
    )

    // Get the reverse geocoding data
    const reverseGeocodingData = jsons.map (
        json => {
            let data = {}
            Constants.REVERSE_GEO_ADDRESS_COMPONENTS.forEach(addressComponent => {
                data[addressComponent] = 
                    json.features
                        .filter(doc => doc.id.startsWith(addressComponent))
                        .map(doc => doc.text)[0]
            })
            return data
        }
    )

    // Instantiate metadata for the schema
    const metadata = {
        geometry: {
            type: "", 
            coordinates: {}
        }
    }

    // Combine everything into the Mongoose compatible metadata
    const combined = base.map(function (x, i) {
        //console.log(x, reverseGeocodingData[i])
    })

     /*
    const combined = reverseGeocodingData.map(function (reverse, i) {
        const base = media[i]
        const exif = exifData[i]
        metadata.name = base.key
        metadata.type = base.path.substring(0, base.path.indexOf('/'))
        metadata.author = ''
        metadata.dateTimeString = exif.exif_datetime
        metadata.dateTime = getDate(exif.exif_datetime)
        metadata.geometry.type = 'Point'
        metadata.geometry.coordinates.latitude = exif.exif_latitude
        metadata.geometry.coordinates.longitude = exif.exif_longitude
    })
*/
    //console.log(metadata)


}

export { save }

    /*

        
        

        metadata.altitude = parseFloat(exif.GPSAltitude.description.replace(' m', ''))
        metadata.country = reverse.country
        metadata.region = reverse.region
        metadata.location = reverse.place
        metadata.postalCode = reverse.postcode
        metadata.road = reverse.address
        metadata.noViews = 0
        return new Island(metadata)
    })
    return combined
}

*/