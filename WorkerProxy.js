(function() {
  if (typeof self.document !== 'undefined') {
    // regular Javascript code
    var meta = arguments.callee;                                                  // keep a reference to the anonymous outer function
    window['WorkerProxy'] = function(jsFile, callback) {
      var proxy = this;
      if (!jsFile)                                                                // if we don't have a jsFile...
        jsFile = URL.createObjectURL(new Blob(['('+meta.toString()+')()']));      // ...create an empty one, injecting the serialized anonymous outer function!

      var remoteCall = (function() {
        var cb = Object.create(null), cb_idx = 0;                                 // create the registry (cb) and Deferred ID (cb_idx)
        var worker = new Worker(jsFile);                                          // load the supplied javascript file in the worker
        worker.addEventListener('message', function(e) {                          // message handler (reply from worker)
          var deferred = cb[e.data.cb];
          delete cb[e.data.cb];                                                   // delete the Deferred from the registry
          if ('res' in e.data) {
            deferred.resolveWith(this, [e.data.res]);                             // if res is in e.data, the function in the worker returned correctly
          } else {
            deferred.rejectWith(this, [e.data.ex]);                               // if ex is in e.data, the function in the worker has thrown an exception
          }
        }, false);
        
        return function(funcName, args) {                                         // remoteCall function definition
          var def = $.Deferred();                                                 // create a Deferred object
          cb[cb_idx] = def;                                                       // add the Deferred to the registry
          worker.postMessage({ func:funcName, args:args, cb:cb_idx });            // send RPC to worker
          cb_idx++;                                                               // increment the Deferred ID in the registry
          return def.promise();                                                   // return the stripped-down Deferred as promise, so that the caller can chain the callbacks
        };
      })();
      
      remoteCall().done(function (workerFuncs) {                                  // the empty remoteCall triggers the enumeration of top-level functions in the worker:
        workerFuncs.forEach(function(funcName) {                                  // for each top-level function in the worker...
          proxy[funcName] = function() {                                          // ...add a function funcName on the current ("this") WorkerProxy object...
            var args = arguments.length === 1 ? 
              [arguments[0]] : 
              Array.apply(null, arguments);
            return remoteCall(funcName, args);                                    // ...that simply forwards its arguments to a RPC call to the worker!
          };
        }, this);
        if (callback instanceof Function)
          callback.call(proxy);
      });
    }
  } else {
    // Web Worker code
    self.addEventListener('message', function(e) {
      try {
        if (!e.data.func) {                                                       // empty remoteCall: enumerate and return the names of the top-level functions in the worker
          //throw JSON.stringify(exports);
          var res = ['eval'], 
              target = self.exports ? self.exports : self;                        // if the worker has defined self.exports use it, otherwise enumerate the top-level functions
          for (var f in self) 
            if (self.hasOwnProperty(f) && self[f] instanceof Function) 
              res.push(f);
        } else if (e.data.func === 'eval') {
          var res = eval.apply(self, e.data.args);
        } else {
          var res = self[e.data.func].apply(self, e.data.args);                   // named remoteCall: call the function named e.data.func
        }
        self.postMessage({cb:e.data.cb, res:res});                                // all is fine: return the result
      } catch (ex) {
        self.postMessage({cb:e.data.cb, ex:ex});                                  // all is lost: return the exception...
        throw ex;                                                                 // ...and retrhow!
      }
    }, false); 
  }
})();
