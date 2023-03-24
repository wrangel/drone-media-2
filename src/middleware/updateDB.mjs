// Load Mongoose model
import { Island } from './manageDb.mjs'

// Enrich islands with authors
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