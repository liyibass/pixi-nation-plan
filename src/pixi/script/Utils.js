import { CityStatusArray, Status } from './Status'

export let unlockCardCityArray = []

export const clearUnlockCardCityArray = () => {
  console.log('clearUnlockCardCityArray')
  unlockCardCityArray = []
}

export const unlockWater = () => {
  console.log('unlockWater')
  unlockCardCityArray = []

  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      if (tab.tabTag === '缺水問題') {
        tab.isLocked = false
        hasUnlock = true
      }
    })

    if (
      hasUnlock &&
      !unlockCardCityArray.find((city) => city.cityIndex === cityData.cityIndex)
    ) {
      unlockCardCityArray.push(cityData)
    }
  })
}
export const unlockGarbage = () => {
  console.log('unlockGarbage')
  Status.snake.isCleared = true

  unlockCardCityArray = []
  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      if (tab.tabTag === '垃圾問題') {
        tab.isLocked = false
        hasUnlock = true
      }
    })

    if (
      hasUnlock &&
      !unlockCardCityArray.find((city) => city.cityIndex === cityData.cityIndex)
    ) {
      unlockCardCityArray.push(cityData)
    }
  })
}
export const unlockBalance = () => {
  console.log('unlockBalance')
  Status.balance.isCleared = true

  unlockCardCityArray = []
  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      if (tab.tabTag === '人口問題') {
        tab.isLocked = false
        hasUnlock = true
      }
    })

    if (
      hasUnlock &&
      !unlockCardCityArray.find((city) => city.cityIndex === cityData.cityIndex)
    ) {
      unlockCardCityArray.push(cityData)
    }
  })
}
export const unlockCandy = () => {
  console.log('unlockCandy')
  Status.candy.isCleared = true

  unlockCardCityArray = []
  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      if (tab.tabTag === '區位問題') {
        tab.isLocked = false
        hasUnlock = true
      }
    })

    if (
      hasUnlock &&
      !unlockCardCityArray.find((city) => city.cityIndex === cityData.cityIndex)
    ) {
      unlockCardCityArray.push(cityData)
    }
  })
}
export const unlockRun = () => {
  console.log('unlockRun')
  Status.run.isCleared = true

  unlockCardCityArray = []
  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      if (tab.tabTag === '個別問題') {
        tab.isLocked = false
        hasUnlock = true
      }
    })

    if (
      hasUnlock &&
      !unlockCardCityArray.find((city) => city.cityIndex === cityData.cityIndex)
    ) {
      unlockCardCityArray.push(cityData)
    }
  })
}
