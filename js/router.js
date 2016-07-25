/* global define, console */
/* jslint nomen: true */
define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'views/mainview/mainview',
  'views/menu/menu'
], function ($, _, Backbone, Router, MainView, Menu) {
  'use strict'

  var init

  Router = Backbone.Router.extend({
    routes: {
      '': function () {
        var mainView

        mainView = new MainView()
        this.show(mainView)
      }
      /* '(:dashboard)(/:minDate)(/:maxDate)': function (dashboard, minDate, maxDate) {
        var dashboardView = new DashboardView({
          minDate: minDate,
          maxDate: maxDate
        })
        this.show(dashboardView, 'PDF Review', 'Dashboard')
      } */
    },
    show: function (view) {
      var mainEl = $('#main')
      var menuEl = $('#menu')

      if (this.menu) {
        this.menu.remove()
        this.menu.unbind()
      }
      this.menu = new Menu()
      menuEl.html(this.menu.render().el)

      mainEl.html(view.render().el)
    }
  })

  init = function () {
    var router = new Router()
    Backbone.history.start()
  }

  return {
    init: init
  }
})
