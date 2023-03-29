
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'


// Create and apply Sharp transformer
const transformer = losslessFlag => sharp()
    .webp( { lossless: losslessFlag } )
    .resize({
        width: 1200,
        height: 1300,
        position: sharp.strategy.attention
    })

// Manipulate and save files
const update = media => {

    // Promise.all() //////
    media.forEach(async medium => {
        console.log(medium) //////

        /*  Create a passthrough stream and an upload container
        Thanks, @danalloway, https://github.com/lovell/sharp/issues/3313, https://sharp.pixelplumbing.com/api-constructor
        */
        const uploadStream = new PassThrough()
        const upload = new Upload({
            client: s3,
            queueSize: 1,
            params: {
                Bucket: Constants.SITE_BUCKET,
                ContentType: 'image/webp', //`image/${Constants.SITE_MEDIA_FORMAT}`,
                Key: medium.key + '.webp', //medium.targets.actual,
                Body: uploadStream
            },
        })

        // Get the file from S3 as a Readable Stream
        const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

        const transformer = sharp()
            .webp( { lossless: false } )
            .resize({
            width: 2000,
            height: 1300,
            position: sharp.strategy.attention
        })

        response.pipe(transformer).pipe(uploadStream)
        await upload.done()

    })


} 

export { update }


/*
        // Create a Sharp object
        const sharpObject = sharp(response)

        // actual
        sharpObject.webp({ lossless: false })


        //thumbnail (compressed)
        if(medium.type != 'hdr') {
            // hdr: as is, wide-angle & pano: crop to 2000x1300, in the middle of the pic
            sharpObject.resize({
              width: 2000,
              height: 1300,
              position: sharp.strategy.attention
            })
           }
        sharpObject.webp({ lossless: true })

        ////////////


   const medium = media[0]

    // Get the file from S3 as Readable Stream
    const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

    // Create and apply Sharp transformer
    const transformer = sharp()
      .webp( { lossless: true } )
      .resize({
        width: 2000,
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