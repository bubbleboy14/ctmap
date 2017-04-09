CT.require("CT.all");
CT.require("core");
CT.require("map.live.core");
CT.setVal("mapkey", CT.data.choice(core.config.ctmap.geokeys));
CT.require("CT.map", true);
CT.require("map.live.Map");
CT.require("map.live.Controller");

CT.onload(function() {
	new map.live.Controller();
});