import ExifReader from 'exifreader'
import Constants from './constants.mjs'
import { Island } from './manageConnections.mjs'

/*  Converts the timestamp string into a GMT / Local date (that is what exifr is doing wrong!)
    https://stackoverflow.com/questions/43083993/javascript-how-to-convert-exif-date-time-data-to-timestamp
*/
const getDate = s => { 
    const [year, month, date, hour, min, sec] = s.split(/\D/) 
    return new Date(year, month - 1 ,date, hour, min, sec) 
}

// Convert GPS in case string is returned
const convertGPS = coord => {
    let corrected
    try {
        corrected = parseFloat(coord)
    } catch {
        corrected = coord.match(/[0-9]/g)
    }
    return corrected
}

// Save the data to the db
async function save(media) {

    // Get exif data for the new files
    const exifData = await Promise.all( 
        media.map(async medium => {
            const exif = await ExifReader.load(medium.sigUrl) // Slow, but reliable (exifr is fast, but omits timezone offset)
            return {
                    key: medium.key,
                    path: medium.path,
                    exif_datetime: exif.DateTimeOriginal.description,
                    exif_longitude: convertGPS(exif.GPSLongitude.description),
                    exif_latitude: convertGPS(exif.GPSLatitude.description),
                    exif_altitude: exif.GPSAltitude.description
            }
        })
    )

    // Get the urls for the reverse engineering call
    const reverseUrls = exifData.map (
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
    const combined = reverseGeocodingData.map(function (reverse, i) {
        const base = media[i]
        const exif = exifData[i]
        console.log(base, exif, reverse)
    })



}

export { save }

    /*

    // Combine everything into the Mongoose compatible metadata
    const combined = reverseData.map(function (reverse, i) {
        const base = media[i]
        const exif = exifdata[i]
        metadata.name = base.key
        metadata.type = base.folder
        metadata.author = ''
        metadata.dateTimeString = exif.DateTimeOriginal.description
        metadata.dateTime = getDate(exif.DateTimeOriginal.description)
        metadata.geometry.type = 'Point'
        metadata.geometry.coordinates.latitude = exif.GPSLatitude.description
        metadata.geometry.coordinates.longitude = exif.GPSLongitude.description
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