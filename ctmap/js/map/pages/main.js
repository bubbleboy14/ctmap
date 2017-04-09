CT.require("CT.all");
CT.require("CT.map");
CT.require("core");
CT.require("map.core");
CT.map.util.setGeoKeys(core.config.ctmap.geokeys);
CT.net.setCache(true);
CT.net.setSpinner(true);
CT.map.useSingleInfoWindow();

CT.onload(function() {
	CT.log.startTimer("load");
	map.core.controller.init();
	CT.dom.id("clearcache").onclick = CT.storage.clear;
	CT.dom.id("clearmap").onclick = map.core.controller.map.clearMarkers;
});