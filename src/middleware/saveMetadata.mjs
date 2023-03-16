import exifr from 'exifr/dist/full.esm.mjs'
import Constants from '../middleware/constants.mjs'

const save = async (media) => {

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

// Combine everything
let combined = reverseData.map(function (reverse, i) {
    let exif = exifdata[i]
    let y = Object.assign({}, 
        media[i], 
        reverse, {
        latitude: exif.latitude, 
        longitude: exif.longitude,
        altitude: exif.GPSAltitude,
        dateTime: exif.DateTimeOriginal // TODO GMT + 1 (nicht GMT)
        }
    )
    return y
  })

  console.log(combined)
}



export { save }



//console.log(combined)
// key - name, folder - type, filepath WEG, road in address umschreiben, postcode - postalCode, 

/*
        metadata.road = everything[0]
        metadata.postalCode = everything[1]
        metadata.location = everything[2]
        metadata.region = everything[3]
        metadata.country = everything[4]

async function save(media) {
}
export { save }

const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  author: String, -- OK
  dateTime: Date,
  geometry: {}, // TODO improve schema
  altitude: String,
  country: String,
  region: String,
  location: String,
  postalCode: String,
  road: String,
  noViews: Number
})

 metadata.dateTime = prepareDate(data.DateTimeOriginal.description)
metadata.geometry.type = "Point"
metadata.geometry.coordinates.latitude = data.GPSLatitude.description
metadata.geometry.coordinates.longitude = data.GPSLongitude.description

        // Feed metadata into Mongoose model
        t document = new __Island(metadata)
        // Save document to DB
        await document.save()
*/