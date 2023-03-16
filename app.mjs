/// PREPARE
import express from 'express'

// Collect new metadata
import { manage } from './src/middleware/manageBooks.mjs'
const newMedia = await manage()

// Save new metadata
/*import { save } from './src/middleware/saveMetadata.mjs'
const x = save(newMedia) // TODO await!
console.log(x)*/
import './src/middleware/saveMetadata.mjs'


/*
//import { add, subtract } from './math.mjs'



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




  const getMetadata = require(__path.join(__middlewarePath, 'getMetadata'))
  const metadata = await getMetadata.grab(existingMedia)

  // Route media folders, provide them with 'media' data
  __mediaFolders.forEach(element => {
    app.get('/' + element, (req, res, next) => {
      res.render(__path.join(pagesPath, 'media'), {
          data: metadata.filter(f => f.type == element)
      })
    })
  })

*/



