/*
* File: index.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Gianluca Travasci
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict';

var App = App || {};

App.Index = Backbone.View.extend({

  el: '.container',

  template: _.template($('script[name="home"]').html()),

  events: {
      'click .NuovoB':     'nuovo',
      'click .CaricaB':    'carica',
      'click .Annulla':    'annulla',
      'click .CreaP':      'crea',
      'click .CaricaP':    'importa'
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

/* button */
  nuovo: function() {
    $('#newDialog').removeClass( "modalNone" ).addClass( "modalView" );
  },

  carica: function() {
    $('#loadDialog').removeClass( "modalNone" ).addClass( "modalView" );
  },

/* submit */
  annulla: function() {
    $('#newDialog').removeClass( "modalView" ).addClass( "modalNone" );
    $('#loadDialog').removeClass( "modalView" ).addClass( "modalNone" );
  },

  crea: function() {
    let name = $('.uname').val();
    if(name.length > 2 && name.length<16) {
      Backbone.history.navigate('editor/' + name, {trigger: true});
    }
  },

  importa: function() {
    var view = this;
    let input = document.getElementById("loadP");
    if(input.files && input.files[0]) {
      let file = input.files[0];

      let name = file.name;
      console.log("Importazione " + name + "!");
      name = name.replace('.json', '');
      name = name.replace('.zip', '');

      let r = new FileReader();
      r.onload = function(event){
          var lines = event.target.result.split('\n');
          var dati = JSON.parse(lines[2]);
          var ent=JSON.parse(lines[1]);
          view.trigger('saveP', name, dati, ent);
      };
      r.readAsText(file);
      Backbone.history.navigate('editor/' + name, {trigger: true});
    }
  }

});
