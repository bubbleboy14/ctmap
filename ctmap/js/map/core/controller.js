map.core.controller = {
	options: core.config.ctmap.types,
	show: function(pager) {
		map.core.controller.nodes.shown.appendChild(pager.node);
		map.core.controller.map.addMarkers(pager.mdata);
	},
	hide: function(pager) {
		map.core.controller.nodes.hidden.appendChild(pager.node);
		map.core.controller.map.clearMarkers(pager.markers);
	},
	init: function() {
		map.core.controller.nodes = {
			shown: CT.dom.id("dbpanels"),
			hidden: CT.dom.id("dbmin"),
			button: CT.dom.id("qbutton"),
			header: CT.dom.id("header"),
			map: CT.dom.id("map")
		}
		map.core.controller.map = new CT.map.Map({
			node: map.core.controller.nodes.map,
			center: core.config.ctmap.center
		});
		map.core.query.init();
	}
};
