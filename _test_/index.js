const { handleTitle } = require('../src/modules/LifeLog')
const testHandleTitle = () => {
  const list = [
    '固@18:14',
    '固 @18:14',
    '固  @18:14',
    '固：sdfasdf@18:14',
    '固',
    '固 adfasdf'
  ]
  list.forEach((item) => {
    const result = handleTitle(item);
    console.log('result is ', result);
    const [type] = result;
    if (type != '固') {
      console.error('错误：', item, result);
    }
  })
}

testHandleTitle()