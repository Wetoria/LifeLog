const dict = $context.query;
const noData = JSON.stringify(dict) == '{}';

if (!noData) return;

let inTest = true; // RMB to modify me
if (inTest) return;

// 创建测试日历

// const date = new Date('2023/1/9 06:00')
// let base = 0;
// for (let i = 0; i < 60; i++) {
//   const startTime = new Date(date.getTime() + i * 60 * 1000);
//   const endTime = new Date(date.getTime() + (i + 1) * 60 * 1000);
//   console.log(startTime)
//   console.log(endTime)
//   console.log('---')
//   $calendar.create({
//     title: "Hey!",
//     startDate: new Date(startTime),
//     endDate: new Date(endTime),
//   })
// }

console.log('in test')