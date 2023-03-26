import { S3Client, GetObjectCommand, ListObjectsCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from '../middleware/constants.mjs'

// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

// Create instance of S3 Client
const s3 = new S3Client({
  credentials: {
    accessKeyId: Constants.SITE_ACCESS_KEY,
    secretAccessKey: Constants.SITE_SECRET_ACCESS_KEY
  },
  region: Constants.BUCKET_REGION
})

// Get the urls
async function getUrls() {
  // Get all the files in the bucket
  const list = await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))

  // Get presigned url
  const arr0 = await Promise.all(
    list.Contents.map(async content => {
      const key = content.Key
      const type = key.substring(0, key.indexOf('/')) == 'thumbnails' ? 'thumbnails' : 'actual'
      return {
        id: getId(key),
        type, 
        sigUrl: await getSignedUrl(
          s3, new GetObjectCommand({ Bucket: Constants.SITE_BUCKET,  Key: key }, { expiresIn: Constants.EXPIRY_TIME_IN_SECS } )
        )
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