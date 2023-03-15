const RUN_DOCKERIZED = false // Determine node.js run environment

// for dockerized node, mount to the volume specified in docker-compose.yml
const RAW_MEDIA_REPO = RUN_DOCKERIZED == true ? '/mnt/originals' : '/Volumes/docker/ellesmere/originals'

export default {
    MEDIA_FOLDERS: ['hdr', 'pano', 'wide_angle'],
    RAW_MEDIA_PREFIX: 'Einzelfotos',
    RAW_MEDIA_REPO,
    RAW_MEDIA_SUFFIX: '.tif',
    RUN_DOCKERIZED,
}