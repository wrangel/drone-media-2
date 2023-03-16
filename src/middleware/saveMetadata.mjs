import ExifReader from 'exifreader'

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


////////////////////////




const media = 
[
    {
      key: '100_0202',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0202.tif'
    },
    {
      key: '100_0238',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0238.tif'
    },
    {
      key: '100_0247',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0247.tif'
    },
    {
      key: '100_0269',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0269.tif'
    },
    {
      key: '100_0278',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0278.tif'
    },
    {
      key: '100_0300',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0300.tif'
    },
    {
      key: '100_0358',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0358.tif'
    },
    {
      key: '100_0383',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0383.tif'
    },
    {
      key: '100_0388',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0388.tif'
    },
    {
      key: '100_0450',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0450.tif'
    },
    {
      key: '100_0461',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0461.tif'
    },
    {
      key: '100_0464',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0464.tif'
    },
    {
      key: '100_0470',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0470.tif'
    },
    {
      key: '100_0490',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0490.tif'
    },
    {
      key: '100_0508',
      folder: 'hdr',
      filePath: '/Volumes/docker/ellesmere/originals/hdr/100_0508.tif'
    },
    {
      key: '100_0056',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0056/DJI_0001.JPG'
    },
    {
      key: '100_0079',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0079/DJI_0001.JPG'
    },
    {
      key: '100_0139',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0139/DJI_0001.JPG'
    },
    {
      key: '100_0147',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0147/DJI_0001.JPG'
    },
    {
      key: '100_0156',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0156/DJI_0001.JPG'
    },
    {
      key: '100_0167',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0167/DJI_0001.JPG'
    },
    {
      key: '100_0186',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0186/DJI_0001.JPG'
    },
    {
      key: '100_0200',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0200/100_0200.jpeg'
    },
    {
      key: '100_0201',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0201/100_0201.jpeg'
    },
    {
      key: '100_0222',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0222/DJI_0001.JPG'
    },
    {
      key: '100_0282',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0282/DJI_0001.JPG'
    },
    {
      key: '100_0431',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0431/DJI_0001.JPG'
    },
    {
      key: '100_0432',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0432/100_0432.jpeg'
    },
    {
      key: '100_0444',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0444/100_0444.jpeg'
    },
    {
      key: '100_0456',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0456/DJI_0001.JPG'
    },
    {
      key: '100_0478',
      folder: 'pano',
      filePath: '/Volumes/docker/ellesmere/originals/pano/Einzelfotos/100_0478/DJI_0001.JPG'
    },
    {
      key: '100_0148',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0148/DJI_0001.JPG'
    },
    {
      key: '100_0149',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0149/DJI_0001.JPG'
    },
    {
      key: '100_0361',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0361/DJI_0001.JPG'
    },
    {
      key: '100_0385',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0385/DJI_0001.JPG'
    },
    {
      key: '100_0497',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0497/DJI_0001.JPG'
    },
    {
      key: '100_0502',
      folder: 'wide_angle',
      filePath: '/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0502/DJI_0001.JPG'
    }
  ]

const exifdata = Promise.all(media.map(
    media => {
        const rawData = ExifReader.load(media.filePath)
        const a = rawData
        
        return rawData
    }
))

const d = await exifdata
console.log(d)
d.forEach(
    i => {
        console.log("------------------------------------------------------------------------")
        console.log(i)
    }
)




const allPromise2 = Promise.all([
    //resolveTimeout(['potatoes', 'tomatoes'], 1000),
    //resolveTimeout(['oranges', 'apples'], 1000),
    ExifReader.load('/Volumes/docker/ellesmere/originals/wide_angle/Einzelfotos/100_0148/DJI_0001.JPG')
  ]);

// wait...
const lists2 = await allPromise2;
console.log
//console.log(lists2); 


  /*


async function save(media) {
    console.log(media)
   const a = media.map(
        media => {
            ExifReader.load(media.filePath)
        })
    const b = Promise.all(a)
    const c = await b
    console.log(c)
}


export { save }





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