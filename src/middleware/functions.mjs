// Get image identifyer from image path
const getId = path => {
    return path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

export { getId }