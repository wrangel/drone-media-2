const baseUrlElement1 = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
const baseUrlElement2 = '.json?access_token='
const ACCESS_TOKEN = 'pk.eyJ1IjoiYmF0aGh1cnN0IiwiYSI6ImNsZjN0eDg1bjB2d2czeHIwMmxra2QyODQifQ.I_CDtcMoSDmCjQErpayFCQ';
 
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
    const latitude = doc.location.coordinates.latitude
    const longitude = doc.location.coordinates.longitude
    //console.log(latitude, longitude)

    //let c = await reverseGeocoding(latitude, longitude)

    getReverseGeoData(latitude, longitude).then(
      data => {
        console.log("--------------")
        console.log(data.features[0].place_name)
      })


    })

  //
  
}

grab()
