import { deserializeGameStatus } from './Utils'

const storedStatus = deserializeGameStatus()

export const Status = storedStatus?.Status || {
  isNeedTutorial: true,
  enteredGame: false,
  isShared: false,

  snake: {
    gameLevel: 0,
    isCleared: false,
  },
  balance: {
    gameLevel: 0,
    isCleared: false,
  },
  run: {
    gameLevel: 2,
    isCleared: false,
  },
  candy: {
    gameLevel: 0,
    isCleared: false,
    pointArray: [
      { typeIndex: 0, count: 0, point: 100 },
      { typeIndex: 1, count: 0, point: 75 },
      { typeIndex: 2, count: 0, point: 50 },
      { typeIndex: 3, count: 0, point: 200 },
      { typeIndex: 4, count: 0, point: 200 },
    ],
  },
}

Status.enteredGame = false
Status.initVolune = 0.7 // 0 or 0.7 = false
// Status.balance = {
//   gameLevel: 0,
//   isCleared: false,
// }

export const CityStatusArray = storedStatus?.CityStatusArray || [
  {
    cityIndex: 0,
    cityName: '新北市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 1,
    cityName: '桃園市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },
  {
    cityIndex: 2,
    cityName: '新竹縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '垃圾問題',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '缺水問題',
      },
    ],
  },

  {
    cityIndex: 3,
    cityName: '新竹市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '缺水問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 4,
    cityName: '苗栗縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'rungit s',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 5,
    cityName: '臺中市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 6,
    cityName: '彰化縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'balance',
        tabTag: '人口問題',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 7,
    cityName: '雲林縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },

      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '垃圾問題',
      },
    ],
  },

  {
    cityIndex: 8,
    cityName: '嘉義縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'balance',
        tabTag: '人口問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 9,
    cityName: '臺南市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'balance',
        tabTag: '人口問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 10,
    cityName: '高雄市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '缺水問題',
      },
      {
        isLocked: true,
        // unlockGame: 'balance',
        tabTag: '人口問題',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 11,
    cityName: '屏東縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 12,
    cityName: '臺東縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '垃圾問題',
      },
    ],
  },

  {
    cityIndex: 13,
    cityName: '花蓮縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'balance',
        tabTag: '人口問題',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 14,
    cityName: '宜蘭縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 15,
    cityName: '基隆市',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: 'snake',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'run',
        tabTag: '個別問題',
      },
    ],
  },

  {
    cityIndex: 16,
    cityName: '南投縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'snake',
        tabTag: '垃圾問題',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },

  {
    cityIndex: 17,
    cityName: '澎湖縣',
    isUnlockAll: false,
    tabs: [
      {
        isLocked: false,
        // unlockGame: '',
        tabTag: '基本資料',
      },
      {
        isLocked: true,
        // unlockGame: 'candy',
        tabTag: '區位問題',
      },
    ],
  },
]
