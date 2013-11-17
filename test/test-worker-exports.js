importScripts('../WorkerProxy.js');

function bar(x) {
  return x+1;
}

exports = {
  foo: bar
};
