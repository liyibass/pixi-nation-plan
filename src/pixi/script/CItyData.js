export const cityDataArray = [
  {
    cityIndex: 0,
    cityName: '新北市',
    tabs: [
      {
        isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        tabContent: [
          '1.市府畫重點：新北市的住商用地相對足夠，這次的重點在於重新調整區位，把人口和產業區從較擁擠、昂貴的都市外移到郊區',
          '2.預計最多會增加40萬人，目前全市50%以上的人口聚居在板橋區、中和區、新莊區、三重區、新店區，未來希望把人引導到蘆洲區、五股區、三峽區、鶯歌區、林口區等區',
          '3.住商用地預計增加420公頃，主要是在三重區、五股區、蘆洲區、土城區、三峽區、瑞芳區',
          '4.新規劃的產業用地約694公頃，主要落在五股區、泰山區、三峽區、鶯歌區、樹林區、大柑園區、瑞芳區',
          '5.三峽、鶯歌列為輔導違章工廠進駐的區域，是2026-2035年的發展重點',
        ],
      },
      {
        isLocked: true,
        unlockGame: 'snake',
        tabTag: '區位問題',
        tabContent: [
          '審查委員：重工輕農，超過九成農地都在山坡地，農糧大量倚賴其他縣市',
          '市府：將部分國土保育地區改為農業地區，農業應從國土配置出發，並不是所有的縣市都能保留大面積農地',
        ],
      },
    ],
  },

  {
    cityIndex: 11,
    cityName: '高雄市',
    tabs: [
      {
        isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        tabContent: [
          '1.市府畫重點：都市與鄉村的人口分布是全臺最失衡，9成聚集在都市，要靠投入重大建設吸引外來人口，縫合城鄉差距',
          '2.5年內要推14個開發案，包括在燕巢區、橋頭區新增153.4公頃的住商用地，在小港區、岡山區新增63.13的工業用地，在岡山區、仁武區、鳥松區設置未登記工廠聚落輔導區，共321.46公頃',
          '3.其中面積最大的開發案是六龜區寶來不老溫泉觀光休閒區，多達405.05公頃。2009年莫拉克風災造成嚴重的山崩和土石流，一直有地質脆弱的疑慮',
          '4.新規劃的產業用地約694公頃，主要落在五股區、泰山區、三峽區、鶯歌區、樹林區、大柑園區、瑞芳區',
          '5.未設置都市農業區，全轉型為納管農地工廠，或是保留作為都市發展',
        ],
      },
      {
        isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTitle: '人口停滯、城鄉失衡',
        tabContent: [
          '審查委員：過去10年人口無顯著成長，已經被臺中市超車；現在只有1成的人口在鄉村，遠比全國平均的8:2更加失衡，未來鄉村地區只會萎縮不能成長',
          '市府：未來有新材料循環經濟園區、橋頭科學園區等產業園區，以及捷運、輕軌等重大交通建設，增加的就業機會能夠吸引外縣市人口移入。未來會調整人口達成率較低的都市計畫，推動城鄉均衡發展',
        ],
      },
      {
        isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTitle: '人口持平卻新增住商用地？',
        tabContent: [
          '營建署：重點在於產業發展而非住商建設，產業帶動社會增加人口，才能解決問題，都市計畫區增加住商反而形成壓力',
          '市府：住宅供給雖然充裕，但有超過四成屬於30年以上老屋，必須預先儲備住宅更新的空間',
        ],
      },
      {
        isLocked: true,
        unlockGame: 'snake',
        tabTag: '缺水問題',
        tabTitle: '豐枯期水資源差異大',
        tabContent: [
          '審查委員：仰賴高屏溪川流水，水資源非常不穩定，在枯水期供水已經有幾十萬噸的不足，還需外縣市支援供水',
          '市府：將推動自來水減漏、鼓勵工廠廢水回收，降低水資源浪費，並優先引進低耗水產業。自來水公司於高屏溪沿岸進行溪埔及大泉伏流水開發，預計民國110年完成',
        ],
      },
      {
        isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTitle: '寶來不老溫泉區有災害風險？',
        tabContent: [
          '審查委員：不老溫泉區環境敏感脆弱，莫拉克風災期間發生嚴重傷亡，市政府用簍空打洞的方式，把災害的地方「打掉」，不代表剩下的一定就安全。應該適度刪減開發規模，地方民眾或許有開發土地的意見，但市府心中應該要有一把尺',
          '市府：並沒有要大規模開發，已經將有安全疑慮的環境敏感地區剔除，如果未來有更多調查事證，指出其他區域也有風險，也會調整',
        ],
      },
    ],
  },
]

