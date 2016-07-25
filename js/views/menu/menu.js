/* global define, console */

define([
  'jquery',
  'underscore',
  'backbone',
  'text!../../../templates/menu/menu.html'
], function ($, _, Backbone, menuTemplate) {
  'use strict'

  var MenuView = Backbone.View.extend({
    render: function () {
      var template = _.template(menuTemplate)
      this.$el.html(template({

      }))
      return this
    }
  })

  return MenuView
})
