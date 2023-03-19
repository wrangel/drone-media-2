import ExifReader from 'exifreader'
import { raw } from 'express'
import Constants from './constants.mjs'

// Load Mongoose model
import { Island } from './manageDb.mjs'

/*  Converts the timestamp string into a GMT / Local date (that is what exifr is doing wrong!)
    https://stackoverflow.com/questions/43083993/javascript-how-to-convert-exif-date-time-data-to-timestamp
*/
const getDate = s => { 
    const [year, month, date, hour, min, sec] = s.split(/\D/) 
    return new Date(year, month - 1 ,date, hour, min, sec) 
}

// Save the data to the db
async function prepare(media) {
 
    // Get and aggregate all exifdata promises to one
    const exifdataPromise = Promise.all(media.map(
        medium => {
            return ExifReader.load(medium.filePath) // Slow, but reliable (exifr is fast, but omits timezone offset)
        }
    ))

    // wait ..
    const exifdata = await exifdataPromise

    // Get the urls for the reverse engineering call
    const urls = exifdata.map (
        exif => {
            return Constants.REVERSE_GEO_URL_ELEMENTS[0] + 
            exif.GPSLongitude.description + ', ' + exif.GPSLatitude.description + 
            Constants.REVERSE_GEO_URL_ELEMENTS[1] + Constants.ACCESS_TOKEN
        }
    )

    // Get the jsons from the reverse engineering call
    const jsons = await Promise.all(
        urls.map(async url => {
            const resp = await fetch(url)
            return resp.json()
            }
        )
    )

    // Get the reverse geocoding data
    const reverseData = jsons.map (
        json => {
            let data = {}
            Constants.ADDRESS_COMPONENTS.forEach(addressComponent => {
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

export { prepare }