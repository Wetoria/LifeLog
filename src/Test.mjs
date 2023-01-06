import fs from 'fs'
import chalk from 'chalk';

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

formatOneRecordStr(recordStr).map(i => JSON.stringify(i)).join('\n')

const basePath = '../data';
const paths = fs.readdirSync(basePath);

console.log(chalk.red('Path is '), paths);

const strRecords = [];
paths.forEach((path) => {
  const fileContent = fs.readFileSync(`${basePath}/${path}`, {encoding:'utf8', flag:'r'})
  try {
    strRecords.push(fileContent)
  } catch(e) {
    console.log('Parse Error: ', e)
  }
})

console.log(strRecords);

strRecords.forEach((item) => {
  let record = formatOneRecordStr(item);
  console.log(record);
})
// console.log(formatOneRecordStr(TestData));