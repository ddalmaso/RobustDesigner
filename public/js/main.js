/*
* File: main.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Lidia Alecci
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict'

// Namespace //
var App = App || {};

$(document).ready(function(){

  let Application = new App.Router();
  Backbone.history.start({pushState: false});

  function myConfirmation() {
    return 'Le modifiche non salvate andranno perse. Sei sicuro di uscire?';
  }
  window.onbeforeunload = myConfirmation;

});
