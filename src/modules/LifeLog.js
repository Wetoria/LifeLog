const { scheduleTypeMap } = require('./constants');
const { calcAndFormatTimeDiff, formatDuration } = require('../utils/formatter');

const getTotalData = (data = []) => {
  const totalDurationMap = {};
  const secondsOfDay = 24 * 60 * 60;

  data.forEach((item) => {
    let total = totalDurationMap[item.scheduleType] || 0;
    total += item.duration;
    totalDurationMap[item.scheduleType] = total;
  })

  const isGrowth = totalDurationMap['废']
    < (
      totalDurationMap['学习']
      + totalDurationMap['工作']
      + totalDurationMap['事业']
      + totalDurationMap['自律']
    )
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
    totalSchedule.content += `${prefix}${formatedDesc}, 占${proportion}%。\n`
  })
  const first = data[0]
  const date = first.date;
  totalSchedule.startTime = `${date} 00:00`
  totalSchedule.endTime = `${date} 23:59`
  return totalSchedule
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

    const recordType = item.title.split('：')[0];
    const scheduleType = scheduleTypeMap[recordType]
    item.recordType = recordType;
    item.scheduleType = scheduleType;
    item.scheduleTitle = `${item.title} ${item.durationDesc}`
  })

  const totalSchedule = getTotalData(list);
  list.push(totalSchedule);
}

const getData = (data) => {
  const temp = `[${data}]`
  const list = JSON.parse(temp);
  list.sort((a, b) => {
    const aCreateTime = new Date(a.endTime);
    const bCreateTime = new Date(b.endTime);
    return aCreateTime - bCreateTime
  })

  dealRecords(list);
  return list
}

module.exports = {
  getData,
  getTotalData,
}