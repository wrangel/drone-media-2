import mongoose from 'mongoose'
import Constants from '../middleware/constants.mjs'

mongoose.set('strictQuery', false)

// Set connection specifics
const user = 'f984hjn3d23'
const password = 'cXtNUDejRZ8MNpcv4x4dPQddyw2sCjs2RpLNj8h4P4Uy4sw3ZWfmUJ74J4dgEefxUMg4qqFqmAwtrxPCXnmudPLaDTrdTccjeusQ'
const db = 'ellesmereDB'

mongoose.connect(`mongodb+srv://${user}:${password}@baffin.eo7kmjw.mongodb.net/${db}?retryWrites=true&w=majority`)

// Create Mongoose schema
const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  type: String,
  author: String,
  dateTime: Date,
  geometry: {}, // TODO improve schema
  altitude: Number, // in Meters
  country: String,
  region: String,
  location: String,
  postalCode: String,
  road: String,
  noViews: Number
})

// Create Mongoose model
const Island = mongoose.model('Island', islandSchema)

export { Island }