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

  // Compile the needed metadata (there might me more on the db)
  return existingMedia.map (
    medium => {
      const name = medium.key
      const type = medium.folder
      const dbMetadata = docs.filter(i => i.name === name)[0]
      return {
        name: name,
        type: type,
        viewer: type == 'pano' ? 'pano' : 'img',
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
    }
  ).reverse()
}

module.exports = grab()