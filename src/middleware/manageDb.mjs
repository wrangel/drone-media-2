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
    unique: true
  },
  type: String,
  author: String,
  dateTimeString: String,
  dateTime: Date,
  geometry: {}, // TODO improve schema
  altitude: Number,
  country: String,
  region: String,
  location: String,
  postalCode: String,
  road: String,
  noViews: Number,
  signedUrl: String
})

// Create Mongoose model
const Island = mongoose.model('Island', islandSchema)

export { Island }