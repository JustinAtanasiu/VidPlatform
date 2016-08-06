/* global define, console */

define([
  'jquery',
  'underscore',
  'backbone',
  'md5',
  'jquery-validator',
  'text!../../../templates/mainview/mainview.html'
], function ($, _, Backbone, md5, jqueryvalidator, mainviewTemplate) {
  'use strict'

  var UserModel = Backbone.Model.extend({
    idAttribute: '_id',

    initialize: function () {
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.crossDomain = {
          crossDomain: true
        }
      })
    },
    urlRoot: 'http://localhost:7211/api/signUp'
  })

  var CheckUserModel = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.crossDomain = {
          crossDomain: true
        }
      })
    },
    urlRoot: 'http://localhost:7211/api/checkUsers'
  })

  var LoginUserModel = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
      $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        options.crossDomain = {
          crossDomain: true
        }
      })
    },
    urlRoot: 'http://localhost:7211/api/authenticate'
  })

  var MainviewView = Backbone.View.extend({
    events: {
      'submit #signUpForm': 'signUp',
      'click #toggleSideNav': 'toggleSideNav',
      'submit #login-nav': 'login'
    },
    login: function (e) {
      e.preventDefault()
      var username = $('#exampleInputEmail2').val()
      var password = md5.hash($('#exampleInputPassword2').val())
      var loginUser = new LoginUserModel({username: username, password: password})
      var promise = loginUser.save()
      $.when(promise).then(function (resp) {
        if (resp.success) {
          e.stopPropagation()
          $('.dropdown').removeClass('open')
        } else {
          var validator2 = $('#login-nav').validate()
          validator2.showErrors({
            'exampleInputPassword2': 'Wrong credentials.'
          })
        }
      })
    },
    render: function () {
      var template = _.template(mainviewTemplate)
      this.$el.html(template({

      }))
      return this
    },
    toggleSideNav: function () {
      var mySidenav = document.getElementById('mySidenav')
      if (document.getElementById('mySidenav').classList.contains('openedSideNav')) {
        document.getElementById('mySidenav').classList.remove('openedSideNav')
        mySidenav.style.width = '0px'
      } else {
        document.getElementById('mySidenav').classList.add('openedSideNav')
        mySidenav.style.width = '250px'
      }
    },
    signUp: function (e) {
      e.preventDefault()
      $("#faSpinnerSignUp").removeClass('faSpinSignUp')
      var username = $('#email').val()     
      if($('#password').val() !== $('#password2').val()){
         var validator = $('#signUpForm').validate()
         validator.showErrors({
            'password2': "Password fields didn't match."
          })
          $("#faSpinnerSignUp").addClass('faSpinSignUp')
          return true
      }
      if($('#password').val().length<6){
        var validator = $('#signUpForm').validate()
          validator.showErrors({
            'password': 'Password must have at least 6 characters.'
          })
          $("#faSpinnerSignUp").addClass('faSpinSignUp')
          return true
      }
      var password = md5.hash($('#password').val())
      var checkUser = new CheckUserModel({username: username})
      var promise = checkUser.save()
      $.when(promise).then(function (resp) {
        if (resp.status === 200) {
          var newUser = new UserModel({ username: username, password: password })
          newUser.save()
          $('#signUpModal').modal('hide')
        } else if (resp.status === 400) {
          var validator = $('#signUpForm').validate()
          validator.showErrors({
            'email': 'User already exists with this email.'
          })
        } else if (resp.status === 404) {
          var validator = $('#signUpForm').validate()
          validator.showErrors({
            'email': 'Invalid email.'
          })
        }
        $("#faSpinnerSignUp").addClass('faSpinSignUp')
      })
    }
  })

  return MainviewView
})

