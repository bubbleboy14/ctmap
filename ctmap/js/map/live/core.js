CT.require("map.init");

map.live.core = {
	_: {
		host: location.hostname,
		port: core.config.ctmap.live.port,
		zoom: core.config.ctmap.live.zoom,
		interval: core.config.ctmap.live.interval,
		resolution: core.config.ctmap.live.resolution,
		scoutz: core.config.ctmap.live.scouts,
		obstaclez: core.config.ctmap.live.obstacles,
		objectivez: core.config.ctmap.live.objectives,
		pulse: {
			interval: 1000,
			iterations: 10
		},
		rotation: {
			retry: 5,
			interval: 200,
			duration: 100
		},
		arrow: {
			degs: [
				-45, 0, 45,
				-90, "default", 90,
				-135, 180, 135
			],
			mod: {
				red: null,
				green: null
			}
		}
	},
	diff: function(p1, p2) {
		return p1.coords.latitude != p2.coords.latitude
			|| p1.coords.longitude != p2.coords.longitude;
	},
	bigDiff: function(p1, p2) {
		var c1 = p1.coords,
			c2 = p2.coords,
			r = core.util._.resolution;
		return (Math.floor(c1.latitude * r) / r)
			!= (Math.floor(c2.latitude * r) / r)
			|| (Math.floor(c1.longitude * r) / r)
			!= (Math.floor(c2.longitude * r) / r);
	},
	strip: function(data) {
		return data.coords && {
			lat: data.coords.latitude,
			lng: data.coords.longitude
		} || {
			lat: data.lat(),
			lng: data.lng()
		};
	},
	rotate: function(icon, degz) {
		var count = map.live.core._.rotation.retry;
		var _rot = function() { // node may not yet be present... (improve)
			var n = CT.dom.attr("src", icon.url || icon, true);
			if (n) {
				CT.trans.rotate(n, {
					degrees: degz,
					duration: map.live.core._.rotation.duration 
				});
			} else if (count) {
				count -= 1;
				CT.log("rotate(): failed to find node; retrying; " + count + " retries left");
				setTimeout(_rot, map.live.core._.rotation.interval);
			}
		};
		_rot();
	}
};