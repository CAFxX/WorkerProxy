WorkerProxy
===========

A tiny scaffolding library for dealing with Web Workers *in style*, by leveraging jQuery Deferred/promise.

Big Fat Warning™
----------------

**WorkerProxy is not yet production-ready.**

Wait... now that I think about it, *it will probably kill your cat*. You've been warned!

Getting started
---------------
Add WorkerProxy.js (and jQuery) to your HTML

    <script type="text/javascript" src="WorkerProxy.js"></script>

Import WorkerProxy.js at the top of the files you'll be executing as worker code (e.g. foo-worker.js)
 
    importScripts('WorkerProxy.js');

Instantiate a worker for each of the files above

    var foo = new WorkerProxy('foo-worker.js');

foo is now an object with a member function for each function defined in foo-worker.js 
(e.g., if inside foo-worker.js you have two functions named bar() and baz(), you can call them 
by calling foo.bar() and foo.baz()). See the examples for more.

Examples
--------

### Simple RPC (automatic function enumeration)

*foo-worker.js*

    importScripts('WorkerProxy.js');
    
    function foo(x) {
      return x+1;
    }

*Regular Javascript*

    var worker = new WorkerProxy('foo-worker.js');
    
    worker.foo(5).then(function (result) {
      alert(result); // will display '6'
    });
          
### Simple RPC (explicit exports)

*foo-worker.js*

    importScripts('WorkerProxy.js');
    
    function bar(x) {
      return x+1;
    }
    
    exports = {
      foo: bar // export function bar as "foo"
    };

*Regular Javascript*

    var worker = new WorkerProxy('foo-worker.js');
    
    worker.foo(5).then(function (result) {
      alert(result); // will display '6'
    });
          
Planned features
----------------
The following features are not implemented yet, but are on the roadmap.

### Inline functions

Define simple functions inline, have them uneval()ed and injected in a blank worker.

*Regular Javascript*

    var worker = new WorkerProxy({
      foo: function (x) { // this will run in a web worker
        return x+1;
      }
    });
    worker.foo(5).then(function(result) {
      // result is 6
    });
    
### Reverse RPC

Call functions in the main javascript code from worker code

*workerCode.js*

    importScripts('WorkerProxy.js');
    alert(5); // perform a RPC to window.alert
    
*Regular Javascript*

    var worker = new WorkerProxy('workerCode.js', {
      alert: window.alert
    });
    
### RPC eval

Easily eval() code in a web worker 

*Regular Javascript*

    var worker = new WorkerProxy();
    worker(function () { 
        // this will run in a web worker
    });
    worker('/* this will run in a web worker */');
    
### Worker clusters

Add inter-worker communication capabilities as well as shared storage 
to enable multiprocessing/concurrent capabilities to workers (e.g. 
spawn N instances of the same worker and aggregate them in a cluster 
with load balancing and shared storage).

Dependencies
------------
* jQuery >= 1.6 (jQuery is required only in regular Javascript code, not inside the workers)

Unit tests
----------
Unit tests are based on QUnit and can be found in the test/ directory. 
The tests are meant to be run in the browser: 
click [here](https://rawgithub.com/CAFxX/WorkerProxy/master/test/test.htm) 
to open the unit test page for master.

License
-------
[MIT](LICENSE)
