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
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
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

export { Island, s3 }