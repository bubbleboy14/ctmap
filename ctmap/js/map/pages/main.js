CT.require("CT.all");
CT.require("core");
CT.require("map.core");

var cfg = core.config.ctmap;
CT.net.setCache(cfg.netcache);
CT.net.setSpinner(true);
CT.map.useSingleInfoWindow();

CT.onload(function() {
	var ctm = CT.dom.id("ctmain");
	if (cfg.header)
		CT.initCore();
	else
		ctm.style.top = CT.dom.id("ctheader").style.height = "0px";
	ctm.style.padding = "10px"; // aligns with map margins

	CT.log.startTimer("load");
	map.core.controller.init();
	CT.dom.id("clearcache").onclick = CT.storage.clear;
	CT.dom.id("clearmap").onclick = map.core.controller.map.clearMarkers;
});