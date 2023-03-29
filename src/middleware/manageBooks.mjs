import { ListObjectsCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'
import { save } from './updateMetadata.mjs'
import { update } from './updateFiles.mjs'


import { PassThrough } from 'stream'
import { Upload } from '@aws-sdk/lib-storage'
import sharp from 'sharp'

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

    // Manipulate and save newly added files to the S3 bucket containing the site media (Melville)
    update(media)

    const medium = media[0]

    // Get a file from S3 as Readable Stream
    const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

    // Create and apply Sharp transformer
    const transformer = sharp()
      .webp( { lossless: false } ) // TODO add dyn flag
      //.withMetadata()
      .resize({
        width: 1200,
        height: 1300,
        position: sharp.strategy.attention
      })

    /*  Create a passthrough stream
        Thanks, @danalloway, https://github.com/lovell/sharp/issues/3313, https://sharp.pixelplumbing.com/api-constructor
    */
    const uploadStream = new PassThrough()

    const upload = new Upload({
      client: s3,
      queueSize: 1,
      params: {
          Bucket: Constants.SITE_BUCKET,
          ContentType: 'image/webp',
          Key: 'dededede.webp',
          Body: uploadStream
      },
  })

  response.pipe(transformer).pipe(uploadStream)

  await upload.done()

  }
}

manage()