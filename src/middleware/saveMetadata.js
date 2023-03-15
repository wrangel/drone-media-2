const ExifReader = require('exifreader')
const newRawMedia = require(__path.join(__basePath, 'app'))

// Define REST constants
const baseUrlElement1 = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const baseUrlElement2 = '.json?access_token='
const ACCESS_TOKEN = 'pk.eyJ1IjoiYmF0aGh1cnN0IiwiYSI6ImNsZjN0eDg1bjB2d2czeHIwMmxra2QyODQifQ.I_CDtcMoSDmCjQErpayFCQ'
const panoFirstImageName = 'DJI_0001'
const addressComponents = ["address", "postcode", "place", "region", "country"]

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
    return new Date(Date.UTC(year, mon - 1, day, hour, min, sec))
}

// Construct a unique identifier on MongoDB based on DJIs internal media numbering
const prepareName = (filePath) => {
    const identifyer = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
    const correctedName = identifyer == panoFirstImageName ? __path.basename(__path.dirname(filePath)) : identifyer
    return correctedName
}


// Loop through media
newRawMedia.forEach (
    async media => {
        // Instantiate document
        let metadata = {
            name: prepareName(media),
            dateTime: new Date(),
            geometry: {
                type: "", 
                coordinates: {} 
            }
        }
        const exifdata = await ExifReader.load(media)
        metadata.dateTime = prepareDate(exifdata.DateTimeOriginal.description)
        metadata.altitude = exifdata.GPSAltitude.description
        metadata.geometry.type = "Point"
        metadata.geometry.coordinates.latitude = exifdata.GPSLatitude.description
        metadata.geometry.coordinates.longitude = exifdata.GPSLongitude.description

        // Attach reverse geo information based on geometry
        const reverseGeoMetadata = await getReverseGeoData(metadata.geometry.coordinates.latitude, metadata.geometry.coordinates.longitude)
        // Fuzzy match the Mapbox output
        everything = []
        addressComponents.forEach(addressComponent => {
            everything.push(reverseGeoMetadata.features.filter(doc => doc.id.startsWith(addressComponent))
                .map(doc => doc.text)[0])
        })
        console.log(everything)
    }
    
)



/*

async function save() {
       
                            
                            
                            addressComponents.forEach(addressComponent => {
                                everything.push(data.features.filter(doc => doc.id.startsWith(addressComponent))
                                    .map(doc => doc.text)[0])
                            })
                            metadata.road = everything[0]
                            metadata.postalCode = everything[1]
                            metadata.location = everything[2]
                            metadata.region = everything[3]
                            metadata.country = everything[4]

                            // Feed metadata into Mongoose model
                            const document = new __Island(metadata)
                            // Save document to DB
                            document.save()
                       
    }

save().then(
    console.log("Saved new metadata to the db")
).catch((error) => {
    console.error("Could not save metadata to the db:" + error)
  })
  
  */