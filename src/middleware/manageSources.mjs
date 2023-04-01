import mongoose from 'mongoose'
import Constants from './constants.mjs'
import { S3Client } from '@aws-sdk/client-s3'

/// Set up S3 client

// Create instance of S3 Client
const s3 = new S3Client({
  credentials: {
    accessKeyId: Constants.ACCESS_KEY,
    secretAccessKey: Constants.SECRET_ACCESS_KEY
  },
  region: Constants.BUCKET_REGION
})

/// Manage Mongo DB

mongoose.set('strictQuery', false)

mongoose.connect(
  `mongodb+srv://${Constants.DB_USER}:${Constants.DB_PASSWORD}@${Constants.SERVER}/${Constants.DB}?retryWrites=true&w=majority`
  )

// Create Mongoose Island Schema
const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  author: String,
  dateTimeString: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  geometry: {
    type: Object,
    required: true
  },
  altitude: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  road: String,
  noViews: {
    type: Number,
    min: 0
  }
})

// Create Mongoose Island Model
const Island = mongoose.model('Island', islandSchema)

// Create Mongoose Author Schema
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  }
})

// Create Mongoose Author Model
const Author = mongoose.model('Author', authorSchema)

export { Island, Author, s3 }