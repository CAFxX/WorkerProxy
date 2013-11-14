WorkerProxy
===========

A scaffolding library for dealing with Web Workers

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
