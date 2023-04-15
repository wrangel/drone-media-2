import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import sharp from 'sharp'
dotenv.config()
import Constants from './src/middleware/constants.mjs'
import { Island } from './src/middleware/handleSources.mjs'
import { question, runCli } from './src/middleware/functions.mjs'


// A) Prepare
// Get infos about the new media files
const files = fs.readdirSync(process.env.INPUT_DIRECTORY)
const fileInfo = files
  .filter(sourceFile => !sourceFile.startsWith('.'))
  .map(sourceFile => {
    let name = sourceFile.substring(0, sourceFile.lastIndexOf('.'))
    // Rename file if needed
    if(name.endsWith(Constants.RENAME_IDS[1])) {
      name = name.replace(Constants.RENAME_IDS[1], '')
        .replace(Constants.RENAME_IDS[0], Constants.REPLACEMENT)
    }
    return {name: name, sourceFile: sourceFile, targetFile: name + Constants.MEDIA_FORMATS.large}
  })

const noMedia = fileInfo.length
if (noMedia == 0) {
  console.log("No media to manage")
  process.exit(0)
} 
else {
  console.log(`${noMedia} media to manage`)
  // Collect user input about authors of the media (while is async by nature!)
  let idx = 0
  while (idx < fileInfo.length) {
    const name = fileInfo[idx].name
    const answer = await question(`Author and media type of --> ${ name } <-- (comma separated) : `)
    let [author, mediaType] = answer.split(',').map(x => x.trim())
    // Allow only known authors
    while (!Constants.CONTRIBUTORS.includes(author)) {
      author = await question(`Please choose one of (${ Constants.CONTRIBUTORS }) as author for --> ${ name }  <-- : `)
    }
    // Allow only known media types
    while (!Constants.MEDIA_PAGES.includes(mediaType)) {
      mediaType = await question(`Please choose one of (${ Constants.MEDIA_PAGES }) as media type for --> ${ name } <-- : `)
    }
    // Add the new info to the fileInfo object
    fileInfo[idx].author = author
    fileInfo[idx].mediaType = mediaType
    idx += 1
  }

  /// B) Update MongoDB
  // Prepare JSON for MongoDB insert -- type: element.mediaType is obsolete, since it is added downstream anyway
  const newIslands = fileInfo.map(element => { return { name: element.name, author: element.author } })
  // Update MongoDB
  await Island.insertMany(newIslands)

  /// C) Upload media to AWS S3 (requires AWS CLI with proper authentication: Alternative would be an S3 client)
  await Promise.all(
    fileInfo.map(fi => 
    runCli(`aws s3 cp ${process.env.INPUT_DIRECTORY}${fi.sourceFile} s3://${process.env.ORIGINALS_BUCKET}/${fi.mediaType}/${fi.targetFile}`)
    )
  )

  /// D) Convert file to .jpeg, copy .jpeg to OneDrive, move .tif to 'done' folder
  await Promise.all(
    fileInfo.map(async fi => {
      const inputFile = path.join(process.env.INPUT_DIRECTORY, fi.sourceFile)
      // Handle jpegs
      await sharp(inputFile)
        .jpeg({ quality: 100 })
        .toFile(path.join(process.env.ONEDRIVE_DIRECTORY, fi.sourceFile.replace(Constants.MEDIA_FORMATS.large, Constants.MEDIA_FORMATS.small)))
      // Handle .tifs
      fs.rename(inputFile, path.join(process.env.OUTPUT_DIRECTORY, fi.sourceFile), function (err) {
        if (err) {
            throw err
        } else {
            console.log(`Successfully moved ${inputFile}`)
        }
      })
    })
  )
  
}