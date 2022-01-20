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

  storeStatusIntoStorage()
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

  storeStatusIntoStorage()
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

  storeStatusIntoStorage()
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

  storeStatusIntoStorage()
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

  storeStatusIntoStorage()
}

export const storeStatusIntoStorage = () => {
  window.localStorage.setItem('gameStatus', serializeGameStatus())
}

export const setCityUnlockStatusToTrue = (cityIndex) => {
  CityStatusArray[cityIndex].isUnlockAll = true
  storeStatusIntoStorage()
}

export const serializeGameStatus = () => {
  const status = {
    Status,
    CityStatusArray,
    storedDate: Date.now(),
  }

  return JSON.stringify(status)
}

export const deserializeGameStatus = () => {
  const storedStatusString = window.localStorage['gameStatus']

  if (storedStatusString) {
    const storedStatus = JSON.parse(storedStatusString)

    if (
      storedStatus.storedDate &&
      Date.now() - storedStatus.storedDate < 60 * 60 * 24 * 7
    ) {
      return storedStatus
    }
  }
}

export const clickUrl = (urlName) => {
  let url

  switch (urlName) {
    case 'facebook':
      url = 'https://www.facebook.com'
      break
    case 'line':
      url = 'https://www.google.com'
      break
    default:
    case 'readr':
      url = 'https://www.readr.tw/'
      break
    case 'donate':
      url = 'https://www.readr.tw/donate'
      break
  }
  window.open(url, '_blank').focus()
}
