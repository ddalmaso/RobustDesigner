/*
* File: editor.js
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

App.Editor = Backbone.View.extend({

  el: '.container',

  initialize: function(name) {
    this.$el.html('');

    this.$el.append('<div class="divMenu"></div>');
    $(".divMenu").after('<div class="canvas"></div>');
    $(".canvas").append('<div class="divDrag"></div>');
    $(".divDrag").after('<div class="divDrop"></div>');

    this.menu = new App.navMenu(name);
    this.drag = new App.navDrag();
    this.drop = new App.navDrop();

  // Collections //
    this.entities = new App.Entities();
    this.counter = 0; // NON con App.Entities.length

  // DRAG event //
    this.listenTo(this.drag, 'drawElement', this.draw);

  // DROP event //
    this.listenTo(this.drop, 'changeName', this.change);
    this.listenTo(this.drop, 'deleteE', this.eliminaE);
    this.listenTo(this.drop, 'addAttribute', this.addAttribute);
    this.listenTo(this.drop, 'loadAttribute', this.loadAttribute);
    this.listenTo(this.drop, 'removedAttr', this.removedAttr);

  // MENU event //
    this.listenTo(this.menu, 'esportaJSON', this.esportaJSON);
    this.listenTo(this.menu, 'esportaZIP', this.esportaZIP);
    this.listenTo(this.menu, 'deleteAll', this.deleteAll);

    this.render();
  },

  render: function() {
    return this.$el;
  },

  loadDati: function(dati, attr) {
    let graph = this.drop.getGraph();
    graph.fromJSON(dati);

    let elements = graph.getElements();
    elements.forEach( (el) => {

      const nome = el.attr('text/text');
      const type = el.attr('label/text');

      if(type === 'Entity')
      {
        var aux = new App.Entity({name:nome});
        this.entities.add(aux);
        this.counter++;
      }
    });
    attr.forEach( (el) => {
      let entity=this.entities.findWhere({name:el.name});
      let attrs = entity.get('attr');
      el.attr.forEach( (attribute) =>{
        let field=new App.Field();
        field.setScope(attribute.scope);
        field.setArray(attribute.array);
        field.setType(attribute.type);
        field.setName(attribute.name);
        field.setPK(attribute.primaryKey);
        attrs.add(field);
      });
      entity.set('attr', attrs);
    });
  },

  loadAttribute: function(entityName) {
    let el = this.entities.findWhere({name:entityName});
    let attr = el.getAttributes();
    this.drop.caricaAttributi(attr);
  },

// DRAG event //
  draw: function(el) {
    const type = el.attr('label/text');
    if(type === 'Entity') {
        let name = 'Entity_' + this.counter;
        this.counter++;
        el.attr('text/text', name);
        this.entities.add(new App.Entity({name:name}));
    }

    this.drop.getGraph().addCell(el);
  },
/////////////////
// DROP event //
  change: function(select, newN) {
    let old = select.attr('text/text');
    let el = this.entities.findWhere({name:newN});
    if(el){
        alert("ERRORE!\nEsiste già una entità con questo nome");
        select.attr('text/text', old);
    }else{
        let el = this.entities.findWhere({name:old});
        el.setName(newN);
        select.attr('text/text', newN);
    }
  },

  removedAttr: function(entityName, AttrNames) {
    let el = this.entities.findWhere({name:entityName});

    if (!Array.isArray(AttrNames) || ! AttrNames.length) { // elimino tutto
        el.deleteAttributes();
    }
    else {
      let attr = el.getAttributes();
      if(attr)
      {
        attr.forEach( (item) => {
          // Devo eliminare gli attributi il cui nome (univoco) non è in AttrNames, poichè
          // significa che sono stati eliminati dall'utente
            if(item)
            {
              let attr = item.getName();
              if( $.inArray(attr, AttrNames) === -1) { item.destroy(); }
            }
        });
      }
    }
  },

  eliminaE: function(arg) {
    this.entities.findWhere({name:arg}).destroy();
  },

  addAttribute: function(entityName, value) {
    let el = this.entities.findWhere({name:entityName});
    let fieldName = el.getAttribute(value[3]);

    if(fieldName){ // c'è già un attributo con lo stesso nome
      el.modifyAttribute(value[3], value);
    }else{ //nuovo attributo
      el.addAttribute(value);
    }
  },

/////////////////
// MENU event //
  esportaJSON: function(name) {
    let download = document.createElement('a');
    //
    var Graph = this.drop.getGraph();
    let data = name + '\n' + JSON.stringify(this.entities) + '\n' + JSON.stringify(Graph.toJSON());
    download.setAttribute('href', 'data:text/plain;charset=utf-8,' + data);
    let nameProject = name + '.json';
    download.setAttribute('download', nameProject);
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
  },

  esportaZIP: function(name) {
/* Creo un form che, una volta salvati i dati (json, entities),
   come action reinderizza alla pagine /esporta, gestita dalla
   funzione router() del file server PresentationTier/Middleware/index.js
   il quale chiama una funzione che richiama i generatori di codice
   e restituisce lo zip finale. */

  // Form per l'esportazione //
    let form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", '/esporta');
    form.setAttribute("target", '_blank');

  // Collections di entities //
    let entities = JSON.stringify(this.entities);
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = "data";
    input.value = entities;
    form.appendChild(input);

  // Nome progetto //
    let nome = document.createElement('input');
    nome.type = 'hidden';
    nome.name = 'name';
    nome.value = name;
    form.appendChild(nome);

    var Graph = this.drop.getGraph();
  // ZIP //
    /*let data = {
        'name': name,
        'entities': encodeURIComponent(JSON.stringify(this.entities)),
        'graph': encodeURIComponent(JSON.stringify(Graph.toJSON())),
    };*/
    let data = name + '\n' + JSON.stringify(this.entities) + '\n' + JSON.stringify(Graph.toJSON());
    let zip = document.createElement('input');
    zip.type = 'hidden';
    zip.name = 'zip';
    zip.value = data;
    form.appendChild(zip);

// Form submit //
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },

  deleteAll: function() {
    this.counter = 0;
    this.entities.reset();
    this.drop.getGraph().clear();
    $('#delete').prop('disabled', true);
    $('#modifica').prop('disabled', true);
    $('#textA').prop('disabled', true);
    $('#textA').val("");
  },
/////////////////

});
