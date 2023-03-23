// Determine node.js run environment
// for dockerized node, mount to the volume specified in docker-compose.yml
const RUN_DOCKERIZED = false 

////////////////////////////////

import dotenv from 'dotenv'
dotenv.config()

export default {
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    ADDRESS_COMPONENTS: ["address", "postcode", "place", "region", "country"],
    DB: 'ellesmereDB',
    DB_USER: prcess.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    MEDIA_FOLDERS: ['hdr', 'pan', 'wide_angle'], // MUST be sorted alphabetically
    PANO_FIRST_IMAGE: 'DJI_0001',
    PORT: 8080,
    RAW_MEDIA_PREFIX: 'Einzelfotos',
    RAW_MEDIA_REPO: RUN_DOCKERIZED == true ? '/mnt/originals' : '/Volumes/docker/ellesmere/originals',
    RAW_MEDIA_SUFFIX: '.tif',
    REVERSE_GEO_URL_ELEMENTS: ['https://api.mapbox.com/geocoding/v5/mapbox.places/','.json?access_token='],
    RUN_DOCKERIZED,
    VIEWS: 'views'
}