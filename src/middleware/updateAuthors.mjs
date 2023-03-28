// Load Mongoose model
import { Island } from './manageSources.mjs'

// Enrich islands with authors
async function update() {
  await Island.aggregate([
    {
      $lookup: { from: 'authors',
        localField: 'name', 
        foreignField: 'name',
        as: 'author'
      }
    }, { 
      $unwind: '$author'
    }, {
      "$replaceRoot": { "newRoot": { "$mergeObjects": [ '$author', '$$ROOT' ] } }
   }, {
    $addFields: { "author": "$author.author" }
  },
    { "$merge": "islands" }
  ]).exec()

  console.log("Merged authors")
}

export { update }
