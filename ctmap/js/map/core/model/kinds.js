map.core.model.kinds.Base = CT.Class({
	CLASSNAME: "map.core.model.kinds.Base",
	mapify: function(subdata) {
		var that = this;
		return function(bdata) {
			that.setHeader(subdata, bdata);
			that.pager.setMarkers(bdata.map(that.process));
		};
	},
	header: function(subdata) {
		return subdata.label;
	},
	list: function(dlist) {
		var n = CT.dom.node();
		CT.panel.triggerList(dlist, this.markers, n);
		return n;
	},
	markers: function(subdata) {
		this.mapify(subdata)([subdata]);
		map.core.controller.map.markers[subdata.key].showInfo();
	},
	setHeader: function(subdata, bdata) {
		CT.dom.setContent(map.core.controller.nodes.header,
			CT.dom.node(this.header(subdata, bdata), "div", "biggest bold"));
	},
	iline: function(d) {
		var process = function(p) {
			if ((typeof p == "string") && (p.slice(0, 4) == "http"))
				return CT.parse.process(p);
			return p || "(none)";
		};
		return function(p) {
			return CT.dom.node([
				CT.dom.node(p + ":", "div", "keycell"),
				CT.dom.node(process(d[p]), "span")
			]);
		};
	},
	process: function(d) {
		return {
			key: d.key,
			position: {
				lng: d.longitude,
				lat: d.latitude
			},
			info: this.info(d),
			icon: this.icon(d)
		}
	},
	info: function(d) {
		var iline = this.iline(d);
		return CT.dom.node([
			CT.dom.node(d.label, "div", "big bold"),
			CT.db.eachProp(d.modelName, iline)
		]);
	},
	icon: function(d) {
		return null; // falls back to map default
	},
	init: function(pager) {
		this.pager = pager;
		this.opts = this.pager.opts;
	}
});

map.core.model.kinds.Place = CT.Class({
	CLASSNAME: "map.core.model.kinds.Place",
	process: function(d) {
		return {
			key: d.key,
			address: this.address(d),
			position: {
				lng: d.longitude,
				lat: d.latitude
			},
			info: this.info(d),
			icon: this.icon(d)
		};
	},
	address: function(d) {
		return d.address;
	},
	info: function(d) {
		return d.name || d.title || d.info || d.description || d.blurb || d.address;
	},
	icon: function(d) {
		return "/img/map/office.png";
	}
}, map.core.model.kinds.Base);

map.core.model.kinds.BuildingBase = CT.Class({
	CLASSNAME: "map.core.model.kinds.BuildingBase",
	address: function(d) {
		return d.address + ", " + core.config.ctmap.city;
	},
	info: function(d) {
		return CT.dom.node([
			CT.dom.node(d.address, "div", "big bold"),
			CT.dom.node([
				CT.dom.node("rent_control:", "div", "keycell"),
				CT.dom.node(d.rent_control ? d.rent_control.toString() : "(no value)", "span")
			])
		].concat(["year", "building_type", "building_id"].map(this.iline(d))));
	},
 	_icons: ["ONE FAMILY", "HOUSE", "OFFICE", "BUSINESS", "INDUSTRIAL", "COMMERCIAL", "RESIDENTIAL"],
	icon: function(d) {
		if (d.building_type) {
			for (var i = 0; i < this._icons.length; i++) {
				var icon = this._icons[i];
				if (d.building_type.indexOf(icon) != -1)
					return "/img/map/" + icon.toLowerCase().replace(" ", "-") + ".png";
			}
		}
	}
}, map.core.model.kinds.Place);

map.core.model.kinds.Building = CT.Class({
	CLASSNAME: "map.core.model.kinds.Building",
}, map.core.model.kinds.BuildingBase);

map.core.model.kinds.BReffer = CT.Class({
	CLASSNAME: "map.core.model.kinds.BReffer",
	process: function(d) {
		var b = CT.data.get(d.building);
		return {
			key: d.key,
			address: b.address + ", " + core.config.ctmap.city,
			position: {
				lng: b.longitude,
				lat: b.latitude
			},
			icon: this.icon(b),
			info: this.info(d)
		};
	},
	list: function(dlist) {
		var n = CT.dom.node(),
			markers = this.markers;
		CT.db.multi(dlist.map(function(d) {
			return d.building;
		}), function(buildings) {
			buildings.forEach(function(b, i) {
				dlist[i].title = b.address;
			});
			CT.panel.triggerList(dlist, markers, n);
		});
		return n;
	},
	setHeader: function(subdata, bdata) {
		var b = CT.data.get(subdata.building);
		CT.dom.setContent(map.core.controller.nodes.header,
			CT.dom.node(this.header(b, b), "div", "biggest bold"));
	}
}, map.core.model.kinds.BuildingBase);

core.config.ctmap.custom_kinds.forEach(function(k) {
	map.core.model.kinds[k] = CT.require("kinds." + k, true);
});