/*
define([
  'jquery',
  'underscore',
  'backbone',
  'ws',
  'text!../../../templates/dashboard/dashboard.html'
], function ($, _, Backbone, ws, dashboardDashboardTemplate) {
  'use strict'

  var DashboardDashboardView = Backbone.View.extend({
    initialize: function (options) {
      this.minDate = options.minDate
      this.maxDate = options.maxDate
    },

    events: {
      'mouseover .dashboard_tbody>tr': 'highlightRow',
      'click .dashboard_tbody>tr': 'pdfselect',
      'click #showpdf': 'libererJal',
      'click #addTable': 'addTable'
    },

    highlightRow: function (event) {
      $('td').removeClass('selected')
      $(event.target).addClass('selected').siblings().addClass('selected')
    },
    pdfselect: function (event) {
      var jalId
      $('td').removeClass('selected')
      $(event.target).addClass('selected').siblings().addClass('selected')
      // var value = find($(event.target).siblings())
      // var value = $(event.target).find('td:first').html()
      // alert(value)
      jalId = $(event.target).parent().attr('id')
      sessionStorage.jalId = jalId

      // alert("You reserved a JAL")
      ws.postReserverJal(jalId, sessionStorage.user, 1)

      Backbone.history.navigate('showpdf/' + jalId, {
        trigger: true
      })
    },
    // When the login is pressed, this function is called
    libererJal: function (event) {
      ws.postLibererJal(sessionStorage.user, function (response) {
        Backbone.history.loadUrl(Backbone.history.fragment)
      }, function (response) {
        console.log('libererJal Error')
      })
    },

    render: function () {
      var template, that, i, inputMin, inputMax, pickerMin, pickerMax

      template = _.template(dashboardDashboardTemplate)
      that = this
      i = 0

      // console.log(this.minDate)
      // console.log(this.maxDate)

      // Populates dashboard's table with the info received from the server
      $('#loader').show()
      ws.getJalListe(this.minDate, this.maxDate, function (response) {
        for (i = 0; i < response.length; i += 1) {
          response[i].DateRelease = ws.formatDotNETDate(response[i].DateRelease)
        }
        that.$el.html(template({
          response: response
        }))

        // Function for picking a minimum display date
        that.$el.find('.datepickermin').pickadate({
          firstDay: 1,
          monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          today: 'aujourd\'hui',
          clear: 'effacer',
          formatSubmit: 'ddmmyyyy',
          min: 0,
          onSet: function (date) {
            var input
            var picker
            var minDate
            var minDateObj = this.get('select')

            if (minDateObj) {
              minDate = new Date(minDateObj.year, minDateObj.month, minDateObj.date)
              minDate.setDate(minDate.getDate() + 1)
              input = $('.datepickermax').pickadate()
              picker = input.pickadate('picker')
              picker.clear()
              picker.set('min', minDate)
            }
          }
        })

        // Function for picking a maximum display date
        that.$el.find('.datepickermax').pickadate({
          firstDay: 1,
          monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          today: 'aujourd\'hui',
          clear: 'effacer',
          formatSubmit: 'ddmmyyyy',

          onClose: function () {
            var minDatePicked, maxDatePicked, input, picker

            // Gets value from .datepickermin input element & formats to 'ddmmyyyy'
            input = $('.datepickermin').pickadate()
            picker = input.pickadate('picker')
            minDatePicked = picker.get('select', 'ddmmyyyy')

            // Gets value from .datepickerax input element & formats to 'ddmmyyyy'
            input = $('.datepickermax').pickadate()
            picker = input.pickadate('picker')
            maxDatePicked = picker.get('select', 'ddmmyyyy')

            // If there is no valid choice, alert the user to choose a date interval
            if (minDatePicked !== '' && maxDatePicked !== '') {
              // Store picked values for persistance through views
              sessionStorage.storeMinDate = minDatePicked
              sessionStorage.storeMaxDate = maxDatePicked

              // Changes url accordingly to the route (trigger: true)
              Backbone.history.navigate('dashboard/' + minDatePicked + '/' + maxDatePicked, {
                trigger: true
              })
            } else {
              alert("S'il vous plaît choisir un intervalle de dates")
            }
          }
        })

        inputMin = $('.datepickermin').pickadate()
        pickerMin = inputMin.pickadate('picker')
        inputMax = $('.datepickermax').pickadate()
        pickerMax = inputMax.pickadate('picker')

        pickerMin.set('select', that.minDate, { format: 'ddmmyyyy' })
        pickerMax.set('select', that.maxDate, { format: 'ddmmyyyy' })
        $('#loader').hide()
      }, function (response) {

      })
      return this
    }
  })
  return DashboardDashboardView
})*/
