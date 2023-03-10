const url = 'https://app.zipcodebase.com/api/v1/search'
const apiKey = 'f9a4b680-bf90-11ed-b04f-f5f79e90e953'

async function getCity(postalCode) {
    const response = await fetch(url + '?' + new URLSearchParams({
        apikey: apiKey,
        codes: postalCode,
        country: 'CH'
    }))
    
    return response.json() // parses JSON response into native JavaScript objects
  }

  getCity('3935').then(response => {
    let c = Object.values(response.results)[0][0].city
    console.log(c)
  })
