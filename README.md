# rJS

rJS (rasen46's JavaScript Library) is a repo with JS scripts designed for Code.org projects based in **App Lab**

## It Currently Features
- external loading of functions/scripts from GitHub via `startWebRequest`
- better console.log outputs (`[00:00:000] [script.js/INFO]: example`)
- Code.org App Lab compatibility
- relatively optimized code? 

## Getting Started
- Import the library `1d793fbc-0484-4b05-84fa-3031e34ae54f` or copy and paste `main.js` into your project
- Then you're done :scream:

## Loading Modules
- Find the repository you need
- Format the URL of the repository (should be like `api.github.com/repos/<name>/<repoName>/contents/<path>`)
- Use `RJSL.loadModule(<url>)` to load the script into your project
- Call the module via `RJSL.require(<fileName>, function(<var>){}, <maxAttempts>)`

Examples of using require and loadModule:
```
// using module functions

RJSL.loadModule("https://api.github.com/repos/rasen46/rJS/contents/modules/example.js");
RJSL.require("example.js", function(module){
  if(!module)return; 
  module.example();
  },5
);
```
```
// caching required modules in vars

var exampleMod;

RJSL.loadModule("https://api.github.com/repos/rasen46/rJS/contents/modules/example.js");
RJSL.require("example.js", function(module){
  if(!module)return; 
  exampleMod = module;
  },5
);

onEvent("testButton", "click", function(){
  exampleMod.example();
});
```

Examples of requiring modules without safety checks (slightly faster, unreliable, does not work with library import):
```
// unreliable module requiring without library importing

loadModule("https://api.github.com/repos/rasen46/rJS/contents/modules/example.js");
var exampleMod = rjs.modules["example.js"];
```

## Creating your own loadable modules
- Create a GitHub Repository
- Create a file with the file extension `.js`
- Then format the code
  
The module should be formatted like this:
```
(function () {
  var module = {
    print("Hello World!");
    example: function () {
      // code
    },
    example2: function () {
      module.example();
      //code
    },
  };
  return module;
})({});
```
- Then commit changes
