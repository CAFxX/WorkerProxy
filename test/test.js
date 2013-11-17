asyncTest("Empty WorkerProxy", 4, function() {
  var wp = new WorkerProxy(null, function() {
    ok( wp === this, "wp passed to callback as this" );
    ok( wp instanceof Object, "wp is an Object" );
    ok( 'eval' in wp, "wp has eval" );
    ok( 'remoteCall' in wp === false, "wp has no remoteCall" );
    start();
  });
});

asyncTest("Remote eval (simple)", 1, function() {
  var wp = new WorkerProxy(null, function() {
    var evalBody = '"4"+"2"';
    wp.eval(evalBody).done(function(res) { 
      equal(res, eval(evalBody), "remote eval success"); 
      start();
    });
  });
});

asyncTest("Remote eval (function)", 1, function() {
  var wp = new WorkerProxy(null, function() {
    var evalBody = '(function () {return 42})()';
    wp.eval(evalBody).done(function(res) { 
      equal(res, eval(evalBody), "remote eval success"); 
      start();
    });
  });
});

asyncTest("Simple RPC (automatic enumeration)", 2, function() {
  var wp = new WorkerProxy('test-worker.js', function() {
    ok( 'foo' in wp, 'foo is present' );
    wp.foo(5).done(function(res) {
      equal(res, 6, "remote call success");
      start();
    });
  });
});

asyncTest("Simple RPC (parallel calls)", 1, function() {
  var wp = new WorkerProxy('test-worker.js', function() {
    var defs = [], success = 0;
    for (var i=0; i<1000; i++) {
      (function(i) {
        var def = wp.foo(i).done(function(res) {
          if (res === i+1) success++;
        });
        defs.push(def);
      })(i);
    }
    $.when.apply(null, defs).then(function() {
      equal(defs.length, success, "parallel remote calls success");
      start();
    })
  });
});

asyncTest("Simple RPC (explicit enumeration)", 3, function() {
  var wp = new WorkerProxy('test-worker-exports.js', function() {
    ok( 'foo' in wp, 'foo is present' );
    ok( 'bar' in wp === false, 'bar is not present' );
    wp.foo(5).done(function(res) {
      equal(res, 6, "remote call success");
      start();
    });
  });
});
