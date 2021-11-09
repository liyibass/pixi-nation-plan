import * as PIXI from 'pixi.js'

import playerImagePath from '../components/player/player1.png'
import groundImagePath from '../components/ground/ground.png'

function loadMedia(topLevelThis) {
    console.log('ready to load media')

    const loader = new PIXI.Loader()

    loader.add('player', playerImagePath)
    loader.add('ground', groundImagePath)
    let failedFiles = []

    console.log('loader added')
    loader.load()

    // throughout the process multiple signals can be dispatched.
    loader.onProgress.add((event) => {
        topLevelThis.progress = event.progress
    }) // called once per loaded/errored file

    loader.onError.add((error) => {
        console.log('error')
        failedFiles.push(error.name)
        console.log('onError: ', error)
    }) // called once per errored file

    loader.onComplete.add(() => {
        if (failedFiles.length == 0) {
            console.log('all file completed')
        } else {
            console.log('Loading...failed: could not load ' + failedFiles)
        }
    }) // called once when the queued resourc
}

export default loadMedia
