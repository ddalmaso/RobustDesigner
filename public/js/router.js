/*
* File: router.js
* Version: 1.0
* Type: javascript
* Date: 2018-08-16
* Author: Daniele Dal Maso
* E-mail: JurassicSWE@gmail.com
*
* License: GNU General Public License v3.0
*
*/

'use strict';

var App = App || {};

App.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "editor/:name": "editor",
        '*random': 'error404'
    },

    home: function() {

      let index = new App.Index();
      console.log('Home page!');
      this.listenTo(index, 'saveP', this.editor);

    },

    editor: function(name, dati, attr) {

      let editor = new App.Editor(name, dati);
      if(dati){ editor.loadDati(dati, attr);
         }
      else{ console.log('Editor!'); }

    },

    error404: function() {

      $( "div.container" ).html( () => {
        return "<h3>Errore 404</h3><br><p>Questa pagina non esiste!</p>";
      });

    },

});
