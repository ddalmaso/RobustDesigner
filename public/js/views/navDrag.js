/*
* File: navDrag.js
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

var App = App || {};

App.navDrag = App.Editor.extend({

  dragGraph: '',
  dragPaper: '',

  el: '.divDrag',

  template: _.template($('script[name="navDrag"]').html()),

  initialize: function() {
    this.render();
    this.buildGraph();
  },

  render: function() {
      this.$el.html(this.template());
      return this.$el;
  },

  buildGraph: function() {
    this.dragGraph = new joint.dia.Graph;
    this.dragPaper = new joint.dia.Paper({
        el: $('#drag'),
        drawGrid: true,
        gridSize: 10,
        width: 100,
        height: 550,
        model: this.dragGraph,
        interactive: false,
        background: {
            color: '#ecf8ec',
            opacity: 0.3
        },
    });

    // Inserisco gli elementi del Robustness Diagramm //
    this.buildElement();

    // Aggiungo il drag & drop //
    var view = this;
    this.dragPaper.on('cell:pointerdown', function(cellView, e, x, y) {
      $('body').append('<div id="flyPaper" style="position:relative;opacity:0.4;pointer-event:none;"></div>');
      var flyGraph = new joint.dia.Graph,
          flyPaper = new joint.dia.Paper({
              el: $('#flyPaper'),
              model: flyGraph,
              height: 100,
              width:110,
              interactive: false
          }),
          flyShape = cellView.model.clone(),
          pos = cellView.model.position(),
          offset = {
              x: x - pos.x,
              y: y - pos.y
          };
      flyShape.position(15, 10);
      flyShape.prop = 1;
      flyGraph.addCell(flyShape);
      $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
      });
      $('body').on('mousemove.fly', function(e) {
          $("#flyPaper").offset({
              left: e.pageX - offset.x,
              top: e.pageY - offset.y
          });
      });
      $('body').on('mouseup.fly', function(e) {
        var x = e.pageX,
            y = e.pageY,
            target = $('#paper').offset();
        // Dropped over paper ?
        if (x > target.left && x < target.left + $('#paper').width() && y > target.top && y < target.top + $('#paper').height()) {
            var el = flyShape.clone();
            el.position(x - target.left - offset.x, y - target.top - offset.y);
            view.trigger('drawElement', el);
        }
       $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
      });
    });
  },

  buildElement: function() {
  // TEMPLATE elementi del Robustness Diagramm //
    joint.shapes.devs.CircleModel = joint.shapes.devs.Model.extend({
      markup: '<g class="rotatable"><g class="scalable"><circle class="body"/></g><image> </image><text class="label"/></g>',
      defaults: joint.util.deepSupplement({
          type: 'devs.CircleModel',
          inPorts: [''],
          outPorts: [''],
          attrs: {
              '.body': {r: 50, cx: 50, stroke: 'none', fill: 'transparent'},
              '.label': { text: '', fontSize: 11, fontWeight: 'normal', 'ref-x': .5, 'ref-y': 20 },
              'image': { 'ref-x': -15, 'ref-y': -15, ref: 'circle', width: 110, height: 110 },
          }
      }, joint.shapes.devs.Model.prototype.defaults)
    });
    joint.shapes.devs.CircleModelView = joint.shapes.devs.ModelView;

  // Costruisco i 4 elementi //
    var cells = [];

  // Actor
    var Actor = new joint.shapes.devs.CircleModel({
      type: 'devs.CircleModel',
      position: {x: 12, y: 70},
      attrs: {
            label: {text:'Actor'}, // identifier (non-modificabile)
            text: {text: 'Actor'}, // name (modificabile)
            image: {
                height: 75,
                'xlink:href': './img/Actor.svg',
            },
            '.body': {stroke: 'none', fill: 'transparent'}
      },
      inPorts: [''],
      ports: {
          groups: {
              'in': {
                  position: {
                    args: {
                        dx: 18,
                        dy: -50
                      }
                  },
                  attrs: {
                      '.port-body': {
                          stroke: 'none',
                          fill: 'transparent',
                          r: 23,
                          cx: 23,
                      }
                  }
              },
          }
      },
    });
    cells[0] = Actor;

  // Boundary
    var Boundary = new joint.shapes.devs.CircleModel({
      type: 'devs.CircleModel',
      position: {x: 7, y: 200},
      attrs: {
            label: {text:'Boundary'},
            text: {text: 'Boundary'},
            image: {
                'xlink:href': './img/Boundary.svg',
                height: 65,
            },
            '.body': {stroke: 'none', fill: 'transparent'}
      },
      inPorts: [''],
      outPorts: [''],
      ports: {
          groups: {
              'in': {
                  position: {
                      args: {
                        dx: 20,
                        dy: -63
                    }
                  },
                  attrs: {
                      '.port-body': {
                          stroke: 'none',
                          fill: 'transparent',
                          r: 33,
                          cx: 25,
                      }
                  }
              },
          }
      },
    });
    cells[1] = Boundary;

  // Control
    var Control = new joint.shapes.devs.CircleModel({
      type: 'devs.CircleModel',
      position: {x: 11, y: 350},
      attrs: {
            label: {text:'Control'},
            text: {text: 'Control'},
            image: {
                'xlink:href': './img/Controller.svg',
                height: 70,
            },
            '.body': {stroke: 'none', fill: 'transparent'}
      },
      inPorts: [''],
      ports: {
          groups: {
              'in': {
                      position: {
                        args: {
                            dx: 11,
                            dy: -57
                      }
                  },
                  attrs: {
                      '.port-body': {
                          stroke: 'none',
                          fill: 'transparent',
                          r: 31,
                          cx: 30,
                      }
                  }
              },
          }
      },
    });
    cells[2] = Control;

  // Entity
    var Entity = new joint.shapes.devs.CircleModel({
      type: 'devs.CircleModel',
      position: {x: 10, y: 500},
      attrs: {
            label: {text:'Entity'},
            text: {text: 'Entity'},
            image: {
                'xlink:href': './img/Entity.svg',
                height: 65,
            },
            '.body': {stroke: 'none', fill: 'transparent'}
      },
      inPorts: [''],
      ports: {
          groups: {
              'in': {
                      position: {
                        args: {
                            dx: 18,
                            dy: -62
                      }
                  },
                  attrs: {
                      '.port-body': {
                          stroke: 'none',
                          fill: 'transparent',
                          r: 32,
                          cx: 23,
                      }
                  }
              },
          }
      },
    });
    cells[3] = Entity;

  // Aggiungo gli elementi alla draggable Area //
    this.dragGraph.addCells(cells);
  },

});
