
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'


// Manipulate and save files
const update = media => {

    Promise.all(
        media.flatMap(async medium => {

            // Get the file from S3 Origin bucket (Patrick) as a Readable Stream
            const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body

            // Loop through targets (for each image, there is an actual and thumbnail image)
            let a = medium.targets.map(target => {
                // Determine if image needs compression and / or resizing
                const compressFlag = target.indexOf("thumbnails") > -1 ? true : false
                const resizeFlag = medium.type === 'hdr' ? false : true


                return resizeFlag
            })
            console.log("----------")

            console.log(a)

            ///------//
            /*  Create a passthrough stream and an upload container
            Thanks, @danalloway, https://github.com/lovell/sharp/issues/3313, https://sharp.pixelplumbing.com/api-constructor
            */
            const uploadStream = new PassThrough()
            const upload = new Upload({
                client: s3,
                queueSize: 1,
                params: {
                    Bucket: Constants.SITE_BUCKET,
                    ContentType: `image/${Constants.SITE_MEDIA_FORMAT}`,
                    Key: medium.key + '.webp', //medium.targets.actual,
                    Body: uploadStream
                },
            })

            const transformer = sharp()
                .webp( { lossless: false } )
            
        
            transformer.resize({
                width: 2000,
                height: 1300,
                position: sharp.strategy.attention
            })
            ///---------///

            response.pipe(transformer).pipe(uploadStream)
            //return await upload.done()

        })
    )
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