const glob = require('glob')
const globParent = require('glob-parent')

const mediaFolders = require('./app')
const mediaDir = __dirname + '/media' 

  
// Create dict with all media files and their respective parents
  const media = glob.sync(mediaDir + '/*('+ mediaFolders.toString().replaceAll(',', '|') + ')/*')
    .map(path => {
      const tmp = globParent(path)
      const type = tmp.substring(tmp.lastIndexOf('/') + 1, tmp.length)
      const viewer = type == 'pano' ? 'pano' : 'img';
      return {
        type: type,
        viewer: viewer,
        file: path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
      }
    })

module.exports = media.reverse()