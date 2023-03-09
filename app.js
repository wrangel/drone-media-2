// Load Node modules
const express = require('express')
const fs = require('fs')
const path = require('path');

// Load modules
const Island = require('././manageDBConnection')

// Initialise Express and set port
const app = express()
const port = 8080

// Set and export directories
const mediaDir = path.join(__dirname, 'media')
const mediaFolders = ['hdr', 'pano', 'wide_angle']
const rawMediaRepo = '/Users/matthiaswettstein/SynologyDrive/Matthias/DJI/'
const rawMediaPrefix = 'Einzelfotos'
const rawMediaSuffix = '.tif'
module.exports = { mediaDir, mediaFolders }

filterDots = file => !file.startsWith('.')

const saveMetadata = (files) => {
  // Store new file's metadata in DB
  module.exports = files
  require('./saveMetadata')
}
          

// PREPARATIONS
// Get existing media
let existingMedia = []
mediaFolders.forEach(
  mediaFolder => {
    let fullPath = path.join(mediaDir, mediaFolder)
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

    newRawMedia = []
    newMedia.forEach (
      medium => {
        const folder = medium.folder
        const id = medium.key
        let originalFile 
        if (folder == mediaFolders[0]) {
          originalFile = path.join(rawMediaRepo, folder, id)  + rawMediaSuffix
        }
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

main()

/*

// ROUTES
// Render static files
app.use(express.static(__dirname))

// Set the view engine to ejs / tell Express server to use ejs
app.set('view engine', 'ejs')

// Port website will run on
app.listen(port, (req, res) => {
  console.log(`App is running on port ${port}`)
})

//  *** GET Routes - display pages ***
//    Root Route
//    --> There are two types of routes, GET and POST. GET routes display pages and POST routes upload data from the front-end to the server (usually via a form) typically before a page is rendered and the uploaded data is somehow used
//    --> The ‘/’ specifies the URL of the website the code will activate on

app.get('/', (req, res, next) => res.render('pages/index'))
app.get('/about', (req, res, next) => res.render('pages/about'))


app.get('/img-viewer', (req, res, next) => {
  res.render('pages/img-viewer', { type: req.query.type, img: req.query.img } )
})

app.get('/pano-viewer', (req, res, next) => {
  res.render('pages/pano-viewer', { img: req.query.img } )
})

const media = require('./data')

// Route media folders
mediaFolders.forEach(element => {
  app.get('/' + element, (req, res, next) => {
    res.render('pages/media', {
        data: media.filter(f => f.type == element)
    })  
  })
})

*/