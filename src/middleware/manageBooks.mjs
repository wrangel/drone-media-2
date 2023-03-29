import { ListObjectsCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from './constants.mjs'
import { s3 } from './manageSources.mjs'
import { save } from './updateMetadata.mjs'
import { update } from './updateFiles.mjs'


// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

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
        const path = newFile.path
        return {
          key: newFile.key,
          type: path.substring(0, path.indexOf('/')),
          origin: path, 
          targets: {
              actual: path.replace('.tif', Constants.SITE_MEDIA_FORMAT).replace('jpeg', Constants.SITE_MEDIA_FORMAT),
              thumbnail: 'thumbnails/' + newFile.key + Constants.SITE_MEDIA_FORMAT
          },
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
  }
}

manage()