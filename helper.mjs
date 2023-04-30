import fs from 'fs'
import path from 'path'
import ExifReader from 'exifreader'
import sharp from 'sharp'
import dotenv from 'dotenv'
dotenv.config()
import Constants from './src/middleware/constants.mjs'
import { Island } from './src/middleware/handleSources.mjs'
import { question, runCli } from './src/middleware/functions.mjs'

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

// Get decimal GPS coordinates
const getCoordinates = (coordString, orientation) => {
  let coordinate = parseFloat(coordString)
  if(['S', 'W'].indexOf(orientation) > - 1) {
    coordinate = -coordinate
  }
  return coordinate
}

/*
// A) Prepare ////OK
// Get infos about the new media files
const files = fs.readdirSync(process.env.INPUT_DIRECTORY)
const fileInfo = files
  .filter(sourceFile => !sourceFile.startsWith('.'))
  .map(sourceFile => {
    let name = sourceFile.substring(0, sourceFile.lastIndexOf('.'))
    // Rename file if needed
    if(name.endsWith(Constants.RENAME_IDS[1])) {
      name = name.replace(Constants.RENAME_IDS[1], '')
        .replace(Constants.RENAME_IDS[0], Constants.REPLACEMENT)
    }
    return {name: name, sourceFile: sourceFile, targetFile: name + Constants.MEDIA_FORMATS.large}
  })


const noMedia = fileInfo.length
if (noMedia == 0) {
  console.log("No media to manage")
  process.exit(0)
} 
else {
  console.log(`${noMedia} media to manage`)
  console.log(fileInfo)
  // Collect user input about authors of the media (while is async by nature!)
  let idx = 0
  while (idx < fileInfo.length) {
    const name = fileInfo[idx].name
    const answer = await question(`Author and media type of --> ${ name } <-- (comma separated) : `)
    let [author, mediaType] = answer.split(',').map(x => x.trim())
    // Allow only known authors
    while (!Constants.CONTRIBUTORS.includes(author)) {
      author = await question(`Please choose one of (${ Constants.CONTRIBUTORS }) as author for --> ${ name }  <-- : `)
    }
    // Allow only known media types
    while (!Constants.MEDIA_PAGES.includes(mediaType)) {
      mediaType = await question(`Please choose one of (${ Constants.MEDIA_PAGES }) as media type for --> ${ name } <-- : `)
    }
    // Add the new info to the fileInfo object
    fileInfo[idx].author = author
    fileInfo[idx].mediaType = mediaType
    idx += 1
  }
  */

  const media = [ ////// KILL
  {
    name: '100_0208',
    sourceFile: '100_0208.tif',
    targetFile: '100_0208.tif'
  }
]

// Get exif data for the new files
const base = await Promise.all(
  media.map(async medium => {      
    const exif = await ExifReader.load(path.join(process.env.INPUT_DIRECTORY, medium.sourceFile))
    return {
      key: medium.key,
      exif_datetime: exif.DateTimeOriginal.description,
      exif_longitude: getCoordinates(exif.GPSLongitude.description, exif.GPSLongitudeRef.value[0]),
      exif_latitude: getCoordinates(exif.GPSLatitude.description, exif.GPSLatitudeRef.value[0]),
      exif_altitude: getAltitude(exif.GPSAltitude.description)
    }
  })
)

// Get the urls for the reverse engineering call
const reverseUrls = base.map (
  exif => Constants.REVERSE_GEO_URL_ELEMENTS[0] + exif.exif_longitude + ', ' + exif.exif_latitude + 
    Constants.REVERSE_GEO_URL_ELEMENTS[1] + process.env.ACCESS_TOKEN
)

// Get the jsons from the reverse engineering call (Wait on all promises to be resolved)
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

console.log(reverseGeocodingData)

  /*
  /// B) Update MongoDB
  // Prepare JSON for MongoDB insert -- type: element.mediaType is obsolete, since it is added downstream anyway
  const newIslands = fileInfo.map(element => { return { name: element.name, type: element.mediaType, author: element.author } })
  // Update MongoDB
  await Island.insertMany(newIslands)

  /// C) Convert file to .jpeg, copy .jpeg to OneDrive, move .tif to 'done' folder
  await Promise.all(
    fileInfo.map(async fi => {
      console.log(fi)
      const inputFile = path.join(process.env.INPUT_DIRECTORY, fi.sourceFile)
      // Handle jpegs
      await sharp(inputFile)
        .jpeg({ quality: 100 })
        .withMetadata()
        .toFile(path.join(process.env.ONEDRIVE_DIRECTORY, fi.sourceFile.replace(Constants.MEDIA_FORMATS.large, Constants.MEDIA_FORMATS.small)))
      // Handle .tifs
      fs.rename(inputFile, path.join(process.env.OUTPUT_DIRECTORY, fi.sourceFile), function (err) {
        if (err) {
            throw err
        } else {
            console.log(`Successfully moved ${inputFile}`)
        }
      })
    })
  )

  /// D) Upload media to AWS S3 (requires AWS CLI with proper authentication: Alternative would be an S3 client)
  await Promise.all(
    fileInfo.map(fi => 
    runCli(`aws s3 cp ${process.env.OUTPUT_DIRECTORY}${fi.sourceFile} s3://${process.env.ORIGINALS_BUCKET}/${fi.mediaType}/${fi.targetFile}`)
    )
  )
  */

/////}