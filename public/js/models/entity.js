/*
* File: entity.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Francesco Minna
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict'

var App = App || {};

App.Entity = Backbone.Model.extend({

  defaults: {
    name: '',
  },

  initialize: function() {
    // Collection di campi dati //
    this.set('attr', new App.Fields());
  },

  parse: function(response) {
  /* permette di ottenere il JSON anche della collection attr */
      debugger;
      if (_.has(response, "attr")) {
          let aux = new App.Fields(response.attr);
          this.set('attr', aux);
          delete response.attr;
      }
      return response;
  },

  setName: function (name) {
    this.set({name: name});
  },

  getName: function() {
    return this.get('name');
  },

  getAttribute: function(attributeName) {
    let attr = this.get('attr');
    let aux = attr.findWhere({name: attributeName});
    return aux;
  },

  modifyAttribute: function(fieldName, value) {
    //alert("MODIFICA");
    let attr = this.get('attr');
    let field = attr.findWhere({name:fieldName});
    field.setScope(value[0]);
    field.setArray(value[1]);
    field.setType(value[2]);
    field.setName(value[3]);
    field.setPK(value[4]);
  },

  addAttribute: function(value) {
    let attr = this.get('attr');

    let field = new App.Field();
    field.setScope(value[0]);
    field.setArray(value[1]);
    field.setType(value[2]);
    field.setName(value[3]);
    field.setPK(value[4]);

    attr.add(field);
  },

  deleteAttributes: function() {
    let attr = this.get('attr');
    if(attr) {
        attr.each( (model) => {
          model.destroy();
        });
    }
  },

  removeAttribute: function (attributeName) {
    let attr = this.get('attr');
    let aux = attr.findWhere({name: attributeName});
    attr.remove(aux);
  },

  getAttributes: function () {
    let attr = this.get('attr');
    return attr;
  },

  getJSON: function() {
    var json = JSON.stringify(this);
    console.log(json);
  },

});
