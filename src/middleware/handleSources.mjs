import { S3Client } from '@aws-sdk/client-s3'
import mongoose from 'mongoose'
import dotenv from 'dotenv-vault-core'
dotenv.config()


/// Set up S3 client

// Create instance of S3 Client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  },
  region: process.env.BUCKET_REGION
})


/// Manage Mongo DB

// Connect to Mongo DB
mongoose.set('strictQuery', false)
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.SERVER}/${process.env.DB}?retryWrites=true&w=majority`
  )

// Create Mongoose Island Schema
const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    required: true,
    type: String
  },
  author: {
    type: String,
    required: true
  },
  dateTimeString: {
    required: true,
    type: String
  },
  dateTime: {
    required: true,
    type: Date
  },
  latitude: {
    required: true,
    type: Number
  },
  longitude: {
    required: true,
    type: Number
  },
  altitude: {
    required: true,
    type: Number
  },
  country: {
    required: true,
    type: String
  },
  region: {
    required: true,
    type: String
  },
  location: {
    required: true,
    type: String
  },
  postalCode: {
    type: String
  },
  road: String,
  noViews: {
    required: true,
    type: Number,
    min: 0
  }
})

// Create Mongoose Island Model
const Island = mongoose.model('Island', islandSchema)

export { Island, s3 }