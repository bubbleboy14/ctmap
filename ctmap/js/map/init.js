map.init = function() {
	var geokeys = core.config.ctmap.geokeys;
	CT.setVal("mapkey", CT.data.choice(geokeys));
	CT.require("CT.map", true);
	CT.map.util.setGeoKeys(geokeys);
};
map.init();