import exifr from 'exifr/dist/full.esm.mjs'
import Constants from './constants.mjs'

// Load Mongoose model
import { Island } from './manageDb.mjs'

// Save the data to the db
async function prepare(media) {

    // Get and aggregate all exifdata promises to one
    const exifdataPromise = Promise.all(media.map(
        media => {
            return exifr.parse(media.filePath)
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
        metadata.dateTime = exif.DateTimeOriginal // TODO GMT + 1 (nicht GMT)
        metadata.geometry.type = "Point"
        metadata.geometry.coordinates.latitude = exif.latitude
        metadata.geometry.coordinates.longitude = exif.longitude
        metadata.altitude = exif.GPSAltitude
        metadata.country = reverse.country
        metadata.region = reverse.region
        metadata.location = reverse.place
        metadata.postalCode = reverse.postcode
        metadata.road = reverse.address
        metadata.noViews = 0
        // Feed metadata into Mongoose model
        return new Island(metadata)
    })

    return combined   
}

export { prepare }