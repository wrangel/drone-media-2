import { ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from './constants.mjs'
import { getId } from '../middleware/functions.mjs'
import { Island } from './manageSources.mjs'
import { s3 } from './manageSources.mjs'
import { save } from './updateMetadata.mjs'
import { update } from './updateFiles.mjs'


// List files
async function list() {
  // List original files (which are the master)
  const originalFiles = (await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGIN_BUCKET } ))).Contents
    .map(originalFile => {
      let path = originalFile.Key
      return { key: getId(path), path: path }
    })

  // Get site files
  const siteFiles = (await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))).Contents
    .map(siteFile => {
      let path = siteFile.Key
      return { key: getId(path), path: path }
    })

  // Get new files TODO does not distinguish between thumbnails and actuals
  const newFiles = originalFiles.filter(x => !siteFiles.map(y => y.key).includes(x.key))
  const nonNewFiles = newFiles.length
  console.log(`${nonNewFiles} new files to add`) 
  
  return {originalFiles: originalFiles, siteFiles: siteFiles, newFiles: newFiles}
}


// Purge files and metadata -- TODO delete both actual and thumbnail -- NOT RUN - DENIED 
async function purge(originalFiles, siteFiles) {
  /*
  const outdatedFiles = siteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  await Promise.all(
    outdatedFiles.map(async outdatedFile => {
      console.log(Constants.SITE_BUCKET, outdatedFile.path)
      await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: outdatedFile.path}))
    })
  )
  */

  // Get the outdated metadata
  const docs = (await Island.find({}, 'name -_id')
    .lean())
    .map(doc => doc.name)
  const outdatedMetadata = docs.filter(x => !originalFiles.map(y => y.key).includes(x))
  await Island.deleteMany( { name : { $in : outdatedMetadata } } )
}


// Add new files' info
async function getNewFileInfo(newFiles) {
  return await Promise.all(
    newFiles.map(async newFile => {
      const key = newFile.key
      const path = newFile.path
      return {
        key: key,
        type: path.substring(0, path.indexOf('/')),
        origin: path, 
        targets: [
            path.replace(/\b(.tif|.jpeg)\b/gi, Constants.SITE_MEDIA_FORMAT), // actual
            Constants.THUMBNAIL_FOLDER + '/' + key + Constants.SITE_MEDIA_FORMAT // thumbnail
        ],
        sigUrl: await getSignedUrl( // use presigned urls for exif extraction // TODO same as in getSignedUrls for the new files
          s3, new GetObjectCommand({ Bucket: Constants.ORIGIN_BUCKET,  Key: newFile.path }, { expiresIn: Constants.EXPIRY_TIME_IN_SECS } )
        )
      }
    })
  )
}


// Manage files and metadata
async function manage() {
  // List
  const lists = await list()
  // Purge
  await purge(lists.originalFiles, lists.siteFiles)
  // Upload and manipulate metadata and files
  if (lists.newFiles.length > 0) {
    const newFileInfo = await getNewFileInfo(lists.newFiles)
    // Save metadata of newly added files to Mongo DB
    await save(newFileInfo)
    // Manipulate and save newly added files to the S3 bucket containing the site media (Melville)
    await update(newFileInfo)
  }
}

export { manage }