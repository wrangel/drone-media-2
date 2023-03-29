import { ListObjectsCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import sharp from 'sharp'
import Constants from './constants.mjs'
import { save } from './updateMetadata.mjs'
import { s3 } from './manageSources.mjs'


// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

//// MANUAL upload to aws (cli)
//// MANUAL update authors
//// Add metadata to db - DONE
//// update authors - DONE
//// Add converted files and tn to melville
//// Remove obsolete metadata and files from db and melville

// Manage files and metadata
async function manage() {

  // List original files (which are the master)
  const originalFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.ORIGIN_BUCKET } ))
  const originalFiles = originalFileInfo.Contents.map(originalFile => {
    let path = originalFile.Key
    return { key: getId(path), path: path }
  })
  
  // List site files
  const siteFileInfo = await s3.send(new ListObjectsCommand( { Bucket: Constants.SITE_BUCKET } ))
  const siteFiles = siteFileInfo.Contents.map(siteFile => {
    let path = siteFile.Key
    return { key: getId(path), path: path }
  })
  
  // Get new files
  const newFiles = originalFiles.filter(x => !siteFiles.map(y => y.key).includes(x.key))

  // Get presigned urls // TODO same as in getSignedUrls for the new files
  const signedUrls = await Promise.all(
    newFiles.map(async content => {
      return {
        key: content.key,
        path: content.path,
        sigUrl: await getSignedUrl(
          s3, new GetObjectCommand({ Bucket: Constants.ORIGIN_BUCKET,  Key: content.path }, { expiresIn: Constants.EXPIRY_TIME_IN_SECS } )
        )
      }
    })
  )  

  if (newFiles.length > 0) {
    // Save metadata of newly added files to db
    /////save(signedUrls) TODO uncomment
    console.log(signedUrls)


  

  }
}

manage()


  /* 
    console.log()

// Convert to WEBP
const convertToWebp = (sharpObject, losslessFlag, outputPath) => {
  sharpObject.webp({ lossless: losslessFlag })
    .toFile(outputPath + '.webp')
    .catch(error => console.log(error))
}

  const obj = newFiles[0]

  const sharpObject = await sharp(sigUrl, obj)
  convertToWebp(sharpObject, true, )

// Convert data
async function convertImages(media) {
  Promise.all(
    media.map(async medium => {
      const sharpObject = sharp(medium.original)
      // actuals, equal for all media categories
      convertToWebp(sharpObject, true, medium.target)
      /*  thumbnails (compressed)
          a) hdr: as is
          b) wide-angle & pano: crop to 2000x1300, in the middle of the pic
      --
          if(medium.folder != 'hdr') {
            sharpObject.resize({
              width: 2000,
              height: 1300,
              position: sharp.strategy.attention
            })
           }
           convertToWebp(sharpObject, false, medium.thumbnail)
          })
        )
      }
      
      await convertImages(newMedia)

import {Readable} from "stream";
import {createWriteStream} from "fs";
pipe(createWriteStream(fileName)
let b = a.Body.pipe(createWriteStream(fileName))


  const a = await Promise.all(
    newFiles.map(async element => {
      let b = await s3.send(new GetObjectCommand({Bucket: Constants.ORIGINALS_BUCKET, Key: element.path}))
      let c = b.Body.pipe(createWriteStream(fileName))
      return c
    })
  )

  /*
  // New metadata
  const newMetadata = originalFiles.filter(x => !metadata.includes(x.key))
  const a = await Promise.all(
    newMetadata.map(async element => {
      let b = s3.send(new GetObjectCommand({Bucket: Constants.ORIGINALS_BUCKET, Key: element.path}))
      return b
    })
  )


  // Outdated site files
  const outdatedFiles = siteFiles.filter(x => !originalFiles.map(y => y.key).includes(x.key))
  console.log("Outdated site files:")
  console.log(outdatedFiles)
  // TODO forEach await s3.send(new DeleteObjectCommand({Bucket: Constants.SITE_BUCKET, Key: 'pan/100_0500.tif'}))

  // Outdated metadata
  const outdatedMetadata = metadata.filter(x => !originalFiles.map(y => y.key).includes(x))
  await Island.deleteMany( { name : { $in : outdatedMetadata } } )

  ------

  //// metaata management and media conversion

import path from 'path'
import fs from 'fs'
import ExifReader from 'exifreader'
import sharp from 'sharp'

const MEDIA_FOLDERS = ['hdr', 'pan', 'wide_angle'] // MUST be sorted alphabetically

const MEDIA_SUBS = ['originals', 'site'] // MUST be alphabetically sorted
const MEDIA_ROOT = '/Users/matthiaswettstein/Desktop/media'
const THUMBNAIL_REPO = 'thumbnails'
const FORMATS = ['.tif', '.webp']

// Filter hidden files
const filterDots = file => !file.startsWith('.')

// Get core identifier
const getIdentifier = fileName => {
  return fileName.split('.')[0]
}

// Get original media
const originalMedia = MEDIA_FOLDERS.flatMap(mediaFolder => {
  // Get the path
  const filePath = path.join(MEDIA_ROOT, MEDIA_SUBS[0], mediaFolder)
  // Get the files in the path
  return fs.readdirSync(filePath, { withFileTypes: false })
    .filter(filterDots)
    .map(file => {
      const originalPath = path.join(filePath, file)
      const targetPath = originalPath.replace(MEDIA_SUBS[0], MEDIA_SUBS[1]).replace(FORMATS[0], FORMATS[1])
      return {
        id: getIdentifier(file), 
        folder: mediaFolder,
        original: originalPath, 
        target: targetPath,
        thumbnail: targetPath.replace(/\b(hdr|pan|wide_angle)\b/gi, THUMBNAIL_REPO) // TODO hardcoded
      }
    })
})


// Convert to WEBP
const convertToWebp = (sharpObject, losslessFlag, outputPath) => {
  sharpObject.webp({ lossless: losslessFlag })
    .toFile(path.join(outputPath))
    .catch(error => console.log(error))
}

// Convert data
async function convertImages(media) {
  Promise.all(
    media.map(async medium => {
      const sharpObject = sharp(medium.original)
      // actuals, equal for all media categories
      convertToWebp(sharpObject, true, medium.target)



      /*  thumbnails (compressed)
          a) hdr: as is
          b) wide-angle & pano: crop to 2000x1300, in the middle of the pic
      --
     if(medium.folder != 'hdr') {
      sharpObject.resize({
        width: 2000,
        height: 1300,
        position: sharp.strategy.attention
      })
     }
     convertToWebp(sharpObject, false, medium.thumbnail)
    })
  )
}

await convertImages(newMedia)

*/