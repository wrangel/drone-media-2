import fs from 'fs'
import path from 'path'
import Constants from '../middleware/constants.mjs'

// Load Mongoose model
import { Island } from './manageDb.mjs'

// Filter hidden files
const filterDots = file => !file.startsWith('.')

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

  console.log(existingMetadata)

  // Remove all metadata from db which is not in the app's media folder

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