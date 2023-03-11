const glob = require('glob')
const globParent = require('glob-parent')

// Prepare all metadata
async function grab() {
  // Get all the metadata on the db
  const docs = await __Island.find({})
  
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
            dateTime: dbMetadata.dateTime,
            latitude: dbMetadata.location.coordinates.latitude,
            longitude: dbMetadata.location.coordinates.longitude,
            altitude: dbMetadata.altitude,
            country: dbMetadata.country,
            city: dbMetadata.city,
            postalCode: dbMetadata.postalCode,
            road: dbMetadata.road,
            noViews: 0 // TODO
          }
      })

    return media.reverse()
}

module.exports = grab()