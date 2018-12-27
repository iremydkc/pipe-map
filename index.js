import 'ol/ol.css';
import {easeIn, easeOut} from 'ol/easing.js';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import BingMaps from 'ol/source/BingMaps.js';
	
var points = {
    "sincan": fromLonLat([32.586287, 39.948533]),
    "eryaman": fromLonLat([32.637287, 39.978533])
}
	  
	  var styles = [
        'RoadOnDemand',
        'AerialWithLabels',
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

      var view = new View({
        center: fromLonLat([32.586287, 39.948533]),
        zoom: 15
      });

      var map = new Map({
        target: 'map',
        layers:layersgroup,
        loadTilesWhileAnimating: true,
		loadTilesWhileInteracting: true,
        view: view
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
	  


     /* onClick('rotate-around-rome', function() {
        // Rotation animation takes the shortest arc, so animate in two parts
        var rotation = view.getRotation();
        view.animate({
          rotation: rotation + Math.PI,
          anchor: rome,
          easing: easeIn
        }, {
          rotation: rotation + 2 * Math.PI,
          anchor: rome,
          easing: easeOut
        });
      });*/

      /*onClick('pan-to-london', function() {
        view.animate({
          center: london,
          duration: 2000
        });
      });*/

     /* onClick('elastic-to-moscow', function() {
        view.animate({
          center: moscow,
          duration: 2000,
          easing: elastic
        });
      });*/

    /*  onClick('bounce-to-istanbul', function() {
        view.animate({
          center: istanbul,
          duration: 2000,
          easing: bounce
        });
      });*/

    /*  onClick('spin-to-rome', function() {
        // Rotation animation takes the shortest arc, so animate in two parts
        var center = view.getCenter();
        view.animate({
          center: [
            center[0] + (rome[0] - center[0]) / 2,
            center[1] + (rome[1] - center[1]) / 2
          ],
          rotation: Math.PI,
          easing: easeIn
        }, {
          center: rome,
          rotation: 2 * Math.PI,
          easing: easeOut
        });
      });*/

      function flyTo(location, done) {
        var duration = 2000;
        var zoom = view.getZoom();
        var parts = 2;
        var called = false;
        function callback(complete) {
          --parts;
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
          zoom: zoom - 3,
          duration: duration / 2
        }, {
          zoom: zoom ,
          duration: duration / 2
        }, callback);
      }
	  
	  //dropdown list event
	  var city=document.getElementById('city-select');
	  
	 /* function cityChange() {
		  var cityname=city.value;
		  if(cityname=="eryaman"){
			  alert(cityname);
				onClick('fly-to-eryaman',function() {
					flyTo(eryaman,function(){});
				});
		  }
		  else if(cityname=="sincan") {
			  alert(cityname);
				onClick('sincan',function() {
					flyTo(sincan,function(){});
				});
		  }
	  }*/
	  
	  city.addEventListener('change',function(event){
		  console.log(event.target.value);
	  });
	 
	  
	  onClick('fly-to-eryaman',function() {
		  flyTo(points[event.target.value],window.alert("eryaman"));
	  });

	  onClick('fly-to-sincan',function() {
		  flyTo(points[event.target.value],window.alert ("sincan"));
	  });

      function tour() {
	  var locations = [points[0], points[1]];
        var index = -1;
        function next(more) {
          if (more) {
            ++index;
            if (index < locations.length) {
              var delay = index === 0 ? 0 : 750;
              setTimeout(function() {
                flyTo(locations[index], next);
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