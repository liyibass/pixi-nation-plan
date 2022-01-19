import { cityDataArray } from './CityData'

export let unlockCardCityArray = []

export const clearUnlockCardCityArray = () => {
  unlockCardCityArray = []
}

export const unlockWater = () => {
  console.log('unlockWater')
  // unlockCardCityArray = []

  cityDataArray.forEach((cityData) => {
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
  // unlockCardCityArray = []
  cityDataArray.forEach((cityData) => {
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
  // unlockCardCityArray = []
  cityDataArray.forEach((cityData) => {
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
  // unlockCardCityArray = []
  cityDataArray.forEach((cityData) => {
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
  // unlockCardCityArray = []
  cityDataArray.forEach((cityData) => {
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
