import dotenv from 'dotenv'
dotenv.config()

export default {
  // AWS
  BUCKET_REGION: process.env.BUCKET_REGION,
  SITE_BUCKET: process.env.SITE_BUCKET,
  ORIGIN_BUCKET: process.env.ORIGINALS_BUCKET,
  ACCESS_KEY: process.env.ACCESS_KEY,    
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
   EXPIRY_TIME_IN_SECS: 86400,
  // MongoDB
  SERVER: process.env.SERVER,
  DB: process.env.DB,
  DB_USER: process.env.DB_USER,
   DB_PASSWORD: process.env.DB_PASSWORD,
  // Reverse Geocoding
  REVERSE_GEO_ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  REVERSE_GEO_ADDRESS_COMPONENTS: ["address", "postcode", "place", "region", "country"],
   REVERSE_GEO_URL_ELEMENTS: ['https://api.mapbox.com/geocoding/v5/mapbox.places/','.json?access_token='],
  // Misc 
  AUTHOR_PICTURES_PATH: 'media/author_pictures/',
  PORT: 37009,
  SITE_MEDIA_FORMAT: '.webp',
  THUMBNAIL_FOLDER: 'thumbnails'
}