import 'ol/ol.css';
import {easeIn, easeOut} from 'ol/easing.js';
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import BingMaps from 'ol/source/BingMaps.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {Fill, Style, Text} from 'ol/style.js';
import {getCenter} from 'ol/extent.js';
	
var points = {
    "sincan": fromLonLat([32.586287, 39.948533]),
    "eryaman": fromLonLat([32.637287, 39.978533])
}
	  
	  var styles = [
        'RoadOnDemand',
        'AerialWithLabels',
		new Style({
        text: new Text({
          font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
          placement: 'line',
          fill: new Fill({
            color: 'white'
          })
        })
      })
      ];
	  
	  var layersgroup = [];
      var i, ii;
	  
      for (i = 0, ii = styles.length; i < ii; ++i) {
        layersgroup.push(new TileLayer({
          visible: false,
          preload: Infinity,
          source: new BingMaps({
            key: 'Apdf50YSPHwkC6-0XbRdDNtEha4zlSN7QzedsTkjcFLTucYRZoT2kS764fzYrRzF',
            imagerySet: styles[i]
          })
        }));
      }
	var viewExtent = [6672979, 2800990, 633851, 6913616];
	var view = new View({
		extent: viewExtent,
		center:getCenter(viewExtent),
		//center: fromLonLat([32.586287, 39.948533]),
        zoom: 11.2,
    });
	layersgroup.push(new VectorLayer({
        declutter: true,
		source: new VectorSource({
			format: new GeoJSON(),
			url: 'data/geojson/vienna-streets.geojson'
		}),
		style: function(feature) {
			style.getText().setText(feature.get('name'));
        return style;
		}
    })
	);
		
	var map = new Map({
		target: 'map',
        layers:layersgroup,
        loadTilesWhileAnimating: true,
		loadTilesWhileInteracting: true,
        view: view,
		
    });
	  
	var select = document.getElementById('layer-select');
    function onChange() {
		var style = select.value;
        for (var i = 0, ii = layersgroup.length; i < ii; ++i) {
			layersgroup[i].setVisible(styles[i] === style);
        }
    }
    select.addEventListener('change', onChange);
    onChange();
	  
      function bounce(t) {
        var s = 7.5625;
        var p = 2.75;
        var l;
        if (t < (1 / p)) {
          l = s * t * t;
        } else {
          if (t < (2 / p)) {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
          } else {
            if (t < (2.5 / p)) {
              t -= (2.25 / p);
              l = s * t * t + 0.9375;
            } else {
              t -= (2.625 / p);
              l = s * t * t + 0.984375;
            }
          }
        }
        return l;
      }

      function elastic(t) {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
      }

      function onClick(id, callback) {
        document.getElementById(id).addEventListener('click', callback);
      }

      onClick('rotate-left', function() {
        view.animate({
          rotation: view.getRotation() + Math.PI / 2
        });
      });

      onClick('rotate-right', function() {
        view.animate({
          rotation: view.getRotation() - Math.PI / 2
        });
      });
	  



      function flyTo(location, done) {

        var duration = 2000;
        var zoom = view.getZoom();
        var parts = 2;
        var called = false;
        function callback(complete) {
          parts--;
          if (called) {
            return;
          }
          if (parts === 0 || !complete) {
            called = true;
            done(complete);
          }
        }
        view.animate({
          center: location,
          duration: duration
        }, callback);
        view.animate({
          zoom: 10.8,
          duration: duration / 2
        }, {
          zoom: 14.7 ,
          duration: duration / 2
        }, callback);
      }
	  
	  //dropdown list event
	  var city=document.getElementById('city-select');
	  
	  city.addEventListener('change',function(event){
		  flyTo(points[event.target.value], function() { });
	  });
	  
	  onClick('fly-to-eryaman',function() {
		  flyTo(points.eryaman, function() { });
	  });

	  onClick('fly-to-sincan',function() {
		  flyTo(points.sincan, function() { });
	  });

      function tour() {
        var index = -1;
        function next(more) {
          if (more) {
            ++index;
			window.alert(Object.keys(points).length);
            if (index < Object.keys(points).length) {
			  if(index===0)
				  var delay=0;
			  else 
				  var delay=750;
              setTimeout(function() {
                flyTo(Object.keys(points)[index], next);
              }, delay);
            } else {
              alert('Tour complete');
            }
          } else {
            alert('Tour cancelled');
          }
        }
        next(true);
      }

      onClick('tour', tour);