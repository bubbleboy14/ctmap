map.core.query = {
	_build: function(opts) {
		new map.core.model.Pager(opts);
	},
	_setup: function(schema) {
		map.core.query.modal = new CT.modal.Prompt({
			transition: "fade",
			style: "single-choice",
			cb: function(mnode) {
				CT.db.query({
					modelName: mnode.innerHTML,
					submit: map.core.query._build,
					startYear: 2005,
					showHelp: true
				}, "slide");
			},
			data: map.core.controller.options.map(function(d) {
				return CT.dom.node(d);
			})
		});
		map.core.controller.nodes.button.onclick = function() {
			map.core.query.modal.showHide();
		};
		var cfg = core.config.ctmap;
		cfg.queries.forEach(map.core.query._build);
		cfg.dynqueries && cfg.dynqueries(function(queries) {
			queries.forEach(map.core.query._build);
		});
	},
	init: function() {
		CT.db.init({ cb: map.core.query._setup });
	}
};