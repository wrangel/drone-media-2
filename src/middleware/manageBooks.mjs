import fs from 'fs'
import path from 'path'
import Constants from '../middleware/constants.mjs'
import { getId } from '../middleware/functions.mjs'
import { ListObjectsCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'

// Load Mongoose model
import { Island, s3 } from './manageConnections.mjs'

// Filter hidden files // TODO kill?
const filterDots = file => !file.startsWith('.') // TODO kill?

// Remove format suffix from files
const removeSuffix = filePath => {
  return filePath.substring(0, filePath.lastIndexOf('.'))
}

async function manage() {
  /// List

  // Original files (which are the master)
  const originalFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGINALS_BUCKET } ))
  const originalFiles = originalFileInfo.Contents.map(originalFile => {
    let path = originalFile.Key
    return { key: getId(path), location: removeSuffix(path), path: path }
  })
  
  // Site files
  const siteFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))
  const siteFiles = siteFileInfo.Contents.map(siteFile => {
    let path = siteFile.Key
    return { key: getId(path), path: path }
  })

  // Metadata on db
  const metadata = (await Island.find({})
    .select('name -_id'))
    .map(element => element.name)
  
  /// Add

  // New files
  const newFiles = originalFiles.filter(x => !siteFiles.map(y => y.key).includes(x.key))
  // TODO

  // New metadata
  const newMetadata = originalFiles.filter(x => !metadata.includes(x.key))
  // TODO

  /// Delete

  // Outdated site files
  const outdatedFiles = siteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  console.log("outdated site files:")
  console.log(outdatedFiles)
  // NOT RUN forEach await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: 'pan/100_0500.tif'}))

  // Outdated metadata
  const outdatedMetadata = metadata.filter(x => !originalFiles.map(y => y.key).includes(x))
    
  console.log(outdatedMetadata)


  /*
  const existingMediaKeys = existingMedia.map(element => {return element.key})
  const removableKeys = existingMetadata.filter(x => !existingMediaKeys.includes(x))
  const deleted = await Island.deleteMany( { name : { $in : removableKeys } } )
  */

}

manage()

/*
// Get existing media
const existingMedia = Constants.MEDIA_FOLDERS.flatMap(
  mediaFolder => {
    return fs.readdirSync(path.join('./media', mediaFolder), { withFileTypes: false })
      .filter(filterDots)
      .map(file => ({key: file.substring(0, file.lastIndexOf('.')), folder: mediaFolder})) 
  }
)

// Get the full file path
const getFilePath = (folder, key) => {
  let filePath 
  // Get HDR media
  if (folder == Constants.MEDIA_FOLDERS[0]) {
    filePath = path.join(Constants.RAW_MEDIA_REPO, folder, key) + Constants.RAW_MEDIA_SUFFIX
  } 
  // Get non-HDE media
  else {
    const parentPath = path.join(Constants.RAW_MEDIA_REPO, folder, Constants.RAW_MEDIA_PREFIX, key)
    // Get the first file in each directory
    filePath = fs.readdirSync(parentPath, { withFileTypes: false })
      .filter(filterDots)
      .map(file => path.join(parentPath, file))[0]
  }
  return filePath
}

// Get all the newly added media
async function manage() {
  // Get all existing metadata on db
  const existingMetadata = (
    await Island.find({})
    .select('name -_id')
  )
    .map(element => element.name)

  // Remove all metadata from db which is not in the app's media folder
  const existingMediaKeys = existingMedia.map(element => {return element.key})
  const removableKeys = existingMetadata.filter(x => !existingMediaKeys.includes(x))
  const deleted = await Island.deleteMany( { name : { $in : removableKeys } } )
  console.log(deleted)
  
  // Get all media which are newly added to the web app
  const newMedia = existingMedia
    .filter(({key}) => !existingMetadata.includes(key))

    // TODO put that directly above to the existingMetadata
    .map(medium => {
      const folder = medium.folder
      const key = medium.key
      return {key: key, folder: folder, filePath: getFilePath(folder, key)}
    })
  return newMedia
}

export { manage }

*/