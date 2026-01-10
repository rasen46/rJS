# rJS

rJS (rasen46's JavaScript Library) is a repo with JS scripts designed for Code.org projects based in **App Lab**

It Currently Features
- 
- external loading of functions/scripts from GitHub via `startWebRequest`
- 1 module
- better console.log outputs (`[00:00:000] [script.js/INFO]: example`)

## Getting Started
- Find the `main.js` file from this repository (`https://github.com/rasen46/rJS/blob/main/main.js`)
- Copy and paste the script within the file to the top of the current project you're working on
- Then you're done :scream:

## Loading Modules
- find the repository you need
- format the url of the repository (should be like `api.github.com/repos/<name>/<repoName>/contents/<path>`)
- use `rjs.loadModule(<url>)` to load the script into your project
- call the module via `rjs.require(<fileName>, function(<var>){}, <maxAttempts>)`

Examples of using require and loadModule:
```
// using module functions

rjs.loadModule("https://api.github.com/repos/rasen46/rJS/contents/modules/example.js");
rjs.require("example.js", function(module){
  if(!module)return; 
  module.example()
  },5
);
```
```
// caching required modules

var exampleMod;

rjs.loadModule("https://api.github.com/repos/rasen46/rJS/contents/modules/example.js");
rjs.require("example.js", function(module){
  if(!module)return; 
  exampleMod = module;
  },5
);

onEvent("testButton", "click", function(){
  exampleMod.example()
});
```

## Creating your own loadable modules
- Create a GitHub Repository
- Create a file with the file extension `.js`
- Then format the code
  
The module should be formatted like this:
```
(function () {
  var module = {
    rjs.print("Hello World!")
    example: function () {
      // code
    },
    example2: function () {
      //code
    },
  };
  return module;
})({});
```
- Then commit changes
