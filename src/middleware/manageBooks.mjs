import { ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import Constants from './constants.mjs'
import { getId } from '../middleware/functions.mjs'
import { Island, Author } from './manageSources.mjs'
import { s3 } from './manageSources.mjs'
import { save } from './updateMetadata.mjs'
import { update } from './updateFiles.mjs'


// Get current status
async function getCurrentStatus() {
  // List Original files (which are the master) - Await for Promise
  const originalFiles = (await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGIN_BUCKET } ))).Contents
    .map(originalFile => {
      let path = originalFile.Key
      return { key: getId(path), path: path }
    })
  // Get Site files - Await for Promise
  const siteFiles = (await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))).Contents
    .map(siteFile => {
      let path = siteFile.Key
      return { key: getId(path), path: path }
    })
  // Get actual image Site files
  const actualSiteFiles = siteFiles.filter(siteFile => siteFile.path.indexOf("thumbnails") == -1)
  // Get thumbnail image Site files
  const thumbnailSiteFiles = siteFiles.filter(siteFile => siteFile.path.indexOf("thumbnails") > -1)
  // Get Island collection entries
  const islandDocs = (await Island.find({}, 'name -_id')
    .lean())
    .map(doc => doc.name)
  // Get Author collection entries
  const authorDocs = (await Author.find({}, 'name -_id')
    .lean())
    .map(doc => doc.name)
  return Promise.all([originalFiles, actualSiteFiles, thumbnailSiteFiles, islandDocs, authorDocs])
}


// Collect all differences
function getDiffs(currentStatus) {
  const [originalFiles, actualSiteFiles, thumbnailSiteFiles, islandDocs, authorDocs] = currentStatus
  // 1a) Get actual files to be added to Site bucket
  const newActualFiles = originalFiles.filter(x => !actualSiteFiles.map(y => y.key).includes(x.key))
  // 1b) Get actual files to be purged from Site bucket
  const outdatedActualFiles = actualSiteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  // 2a) Get actual files to be added to Site bucket
  const newThumbnailFiles = originalFiles.filter(x => !thumbnailSiteFiles.map(y => y.key).includes(x.key))
  // 2b) Get actual files to be purged from Site bucket
  const outdatedThumbnailFiles = thumbnailSiteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  // 3a) Get documents to be added to Island collection
  const newIslandDocs = originalFiles.filter(x => !islandDocs.includes(x.key))
  // 3b) Get documents to be purged from Island collection
  const outdatedIslandDocs = islandDocs.filter(x => !originalFiles.map(y => y.key).includes(x))  
  // 4a) Get documents to be purged from Author collection
  const outdatedAuthorDocs = authorDocs.filter(x => !originalFiles.map(y => y.key).includes(x))
  return {
    newActualFiles: newActualFiles, outdatedActualFiles: outdatedActualFiles,
    newThumbnailFiles: newThumbnailFiles, outdatedThumbnailFiles: outdatedThumbnailFiles,
    newIslandDocs: newIslandDocs, outdatedIslandDocs, outdatedIslandDocs,
    outdatedAuthorDocs: outdatedAuthorDocs
  }
}


// Purge files and metadata 
async function purge(diffs) {
  // Get Promise to purge actual files
  const actualFilePurgePromise = Promise.all(
    diffs.outdatedActualFiles.map(async outdatedActualFile => {
      //await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: outdatedActualFile.path})) // TODO NOT RUN - DENIED 
    })
  )
  const thumbnailFilePurgePromise = Promise.all(
    diffs.outdatedThumbnailFiles.map(async outdatedThumbnailFile => {
      //await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: outdatedThumbnailFile.path})) // TODO NOT RUN - DENIED 
    })
  )
  // Return Promise to purge every outdated element
  return Promise.all([
    actualFilePurgePromise,
    thumbnailFilePurgePromise,
    Island.deleteMany({ name : { $in : diffs.outdatedIslandDocs } }), 
    Author.deleteMany({ name : { $in : diffs.outdatedAuthorDocs } })
  ])
}


/* new actuals
  - get metadata A
  - add metadata B
  - add file C

  new thumbnails
  - add file C

  new Island metadata (make sure you update Authors manually!)
  - get metadata A
  - add metadata B
  - merge with Authors D

*/

// Add info for newly added elements
async function getInfo(newElements) {
  return Promise.all(
    newElements.map(async newElement => {
      const key = newElement.key
      const path = newElement.path
      return {
        key: key,
        type: path.substring(0, path.indexOf('/')),
        origin: path, 
        targets: [
            path.replace(/\b(.tif|.jpeg)\b/gi, Constants.SITE_MEDIA_FORMAT), // actual
            Constants.THUMBNAIL_FOLDER + '/' + key + Constants.SITE_MEDIA_FORMAT // thumbnail
        ],
        // use presigned urls for exif extraction later on
        sigUrl: await getSignedUrl(s3, new GetObjectCommand({ Bucket: Constants.ORIGIN_BUCKET,  Key: newElement.path }), { expiresIn: 1200 })
      }
    })
  )
}



// Manage files and metadata
async function manage() {
  // Wait for Promises to get the current contents
  const currentStatus = await getCurrentStatus()
  const diffs = getDiffs(currentStatus)
  // Purge outdated elements
  await purge(diffs)


  const info = await getInfo(diffs.newThumbnailFiles)
  console.log(info)

  //diffs.newActualFiles, diffs.newIslandDocs diffs.newThumbnailFiles

  /*
  // Wait for resolve of Promise to get new file data
  const newFileInfo = await getNewFileInfo(lists.newFiles)
  // Promise to save metadata of newly added files to Mongo DB 
  const updatePromise1 = save(newFileInfo)
  // Promise to manipulate and save newly added files to the S3 bucket containing the site media (Melville)
  const updatePromise2 = update(newFileInfo)
  // Purge outdated files and metadata
  const purgePromise = purge(lists.originalFiles, lists.siteFiles)

  // Return Promise to update everything to the caller
  return Promise.all([updatePromise1, updatePromise2, purgePromise]) 
  */
}

export { manage }