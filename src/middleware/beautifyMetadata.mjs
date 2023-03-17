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
const beautify = docs => {
  const makePretty = docs.map (doc => {
    return {
      name: doc.name,
      type: doc.type,
      viewer: doc.type == 'pano' ? 'pano' : 'img',
      dateTime: prepareDate(doc.dateTime),
      latitude: doc.geometry.coordinates.latitude,
      longitude: doc.geometry.coordinates.longitude,
      altitude: doc.altitude,
      country: doc.country,
      region: doc.region,
      location: doc.location,
      postalCode: doc.postalCode,
      road: doc.road == undefined ? '' : ', above ' + doc.road,
      noViews: 0
    }
  })
  return makePretty
}

export { beautify } 