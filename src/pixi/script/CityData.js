export const cityDataArray = [
  {
    cityIndex: 0,
    cityName: '新北市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        cityName: 'newtaipei',
        tabTag: '基本資料',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020新北市未來20年發展重點：新北市的住商用地相對足夠，這次國土計畫著重在區位調整，把人口和產業從較擁擠、昂貴的都市移到郊區。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020預計最多會增加40萬人，目前全市50%以上的人口聚居在板橋區、中和區、新莊區、三重區、新店區，未來希望把人引導到蘆洲區、五股區、三峽區、鶯歌區、林口區等區',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020住商用地預計增加420公頃，主要是在三重區、五股區、蘆洲區、土城區、三峽區、瑞芳區',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020新規劃的產業用地約694公頃，主要落在五股區、泰山區、三峽區、鶯歌區、樹林區、大柑園區、瑞芳區',
          },
          {
            type: 'paragraph',
            content:
              '5.\u0020三峽、鶯歌列為輔導違章工廠進駐的區域，是2026-2035年的發展重點',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'newtaipei',
        //tabTitle:'？',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在新北市討論到的區位問題：',
          },
          {
            type: 'title',
            content: '平地農業幾乎消失？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>重工輕農，超過九成農地都在山坡地，農糧大量倚賴其他縣市',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>將部分國土保育地區改為農業地區，農業應從國土配置出發，並不是所有的縣市都能保留大面積農地',
          },
          {
            type: 'title',
            content: '住商用地太多？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>人口雖還在增加，但空屋率很高、部分地區人口萎縮，應檢討住商需求。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>未來人口增加的重點地區是三峽和鶯歌，評估之後仍有新增住商用地的需求',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 1,
    cityName: '桃園市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'taoyuan',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020桃園市未來20年發展重點：人口快速成長，工業生產總額全國第一，現有的住宅及產業用地已經開發飽和，目標是推動新的產業開發地區。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020桃園區、中壢區和航空城定位為三大都會生活圈，光是航空城計畫就新增近880公頃的住商用地。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020新增的工業用地約1994公頃，其中5年內有具體發展規劃的是中壢工業區擴大計畫，約增加623公頃。',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020有全臺第二大的未登記工廠面積，僅次臺中市。5年內具體規劃5處聚落輔導區，包括八德、大園、新屋、大溪、平鎮。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'taoyuan',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在桃園市討論到的區位問題：',
          },
          {
            type: 'title',
            content: '都市農業區歸零？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>部分都市農業區主要從事農業使用，未來也沒有都市發展需求，建議維持原有規劃。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>都會的農業也是環境容受力的一部分，應先釐清住商、產業的需求，再盤點要釋出多少的都市計畫農業區。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>產業開發用地平均達到93%，以現況來看，新的產業用地只能從剩下的農業用地來尋找。國土計畫不可能是每個縣市、區位均衡發展，桃園的現況就是要擔負臺灣產業發展的責任。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'taoyuan',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到桃園市獨有的問題：',
          },
          {
            type: 'title',
            content: '煉油廠搬遷爭議',
          },
          {
            type: 'paragraph',
            content:
              '設置在龜山區的煉油廠過去發生多次爆炸，且附近居民人數增加，市府基於工安問題，屢次要求中油提出遷廠計畫。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>中油承諾說要搬遷，卻遲遲沒有明確的時間表，建議要在2036年前完成規劃。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>中油：</bold>從未承諾遷廠期限，目前仍在規劃階段，市府不能擅自決定搬遷時間。煉油廠是北部最重要的油品輸儲中心，如果要維持全國能源的穩定供應，必須慎重考量，先建後遷。',
          },
        ],
      },
    ],
  },
  {
    cityIndex: 2,
    cityName: '新竹縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'hsinchu',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020新竹縣未來20年發展重點：科技和產業園區是發展重點，希望透過新增住商及工業區的腹地，擴大都市計畫的範圍。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020住商用地約增加689公頃，主要的地點包括竹東鎮、寶山鄉、新豐鄉、湖口鄉，以及遭質疑空屋率太高的竹北市。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u00205年內有具體開發計畫的四大園區，包含徵收爭議超過20年的臺灣知識經濟旗艦園區、環評曾三次卡關的竹科寶山2期擴建案、芎林新設產業園區，以及新豐新設產業園區，共新增279.91公頃的住商用地，以及225.5公頃的工業、科學園區用地。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '垃圾問題',
        tabTagEng: 'trash',
        cityName: 'hsinchu',
        tabContent: [
          {
            type: 'hint',
            content:
              '廢棄物處理是人們生活必要的措施，卻也是人們不想靠近的鄰避設施。以下是國土計畫審查時在新竹縣討論到的垃圾處理問題：',
          },
          {
            type: 'title',
            content: '廢棄物該怎麼處理？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>新竹縣目前和新竹市共用焚化爐，如果未來工業區和科學園區會增加，縣府有辦法處理暴增的廢棄物嗎？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>新竹市垃圾焚化廠的最大可服務人口255萬人，按照目前的計畫人口與每日平均焚燒量應該沒問題。正在規劃「新竹縣促進民間參與高效能垃圾熱處理設施投資BOO案」，希望能「自立自強」改善廢棄物堆積的狀況。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'hsinchu',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在新竹縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '原地土地如何分區？',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>泰雅族、賽夏族的聚落型態多為散居，如果全部劃設為「農業發展地區」，恐怕會被不肖人士開發；如果全部劃設為「國土保育地區」，民宿、停車場等建設都將全面禁止，造成部落發展困難。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>因為原住民散居的特性，讓劃設範圍看起來面積很大，會與83個部落逐案討論，再決議各部落採用的方案。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '缺水問題',
        tabTagEng: 'water',
        cityName: 'hsinchu',
        tabContent: [
          {
            type: 'hint',
            content:
              '人們的日常生活需要水、產業發展需要水、觀光活動也需要水，而受極端氣候影響，水資源日益珍貴，以下是國土計畫審查時在新竹縣討論到的水資源問題：',
          },
          {
            type: 'title',
            content: '缺水問題該怎麼處理？',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>預計人口大量移入，目前缺水的解決方案是從石門水庫提取或新設水庫，有其他的處理方式嗎？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>增加供水措施，例如寶二水庫加高、再生水和海淡水開發、更換老舊的自來水管線等，另外還有列入前瞻基礎建設計畫的天花湖水庫興建計畫。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 3,
    cityName: '新竹市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'hsinchu-city',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020新竹市未來20年發展重點：重心放在升級既有的香山、朝山等傳統工業區，以及推動以AI、物聯網等軟體為主的「竹科X」產業園區。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020軟體產業的特性是不需要太多的廠房，新竹市因此成為臺灣西部縣市中唯一不在未來20年再新增工業用地的縣市。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020長期存在交通壅塞的問題，新竹市解方是規劃新的都市計畫（如頭前溪都市計畫），增加居住空間、搭配輕軌串聯。5年內有具體發展的規劃，約新增139.25公頃的住商用地。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'hsinchu-city',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在新竹市討論到的區位問題：',
          },
          {
            type: 'title',
            content: '都市農業區幾乎歸零？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>新竹市沒有先檢討都市計畫可釋出的住商、工業發展用地，就直接把都市計畫農業區挪為他用。新竹市必須先提出未來發展計畫與期程。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>新竹都市計畫發展率已近九成、腹地不足，且有些農地受到污染，有些分佈零散，有些夾在都市發展區之中，有些則是淹水潛勢區，因此都規劃為未來的都市發展用地。最後仍有保留3.4公頃。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '缺水問題',
        tabTagEng: 'water',
        cityName: 'hsinchu-city',
        tabContent: [
          {
            type: 'hint',
            content:
              '人們的日常生活需要水、產業發展需要水、觀光活動也需要水，而受極端氣候影響，水資源日益珍貴，以下是國土計畫審查時在新竹市討論到的水資源問題：',
          },
          {
            type: 'title',
            content: '缺水問題該怎麼處理？',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>民國125年需水量預估一天短缺26.19萬噸，就算桃園新竹備援管線完成，一天還是短缺6.19萬噸，且天花湖水庫提供水源不確定，該如何解決？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>增加供水措施，例如寶二水庫加高、再生水和海淡水開發、更換老舊的自來水管線等，另外還有列入前瞻基礎建設計畫的天花湖水庫興建計畫。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'hsinchu-city',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到新竹市獨有的問題：',
          },
          {
            type: 'title',
            content: '塞車問題該怎麼解決？',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>新竹市如何紓解交通壓力？像是跨域輕軌等交通議題，建議縣市有更密切的合作。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>新竹市過去10幾年沒有大的開發區，人口增長後，多住在新竹縣，通勤到科學園區上班。目前已規劃新的都市計畫，希望留住通勤的人潮，另外也會和新竹縣討論改善公共運輸和輕軌串聯。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 4,
    cityName: '苗栗縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'miaoli',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020苗栗縣未來20年發展重點：首要目標是加強鄉村地區的規劃，優先地區是頭份市、苗栗市、後龍鎮、通宵鎮、卓蘭鎮、三義鄉、西湖鄉、南庄鄉、泰安鄉，補強公共設施，改善居住環境。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020人口外流和老化問題嚴重，5年內有具體發展的規劃，僅有竹南鎮廣源科技園區新增12.39公頃的住商用地。新增的工業用地主要位於通霄鎮、銅鑼鄉跟三義鄉，約為51公頃。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'miaoli',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在苗栗縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '5 年內有具體規劃的開發計畫，從 5 項暴增到 13 項？',
          },
          {
            type: 'paragraph',
            content:
              '縣府在國土計畫專案小組討論階段提出 5 項 5 年內有具體發展的規劃，到了內政部大會審議時，再新增 8 項，民間團體質疑規劃過程太草率。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>撤回苗栗公館鄉佛壽普陀山大圓覺禪寺一案，取消銅鑼光電案，最後共通過 11 案。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'miaoli',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在苗栗縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '石虎棲地強碰光電場區？',
          },
          {
            type: 'paragraph',
            content:
              '苗栗是全臺發現最多石虎的地區，棲地和上百件光電申請案重疊，但目前農委會未劃設石虎保護區，苗栗縣國土計畫也未規劃特定區。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>實質保育與友善石虎的獎勵措施已陸續上路，遇到相關案件，會徵詢保育科意見，也在研究外審機制。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 5,
    cityName: '臺中市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'taichung',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020臺中市未來20年發展重點：外來人口持續移入，產業用地及住商用地的需求大增，郊區農地面臨開發壓力。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020減少兩成現有農地，預計用來興建住商用地、產業用地，以及輔導違章工廠進駐的區域。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020新增的工業用地約682公頃，其中5年內有具體發展規劃的地點包含神岡都市計畫周邊產業園區、大里夏田周邊產業園區、塗城周邊產業園區，總共約153.43公頃。',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020有全臺面積最大的未登記工廠，約有1.8萬家，5年內具體規劃5處聚落輔導區，包括大里區、烏日區、神岡區。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'taichung',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在臺中市討論到的區位問題：',
          },
          {
            type: 'title',
            content: '未登記工廠盤點太慢？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>未登工廠數量龐大，目前尚未完成盤點及清查，市府對於土地需求、輔導方式也說不清楚。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>優先處理55%未登工廠，如果產業用地仍有不足，將以都市計畫農業區為未來優先發展的儲備用地。',
          },
          {
            type: 'title',
            content: '都市農業區銳減？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>不能只憑籠統的原則就輕易將整塊都市計畫農業區改為城鄉發展區，應該提出個別更細緻的實際狀況，才能評估這樣的改變是否合理。例如大甲都市計畫區的住商用地需求幾十公頃，卻要把200多公頃的農業區改為都市儲備用地，並不合理。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>會訂下原則，現況農業使用大於80%，會維持農業發展地區；如果住商發展率達80%以上，或現況非農業使用的比例較高，或原都市計畫已指導為都市發展儲備用地，才改為城鄉發展儲備用地。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 6,
    cityName: '彰化縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'chunghua',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020彰化縣未來20年發展重點：近10年人口數持續下降，希望透過規劃重大建設，吸引外來人口移入彰化，並藉由擴大都市計畫區，把人留住。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020目前都市化程度太低，排名全國倒數第三。未來集中發展彰化縣、員林市兩大都市群，輔以田中鎮、北斗鎮次都市群，目標是2036年人口數維持127萬人，與現況持平。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u00205年內有具體規劃的開發案，包含新增約292.28公頃住商用地和73.76公頃產業用地的「擴大彰化縣都市計畫」、用來輔導未登記工廠的水五金田園生產聚落特定區，以及二林精密機械產業園區，預估會新增109.06公頃的工業用地。',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020近年成為違章工廠重災區，主要集中和美鎮、彰化縣、鹿港鎮、福興鄉、秀水鄉、埔鹽鄉及花壇鄉，預計2036年優先處理70％未登記工廠，規劃3處聚落輔導區，包括鹿港鎮、和美鎮、彰北地區。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTagEng: 'population',
        cityName: 'chunghua',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個地方因為人口組成會有不同的問題：例如人口外流、或人口大量移入、老年人口急遽增加等等，都要有不同的規劃和調整。以下是國土計畫審查時在彰化縣討論到的人口問題：',
          },
          {
            type: 'title',
            content: '人口不停流失？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>過去因彰化縣、和美等彰北地區的都市土地發展飽和，導致都市化人口外流。未來擬透過重大建設吸引人才，並擴大彰北地區的都市計畫，把人留在縣內。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>擴大都市就能留住人口嗎？企劃書中提到重大建設將可引入5萬6600人，判斷的依據是什麼？怎樣防止臺中市把彰化縣人口吸走？',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'chunghua',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在彰化縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '5年內想推動5大開發案？',
          },
          {
            type: 'paragraph',
            content:
              '縣府原本提案，5年內想推動打鐵厝南北側產業園區、二林精密機械產業園區、彰化水五金田園生產聚落特定區和擴大彰化縣都市計畫，新增面積達1724公頃。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>打鐵厝南北側產業園區太靠近住宅區，最後全數刪除。二林精密機械產業園區原本劃設的範圍太大，決議縮減面積。',
          },
          {
            type: 'title',
            content: '違章工廠聚落規劃爭議？',
          },
          {
            type: 'paragraph',
            content: '縣府規劃三處未登記工廠聚落輔導區，總量約1595公頃。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>環團：</bold>縣府非常積極輔導未登工廠取得「特定工廠登記」，讓工廠有20年合法用地資格，根本無須遷廠。另根據經濟部清查，彰化縣有73.8公頃的閒置用地，這些地都可以用，為什麼一定要開發？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>除了彰北地區，未登工廠第二多的地方在員林市，縣府原本劃設的輔導區卻分散各地。輔導應該要有區域性，工廠一定是就近遷移，建議引導哪個地方的未登工廠也都沒有講清楚，選址真的適當嗎？',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 7,
    cityName: '雲林縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'yunlin',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020雲林縣未來20年發展重點：有全臺最大的「宜維護農地」面積，超過8萬公頃，提倡將「農業權入憲」，農民的權益應該由各縣市共同負擔，而不是歸責於農業大縣，同時希望政府給予農地所有權人必要的補償，彌補因為開發受限所造成的經濟損失。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020預估2036年人口略減，以麥寮鄉、斗六市、虎尾鎮為人口的重點區域，新增住商用地602.8公頃。縣府理由是：麥寮工業區都市人口飽和、斗六有雲林科技大學學生的宿舍需求、高鐵虎尾站通車後，周邊呈現蔓延發展。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020地層下陷問題嚴重，在高鐵沿線150公尺禁限建範圍，劃設全國唯一的「國土復育促進地區」。',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020200多座宗教建築坐落在國土保育區、農業發展區，持續協助改善違規情況，輔導合法化。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'yunlin',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在雲林縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '麥寮特定區要新增3155公頃的開發面積？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>麥寮工業區已百分之百飽和，周邊的都市計畫人口發展率為119%，有開發的必要。第一期預計先開發緊鄰既有都市計畫區的200公頃土地，其餘2955公頃則改列農業發展地區，視未來發展情況決定。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>國土計畫每5年可以通盤檢討，建議雲林縣政府「分期分區」方式辦理，如果地方政府有具體新增未來發展地區的需要，可以5年後再提出。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'yunlin',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到雲林縣獨有的問題：',
          },
          {
            type: 'title',
            content: '地層下陷的挑戰',
          },
          {
            type: 'paragraph',
            content:
              '有14鄉鎮存在地層下陷的問題，其中以台西鄉、口湖鄉、四湖鄉等沿海地區和高鐵沿線尤其嚴重。',
          },
          {
            type: 'paragraph',
            content: '<bold>水利署：</bold>建議農業能夠向低耗水性作物轉型。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>能源局：</bold>可以參考複合式的地面型太陽光電，來提升地層下陷地區的土地利用率。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>經濟部：</bold>2001年雲林縣嚴重地層下陷面積是610.5平方公里，目前降低到200平方公里，已經減緩很多，已提出第二期防治計畫。',
          },
        ],
      },

      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '垃圾問題',
        tabTagEng: 'trash',
        cityName: 'yunlin',
        tabContent: [
          {
            type: 'hint',
            content:
              '廢棄物處理是人們生活必要的措施，卻也是人們不想靠近的鄰避設施。以下是國土計畫審查時在雲林縣討論到的垃圾處理問題：',
          },
          {
            type: 'title',
            content: '垃圾問題難解',
          },
          {
            type: 'paragraph',
            content:
              '林內焚化廠完工16年未啟用，目前垃圾都是委託嘉義縣代為處理，部分垃圾暫置各鄉鎮衛生掩埋場內。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>規劃精進型MT計畫，透過機器分選減少廢棄物，並產製RDF（廢棄物衍生燃料）作為鍋爐燃料。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 8,
    cityName: '嘉義縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'chiayi',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020嘉義縣未來20年發展重點：是全國人口負成長與老化指數最高的城市，要透過引進產業園區，吸引外地的青壯年就業與入籍。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u00205年內有具體規劃的開發案包括：迎接臺商回流的水上鄉南靖農場工業園區、中埔鄉公館農場工業園區等，以及3處未登記工廠聚落輔導區，位於水上鄉、民雄鄉、新港鄉，總開發面積達767公頃。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020原本想在5年內推動東石鄉、番路鄉、竹崎鄉新增都市計畫，以及大林鎮擴大都市計畫，審議大會時全數被退件，調整為5至20年的發展計畫。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTagEng: 'population',
        cityName: 'chiayi',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個地方因為人口組成會有不同的問題：例如人口外流、或人口大量移入、老年人口急遽增加等等，都要有不同的規劃和調整。以下是國土計畫審查時在嘉義縣討論到的人口問題：',
          },
          {
            type: 'title',
            content: '人口成長評估太樂觀？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>產業園區會帶人進來，大埔美智慧型工業園區已經招商招滿，再加上新增的馬稠後產業園區，預期會吸引3.8萬來自雲林、嘉義市、臺南縣市的人口。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>公立學校都在解編和廢校，青年回鄉屬於「微變化」，整體人口仍是呈現微降且老化的狀況，縣府的推估與現狀不符，改善生活品質比較關鍵。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'chiayi',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到嘉義縣獨有的問題：',
          },
          {
            type: 'title',
            content: '阿里山土地怎麼用？',
          },
          {
            type: 'paragraph',
            content:
              '目前大約有107公頃林班地，例如奮起湖老街，作為住宅、零售及餐飲設施等使用。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>那些地方早已有居住和營業的事實，也不可能回復成林業使用，希望保障既有的觀光商業發展。等林務局解編還需要時間，擔心不能在國土計畫實施前完成變更。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>林務局：</bold>各縣市的林班地也在解編當中，應採通案考量，會在2025年前積極趕辦。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>這屬於跨縣市的共通問題，傾向回歸農委會林務局研議，不另由地方政府建立土地管制措施。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 9,
    cityName: '臺南市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'tainan',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020臺南市未來20年發展重點：都市人口150萬，佔全市總人口將近80％，鄉村人口流失嚴重，目標是縫合都市和鄉村的落差。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u00205年內有具體規劃的新訂、擴大都市計畫共三個，落在七股區、北門區跟安平區，共218公頃；另外會推動的重大建設計畫包括新市產業園區、綠能產業園區和臺灣三部曲歷史文化區BOT案，前兩者開發涉及優良農地流失、破壞生態，農民抗爭持續至今。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTagEng: 'population',
        cityName: 'tainan',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個地方因為人口組成會有不同的問題：例如人口外流、或人口大量移入、老年人口急遽增加等等，都要有不同的規劃和調整。以下是國土計畫審查時在臺南市討論到的人口問題：',
          },
          {
            type: 'title',
            content: '都市、鄉村的人口分布失衡',
          },
          {
            type: 'paragraph',
            content:
              '臺南發展集中在都市計畫區，偏鄉地區產業流失嚴重，人口持續減少，5年內維持38萬人都很困難。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>滾動式檢討，計畫人口率未達五成的都市計畫區，將優先下修；而計畫人口達八成以上者，則會考慮增加計畫人口數。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>如何讓民眾搬到非都市，目前仍欠缺具體作法，像是未來改善環境品質、推動產業發展計畫、非都市地區的交通系統，都應更具體地納入鄉村整體規劃。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'tainan',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到臺南市獨有的問題：',
          },
          {
            type: 'title',
            content: '爭議的重大建設計畫',
          },

          {
            type: 'paragraph',
            content:
              '<bold>綠能產業園區：</bold>位於仁德區，因開發地多保育林木與動物，且仍有農民耕作，引發強烈反彈。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>新市產業園區：</bold>位於新市區台糖番仔寮農場，是經濟部因應臺商回流，規劃的五座產業園區之一，因屬於優良農地，且發現有環頸雉、燕鴴等保育類動物，須作二階環評。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 10,
    cityName: '高雄市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'kao',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020高雄市未來20年發展重點：都市與鄉村的人口分布是全臺最失衡，9成聚集在都市，要靠投入重大建設吸引外來人口，縫合城鄉差距。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u00205年內要推14個開發案，包括在燕巢區、橋頭區新增153.4公頃的住商用地，在小港區、岡山區新增63.13的工業用地，在岡山區、仁武區、鳥松區設置未登記工廠聚落輔導區，共321.46公頃。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020其中面積最大的開發案是六龜區寶來不老溫泉觀光休閒區，多達405.05公頃。2009年莫拉克風災造成嚴重的山崩和土石流，一直有地質脆弱的疑慮。',
          },
          {
            type: 'paragraph',
            content:
              '4.\u0020未設置都市農業區，全轉型為納管農地工廠，或是保留作為都市發展',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '缺水問題',
        tabTagEng: 'water',
        cityName: 'kao',
        tabContent: [
          {
            type: 'hint',
            content:
              '人們的日常生活需要水、產業發展需要水、觀光活動也需要水，而受極端氣候影響，水資源日益珍貴，以下是國土計畫審查時在高雄市討論到的水資源問題：',
          },
          {
            type: 'title',
            content: '豐枯期水資源差異大',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>高雄仰賴高屏溪川流水，水資源非常不穩定，在枯水期供水已經有幾十萬噸的不足，還需外縣市支援供水。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>將推動更換老舊的自來水管線、鼓勵工廠廢水回收，降低水資源浪費，並優先引進低耗水產業。自來水公司於高屏溪沿岸進行溪埔及大泉伏流水開發，預計民國110年完成。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTagEng: 'population',
        cityName: 'kao',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個地方因為人口組成會有不同的問題：例如人口外流、或人口大量移入、老年人口急遽增加等等，都要有不同的規劃和調整。以下是國土計畫審查時在高雄市討論到的人口問題：',
          },
          {
            type: 'title',
            content: '人口停滯、城鄉失衡',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>過去10年人口無顯著成長，已經被臺中市超車；現在只有1成的人口在鄉村，遠比全國平均的8:2更加失衡，未來鄉村地區只會萎縮不能成長。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>未來有新材料循環經濟園區、橋頭科學園區等產業園區，以及捷運、輕軌等重大交通建設，增加的就業機會能夠吸引外縣市人口移入。未來會調整人口達成率較低的都市計畫，推動城鄉均衡發展。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'kao',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在高雄市討論到的區位問題：',
          },
          {
            type: 'title',
            content: '人口持平卻新增住商用地？',
          },

          {
            type: 'paragraph',
            content:
              '<bold>營建署：</bold>重點在於產業發展而非住商建設，產業帶動社會增加人口，才能解決問題，都市計畫區增加住商反而形成壓力。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>住宅供給雖然充裕，但有超過四成屬於30年以上老屋，必須預先儲備住宅更新的空間。',
          },
        ],
      },

      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'kao',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到高雄市獨有的問題：',
          },
          {
            type: 'title',
            content: '寶來不老溫泉區有災害風險？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>不老溫泉區環境敏感脆弱，莫拉克風災期間發生嚴重傷亡，市政府用簍空打洞的方式，把災害的地方「打掉」，不代表剩下的一定就安全。應該適度刪減開發規模，地方民眾或許有開發土地的意見，但市府心中應該要有一把尺。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>並沒有要大規模開發，已經將有安全疑慮的環境敏感地區剔除，如果未來有更多調查事證，指出其他區域也有風險，也會調整。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 11,
    cityName: '屏東縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'pintung',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020屏東縣未來20年發展重點：擔心土地劃設成農業區後會限制用途，例如魚塭用地可能無法合法，因此低報優良農地的面積，都市農業區也全轉為都市發展使用。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020預計2035年大部分的鄉鎮市人口都會減少，因此不再新增住商用地。5年內有具體規劃的工業區位於屏東市、新園鄉，總共22.08公頃。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020未登記工廠面積約1015.84公頃，整體主要分布於屏北地區，輔導區應會落在長治鄉、麟洛鄉、屏東市、新園鄉、崁頂鄉、潮州鎮、東港鎮、林邊鄉。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'pintung',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在屏東縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '都市農業區掛零？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>民眾擔心劃設後會有土地使用限制的問題，接受到許多民意陳情。如果後續經通盤檢討，認定都市計畫農業區沒有都市發展需求，再調整回來。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>目前政策下，耕作條件較佳的特定農業區限制較嚴，但補助資源卻和一般農業區沒有差別。未來以分級輔導、分級投入資源的方向來研議。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>環團：</bold>可考慮加入農地分配款，希望提高劃設農地意願，不再讓農地成為農民不可承受之重。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 12,
    cityName: '臺東縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'taitung',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020臺東縣未來20年發展重點：觀光快速發展，到2036年戶籍人口和觀光人口達38.9萬，比現居人口21萬人高出許多，目標是補足公共建設，包括設置3座綠能發電廠、開發地下水或伏流水、重啟焚化爐。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020少子化＋人口外移，預估2036年人口會減少一萬多人，無新增住商用地。5年內有具體發展規劃的開發案包括深層海水產業發展園區、知本濕地光電場、城鎮之心南迴驛建設計畫、小野柳風景特定區，共306公頃，無額外的工業用地。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020沒有提供任何5至20年內的開發規劃，縣府稱未來的城鄉發展會以既有的都市計畫地區為優先，避免浪費公共資源。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '垃圾問題',
        tabTagEng: 'trash',
        cityName: 'taitung',
        tabContent: [
          {
            type: 'hint',
            content:
              '廢棄物處理是人們生活必要的措施，卻也是人們不想靠近的鄰避設施。以下是國土計畫審查時在臺東縣討論到的垃圾處理問題：',
          },
          {
            type: 'title',
            content: '垃圾量因觀光人數暴增？',
          },
          {
            type: 'paragraph',
            content:
              '公有垃圾掩埋場僅餘一到兩年的掩埋使用量，蘭嶼、綠島地區的廢棄物掩埋場也已經飽和，需將垃圾運回臺灣。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>之前的垃圾多是委由高雄市處理，現在主要以垃圾掩埋為主，將重啟焚化爐。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 13,
    cityName: '花蓮縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'hualian',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020花蓮縣未來20年發展重點：人口2035年雖預估會減少，但包括花蓮市、吉安鄉、新城鄉、壽豐鄉、秀林鄉等北花蓮地區已發展飽和，仍劃設了68公頃的住商用地。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u00205-20年的開發重點地區多達3270公頃。縣府表示，有四處位於鄉鎮公所附近，是因為公共設施不足，準備改善當地的生活機能；林田山、七星潭、花蓮溪出海口、瑞穗溫泉等五處因應觀光發展，預留發展彈性。剩餘一處則位於吉安工業區周邊，預留為輔導未登記工廠的空間。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020原住民人口占28%，原保地建地面積卻僅有全縣住宅用地的13%，部落建築用地非常不足，導致原住民離開部落。正與部落溝通，馬太鞍、太巴塱等部落可能優先做鄉村地區整體規劃。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'balance',
        tabTag: '人口問題',
        tabTagEng: 'population',
        cityName: 'hualian',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個地方因為人口組成會有不同的問題：例如人口外流、或人口大量移入、老年人口急遽增加等等，都要有不同的規劃和調整。以下是國土計畫審查時在花蓮縣討論到的人口問題：',
          },
          {
            type: 'title',
            content: '人口老化嚴重',
          },
          {
            type: 'paragraph',
            content:
              '鳳林鎮、壽豐鄉、光復鄉、豐濱鄉、瑞穗鄉及富里鄉等6鄉鎮的老化指數高達200%，65歲以上人口是0-14歲人口的兩倍，10年後老年人口將再增一倍。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>鄉村長照設施嚴重不足，將建立高齡資料庫，以此擬定高齡友善城市指標，並推動示範計畫。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'hualian',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在花蓮縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '住商和產業用地劃設太多？',
          },
          {
            type: 'paragraph',
            content:
              '人口預估會減少，卻打算新增360公頃住商及產業用地，之後被大砍到68公頃住商用地。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>目前的都市計畫區土地雖供給超量，但區域分布不均，特別是北花蓮的吉安地區住宅面積不足，人口仍在成長。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 14,
    cityName: '宜蘭縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'yilan',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020宜蘭縣未來20年發展重點：鐵路、東部快鐵、北宜高鐵「三鐵共構」是確定的發展方向，未來宜蘭的人口成長及假日人潮須再評估。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u00205年內有具體規劃的開發案主要落在礁溪鄉和頭城鎮，共新增109.33公頃的住商用地。另外還有「清水地區自然養生及觀光遊憩園區」新增37.86公頃觀光用地，要在清水地熱的上游興建旅館，並設置露營區及泡湯區。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u0020發展山海田園宜居城市，全縣超過7成列入國土保育地區，宜維護農地則劃設了28682公頃，佔13%面積。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'yilan',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到宜蘭縣獨有的問題：',
          },
          {
            type: 'title',
            content: '豪華農舍亂象？',
          },
          {
            type: 'paragraph',
            content:
              '雪隧開通後，宜蘭農舍問題日益嚴重。根據宜蘭縣國土計畫書，縣內共有1124筆違規使用土地，包含住家、買賣業、倉儲、宮廟、未登記工廠。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>宜蘭有1萬多間農舍，吃掉1000多公頃農地',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>先有農業經營需求、又兼有自住需要，才特許核准農舍，未來會專案討論。',
          },
          {
            type: 'title',
            content: '地質敏感區蓋旅館？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>環團：</bold>清水BOT園區預定地為河川地，等於將河川地讓財團蓋別墅，且該處鄰近山崩地滑地質敏感區、地下水補注敏感區，公益性何在？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>申請性質為遊憩設施，非屬重大公共設施或公用事業計畫項目。計畫內容，如建築高度及樓層數配置、引進人口、客房數及土地使用強度等，將一併考量。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 15,
    cityName: '基隆市',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: 'snake',
        tabTag: '基本資料',
        cityName: 'keelung',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020基隆市未來20年發展重點：：希望推動「都會區域計畫」，和臺北市、新北市與桃園市結合為「首都圈」，共享財政和建設資源，各自發揮區位優勢，基隆預計擔任海洋門戶。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020人口持續減少，且土地有93%為山坡地，發展受限。未再新增住商用地，產業用地僅在七堵增設10.1公頃。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'run',
        tabTag: '個別問題',
        tabTagEng: 'indi',
        cityName: 'keelung',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市都因為發展歷史的獨特性，衍生出各自的問題，以下是國土計畫審查時討論到基隆市獨有的問題：',
          },
          {
            type: 'title',
            content: '基隆港轉型？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>市府：</bold>不只是商港，還可以海洋休憩活動場域，以及設置「市港再生發展基地」，引入海洋科技技術服務、金融、商業會議等產業。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>港務公司：</bold>觀光和發展城市文化場域對城市來說或許很重要，但對商港而言，卻可能產生衝擊。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 16,
    cityName: '南投縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'nantou',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020南投縣未來20年發展重點：近10年人口持續減少，要靠重大產業建設吸引人口，5年內有具體規劃的開發案包括南投市工業區、竹山鎮竹藝產業園區、名間鄉大中鋼鐵擴展計畫，共新增40.22公頃的工業用地',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020專案輔導清境農場地區，未來會做鄉村地區的整體規劃，以改善環境為主要目標，持續進行環境監測。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'snake',
        tabTag: '垃圾問題',
        tabTagEng: 'trash',
        cityName: 'nantou',
        tabContent: [
          {
            type: 'hint',
            content:
              '廢棄物處理是人們生活必要的措施，卻也是人們不想靠近的鄰避設施。以下是國土計畫審查時在南投縣討論到的垃圾處理問題：',
          },
          {
            type: 'title',
            content: '垃圾問題難解？',
          },
          {
            type: 'paragraph',
            content:
              '縣內沒有焚化爐，原本都是委託彰化縣和臺中市代為處理，但其從2016年開始因焚化爐老舊等因素無法提供協助，垃圾堆積問題嚴重。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>現階段僅能轉運至外縣市焚化廠代為處理，並設置多元垃圾處理設施；未來擬在竹山鎮設置綠能永續中心，自主處理廢棄物，是2026-2035年的發展重點。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'nantou',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在南投縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '住商用地新增太多？',
          },
          {
            type: 'paragraph',
            content:
              '縣府原本預計新增1900公頃住商用地，其中的重大開發案「新訂中興交流道特定區計畫」5年內有具體規劃的住商和產業用地只有141公頃，卻劃設了582公頃。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>農委會：</bold>中興交流道特定區已經是花園城市的風貌，四周都是低密度水田，無需更多建設，新的建設恐提高房價。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>未來預計成長人口才2-3萬，住商需求土地為什麼需要這麼多？',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>草屯、中興新村、南投都市計畫區已經飽和，有往外擴散的情形，希望藉由「新訂中興交流道特定區計畫」來降低隨意發展的情況。目前以582公頃為主要發展方向，剩餘的住商用地則是針對未來發展，目前尚未有具體規劃。',
          },
        ],
      },
    ],
  },

  {
    cityIndex: 17,
    cityName: '澎湖縣',
    // isUnlockAll: false,
    tabs: [
      {
        // isLocked: false,
        unlockGame: '',
        tabTag: '基本資料',
        cityName: 'penghu',
        tabContent: [
          {
            type: 'paragraph',
            content:
              '1.\u0020澎湖縣未來20年發展重點：觀光需求成長，規劃吉貝和七美各新建一座海水淡化廠、馬公海淡二廠二期工程，確保供水無虞。垃圾目前代請高雄市所管焚化爐代為處理，還需要規劃新方法。',
          },
          {
            type: 'paragraph',
            content:
              '2.\u0020海洋資源豐富，島嶼共90座，海洋資源地區比例超過全縣9成。南方四島國家公園、玄武岩自然保留區、望安島綠蠵龜產卵棲地保護區、貓嶼海鳥保護區等均設為國土保育區。',
          },
          {
            type: 'paragraph',
            content:
              '3.\u00205年內有具體發展規劃的案件共10件，包括4件度假區開發案，共新增44.25公頃的觀光用地，地點位在隘門、漁翁島、七美月鯉灣、吉貝。',
          },
        ],
      },
      {
        // isLocked: true,
        unlockGame: 'candy',
        tabTag: '區位問題',
        tabTagEng: 'area',
        cityName: 'penghu',
        tabContent: [
          {
            type: 'hint',
            content:
              '每個縣市會依照各自的需求，把土地劃設成不同的區域，包括農業區、工業區、住宅區、商業區、鄉村區、國土保育區等。各區的面積分配與位置對於住在上面的人至關重要，以下是國土計畫審查時在澎湖縣討論到的區位問題：',
          },
          {
            type: 'title',
            content: '農地變建地？',
          },
          {
            type: 'paragraph',
            content:
              '農地相對稀少，部分弱勢民眾面臨「有地無屋」窘境，因此自民國83年起形成特殊的「農」變「建」制度。近年逐漸浮濫，甚至淪為農地炒作管道，曾遭監察院糾正。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>會訂定農地改建地的總量上限，並輔導集中分布，完成後才可以申請自建住宅，且需符合特殊的土地管制規定。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>二、三級離島非重點聚落周邊地區，為保留未來發展彈性，無須訂定基地應留設綠地面積，且不宜限制僅作自用住宅使用。',
          },
          {
            type: 'title',
            content: '一次推12處重大建設或度假村計畫',
          },

          {
            type: 'paragraph',
            content:
              '<bold>審查委員：</bold>12案只有少處完成招商，大多還未完成核定，且開發案大多在海岸地區，或是選址位於海灣的度假村，容易受到海平面上升或海嘯影響。',
          },
          {
            type: 'paragraph',
            content:
              '<bold>縣府：</bold>的確沒有考量氣候變遷的對策，相信將來個別案件在推動建設時，投資單位一定會考慮氣候風險進來。如果建設案未能即時完成，將納入未來5至20年的發展重點。',
          },
        ],
      },
    ],
  },
]

export const infoCard = {
  cityIndex: 0,
  cityName: '',
  tabs: [
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '基本資料',
      tabTitle: '什麼是國土計畫？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '在2015年「國土計畫法」通過之前，臺灣的土地管理可分成三種：都市土地由「都市計畫法」管理、非都市土地由「區域計畫法」管理、國家公園由「國家公園法」管理。',
        },

        {
          type: 'paragraph',
          content:
            '不過，「區域計畫法」長期存在漏洞，例如法律規定農業區不可以蓋工廠，只要業者透過申請使用地變更等方式，農地還是可能被變更為建築用地。此外，區域計畫也無法「越俎代庖」，指導都市計畫。',
        },
        {
          type: 'paragraph',
          content:
            '「國土計畫法」上路後，成為臺灣管理土地的最高原則，中央政府以此制定「全國國土計畫」，先評估國家所需的糧食、產業等需求，再進行國土分配。舉例來說，政府訂出國家應保有的最少農地總量，再要求各縣市維持農地的基本面積。',
        },
        {
          type: 'paragraph',
          content:
            '接著，地方政府結合全國性的規定（如農地、工業地的全國總量），以及縣市本身的人口、自然環境、產業需求等條件和願景，進行土地規劃，這就是「縣市國土計畫」。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '計畫目的',
      tabTitle: '目的是什麼？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '國土計畫的目的是，找出每塊土地最適合的使用方式：哪些地區適合發展農業？哪些地區的都市化程度適合發展為城鄉區？哪些地區的環境較敏感而必須劃為國土保育區？透過事先的規劃，定出土地可發展與不可發展的地方，減少不當開發發生的機會。',
        },
        {
          type: 'paragraph',
          content:
            '過去的土地開發模式通常是開發商先買地，再申請土地開發許可，如果取得的土地是位在環境敏感區或農地，就容易產生爭議。如今受到「國土計畫法」的管制，土地分區的穩定性比較高，不會輕易就被變更使用的方式。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '主要內涵',
      tabTitle: '主要內涵？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '「國土計畫法」將全國土地的使用方式分成四大類，包括國土保育地區、海洋資源地區、農業發展地區、城鄉發展地區。',
        },
        {
          type: 'paragraph',
          content:
            '國土保育地區是為了保護重要生態，或是敏感環境而設；海洋資源地區是為了海洋資源保育、規範海域使用而設；農業發展地區是為了保留農地、維持糧食安全功能；城鄉發展地區則是為了提供都市與產業的發展需求。',
        },
        {
          type: 'paragraph',
          content:
            '功能分區劃定後，地方政府就會依此決定如何使用土地。有別於「區域計畫法」較容易申請分區變更，在「國土計畫法」的管制下，就算開發者想申請在農地蓋工廠，只要不符合分區規定，就無法過關。',
        },
        {
          type: 'paragraph',
          content:
            '也就是說，開發者只能在城鄉發展地區進行建設，過去如彰化國光石化案一度選址在彰化濕地，或是中科四期二林園區使用優良農地的爭議，在國土計畫的管制下，開發案不會通過申請。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '誰來訂定',
      tabTitle: '誰來訂定？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '中央與18個直轄市、縣市各自訂定自己的國土計畫，並以中央指導為準則。',
        },
        {
          type: 'paragraph',
          content:
            '值得注意的是，臺北市、嘉義市、金門縣、連江縣因全轄區都屬於都市計畫或國家公園地區，不需要提縣市國土計畫。',
        },
        {
          type: 'paragraph',
          content:
            '未來，全國國土計畫每10年通盤檢討一次，縣市國土計畫則是每5年通盤檢討，做必要變更。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '何時上路',
      tabTitle: '何時上路？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '根據「國土計畫法」規定，國土計畫的推動分成三個階段、總共10年實施。第一階段是2018年內政部公告實施「全國國土計畫」，作為指導地方的準則；第二階段是18縣市提出自己的國土計畫，2021年4月已全數公告實施；第三階段是製作「國土功能分區圖」，各縣市必須在2025年4月底前完成每一塊土地的功能分區圖繪製及公告。',
        },
        {
          type: 'paragraph',
          content: '等到三階段陸續完成，臺灣的國土計畫才算正式上路。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '影響範圍',
      tabTitle: '影響範圍有多大？',
      tabContent: [
        {
          type: 'paragraph',
          content:
            '縣市國土計畫的影響範圍包括縣市轄內的陸地以及所管轄的海域範圍，實際對民眾的影響可能要等到第三階段完成才比較明確。',
        },
        {
          type: 'paragraph',
          content:
            '不過從功能分區的定義來看，住在都市的人應不至於感受到太大的變化，原本的都市計畫區原則上全部劃入城鄉發展地區第一類，一樣以都市計畫法管理。至於住在非都市地區的人，可能會因住家被劃設到不同的地區而受到影響。',
        },
      ],
    },
    {
      // isLocked: false,
      unlockGame: 'snake',
      tabTag: '製作名單',
      tabTitle: '製作名單',
      tabContent: [
        {
          type: 'center',
          content: '監製：簡信昌',
        },
        {
          type: 'center',
          content: '製作人：李又如、陳玟諺',
        },
        {
          type: 'center',
          content: '記者：陳珮瑜',
        },
        {
          type: 'center',
          content: ' 設計：曾立宇',
        },
        {
          type: 'center',
          content: '工程：呂理詣',
        },
        {
          type: 'center',
          content: '社群：徐湘芸',
        },
      ],
    },
  ],
}
