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
    let fullPath = path.join('./media', mediaFolder)
    return fs.readdirSync(fullPath, { withFileTypes: false })
      .filter(filterDots)
      .map(file => ({key: file.substring(0, file.lastIndexOf('.')), folder: mediaFolder})) 
  }
)

async function manage() {
  // Get all existing metadata on db
  const existingMetadata = (await Island.find({})
    .select('name -_id'))
    .map(element => element.name)

    // Get all media which are newly added to the web app
    const newMedia = existingMedia
      .filter(({key}) => !existingMetadata.includes(key))

    console.log(newMedia)



    // Initialize new raw media container
    let newRawMedia = []

    if (newMedia.length > 0) {
        // Loop through media and check if they have been added since the last dump of metadata to the DB
        newMedia.forEach (
        medium => {
            const folder = medium.folder
            const id = medium.key
            let originalFile 
            // Get HDR media
            if (folder == Constants.MEDIA_FOLDERS[0]) {
            originalFile = path.join(Constants.RAW_MEDIA_REPO, folder, id) + Constants.RAW_MEDIA_SUFFIX
            }
            // Get non-HDE media
            else {
                const filePath = path.join(rawMediaRepo, folder, Constants.RAW_MEDIA_PREFIX, id)
                // Get the first file in each directory
                originalFile = fs.readdirSync(filePath, { withFileTypes: false })
                    .filter(filterDots)
                    .map(file => path.join(filePath, file))[0]
                }
            newRawMedia.push(originalFile)
            }   
        )

    return newRawMedia
}
}

let a = await manage()
console.log(a)

/*

async function manage() {
  
    // Initialize new raw media container
    newRawMedia = []

    if (newMedia.length > 0) {
        // Loop through media and check if they have been added since the last dump of metadata to the DB
        newMedia.forEach (
        medium => {
            const folder = medium.folder
            const id = medium.key
            let originalFile 
            // Get HDR media
            if (folder == __mediaFolders[0]) {
            originalFile = __path.join(rawMediaRepo, folder, id)  + rawMediaSuffix
            }
            // Get non-HDE media
            else {
                const filePath = __path.join(rawMediaRepo, folder, rawMediaPrefix, id)
                // Get the first file in each directory
                originalFile = fs.readdirSync(filePath, { withFileTypes: false })
                    .filter(filterDots = file => !file.startsWith('.'))
                    .map(file => __path.join(filePath, file))[0]
                }
            newRawMedia.push(originalFile)
            }   
        )
    }
  return [newRawMedia, existingMedia]
}


module.exports = manage()

*/