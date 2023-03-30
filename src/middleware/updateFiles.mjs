
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'


// Manipulate and save files
async function update(media) {
  return await Promise.all(
    media.flatMap(async medium => {
      // Get the file from S3 Origin Bucket (Patrick) as Readable Stream
      const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

      // Loop through both actual and thumbnail image for each medium
      medium.targets.map(async target => {
        // Determine if image needs compression and / or resizing
        const losslessFlag = target.indexOf(Constants.THUMBNAIL_FOLDER) > -1 ? false : true
        const resizeFlag = !losslessFlag && medium.type  != 'hdr' ? true : false

        // Create and apply Sharp transformer
        const transformer = sharp()
          .webp( { lossless: losslessFlag } )
          if(resizeFlag) {
            transformer.resize({
              width: 2000,
              height: 1300,
              position: sharp.strategy.attention
            })
          }

        /*  Create a PassThrough Stream
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

        // Pipe the stream through to the S3 Site bucket (Melville)
        response.pipe(transformer).pipe(uploadStream)
        // Return a Promise
        return await upload.done()
      })
      // Pass the Promise on to the outer loop
      return
    })
  )
} 

export { update }