export const infoCard = {
  cityIndex: 0,
  cityName: '新北市',
  tabs: [
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '基本資料',
      tagTitle: '什麼是國土計畫？',
      tabContent: [
        '在2015年「國土計畫法」通過之前，臺灣的土地管理可分成三種：都市土地由「都市計畫法」管理、非都市土地由「區域計畫法」管理、國家公園由「國家公園法」管理。',
        '不過，「區域計畫法」長期存在漏洞，例如法律規定農業區不可以蓋工廠，只要業者透過申請使用地變更等方式，農地還是可能被變更為建築用地。此外，區域計畫也無法「越俎代庖」，指導都市計畫。',
        '「國土計畫法」上路後，成為臺灣管理土地的最高原則，中央政府以此制定「全國國土計畫」，先評估國家所需的糧食、產業等需求，再進行國土分配。舉例來說，政府訂出國家應保有的最少農地總量，再要求各縣市維持農地的基本面積。',
        '接著，地方政府結合全國性的規定（如農地、工業地的全國總量），以及縣市本身的人口、自然環境、產業需求等條件和願景，進行土地規劃，這就是「縣市國土計畫」。',
      ],
    },
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '目的',
      tagTitle: '目的是什麼？',
      tabContent: [
        '國土計畫的目的是，找出每塊土地最適合的使用方式：哪些地區適合發展農業？哪些地區的都市化程度適合發展為城鄉區？哪些地區的環境較敏感而必須劃為國土保育區？透過事先的規劃，定出土地可發展與不可發展的地方，減少不當開發發生的機會。',
        '過去的土地開發模式通常是開發商先買地，再申請土地開發許可，如果取得的土地是位在環境敏感區或農地，就容易產生爭議。如今受到「國土計畫法」的管制，土地分區的穩定性比較高，不會輕易就被變更使用的方式。',
      ],
    },
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '主要內涵',
      tagTitle: '主要內涵？',
      tabContent: [
        '「國土計畫法」將全國土地的使用方式分成四大類，包括國土保育地區、海洋資源地區、農業發展地區、城鄉發展地區。',
        '國土保育地區是為了保護重要生態，或是敏感環境而設；海洋資源地區是為了海洋資源保育、規範海域使用而設；農業發展地區是為了保留農地、維持糧食安全功能；城鄉發展地區則是為了提供都市與產業的發展需求。',
        '功能分區劃定後，地方政府就會依此決定如何使用土地。有別於「區域計畫法」較容易申請分區變更，在「國土計畫法」的管制下，就算開發者想申請在農地蓋工廠，只要不符合分區規定，就無法過關。',
        '也就是說，開發者只能在城鄉發展地區進行建設，過去如彰化國光石化案一度選址在彰化濕地，或是中科四期二林園區使用優良農地的爭議，在國土計畫的管制下，開發案不會通過申請。',
      ],
    },
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '誰來訂定',
      tagTitle: '誰來訂定？',
      tabContent: [
        '中央與18個直轄市、縣市各自訂定自己的國土計畫，並以中央指導為準則。',
        '值得注意的是，臺北市、嘉義市、金門縣、連江縣因全轄區都屬於都市計畫或國家公園地區，不需要提縣市國土計畫。',
        '未來，全國國土計畫每10年通盤檢討一次，縣市國土計畫則是每5年通盤檢討，做必要變更。',
      ],
    },
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '何時上路',
      tagTitle: '何時上路？',
      tabContent: [
        '根據「國土計畫法」規定，國土計畫的推動分成三個階段、總共10年實施。第一階段是2018年內政部公告實施「全國國土計畫」，作為指導地方的準則；第二階段是18縣市提出自己的國土計畫，2021年4月已全數公告實施；第三階段是製作「國土功能分區圖」，各縣市必須在2025年4月底前完成每一塊土地的功能分區圖繪製及公告。',
        '等到三階段陸續完成，臺灣的國土計畫才算正式上路。',
      ],
    },
    {
      isLocked: false,
      unlockGame: 'snake',
      tabTag: '影響範圍',
      tagTitle: '影響範圍有多大？',
      tabContent: [
        '縣市國土計畫的影響範圍包括縣市轄內的陸地以及所管轄的海域範圍，實際對民眾的影響可能要等到第三階段完成才比較明確。',
        '不過從功能分區的定義來看，住在都市的人應不至於感受到太大的變化，原本的都市計畫區原則上全部劃入城鄉發展地區第一類，一樣以都市計畫法管理。至於住在非都市地區的人，可能會因住家被劃設到不同的地區而受到影響。',
      ],
    },
  ],
}
