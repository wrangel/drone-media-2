/// PREPARE
import express from 'express'
import Constants from './src/middleware/constants.mjs'
import { getUrls } from './src/middleware/serveSignedUrls.mjs'
import { beautify } from './src/middleware/serveMetadata.mjs'
import { manage } from './src/middleware/manageBooks.mjs'

// Update files and metadata
await manage()

/// RENDER
// Initialise Express
const app = express()

// Set views directory
app.set('views', './src/' + 'views')

// Render static files from root folder (css, ..)
app.use(express.static('.'))

// Tell Express server to use ejs view engine
app.set('view engine', 'ejs')

// Determine port website will run on
app.listen(Constants.PORT, _ => {
  console.log(`App is running on port ${Constants.PORT}`)
})

/* *** GET Routes - display pages ***
    Root Route
    --> There are two types of routes, GET and POST. GET routes display pages and POST routes upload data 
        from the front-end to the server (usually via a form) typically before a page is rendered and 
        the uploaded data is somehow used
    --> The ‘/’ specifies the URL of the website the code will activate on
*/
app.get('/', (req, res, next) => res.render('pages/index'))
app.get('/about', (req, res, next) => res.render('pages/about'))

app.get('/img-viewer', (req, res, next) => {
  // req.query refers to the querystring components sent by media.ejs
  res.render('pages/img-viewer', { type: req.query.type, url: req.query.url, qs: req.query.qs } )
})

app.get('/pano-viewer', (req, res, next) => {
  // req.query refers to the querystring components sent by media.ejs
  res.render('pages/pano-viewer', { url: req.query.url, qs: req.query.qs } )
})

// Get presigned URLs from AWS S3
const presignedUrls = await getUrls()

function render() {
  // Route media folders, provide them with  metadata
  Constants.MEDIA_PAGES.forEach(async mediaPage => {
    // Get the metadata documents related to the respective media folder. Sort it. Convert them to JS object
    const prettyDocs = await beautify(mediaPage, presignedUrls)
    // Call the media.ejs for each of the media types, with the respective metadata
    app.get('/' + mediaPage, (req, res, next) => {
      res.render('pages/media', {data: prettyDocs})
    })
  })
}

render()