// Get image identifyer from image path
const getId = path => {
  return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

// Log out full JSONs for debugging
function prettyJSON(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

export { getId, prettyJSON }