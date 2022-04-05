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

export const unlockAll = () => {
  console.log('unlockAll')
  unlockCardCityArray = []

  CityStatusArray.forEach((cityData) => {
    let hasUnlock = false
    cityData.tabs.forEach((tab) => {
      tab.isLocked = false
      hasUnlock = true
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
  let winRef
  let targetUrl

  // 延迟1000ms
  setTimeout(() => {
    winRef = window.open(targetUrl, '_blank')
    winRef.document.title = 'xxx'
  }, 1000)

  let url

  switch (urlName) {
    case 'facebook':
      url =
        'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.readr.tw%2Fpost%2F2892'
      break
    case 'line':
      url =
        'https://access.line.me/oauth2/v2.1/login?loginState=JdpW9FfA0rxLMqoGC71QBs&loginChannelId=1446101138&returnUri=%2Foauth2%2Fv2.1%2Fauthorize%2Fconsent%3Fscope%3Dopenid%2Bprofile%2Bfriends%2Bgroups%2Btimeline.post%2Bmessage.write%26response_type%3Dcode%26state%3Db284e28d368a40b14b36f3e6edcf72%26redirect_uri%3Dhttps%253A%252F%252Fsocial-plugins.line.me%252Flineit%252FloginCallback%253FreturnUrl%253Dhttps%25253A%25252F%25252Fsocial-plugins.line.me%25252Flineit%25252Fshare%25253Furl%25253Dhttps%25253A%25252F%25252Fwww.readr.tw%25252Fpost%25252F2892%26client_id%3D1446101138#/'
      break
    default:
    case 'readr':
      url = 'https://www.readr.tw/'
      break
    case 'donate':
      url = 'https://www.readr.tw/donate'
      break
  }

  if (winRef) {
    winRef.location.href = url
  } else {
    targetUrl = url
  }
}

export const updateMod = (modName) => {
  console.log(modName)
}

export const saveGameStatus = () => {
  // console.log(Status)
  storeStatusIntoStorage()
}

export const shareUtil = {
  shareHandler: () => {},
  doneShare: () => {},
}
