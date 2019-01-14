/*
* File: field.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Marco Masiero
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict'

var App = App || {};

App.Field = Backbone.Model.extend({

  defaults: {
    scope: '',
    array: '',
    type: '',
    name: '',
    // value
    primaryKey: '',
  },

  setScope: function (scope) {
    this.set({scope: scope});
  },

  getScope: function() {
    return this.get('scope');
  },

  setArray: function (array) {
    this.set({array: array});
  },

  getArray: function() {
    return this.get('array');
  },

  setType: function (type) {
    this.set({type: type});
  },

  getType: function() {
    return this.get('type');
  },

  setName: function (name) {
    this.set({name: name});
  },

  getName: function() {
    return this.get('name');
  },

  setPK: function (check) {
    this.set({primaryKey: check});
  },

  getPK: function() {
    return this.get('primaryKey');
  },

  getJSON: function() {
    let json = JSON.stringify(this.toJSON());
    return json;
  },

});
