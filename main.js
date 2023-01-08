const modules = require('./src/modules');

const dict = $context.query;

const {
  cmd,
  data,
  params,
} = dict;

const test = require('./src/modules/TestJSBox')

if (!cmd) {
  $intents.finish('请选择一个操作')
  return;
}

const func = modules[cmd];

let result
if (func) {
  result = func(data, params);
} else {
  result = `未找到相应的指令，输入的指令为【${cmd}】`
}
$intents.finish(result);
