
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'


// Manipulate and save files
const update = async media => {

  await Promise.all(
    media.map(async medium => {

      // Get the file from S3 Origin bucket (Patrick) as a Promise of a Readable Stream
      const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

      // Loop through targets (for each image, there is an actual and thumbnail image)
      medium.targets.map(async target => {
        // Determine if image needs compression and / or resizing
        const losslessFlag = target.indexOf(Constants.THUMBNAIL_FOLDER) > -1 ? false : true
        const resizeFlag = !losslessFlag && medium.type  != 'hdr' ? true : false
        /*  Create a PassThrough Stream and an upload container
        Thanks, @danalloway, https://github.com/lovell/sharp/issues/3313, https://sharp.pixelplumbing.com/api-constructor
        */
        const uploadStream = new PassThrough()
        const upload = new Upload({
          client: s3,
          queueSize: 1,
          params: {
              Bucket: Constants.SITE_BUCKET,
              ContentType: `image/${Constants.SITE_MEDIA_FORMAT}`,
              Key: target,
              Body: uploadStream
          },
        })
        // Create Sharp transformation stream
        const transformStream = sharp()
          .webp( { lossless: losslessFlag } )
        if(resizeFlag) {
          transformStream.resize({
              width: 2000,
              height: 1300,
              position: sharp.strategy.attention
          })
        }
        // Pipe through
        response.pipe(transformStream).pipe(uploadStream)
        // Return an upload Promise
        return await upload.done()
      })
      return
    })
  )
  console.log("Updated all files")
} 

export { update }