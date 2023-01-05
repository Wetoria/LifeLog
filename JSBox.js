let str = ''

function formatOneRecordStr(str) {
  str = str.replaceAll('\n', '@@@@');
  str = `[${str}]`
  let record
  try {
    record = JSON.parse(str);
  } catch (e) {
    console.error('Parse Errod: ', e);
  }
  return record
}

const list = formatOneRecordStr(str);

const formatDuration = (duration) => {
  const durationMinutes = Math.round(duration / 60);
  const durationHours = Math.round(durationMinutes / 60);
  const durationMinutesRemain = durationMinutes % 60;
  return `${durationHours > 0 ? durationHours + '小时' : ''}${durationMinutesRemain}分钟`;
}

list.sort((a, b) => {
  const aCreateTime = new Date(a.endTime);
  const bCreateTime = new Date(b.endTime);
  return aCreateTime - bCreateTime
})

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

list