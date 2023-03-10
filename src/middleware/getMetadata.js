const glob = require('glob')
const globParent = require('glob-parent')

async function main() {
  // Get all the metadata on the db
  const docs = await __Island.find({})

  // Create dict with all media files and their respective metadata
    const media = glob.sync(__mediaPath + '/*('+ __mediaFolders.toString().replaceAll(',', '|') + ')/*')
      .map(path => {
        const tmp = globParent(path)
        const type = tmp.substring(tmp.lastIndexOf('/') + 1, tmp.length)
        const viewer = type == 'pano' ? 'pano' : 'img'
        const id = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
        console.log("----------------------------------")
        const dbMetadata = docs.filter(i => i.name === id)
        console.log(c)
        
        
        return {
          type: type,
          viewer: viewer,
          file: id
        }
      })

  module.exports = media.reverse()
}

main()