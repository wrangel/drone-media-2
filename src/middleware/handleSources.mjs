import { S3Client } from '@aws-sdk/client-s3'
import mongoose from 'mongoose'
import { exec, execSync } from 'child_process'
import axios from 'axios'
import Constants from './constants.mjs'


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

/*
// Allow access from current IP, if changed

// Run command against Mongo Atlas
const runCli = cmd => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(stdout)
  })
}

// Get current public IP
const ip = (await axios.get(Constants.EXTERNAL_IP_URL)).data.toString()

// Get the IPs currently listed on Mongo Atlas
const existingIpsRaw = execSync(Constants.COMMANDS.list).toString()

// Create a list of IPs
const existingIps = existingIpsRaw
  .replace('CIDR BLOCK          AWS SECURITY GROUP', '')
  .replaceAll('N/A', '')
  .split(/\r?\n/)
  .filter(element => element.length != 0)
  .map(x => x.substring(0, x.indexOf('/')))

// Add current public IP if it is not in IP list
if (!existingIps.includes(ip)) {
  runCli(COMMANDS.create + ip)
}

// Delete last IP entry if number of IPs is reached
if(existingIps.length === Constants.MAX_IP_ENTRIES) {
  const removableIp = existingIps
    .filter(element => element != ip) // Don't touch the just added IP
    .slice(-1)[0]
  runCli(COMMANDS.delete + removableIp)
}
*/

// Mongoose Schema

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