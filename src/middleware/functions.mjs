import { exec } from 'child_process'
import readline from 'readline'


/// Web App
// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

// Log out full JSONs for debugging
function prettyJSON(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

/// Helper App
// Create a readline interface
const cl = readline.createInterface(process.stdin, process.stdout)

// Create a readline question
const question = function(q) {
  return new Promise((res, rej) => {
    cl.question(q, answer => {
      res(answer)
    })
  })
}

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

export { getId, prettyJSON, question, runCli }