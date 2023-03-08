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
const rawMediaRepo = '~/SynologyDrive/Matthias/DJI/'
module.exports = { mediaDir, mediaFolders }

// PREPARATIONS
// Get existing media
let existingMedia = []
mediaFolders.forEach(
  mediaFolder => {
    let fullPath = path.join(mediaDir, mediaFolder)
    let fileObjs = fs.readdirSync(fullPath, { withFileTypes: false })
      .filter(file => !file.startsWith('.'))
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
    const res = existingMedia.filter(({key}) => !existingMetadata.includes(key))

    console.log(res)
}

main()


/*

  // Store new file's metadata in DB
  newMedia.forEach(
    file => {
      module.exports = file
      require('./saveMetadata')
    }
  )
}

main()




for (i in newMedia) {
    module.exports = images[i]
    require('./saveMetadata')
  }





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