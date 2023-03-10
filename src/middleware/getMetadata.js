const fs = require('fs')
const Island = require('./manageDb')





async function main() {
  // Get all the metadata on the db
  const docs = await Island.find({})
  console.log(docs)
  }

main()



/*
const document = new Island(
                    {
                        name: img.substring(0, img.lastIndexOf('.')),
                        datetime: new Date(Date.UTC(year, mon, day, hour, min, sec)),
                        coordinates: { type: "Point", coordinates: [longitude, latitude] },
                        country: data.address.country, // JSON data parsed by `data.json()` call
                        city: data.address.city,
                        postCode: data.address.postcode,
                        road: data.address.road,
                        houseNumber: data.address.house_number
                    }
                  )
                document.save()

*/
