
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

const convertToWebp = (sharpObject, losslessFlag, outputPath) => {
    sharpObject.webp({ lossless: losslessFlag })
    }

// Manipulate and save files
const update = media => {

    // Promise.all() //////
    media.forEach(async medium => {
        console.log(medium) //////
        // Get the file from S3 as a Readable Stream
        const response = (await s3.send(new GetObjectCommand( { Bucket: Constants.ORIGIN_BUCKET, Key: medium.origin } ))).Body
        // Create a Sharp object
        const sharpObject = sharp(response)
        // Collect the file paths for both actual and thumbnail images

       // Array.from([medium.target_actual, medium.target_thumbnail]).forEach(x => console.log(x))


        let a = 'hdr/100_0071.jpeg'

        let b = a.replace('tif', 'webp').replace('jpeg', 'webp')
        console.log(b)
        

    })


} 

export { update }


/*

// Convert data
async function convertImages(media) {
  Promise.all(
    media.map(async medium => {
      const sharpObject = sharp(medium.original)
      // actuals, equal for all media categories
      convertToWebp(sharpObject, true, medium.target)

      /*  thumbnails (compressed)
          a) hdr: as is
          b) wide-angle & pano: crop to 2000x1300, in the middle of the pic
      --
     if(medium.folder != 'hdr') {
      sharpObject.resize({
        width: 2000,
        height: 1300,
        position: sharp.strategy.attention
      })
     }
     convertToWebp(sharpObject, false, medium.thumbnail)
    })
  )
}

await convertImages(newMedia)

/////////////////

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