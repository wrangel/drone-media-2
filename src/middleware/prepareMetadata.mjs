import ExifReader from 'exifreader'
import Constants from './constants.mjs'

// Load Mongoose model
import { Island } from './manageDb.mjs'

// Converts the timestamp string into a UTC date (that is what exifr is doing wrong!)
const prepareTimestamp = datetimeString => {
    const [y,m,d,h,M,s] = datetimeString.split(' ').flatMap(
      element => element.split(':')
    )
      .map (element => parseInt(element))
    return new Date(Date.UTC(y,m,d,h,M,s))
  }

// Save the data to the db
async function prepare(media) {

    // Get and aggregate all exifdata promises to one
    const exifdataPromise = Promise.all(media.map(
        media => {
            return ExifReader.load(media.filePath) // Slow, but reliable (exifr is fast, but omits timezone offset)
        }
    ))

    // wait ..
    const exifdata = await exifdataPromise

    // Get the urls for the reverse engineering call
    const urls = exifdata.map (
        ed => {
            return Constants.BASE_URL_ELEMENT_1 + 
            ed.longitude + ', ' + ed.latitude + 
            Constants.BASE_URL_ELEMENT_2 + Constants.ACCESS_TOKEN
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
    let reverseData = jsons.map (
        json => {
            let rd = {}
            Constants.ADDRESS_COMPONENTS.forEach(addressComponent => {
                rd[addressComponent] = 
                    json.features
                        .filter(doc => doc.id.startsWith(addressComponent))
                        .map(doc => doc.text)[0]
            })
            return rd
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
        let exif = exifdata[i]
        metadata.name = media[i].key
        metadata.author = '' // TODO
        metadata.dateTime = prepareTimestamp(exif.DateTimeOriginal.description)
        metadata.geometry.type = "Point"
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