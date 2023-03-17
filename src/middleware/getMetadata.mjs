// Load Mongoose model
import { Island } from './manageDb.mjs'

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

// Get all the metadata from the db
async function grab() {
  const docs = Island.find({})
  return docs
}

export { grab }


/*

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
      ///////
    }
  ).reverse()
}

*/