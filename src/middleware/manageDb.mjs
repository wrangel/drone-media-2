import mongoose from 'mongoose'
import Constants from './constants.mjs'

mongoose.set('strictQuery', false)

mongoose.connect(
  `mongodb+srv://${Constants.DB_USER}:${Constants.DB_PASSWORD}@baffin.eo7kmjw.mongodb.net/${Constants.DB}?retryWrites=true&w=majority`
  )

// Create Mongoose schema
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
    type: mongoose.Schema.Types.ObjectId,
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
  },
  signedUrl: {
    type: String,
    required: true
  }
})

// Create Mongoose model
const Island = mongoose.model('Island', islandSchema)

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

// Create Mongoose model
const Author = mongoose.model('Author', authorSchema)








 /*
export { Island }

*/