/*global requirejs, alert */
requirejs.config({
  waitSeconds: 60,
  shim: {
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: "Backbone"
    },
    underscore: {
      exports: "_"
    },
    bootstrap: {
      deps: [
        "jquery"
      ]
    },
    "responsive-img": {
      deps: [
        "jquery"
      ]
    }
  },
  paths: {
    backbone: "../bower_components/backbone/backbone",
    underscore: "../bower_components/underscore/underscore",
    bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
    jquery: "../bower_components/jquery/dist/jquery",
    propertyParser: "../bower_components/requirejs-plugins/src/propertyParser",
    "Markdown.Converter": "../bower_components/requirejs-plugins/lib/Markdown.Converter",
    text: "../bower_components/requirejs-plugins/lib/text",
    "responsive-img": "../bower_components/responsive-img.js/responsive-img",
    "requirejs-text": "../bower_components/requirejs-text/text"
  },
  packages: [

  ]
});

requirejs(["app"], function (App) {
  "use strict";
    
  App.init();
});

requirejs.onError = function (err) {
  "use strict";
    
  alert(err.message);
};

