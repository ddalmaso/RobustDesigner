/*
* File: navDrop.js
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

App.navDrop = App.Editor.extend({

  dropGraph: '',
  dropPaper: '',

  el: '.divDrop',

  template: _.template($('script[name="navDrop"]').html()),

  events: {
      'click .addAttribute':     'addAttribute',
      'click .Chiudi':           'chiudi',
      'click .saveAttr':         'saveAttr',
  },

  initialize: function() {
    this.render();
    this.buildGraph();
    this.selected = null;
  },

  render: function() {
      this.$el.html(this.template());
      return this.$el;
  },

  getGraph: function() {
    return this.dropGraph;
  },

  buildGraph: function() {
    var view = this;

    this.dropGraph = new joint.dia.Graph;
    this.dropPaper = new joint.dia.Paper({
      el: $('#paper'),
      model: this.dropGraph,
      width: 1024,
      height: 550,
      snapLinks: true,
      linkPinning: false,
      drawGrid: true,
      gridSize: 10,
      backgroundColor: 'white',
      interactive: true,
      defaultLink: this.styleLink(),
      linkConnectionPoint: joint.util.shapePerimeterConnectionPoint,
      highlighting: {
        connecting: {
          name: 'stroke',
          options: {
            padding: 17,
            attrs: {
                'stroke-width': 2,
                stroke: 'green'
            }
          }
        }
      },
      validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
        if (magnetS && magnetS.getAttribute('type') === 'input')
              return false;
          // Prevent linking from output ports to input ports within one element.
          if (cellViewS === cellViewT)
              return false;

          const typeS = cellViewS.model.attr('label/text');
          const typeT = cellViewT.model.attr('label/text');
          if((typeS == 'Actor' && typeT == 'Boundary') || // Attore -> Interfaccia
              (typeS == 'Boundary' && typeT == 'Control') || // Interfaccia -> Control
                (typeS == 'Control' && typeT == 'Control') || // Control -> Control
                  (typeS == 'Control' && typeT == 'Entity') || // Control -> Entity
                    (typeS == 'Entity' && typeT == 'Control')) // Entità -> Control
                      return (magnetS !== magnetT);
          else // altrimenti connessione non valida
            return false;
      },
    });

    // Selezione elementi grafico //
    var previousCellView = null;
    var select = null;

    this.dropPaper.on('cell:pointerdown', function(cellView) {
      select = cellView.model;
      $('#delete').prop('disabled', false);
      $('#modifica').prop('disabled', false);
      $('#textA').prop('disabled', false);
    });
    this.dropPaper.on('element:pointerdown', function(cellView, evt, x, y) {
        select = cellView.model;
        cellView.highlight();
        if(cellView != previousCellView && previousCellView != null){
            previousCellView.unhighlight();}
        previousCellView = cellView;

        $('#delete').prop('disabled', false);
        $('#modifica').prop('disabled', false);
        $('#textA').prop('disabled', false);
      }
    );
    this.dropPaper.on('blank:pointerdown', function(evt, x, y) {
        select = null;
        $('#delete').prop('disabled', true);
        $('#modifica').prop('disabled', true);
        $('#textA').prop('disabled', true);
        $('#textA').val("");
          if(previousCellView != null){
              previousCellView.unhighlight();
          }
      }
    );
    this.dropPaper.on('element:pointerdblclick', function(elementView, evt, x, y) {
        const typeE = elementView.model.attr('label/text');
        if(typeE == 'Entity'){
          let entityName = elementView.model.attr('text/text');
          $('.nomeEnt').text(entityName);
          view.trigger('loadAttribute', entityName);
          $('#entityDialog').removeClass( "modalNone" ).addClass( "modalView" );
        }
    });

    $('#delete').on('click', function() {
      if (select){
        const type = select.attr('label/text');
        if(type == 'Entity'){
          const name = select.attr('text/text');
          view.trigger('deleteE', name);
        }
        select.remove();
      }
    });

    $('#modifica').on('click', function() {
      if (select) {
        let newN = $('#textA').val();
        if(newN.length > 0){

          if(select.isLink()) {
            select.removeLabel(-1);
            select.appendLabel({
              attrs: {text: {text: newN}},
              position: {distance: 0.50}
            });
          }
          else {
              const type = select.attr('label/text');
              if(type == 'Entity'){
                view.trigger('changeName', select, newN);
              }else{
                select.attr('text/text', newN);
              }
          }
        }
        $('#textA').val("");
      }
    });

  },

  caricaAttributi: function(attr) {
    if(attr)
    { // Render model just-in-time
      attr.forEach( (item) => {
        $("#entityList").append(this.attribute);

        $('#entityList li:last .scope').val(item.getScope());
        $('#entityList li:last .arr').val(item.getArray());
        $('#entityList li:last .type').val(item.getType());
        $("#entityList li:last .nomeE").val(item.getName());
        $('#entityList li:last .pk').val(item.getPK());
      });
    }
  },

  saveAttr: function() {
    var view = this;
    var entityName = $('.nomeEnt').text();
    var AttrNames = [];

    for (let i = 0; i < $('#entityList li' ).length; ++i) {
      var nome = $( ".nomeE:eq(" + i + ")" ).val();
      if(nome.length>0)
      {
        if( $.inArray(nome, AttrNames) === -1 ) // JQuery ritorna -1 se non trova 'nome' in 'AttrNames'
        {
          AttrNames.push(nome);
          // SCOPE //
           let scope = $( ".scope:eq(" + i + ") option:selected" ).text();
          // ARRAY //
           let array = $( ".arr:eq(" + i + ") option:selected" ).text();
          // TYPE //
           let type = $( ".type:eq(" + i + ") option:selected" ).text();
          // PK //
           let pk = $( ".pk:eq(" + i + ") option:selected" ).text();

          let value = [scope, array, type, nome, pk];
          view.trigger('addAttribute', entityName, value);
        }
        else {
          alert("Questa entità contiene più volte l'attributo: '" + nome + "'\n"+
          "È stata salvata solo la prima occorrenza!");
        }
      }
    }
    // AttrNames contiene i nomi degli attributi salvati; quelli cancellati vanno eliminati dalla collections
      view.trigger('removedAttr', entityName, AttrNames);

    $('#entityDialog li').remove();
    $('#entityDialog').removeClass( "modalView" ).addClass( "modalNone" );
  },

  chiudi: function() {
    $('#entityDialog li').remove();
    $('#entityDialog').removeClass( "modalView" ).addClass( "modalNone" );
  },

  addAttribute: function() {
    if( $('#entityList li' ).length === 15 ){
      alert("Non è possibile aggiungere più di 15 attributi!\n")
    }else{
      $("#entityList").append(this.attribute);
    }
  },

  attribute: function() {
    var item = '<li class="w3-bar itemAttr">'+
                  '<span onclick="this.parentElement.remove()" class="w3-bar-item w3-button w3-white w3-xlarge w3-right">×</span>'+
                  '<div class="w3-bar-item">'+
                    '<span class="w3-large">Scope: </span>'+
                    '<select class="scope">'+
                      '<option value="private">private</option>'+
                      '<option value="protected">protected</option>'+
                      '<option value="public">public</option>'+
                    '</select>'+
                  '</div>'+
                  '<div class="w3-bar-item">'+
                    '<span class="w3-large">Array: </span>'+
                      '<select class="arr">'+
                        '<option value="false">false</option>'+
                        '<option value="true">true</option>'+
                      '</select>'+
                  '</div>'+
                  '<div class="w3-bar-item">'+
                    '<span class="w3-large">Type: </span>'+
                      '<select class="type">'+
                        '<option value="String">String</option>'+
                        '<option value="Integer">Integer</option>'+
                        '<option value="Double">Double</option>'+
                        '<option value="Data">Data</option>'+
                        '<option value="Boolean">Boolean</option>'+
                      '</select>'+
                    '</div>'+
                    '<div class="w3-bar-item">'+
                      '<span class="w3-large">Nome: </span>'+
                        '<input type="text" class="nomeE" placeholder="my_var" maxlength="15" required>'+
                    '</div>'+
                    '<div class="w3-bar-item">'+
                      '<span class="w3-large">Primary key: </span>'+
                        '<select class="pk">'+
                          '<option value="false">false</option>'+
                          '<option value="true">true</option>'+
                        '</select>'+
                    '</div>'+
                  '</li>';

      return item;
  },

  styleLink: function() {
    var link = new joint.dia.Link({
      attrs: {
          '.connection': { stroke: 'black', strokeWidth: '1' },
          '.marker-target': {
              stroke: 'black',
              strokeWidth: 1,
              fill: 'black',
              d: 'M 10 0 L 0 5 M 0 5 L 10 10 z'
          }
      },
    });
    return link;
  },

});
