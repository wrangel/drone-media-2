export default { 
  // MongoDB
  EXTERNAL_IP_URL: 'https://ident.me',
  MAX_IP_ENTRIES: 30,
  COMMANDS: { list: 'atlas accessLists list', create: 'atlas accessLists create ', delete: 'atlas accessLists delete --force ' },
  // Reverse Geocoding
  REVERSE_GEO_ADDRESS_COMPONENTS: new Array("address", "postcode", "place", "region", "country"),
   REVERSE_GEO_URL_ELEMENTS: new Array('https://api.mapbox.com/geocoding/v5/mapbox.places/','.json?access_token='),
  // Misc
  AUTHOR_PICTURES_PATH: 'media/author_pictures/',
  PORT: 8280,
  MEDIA_PAGES: new Array('hdr', 'pan', 'wide_angle'), // MUST be sorted alphabetically
  SITE_MEDIA_FORMAT: '.webp',
  ACTUAL_ID: 'actual',
  THUMBNAIL_ID: 'thumbnails'
}

console.log("sdfasdfasdfasdfsdf")
console.log(process.env.SERVER)