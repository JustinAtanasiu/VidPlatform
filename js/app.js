/* global define, console */

define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'bootstrap'
], function ($, _, Backbone, Router) {
  'use strict'

  var init = function () {
    // init router
    Router.init()
  }

  return {
    init: init
  }
})
