const fs = require('fs')
const path = require('path')

// Get web app directories
const {mediaPath, mediaFolders} = require('../../app')

// Load Mongoose model
const Island = require('./manageDb')

// Define path constants
const rawMediaRepo = '/Users/matthiaswettstein/SynologyDrive/Matthias/DJI/'
const rawMediaPrefix = 'Einzelfotos'
const rawMediaSuffix = '.tif'

// Filter hidden files
filterDots = file => !file.startsWith('.')

// Save document to Mongo DB
const saveMetadata = (files) => {
  // Store new file's metadata in DB
  module.exports = files
  require('./saveMetadata')
}
          
// Get existing media
let existingMedia = []
mediaFolders.forEach(
  mediaFolder => {
    let fullPath = path.join(mediaPath, mediaFolder)
    let fileObjs = fs.readdirSync(fullPath, { withFileTypes: false })
      .filter(filterDots)
      .map(file => ({key: file.substring(0, file.lastIndexOf('.')), folder: mediaFolder}))
    existingMedia = existingMedia.concat(fileObjs)
  }
)

async function main() {
  // Get all existing metadata on db
  const existingMetadata = (await Island.find({})
    .select('name -_id'))
    .map(element => element.name)    
    // Get all images which are newly added to the web app
    const newMedia = existingMedia.filter(({key}) => !existingMetadata.includes(key))
    if (newMedia.length > 0) {
        // Loop through media and check if they have been added since the last dump of metadata to the DB
        newRawMedia = []
        newMedia.forEach (
        medium => {
            const folder = medium.folder
            const id = medium.key
            let originalFile 
            // Get HDR media
            if (folder == mediaFolders[0]) {
            originalFile = path.join(rawMediaRepo, folder, id)  + rawMediaSuffix
            }
            // Get non-HDE media
            else {
                const filePath = path.join(rawMediaRepo, folder, rawMediaPrefix, id)
                // Get the first file in each directory
                originalFile = fs.readdirSync(filePath, { withFileTypes: false })
                    .filter(filterDots = file => !file.startsWith('.'))
                    .map(file => path.join(filePath, file))[0]
                }
            newRawMedia.push(originalFile)
            }   
        )
        saveMetadata(newRawMedia)
    }
}

main()