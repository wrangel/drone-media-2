import { ListObjectsCommand, DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from 'sharp'
import Constants from './constants.mjs'
import { save } from './updateMetadata.mjs'
import { s3 } from './manageSources.mjs'
import { createReadStream } from 'fs'
import { join } from 'path'


// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

//// MANUAL upload to aws (cli)
//// MANUAL update authors
//// Add metadata to db - DONE
//// update authors - DONE
//// Add converted files and tn to melville
//// Remove obsolete metadata and files from db and melville

// Manage files and metadata
async function manage() {

  // List original files (which are the master)
  const originalFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGIN_BUCKET } ))
  const originalFiles = originalFileInfo.Contents.map(originalFile => {
    let path = originalFile.Key
    return { key: getId(path), path: path }
  })
  
  // List site files
  const siteFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))
  const siteFiles = siteFileInfo.Contents.map(siteFile => {
    let path = siteFile.Key
    return { key: getId(path), path: path }
  })
  
  // Get new files
  const newFiles = originalFiles.filter(x => !siteFiles.map(y => y.key).includes(x.key))

  if (newFiles.length > 0) {

    const media = await Promise.all(
      newFiles.map(async newFile => {
        return {
          key: newFile.key,
          origin: newFile.path,
          target_actual: newFile.path.replace('.tif', '.webp'),
          target_thumbnail: 'thumbnails/' + newFile.key + '.webp',
          sigUrl: await getSignedUrl( // use presigned urls for exif extraction // TODO same as in getSignedUrls for the new files
            s3, new GetObjectCommand({ Bucket: Constants.ORIGIN_BUCKET,  Key: newFile.path }, { expiresIn: Constants.EXPIRY_TIME_IN_SECS } )
          )
        }
      })
    )

    // Save metadata of newly added files to db
    ////save(media) // TODO uncomment

    const medium = media[0]
    console.log(medium)

  

    /// get a file from s3
    const params1 = {
      Bucket: Constants.ORIGIN_BUCKET,
      Key: medium.origin,
      //Body: Buffer.from("sdf")
    }

    const response = (await s3.send(new GetObjectCommand(params1))).Body // Readable stream

    // Read image data from readableStream,
    // resize to 300 pixels wide,
    // emit an 'info' event with calculated dimensions
    // and finally write image data to writableStream
    const transformer = sharp()
      .webp({ lossless: true }) // TODO add dyn flag
      .resize({
        width: 2000,
        height: 1300,
        position: sharp.strategy.attention
      })
      .on('info', function(info) {
        console.log(`Image resized to ${info.width}, ${info.height}`)
    })
    response.pipe(transformer)//.pipe(transformed)

   let file =  join(process.env.PWD, 'media', 'about', '100_0186.webp')
  
    const readStream = createReadStream(file) // a ReadStream

    /// put the image on s3
    // Define params
    const params = {
      Bucket: Constants.SITE_BUCKET,
      Key: 'dududu', // target_actual or target_thumbnail, respectively TODO
      Body: readStream, //readStream,
      Content: 'image/webp'
    }

    // put
    await s3.send(new PutObjectCommand(params))

  }
}

manage()