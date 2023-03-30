
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'
import { Readable } from "stream"


// Manipulate and save files
const update = media => {
  Promise.all(
    media.flatMap(async medium => {
      // Get the file from S3 Origin Bucket (Patrick) as Readable Stream
      const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

      // Loop through both actual and thumbnail image for each medium
      medium.targets.map(async target => {
        console.log(target)

        // Create and apply Sharp transformer
        const transformer = sharp()
        .webp( { lossless: false } )
        .resize({
          width: 2000,
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
                ContentType: `image/${Constants.SITE_MEDIA_FORMAT}`,
                Key: target, ////medium.targets[1],
                Body: uploadStream
            },
        })

        // Pipe the stream through
        response.pipe(transformer).pipe(uploadStream)
        return await upload.done()
      })

      console.log("----------------")

      return
    })
  )


    

} 

export { update }