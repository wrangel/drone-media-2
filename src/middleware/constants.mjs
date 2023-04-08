export default { 
  // Reverse Geocoding
  REVERSE_GEO_ADDRESS_COMPONENTS: new Array("address", "postcode", "place", "region", "country"),
   REVERSE_GEO_URL_ELEMENTS: new Array('https://api.mapbox.com/geocoding/v5/mapbox.places/','.json?access_token='),
  // Misc
  AUTHOR_PICTURES_PATH: 'media/author_pictures/',
  MEDIA_PAGES: new Array('hdr', 'pan', 'wide_angle'), // MUST be sorted alphabetically
  SITE_MEDIA_FORMAT: '.webp',
  ACTUAL_ID: 'actual',
  THUMBNAIL_ID: 'thumbnails'
}