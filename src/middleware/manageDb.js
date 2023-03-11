const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const connectionString = 'mongodb://localhost:27017/'
const db = 'ellesmereDB'

mongoose.connect(connectionString + db)
// TODO use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

const islandSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  author: String,
  dateTime: Date,
  geometry: {},
  altitude: String,
  country: String,
  city: String,
  postalCode: String,
  road: String,
  noViews: Number
})

const Island = mongoose.model('Island', islandSchema)

module.exports = Island