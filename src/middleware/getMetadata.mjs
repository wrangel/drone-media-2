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

// Get all the metadata from the db
async function grab() {
  const docs = Island.find({})
  
  return docs


  /*
  console.log(docs.dateTime)
  return {
    name: docs.name,
    type: docs.type,
    viewer: docs.type == 'pano' ? 'pano' : 'img',
    author: "", // TODO
    dateTime: prepareDate(docs.dateTime),
    latitude: docs.geometry.coordinates.latitude,
    longitude: docs.geometry.coordinates.longitude,
    altitude: docs.altitude,
    country: docs.country,
    region: docs.region,
    location: docs.location,
    postalCode: docs.postalCode,
    road: docs.road == undefined ? '' : ', above ' + docs.road,
    noViews: 0
  }.reverse()
  */
}

export { grab }