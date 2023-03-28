import Constants from '../middleware/constants.mjs'
import { getId } from '../middleware/functions.mjs'
import { ListObjectsCommand, DeleteObjectCommand, GetObjectAclCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { Island, s3 } from './manageConnections.mjs'
import ExifReader from 'exifreader'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from 'sharp'

// Remove format suffix from files
const removeSuffix = filePath => {
  return filePath.substring(0, filePath.lastIndexOf('.'))
}

// Get exif data
async function getExif(media) {
  const exifdataPromise = Promise.all( 
    media.map(medium => {
      return ExifReader.load(medium.original) // Slow, but reliable (exifr is fast, but omits timezone offset)
    })
  )
return exifdataPromise
}

async function manage() {
  /// List

  // Original files (which are the master)
  const originalFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGINALS_BUCKET } ))
  const originalFiles = originalFileInfo.Contents.map(originalFile => {
    let path = originalFile.Key
    return { key: getId(path), location: removeSuffix(path), path: path }
  })
  
  // Site files
  const siteFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))
  const siteFiles = siteFileInfo.Contents.map(siteFile => {
    let path = siteFile.Key
    return { key: getId(path), path: path }
  })
  
  /// Add

  // New files
  const newFiles = originalFiles.filter(x => !siteFiles.map(y => y.key).includes(x.key))




  const sigUrl =  await getSignedUrl(
    s3, new GetObjectCommand({ Bucket: Constants.ORIGINALS_BUCKET,  Key: 'pan/100_0061.tif' }, { expiresIn: Constants.EXPIRY_TIME_IN_SECS } )
  )

  console.log(sigUrl)

  sharp(sigUrl)


  /*
  let a = await s3.send(new GetObjectCommand({Bucket: Constants.ORIGINALS_BUCKET, Key: 'pan/100_0061.tif'}))
  let b = a.Body

  console.log(b)


import {Readable} from "stream";
import {createWriteStream} from "fs";
pipe(createWriteStream(fileName)
let b = a.Body.pipe(createWriteStream(fileName))


  const a = await Promise.all(
    newFiles.map(async element => {
      let b = await s3.send(new GetObjectCommand({Bucket: Constants.ORIGINALS_BUCKET, Key: element.path}))
      let c = b.Body.pipe(createWriteStream(fileName))
      return c
    })
  )


// ID NEW FILES, GET ALL METADATA, STORE ALL METADATA IN DB, SHARP FILES, STORE IN MELVILLE
  // ID OUTDATED FILES, DELETE THEM IN DB, ON FILES (TRY CATCH)
  
  // TODO

  /*
  // New metadata
  const newMetadata = originalFiles.filter(x => !metadata.includes(x.key))
  const a = await Promise.all(
    newMetadata.map(async element => {
      let b = s3.send(new GetObjectCommand({Bucket: Constants.ORIGINALS_BUCKET, Key: element.path}))
      return b
    })
  )


  console.log(a)
    */

  ///const exifData = await getExif(newMetadata)

  /*
  /// Delete TODO -- FILES AND DB AT ONCE

  // Outdated site files
  const outdatedFiles = siteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  console.log("Outdated site files:")
  console.log(outdatedFiles)
  // TODO forEach await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: 'pan/100_0500.tif'}))

  // Outdated metadata
  const outdatedMetadata = metadata.filter(x => !originalFiles.map(y => y.key).includes(x))
  await Island.deleteMany( { name : { $in : outdatedMetadata } } )
  console.log("Outdated metadata:")
  console.log(outdatedMetadata)

*/

}

manage()


/*

export { manage }

*/