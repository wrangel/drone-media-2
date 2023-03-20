// Determine node.js run environment
// for dockerized node, mount to the volume specified in docker-compose.yml
const RUN_DOCKERIZED = false 


export default {
    ACCESS_TOKEN: 'pk.eyJ1IjoiYmF0aGh1cnN0IiwiYSI6ImNsZjN0eDg1bjB2d2czeHIwMmxra2QyODQifQ.I_CDtcMoSDmCjQErpayFCQ', // TODO secret
    ADDRESS_COMPONENTS: ["address", "postcode", "place", "region", "country"],
    REVERSE_GEO_URL_ELEMENTS: ['https://api.mapbox.com/geocoding/v5/mapbox.places/','.json?access_token='],
    MEDIA_FOLDERS: ['hdr', 'pan', 'wide_angle'], // MUST be sorted alphabetically
    PANO_FIRST_IMAGE: 'DJI_0001',
    PORT: 8080,
    RAW_MEDIA_PREFIX: 'Einzelfotos',
    RAW_MEDIA_REPO: RUN_DOCKERIZED == true ? '/mnt/originals' : '/Volumes/docker/ellesmere/originals',
    RAW_MEDIA_SUFFIX: '.tif',
    RUN_DOCKERIZED,
}