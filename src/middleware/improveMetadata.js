const baseUrlElement1 = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const baseUrlElement2 = '.json?access_token='
const ACCESS_TOKEN = 'pk.eyJ1IjoiYmF0aGh1cnN0IiwiYSI6ImNsZjN0eDg1bjB2d2czeHIwMmxra2QyODQifQ.I_CDtcMoSDmCjQErpayFCQ'
const addressComponents = ["address", "postcode", "region", "country"]
 
// Get reverse geo data (REST)
async function getReverseGeoData(latitude, longitude) {
  const response = await fetch (baseUrlElement1
            + longitude + ', ' + latitude
            + baseUrlElement2 + ACCESS_TOKEN
            )
  return response.json() // parses JSON response into native JavaScript objects
}


async function grab(){
  // Get all the metadata on the db
  const docs = await __Island.find({})
  docs.forEach (async doc => {
    const latitude = doc.geometry.coordinates.latitude
    const longitude = doc.geometry.coordinates.longitude
    getReverseGeoData(latitude, longitude).then(
      data => {       
        everything = [] 
        addressComponents.forEach(addressComponent => {
            everything.push(data.features.filter(doc => doc.id.startsWith(addressComponent))
              .map(doc => doc.text)[0])
        })
        console.log(everything)
      })
    })
}

grab()
