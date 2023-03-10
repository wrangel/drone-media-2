// Load Node modules
const express = require('express')
const path = require('path')

// Set and export web app directories
const basePath = path.join(__dirname, 'src')
const middlewarePath = path.join(basePath, 'middleware')
const pagesPath = path.join(basePath, 'views', 'pages')
const mediaPath = path.join(__dirname, 'media')
const mediaFolders = ['hdr', 'pano', 'wide_angle']
module.exports = { mediaPath, mediaFolders }

// Load Mongoose model
const Island = require(path.join(middlewarePath, 'manageDb'))

// Conduct metadata bookkeeping
require(path.join(middlewarePath, 'manageBooks'))

// Get metadata from db
require(path.join(middlewarePath, 'getMetadata'))

// Get the media
const media = require(path.join(middlewarePath, 'displayMedia'))

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

/*  *** GET Routes - display pages ***
    Root Route
    --> There are two types of routes, GET and POST. GET routes display pages and POST routes upload data from the front-end to the server (usually via a form) typically before a page is rendered and the uploaded data is somehow used
    --> The ‘/’ specifies the URL of the website the code will activate on
*/
app.get('/', (req, res, next) => res.render(path.join(pagesPath, 'index')))
app.get('/about', (req, res, next) => res.render(path.join(pagesPath, 'about')))

app.get('/img-viewer', (req, res, next) => {
  res.render(path.join(pagesPath, 'img-viewer'), { type: req.query.type, img: req.query.img } )
})

app.get('/pano-viewer', (req, res, next) => {
  res.render(path.join(pagesPath, 'pano-viewer'), { img: req.query.img } )
})

// Route media folders
mediaFolders.forEach(element => {
  app.get('/' + element, (req, res, next) => {
    res.render(path.join(pagesPath, 'media'), {
        data: media.filter(f => f.type == element)
    })  
  })
})