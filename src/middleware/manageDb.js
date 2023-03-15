const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

// Set connection specifics
// Use the same mongo service name as in docker-compose.yml
const mongoHost = __runDockerized == true ? 'mongo' : 'localhost'
const connectionString = 'mongodb://' + mongoHost + ':27017/'
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
  geometry: {}, // TODO improve schema
  altitude: String,
  country: String,
  region: String,
  location: String,
  postalCode: String,
  road: String,
  noViews: Number
})

const Island = mongoose.model('Island', islandSchema)

module.exports = Island