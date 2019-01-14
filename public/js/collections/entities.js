/*
* File: entities.js
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

App.Entities = Backbone.Collection.extend({

    model: App.Entity

});
