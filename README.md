WorkerProxy
===========

A scaffolding library for dealing with Web Workers

Big Fat Warning
---------------

**WorkerProxy is not yet production-ready.**
Wait, now that I think about it, *it will probably kill your cat*. 
You've been warned...

Example
-------

**foo-worker.js**

    importScripts('WorkerProxy.js');
    
    function foo(x) {
      return x+1;
    }

**foo.htm**

    <html>
      <head>
        <script type="text/javascript" src="WorkerProxy.js"></script>
        <script type="text/javascript">
        
          var worker = new WorkerProxy('foo-worker.js');
          
          worker.foo(5).then(function (result) {
            alert(result); // will display '6'
          });
          
        </script>
      </head>
      <body>
      </body>
    </html>
