/// PREPARE
// Load Node modules
const express = require('express')
global.__path = require('path')

// Set and export web app directories
global.__basedir = __dirname
const sourcePath = __path.join(__dirname, 'src')
global.__middlewarePath = __path.join(sourcePath, 'middleware')
const pagesPath = __path.join(sourcePath, 'views', 'pages')
global.__mediaPath = __path.join(__dirname, 'media')
global.__mediaFolders = ['hdr', 'pano', 'wide_angle']

// Determine node.js run environment
global.__runsDockerized = false

/// MANAGE METADATA
// Load Mongoose model
global.__Island = require(__path.join(__middlewarePath, 'manageDb'))

// Collect new metadata
require(__path.join(__middlewarePath, 'manageBooks'))


/// RENDER
// Initialise Express and set port
const app = express()
const port = 8080

// Render static files (css, ..)
app.use(express.static(__dirname))

// Tell Express server to use ejs view engine
app.set('view engine', 'ejs')

// Determine port website will run on
app.listen(port, (req, res) => {
  console.log(`App is running on port ${port}`)
})

// *** GET Routes - display pages ***
//    Root Route
//    --> There are two types of routes, GET and POST. GET routes display pages and POST routes upload data from the front-end to the server (usually via a form) typically before a page is rendered and the uploaded data is somehow used
//    --> The ‘/’ specifies the URL of the website the code will activate on
app.get('/', (req, res, next) => res.render(__path.join(pagesPath, 'index')))
app.get('/about', (req, res, next) => res.render(__path.join(pagesPath, 'about')))

app.get('/img-viewer', (req, res, next) => {
  res.render(__path.join(pagesPath, 'img-viewer'), { type: req.query.type, img: req.query.img } )
})

app.get('/pano-viewer', (req, res, next) => {
  res.render(__path.join(pagesPath, 'pano-viewer'), { img: req.query.img } )
})

// Get the media and their metadata (a Promise)
require(__path.join(__middlewarePath, 'getMetadata'))
  .then(
      media => {
        // Route media folders, provide them with 'media' data
        __mediaFolders.forEach(element => {
          app.get('/' + element, (req, res, next) => {
            res.render(__path.join(pagesPath, 'media'), {
                data: media.filter(f => f.type == element)
            })
          })
        })
      }
  )
  .catch((error) => { console.log(error) })