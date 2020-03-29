map.widget = {
	_: {
		markers: {},
		receive: function(event) {
			var d = event.data, _ = map.widget._;
			_.targetOrigin = event.origin;
			if (d.action == "init")
				map.widget.build(d.data);
		},
		notify: function(data) {
			window.parent.postMessage(data, map.widget._.targetOrigin);
		},
		clicker: function(marker) {
			var _ = map.widget._;
			return function() {
				_.notify({
					action: "click",
					data: marker.key
				});
			};
		}
	},
	build: function(opts) {
		var _ = map.widget._;
		_.opts = opts;
		opts.markers.forEach(function(marker) {
			if (!marker.position && marker.latitude) {
				marker.position = {
					lat: marker.latitude,
					lng: marker.longitude
				};
			}
			marker.listeners = {
				click: _.clicker(marker)
			};
			_.markers[marker.key] = marker;
		});
		opts.map = new CT.map.Map({
			node: CT.dom.id("map"),
			markers: _.markers,
			autoFrame: true
		});
	},
	init: function() {
		window.addEventListener("message", map.widget._.receive);
	}
};