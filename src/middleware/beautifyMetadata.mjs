import Constants from './constants.mjs'
import { Island } from './manageDb.mjs'

// Prepare date for website
const prepareDate = date => {
  const options = {
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

// Adapt metadata to show prettily on the website
const beautify = async mediaFolder => {

  const docs = await Island.find({ type : mediaFolder })
        .sort({ dateTime: -1 })
        .lean()

  const makePretty = docs.map (doc => {
    return {
      name: doc.name,
      type: doc.type,
      viewer: doc.type == Constants.MEDIA_FOLDERS[1] ? 'pano' : 'img',
      author: Constants.AUTHOR_PICTURES_PATH + doc.author + Constants.AUTHOR_PICTURE_FORMAT,
      dateTime: prepareDate(doc.dateTime),
      latitude: doc.geometry.coordinates.latitude,
      longitude: doc.geometry.coordinates.longitude,
      altitude: doc.altitude.toFixed(2) + 'm',
      country: doc.country,
      region: doc.region,
      location: doc.location,
      postalCode: doc.postalCode,
      road: doc.road == undefined ? '' : ', above ' + doc.road,
      noViews: 0,
      thumbnail_url: doc.urls.thumbnail,
      actual_url: doc.urls.actual
    }
  })
  return makePretty
}

export { beautify } 