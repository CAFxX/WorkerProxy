importScripts('../WorkerProxy.js');

function foo(x) {
  return x+1;
}

function oops(x) {
  throw x;
}
