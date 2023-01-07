const moment = require('moment')

const calcAndFormatTimeDiff = (date1, date2) => {
  const startTime = moment(date1)
  const endTime = moment(date2)
  const secondsDiff = endTime.diff(startTime, 'seconds')
  const minuteDiff = endTime.diff(startTime, 'minutes')
  const hourDiff = endTime.diff(startTime, 'hours')
  const durationMinutesRemain = minuteDiff % 60;
  return {
    duration: secondsDiff,
    durationDesc: `${hourDiff > 0 ? hourDiff + '小时' : ''}${durationMinutesRemain}分钟`,
  }
}

const formatDuration = (duration) => {
  const durationMinutes = Math.round(duration / 60);
  const durationHours = Math.round(durationMinutes / 60);
  const durationMinutesRemain = durationMinutes % 60;
  return `${durationHours > 0 ? durationHours + '小时' : ''}${durationMinutesRemain}分钟`;
}

const formatZero = (value) => {
  const temp = Number(value)
  return isNaN(temp) ? 0 : temp;
}

module.exports = {
  calcAndFormatTimeDiff,
  formatDuration,
  formatZero,
}