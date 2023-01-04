import TestData from './TestData';

const GUDING = '固定'
const LANGFEI = '废'
const typeMap = {
  "V":"Wetoria",
  
  "通勤": GUDING,
  "午休": GUDING,
  "固": GUDING,
  "睡觉": GUDING,

  "❤️":"❤️",
  "家":"家庭",
  "友":"朋友",

  "工作":"工作",
  "事业":"事业",

  "律":"自律",
  "增":"学习",

  "废": LANGFEI,
  "玩": LANGFEI,
  "摸鱼": LANGFEI,
}

const secondsOfDay = 24 * 60 * 60;

const formatDuration = (duration) => {
  const durationMinutes = Math.round(duration / 60);
  const durationHours = Math.round(durationMinutes / 60);
  const durationMinutesRemain = durationMinutes % 60;
  return `${durationHours > 0 ? durationHours + '小时' : ''}${durationMinutesRemain}分钟`;
}

function getTotalSchedule(totalDurationMap) {
  const isGrowth = totalDurationMap['废']
    < (totalDurationMap['学习'] + totalDurationMap['工作'] + totalDurationMap['事业'] + totalDurationMap['自律'])
  const totalSchedule = {
    title: '统计',
    content: '',
    isAllDay: '是',
    scheduleType: isGrowth ? '学习' : '废',
  }
  Object.keys(totalDurationMap).forEach((key) => {
    const duration = totalDurationMap[key]
    const formatedDesc = formatDuration(duration);
    let prefix = '';
    const map = {
      固定: '日常耗费',
      废: '荒废了',
      事业: '为自由花费了',
    }
    prefix = map[key] || `在${key}上花费了`
    let proportion = (duration / secondsOfDay * 100).toFixed(0);
    totalSchedule.content += `${prefix}${formatedDesc}, 占${proportion}%。@@@@`
  })
  return totalSchedule;
}

function dealRecords(list) {
  list.sort((a, b) => {
    const aCreateTime = new Date(a.endTime);
    const bCreateTime = new Date(b.endTime);
    return aCreateTime - bCreateTime
  })

  list = list.map(i => ({
    title: i.title,
    content: i.content,
    createTime: i.createTime,
    modifyTime: i.modifyTime,
    lastDayEndTime: i.lastDayEndTime,
  }))

  const totalDurationMap = {};

  list.forEach((item, index) => {
    const temp = new Date(item.createTime);
    item.date = `${temp.getFullYear()}/${temp.getMonth() + 1}/${temp.getDate()}`

    if (index == 0) {
      if (item.lastDayEndTime) {
        item.startTime = item.lastDayEndTime;
      } else {
        item.startTime = `${item.date} 00:00`
      }
    } else {
      const lastRecord = list[index - 1];
      item.startTime = lastRecord.modifyTime;
    }
    item.endTime = item.modifyTime;

    // 处理时间
    const duration = new Date(item.endTime) - new Date(item.startTime);
    item.duration = duration / 1000;
    item.durationDesc = formatDuration(item.duration);

    const recordType = item.title.split('：')[0];
    const scheduleType = typeMap[recordType]
    item.recordType = recordType;
    item.scheduleType = scheduleType;
    item.title += ' ' + item.durationDesc

    const hasTimeCorrection = item.title.indexOf('@') !== -1;
    if (hasTimeCorrection) {
      const newEndTime = item.title.split('@')[1];
      item.endTime = `${item.date} ${newEndTime}`
    }

    let total = totalDurationMap[scheduleType] || 0;
    total += item.duration;
    totalDurationMap[scheduleType] = total;
  })

  console.log(totalDurationMap)
  const totalSchedule = getTotalSchedule(totalDurationMap);
  const first = list[0]
  const date = first.date;
  totalSchedule.startTime = `${date} 00:00`
  totalSchedule.endTime = `${date} 23:59`
  list.push(totalSchedule);
  return list;
}

function run(input, parameters) {
	// Your script goes here
	let inputStr = `${input[0]}`;
  inputStr = `[${inputStr.substring(0, inputStr.length - 1)}]`
  let list = JSON.parse(inputStr)
  list = dealRecords(list);

  console.log(list);
  let result = ''
  list.forEach((item) => {
    result += JSON.stringify(item) + '|||'
  })
  return result
}

run(TestData)