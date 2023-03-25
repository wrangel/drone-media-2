import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand} from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import dotenv from 'dotenv'
dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

/*

// Create instance of S3 Client
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
})

async function main() {

    const list = await s3.send(new ListObjectsCommand( { Bucket: bucketName } ))
    //console.log(list.Contents)
    
    // Pan out all the info
    const arr = await Promise.all(
      list.Contents.map(async content => {
        const key = content.Key
        const id = getId(key)
        const parent = key.substring(0, key.indexOf('/'))
        const type = parent == 'thumbnails' ? 'thumbnails' : 'actual'
        return {
          id: id,
          type, 
          sigUrl: await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucketName,  Key: key }, { expiresIn: 86400 } )) // in seconds. Here: a day
        }
      })
    )

//console.log(arr)
  
  // Reduce on the id
  const result = arr.reduce((acc, d) => {
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
  
  console.log(result)

  // sort urls based on type (actual, thumbnail)
  let sortedResult = result.map(r => {
    let sorted = r.data.sort(function (a, b) {
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

  // Create new kv pair
  let finalResult = sortedResult.map(elem => {
    
    let values_0 = Object.values(elem.data)[0]
    let values_1 = Object.values(elem.data)[1]
    //let a00 = Object.values(values_0)[0]
    let a01 = Object.values(values_0)[1]
    //let a10 = Object.values(values_1)[0]
    let a11 = Object.values(values_1)[1]

    const d = new URL(a01).toJSON()
    const e = new URL(a11).toJSON()

    return {name: elem.id, urls: {actual: a01, thumbnail: a11}}
  })

  */
 