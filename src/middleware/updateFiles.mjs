
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import dotenv from 'dotenv-vault-core'
dotenv.config()
import Constants from './constants.mjs'
import { s3 } from './handleSources.mjs'


// Manipulate and save files (Return a Promise that this all will happen)
async function update(media, mediaType) {
  return Promise.all(
    media.flatMap(async medium => {
      // Get the file from S3 Origin Bucket (Patrick) as Readable Stream
      const response = (await s3.send(new GetObjectCommand( { Bucket: process.env.ORIGINALS_BUCKET, Key: medium.origin } ))).Body

      // Instantiate the target
      let target
      // Instantiate Sharp transformer
      const transformer = sharp()

      // Adapt transformer and target for actual media
      if(mediaType == Constants.ACTUAL_ID) {
        target = medium.targets[0]
        transformer.webp( { lossless: true } )
      } 
      // Adapt transformer and target for thumbnail media
      else {
        target = medium.targets[1]
        transformer.webp( { lossless: false } )
        if(medium.type  != 'hdr') {
          transformer.resize({
            width: 2000,
            height: 1300,
            position: sharp.strategy.attention
          })
        }
      }

      /*  Create a PassThrough Stream
          Thanks, @danalloway, https://github.com/lovell/sharp/issues/3313, https://sharp.pixelplumbing.com/api-constructor
      */
      const uploadStream = new PassThrough()
      const upload = new Upload({
        client: s3,
        queueSize: 1,
        params: {
          Bucket: process.env.SITE_BUCKET ,
          ContentType: `image/${Constants.MEDIA_FORMATS.site}`,
          Key: target,
          Body: uploadStream
        },
      })

      // Pipe the stream through to the S3 Site bucket (Melville)
      response.pipe(transformer).pipe(uploadStream)
      // Return a Promise
      return upload.done()
    })  
  ) 
} 

export { update }