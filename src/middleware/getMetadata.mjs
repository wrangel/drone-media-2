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


  /*
  return {
    name: docs.name,
    type: docs.type,
    viewer: docs.type == 'pano' ? 'pano' : 'img',
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
  }
  */
