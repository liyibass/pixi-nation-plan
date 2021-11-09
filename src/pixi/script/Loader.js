import { LoaderConfig } from './LoaderConfig'

export class Loader {
  constructor(loader, topLevelThis) {
    this.loader = loader
    this.resource = LoaderConfig
    this.failedFiles = []
    this.topLevelThis = topLevelThis
  }

  preload() {
    return new Promise((resolve) => {
      for (let key in this.resource) {
        this.loader.add(key, this.resource[key])
      }

      console.log('loader added')
      this.loader.load()

      // throughout the process multiple signals can be dispatched.
      this.loader.onProgress.add((event) => {
        this.topLevelThis.progress = event.progress
        console.log(event.progress)
      }) // called once per loaded/errored file

      this.loader.onError.add((error) => {
        console.log('error')
        this.failedFiles.push(error.name)
        console.log('onError: ', error)
      }) // called once per errored file

      this.loader.onComplete.add(() => {
        if (this.failedFiles.length == 0) {
          console.log('all file completed')
          resolve()
        } else {
          console.log('Loading...failed: could not load ' + this.failedFiles)
        }
      }) // called once when the queued resourc
    })
  }
}
