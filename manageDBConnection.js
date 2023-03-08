const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const db = 'ellesmereDB'

mongoose.connect('mongodb://localhost:27017/' + db)
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

const islandSchema = new mongoose.Schema({
  /*name: {
    type: String, // TODO 
    unique: false 
  },*/
  name: String,
  type: String,
  author: String,
  dateTime: Date,
  coordinates: {},
  country: String,
  city: String,
  postalCode: String,
  road: String,
  houseNumber: String,
  noViews: Number
})

const Island = mongoose.model('Island', islandSchema)

module.exports = Island