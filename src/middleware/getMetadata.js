const existingMedia = require(__path.join(__basePath, 'app'))

// Prepare date for website
const prepareDate = date => {
  options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "CET",
    timeZoneName: "short"
  }
  return new Intl.DateTimeFormat("en-US", options).format(date)
}

// Prepare location
const prepareRoad = road => {
  return road == undefined ? '' : ', above ' + road
}

// Prepare altitude
const prepareAltitude = altitude => {
  const components = altitude.split(' ')
  return Number(components[0]).toFixed(2) + ' ' + components[1]
}

// Prepare all metadata
async function grab() {
  // Get all the metadata on the db
  const docs = await __Island.find({})



  ///////console.log(existingMedia)

  existingMedia.forEach (
    medium => {
      medium.key // name / id
      medium.folder // type
      const viewer = medium.folder == 'pano' ? 'pano' : 'img'
    }
  )

  const glob = require('glob')
const globParent = require('glob-parent')

  const media222 = glob.sync(__mediaPath + '/*('+ __mediaFolders.toString().replaceAll(',', '|') + ')/*')
      .map(path => {
          const tmp = globParent(path)
          const type = tmp.substring(tmp.lastIndexOf('/') + 1, tmp.length)
          const viewer = type == 'pano' ? 'pano' : 'img'
          const id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
          /////console.log(type, viewer, id)
      }
      )
  
/*
 {
    name: '100_0497',
    type: 'wide_angle',
    viewer: 'img',
    author: '',
    dateTime: 'Saturday, February 18, 2023 at 19:08:30 GMT+1',
    latitude: 47.40482313888889,
    longitude: 8.525132416666667,
    altitude: '692.16 m',
    country: 'Switzerland',
    region: 'Zürich',
    location: 'Zürich',
    postalCode: '8037',
    road: ', above Wannenweg',
    noViews: 0
  },
  */
  
  // Create dict with all media files and their respective metadata
    const media = glob.sync(__mediaPath + '/*('+ __mediaFolders.toString().replaceAll(',', '|') + ')/*')
      .map(path => {
          const tmp = globParent(path)
          const type = tmp.substring(tmp.lastIndexOf('/') + 1, tmp.length)
          const viewer = type == 'pano' ? 'pano' : 'img'
          const id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))



          // Get the respective db metadata
          const dbMetadata = docs.filter(i => i.name === id)[0]
          return {
            name: id,
            type: type,
            viewer: viewer,
            author: "", // TODO
            dateTime: prepareDate(dbMetadata.dateTime),
            latitude: dbMetadata.geometry.coordinates.latitude,
            longitude: dbMetadata.geometry.coordinates.longitude,
            altitude: prepareAltitude(dbMetadata.altitude),
            country: dbMetadata.country,
            region: dbMetadata.region,
            location: dbMetadata.location,
            postalCode: dbMetadata.postalCode,
            road: prepareRoad(dbMetadata.road),
            noViews: 0 // TODO
          }
      })
    return media.reverse()
    
}

module.exports = grab()