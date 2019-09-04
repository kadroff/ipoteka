Map = {
	maps:[],
	points:[],
	init: function(node,id,pos) {
		var initApi = function() {
			var cont = $(node)[0];
			if (typeof cont == 'undefined') return;
			if (cont.getBoundingClientRect().top-screen.height>0) return; 
			if (!!window.ymaps) return; 
			if (!!window.yaApi && window.yaApi.parentNode!=null) return;
			
			window.yaApi = document.createElement('script');	
			window.yaApi.src = 'http://api-maps.yandex.ru/2.0/?load=package.full&mode=release&lang=ru';
			(document.head || document.documentElement).appendChild(window.yaApi);
			var loadMap = function () {
				if (window.yaApi.parentNode!=null) window.yaApi.parentNode.removeChild(window.yaApi);
				var initMap = function() {
					if (!window.ymaps) return;
					ymaps.geocode(pos,{result:1}).then(
						function(res) {
							var coord = res.geoObjects.get(0).geometry.getCoordinates();
							var map = new ymaps.Map(cont, {
								center: coord,
								zoom: 17,
								type: 'yandex#map'
							});
							map.behaviors.enable("dblClickZoom");
							map.behaviors.enable("drag");
							map.controls.add("smallZoomControl");
							map.controls.add("typeSelector",{left:5,top:5});
							Map.loadPoints(map);
							Map.maps[id] = map;
						}
					);
				}
				var wait = function() {
					if (typeof ymaps!=='undefined') ymaps.ready(initMap);
					else setTimeout(wait,100);
				}();
			}
			if (window.yaApi.parentNode!=null) window.yaApi.onload = loadMap;
			else loadMap();
		}
		initApi();
		$(window).scroll(initApi);
	},
	setPos:function(map,pos) {
		ymaps.geocode(pos,{result:1}).then(
			function(res) {
				var coord = res.geoObjects.get(0).geometry.getCoordinates();
				map.panTo(coord,{flying:true});
			}
		);
	},
	loadPoints: function(map) {
		for(var i=0;i<Map.points.length;i++) {
			var point = Map.points[i];
			(function(map,pos) {
				ymaps.geocode(pos,{result:1}).then(
					function(res) {
						var coord = res.geoObjects.get(0).geometry.getCoordinates();
						var pm = new ymaps.Placemark(
							coord,
							{
								hintContent:pos
							},
							{
								iconImageHref:'/img/point.png',
								iconImageOffset:[-26,-75],
								iconImageSize:[53,77]
							}
						);
						map.geoObjects.add(pm);
					}
				);
			})(map,point)
		}
	}
};