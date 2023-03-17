/// PREPARE
import express from 'express'
import Constants from './src/middleware/constants.mjs'

// Load Mongoose model
import { Island } from './src/middleware/manageDb.mjs'

// Update the media metadata, if necessary
import { manage } from './src/middleware/manageBooks.mjs'
const newMedia = await manage()

// Save new metadata (in form of Mongoose Models)
import {prepare} from './src/middleware/prepareMetadata.mjs'
const newMetadata = await prepare(newMedia)

// Save document to DB
const save = await Island.insertMany(newMetadata)
console.log(save)


/// RENDER
// Initialise Express
const app = express()

// Set views directory
app.set('views', './src/views')

// Render static files from root folder (css, ..)
app.use(express.static('.'))

// Tell Express server to use ejs view engine
app.set('view engine', 'ejs')

// Determine port website will run on
app.listen(Constants.PORT, (req, res, next) => {
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
  res.render('pages/img-viewer', { type: req.query.type, img: req.query.img } )
})

app.get('/pano-viewer', (req, res, next) => {
  res.render('pages/pano-viewer', { img: req.query.img } )
})



import { beautify } from './src/middleware/beautifyMetadata.mjs'

async function render() {
    // Route media folders, provide them with  metadata
    Constants.MEDIA_FOLDERS.forEach(async mediaFolder => {

      // Get the metadata documents related to the respective media folder. Sort it. Convert them to JS object
      const docs = await Island.find({ type : mediaFolder})
        .sort({ name: -1 })
        .lean()
      
      const prettyDocs = beautify(docs)
      
      console.log(prettyDocs)
      console.log("-----------------------------------")
      
    })

}

render()
    

/*
  __mediaFolders.forEach(element => {
    app.get('/' + element, (req, res, next) => {
      res.render(__path.join(pagesPath, 'media'), {
          data: metadata.filter(f => f.type == element)
      })
    })
  })

*/