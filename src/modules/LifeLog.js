const { scheduleTypeMap } = require('./constants');
const {
  calcAndFormatTimeDiff,
  formatDuration,
  formatZero,
} = require('../utils/formatter');


const getTotalData = (list = []) => {
  const totalDurationMap = {};
  const secondsOfDay = 24 * 60 * 60;

  list.forEach((item) => {
    let total = totalDurationMap[item.scheduleType] || 0;
    total += item.duration;
    totalDurationMap[item.scheduleType] = total;
  })

  const isGrowth = formatZero(totalDurationMap['废'])
    < (
      formatZero(totalDurationMap['学习'])
      + formatZero(totalDurationMap['工作'])
      + formatZero(totalDurationMap['事业'])
      + formatZero(totalDurationMap['自律'])
    )
  const totalSchedule = {
    title: '统计',
    content: '',
    isAllDay: '是',
    data: totalDurationMap,
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
    totalSchedule.content += `${prefix}${formatedDesc}, 占${proportion}%。\n`
  })
  const first = list[0]
  const date = first.date;
  totalSchedule.startTime = `${date} 00:00`
  totalSchedule.endTime = `${date} 23:59`

  list.push(totalSchedule);
}

const handleTitle = (title) => {
  let result = [];
  
  const containsBlank = /\s*/.test(title)
  const containsColon = /：/.test(title)
  const containsAt = /@/.test(title);

  const replaceAt = (str) => {
    return str.replace(/@.*/, '');
  }
  
  // 获取 recordType
  let temp = title;
  temp = temp.replace(/：.*/, '');
  temp = replaceAt(temp);
  if (containsBlank) {
    temp = temp.trim().split(/\s+/)[0]
  }
  result.push(temp);

  // 获取做了什么事情
  if (containsColon) {
    temp = title;
    temp = replaceAt(temp);
    temp = temp.split('：')[1]
    result.push(temp)
  }

  return result;
}

const dealRecords = (list) => {
  list.forEach((item, index) => {
    if (index == 0) {
      if (item.lastDayEndTime) {
        item.startTime = item.lastDayEndTime;
      } else {
        item.startTime = `${item.date} 00:00`
      }
    } else {
      const lastRecord = list[index - 1];
      item.startTime = lastRecord.endTime;
    }

    // 处理时间
    const {
      duration,
      durationDesc,
    } = calcAndFormatTimeDiff(item.startTime, item.endTime);
    item.duration = duration;
    item.durationDesc = durationDesc;

    const [recordType] = handleTitle(item.title);
    const scheduleType = scheduleTypeMap[recordType]
    item.recordType = recordType;
    item.scheduleType = scheduleType;
    item.scheduleTitle = `${item.title} ${item.durationDesc}`
  })
}


const createReminder = (line) => {
  const [contentWithIcon, time] = line.split('at');
  const contents = contentWithIcon.split(' ');
  contents.shift() // 去掉 ⏰ 图标
  const [title, second, third] = contents;
  const hasUrl = second.startsWith('http')
  $reminder.create({
    title: `${title}${hasUrl ? ` ${second}` : ''}`,
    alarmDate: time ? new Date(time) : null,
    notes: hasUrl ? third : second,
  })
}

const dealEachRecordDetail = (records) => {
  const map = {
    '⏰': createReminder,
  }
  const keys = Object.keys(map);
  records.forEach((record) => {
    const {
      content = '',
    } = record;
    const lines = content.split('\n')
    lines.forEach((line) => {
      const targetKey = keys.find(key => line.startsWith(key))
      if (targetKey) {
        const operator = map[targetKey]
        operator(line);
      }
    })
  })
}

const getData = (list) => {
  list.sort((a, b) => {
    const aCreateTime = new Date(a.endTime);
    const bCreateTime = new Date(b.endTime);
    return aCreateTime - bCreateTime
  })

  dealRecords(list);
  getTotalData(list);
  dealEachRecordDetail(list);

  return list
}

module.exports = {
  getData,
  getTotalData,
  handleTitle,
}