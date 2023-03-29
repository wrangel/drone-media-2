
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'


// Manipulate and save files
const update = media => {

    media.forEach(async medium => {
        medium
        console.log(medium) //////
        // Get the file from S3 as Readable Stream
        const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

    })


} 

export { update }


/*

   const medium = media[0]

    // Get the file from S3 as Readable Stream
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
    --
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

      */