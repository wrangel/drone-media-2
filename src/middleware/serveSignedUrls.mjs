import { GetObjectCommand, ListObjectsCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from './constants.mjs'
import { getId } from '../middleware/functions.mjs'
import { s3 } from './handleSources.mjs'

// Get the urls
async function getUrls() {

  // Wait for Promise to resolve to get all the files in the bucket
  const list = (await s3.send(new ListObjectsCommand({ Bucket: Constants.SITE_BUCKET } ))).Contents

  // Provide Promises to get presigned urls
  const arr0 = await Promise.all(
    list.map(async content => {
      const key = content.Key
      const type = key.substring(0, key.indexOf('/')) == Constants.THUMBNAIL_ID ? Constants.THUMBNAIL_ID : Constants.ACTUAL_ID
      return {
        id: getId(key),
        type,
        // Allow access for 1.1 days
        sigUrl: await getSignedUrl(s3, new GetObjectCommand({ Bucket: Constants.SITE_BUCKET,  Key: key }), { expiresIn: 95040 })
      }
    })
  )

  // Reduce the info on the id
  const arr1 = arr0.reduce((acc, d) => {
    const found = acc.find(a => a.id === d.id)
    const value = { type: d.type, sigUrl: d.sigUrl } // the element in data property
    if (!found) {
      acc.push({id:d.id, data: [value]}) // not found, so need to add data property
    }
    else {
      found.data.push(value) // if found, that means data property exists, so just push new element to found.data
    }
    return acc
  }, 
  [])

  // sort urls based on type (first: actual, second: thumbnail)
  const arr2 = arr1.map(r => {
    const sorted = r.data.sort(function (a, b) {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      return 0;
    })
    return {id: r.id, data: sorted}
  })

  // Create new key value pair
  return arr2.map(elem => {
    let actual_url = Object.values(elem.data)[0].sigUrl
    let thumbnail_url = Object.values(elem.data)[1].sigUrl
    return {name: elem.id, urls: {actual: actual_url, thumbnail: thumbnail_url}}
  })

}

export { getUrls }