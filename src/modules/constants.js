const GUDING = '固定'
const LANGFEI = '废'

const typeInCalender = {
  GuDing: '固定',
  LangFei: '废',
  jiHuaWork: '计划-工作',
  wetoria: 'Wetoria',
  work: '工作',
  family: '家庭',
  selfDiscipline: '自律',
  study: '学习',
  friend: '朋友',
  ShiYe: '事业',
  '❤️': '❤️',
}

const defaultMap = {}
Object.values(typeInCalender).forEach((i) => {
  defaultMap[i] = i;
})

exports.scheduleTypeMap = {
  ...defaultMap,
  "V": typeInCalender.wetoria,
  
  "通勤": typeInCalender.GuDing,
  "午休": typeInCalender.GuDing,
  "固": typeInCalender.GuDing,
  "睡觉": typeInCalender.GuDing,

  "❤️": typeInCalender['❤️'],
  "家": typeInCalender.family,
  "友": typeInCalender.friend,

  "工作": typeInCalender.work,
  "事业": typeInCalender.ShiYe,

  "律": typeInCalender.selfDiscipline,
  "增": typeInCalender.study,
  "学习": typeInCalender.study,

  "废": typeInCalender.LangFei,
  "玩": typeInCalender.LangFei,
  "摸鱼": typeInCalender.LangFei,
}