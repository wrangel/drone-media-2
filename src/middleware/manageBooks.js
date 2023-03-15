const fs = require('fs')

// Define path constants 
// for dockerized node, mount to the volume specified in docker-compose.yml
const rawMediaRepo = __runDockerized == true ? '/mnt/originals' : '/Volumes/docker/ellesmere/originals'

const rawMediaPrefix = 'Einzelfotos'
const rawMediaSuffix = '.tif'

// Filter hidden files
filterDots = file => !file.startsWith('.')
          
// Get existing media
let existingMedia = []
__mediaFolders.forEach(
  mediaFolder => {
    let fullPath = __path.join(__mediaPath, mediaFolder)
    let fileObjs = fs.readdirSync(fullPath, { withFileTypes: false })
      .filter(filterDots)
      .map(file => ({key: file.substring(0, file.lastIndexOf('.')), folder: mediaFolder}))
    existingMedia = existingMedia.concat(fileObjs)
  }
)

async function manage() {
  // Get all existing metadata on db
  const existingMetadata = (await __Island.find({})
    .select('name -_id'))
    .map(element => element.name)  
    
    // Get all images which are newly added to the web app
    const newMedia = existingMedia.filter(({key}) => !existingMetadata.includes(key))
  
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
  return newRawMedia
}

module.exports = manage()