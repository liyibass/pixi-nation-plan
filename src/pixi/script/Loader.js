import { LoaderConfig } from './LoaderConfig'
import { Globals } from './Globals'

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

      this.loader.load((loader, resources) => {
        Globals.resources = resources
        resolve()
      })

      // throughout the process multiple signals can be dispatched.
      this.loader.onProgress.add((event) => {
        this.topLevelThis.progress = event.progress > 99 ? 100 : event.progress
      }) // called once per loaded/errored file
    })
  }
}
