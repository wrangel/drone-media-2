import ExifReader from 'exifreader'

/*

const newRawMedia = require(__path.join(__basePath, 'app'))


// GET reverse geo data
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

newRawMedia.map(
    media => {
        const exifdata = ExifReader.load(media)
    }
)

/*

// Loop through media, load each piece into db
newRawMedia.forEach (
    
       

        // Attach reverse geo information based on geometry
        const reverseGeoMetadata = await getReverseGeoData(
            metadata.geometry.coordinates.latitude, metadata.geometry.coordinates.longitude
            )
        // Fuzzy match the Mapbox output
        everything = []
        addressComponents.forEach(addressComponent => {
            everything.push(reverseGeoMetadata.features.filter(doc => doc.id.startsWith(addressComponent))
                .map(doc => doc.text)[0])
        })
        metadata.road = everything[0]
        metadata.postalCode = everything[1]
        metadata.location = everything[2]
        metadata.region = everything[3]
        metadata.country = everything[4]

        // Feed metadata into Mongoose model
        t document = new __Island(metadata)
        // Save document to DB
        //////await document.save()
    } 
)



*/