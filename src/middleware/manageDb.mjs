import mongoose from 'mongoose'
import Constants from './constants.mjs'

mongoose.set('strictQuery', false)

mongoose.connect(
  `mongodb+srv://${Constants.DB_USER}:${Constants.DB_PASSWORD}@baffin.eo7kmjw.mongodb.net/${Constants.DB}?retryWrites=true&w=majority`
  )

// Create Mongoose Schema
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
  }
})

// Create Mongoose Model
const Island = mongoose.model('Island', islandSchema)

export { Island }