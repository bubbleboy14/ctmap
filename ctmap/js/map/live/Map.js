map.live.Map = CT.Class({
	CLASSNAME: "map.live.Map",
	_: {
		obstacles: 0,
		objectives: 0,
		panics: {},
		buttons: {},
		arrows: function(color) {
			var _ = map.live.core._, thaz = this, modal = _.arrow.mod[color];
			if (!modal) {
				var content = CT.dom.div(), degz = [];
				_.arrow.degs.forEach(function(d, i) {
					var icon, img, rot = (d != "default") ? d : 0;
					if (d == "default")
						icon = (color == "green") ? "default" : "red";
					else
						icon = color + "_arrow";
					img = CT.dom.img("/img/objective/" + icon + ".png", null, function() {
						var dropper = thaz._.buttons.objective;
						dropper.src = "/img/objective/" + icon + ".png";
						CT.trans.rotate(dropper, { degrees: rot });
						thaz.objective(icon, rot);
						modal.hide();
					});
					content.appendChild(img);
					if (i == 2 || i == 5)
						content.appendChild(CT.dom.br());
					if (rot) {
						img._rot = rot;
						degz.push(img);
					}
				});
				modal = _.arrow.mod[color] = new CT.modal.Modal({
					center: false,
					noClose: true,
					content: content,
					innerClass: "full noflow",
					transition: "slide",
					slide: {
						origin: "topright"
					}
				});
				modal.on.show = function() {
					degz.forEach(function(n) {
						CT.trans.rotate(n.firstChild, { degrees: n._rot });
					});
				};
			}
			modal.show();
		},
		select: function(channel) {
			var _ = this._, bz = _.buttons, anchor = bz[channel], selector = this[channel],
				sd = _[channel + "Drop"] = _[channel + "Drop"] || new CT.Drop({
					shiftV: 4,
					translucent: true,
					constrained: false,
					anchor: anchor,
					parent: this.opts.node,
					content: map.live.core._[channel + "z"].map(function(s) {
						var ilnk = "/img/" + channel + "/" + s + ".png";
						return CT.dom.img(ilnk, "hoverglow roundest block", function() {
							if (channel == "scout") {
								CT.dom.hide(bz.scout);
								CT.dom.show(bz.obstacle, "inline");
								CT.dom.show(bz.objective, "inline");
								CT.dom.show(bz.peep, "inline");
							} else { // obstacle, objective
								anchor.src = ilnk;
								if (channel == "objective") {
									var isd = s == "default";
									if (isd || s == "red")
										return _.arrows(isd ? "green" : "red");
									else {
										_.objRotation = null;
										CT.trans.rotate(anchor, { degrees: 0 });
									}
								}
							}
							selector(s);
						});
					})
				});
			sd.slide();
		},
		drop: function(evt) {
			var _ = this._;
			if (_.mode) {
				var message = {
					action: "add",
					data: {
						position: evt.latLng,
						icon: _[_.mode]
					}
				}, mcounter = _.mode + "s";
				message.data.id = _[mcounter];
				_[mcounter] += 1;
				if (_.mode == "objective" && _.objRotation)
					message.data.rotation = _.objRotation;
				CT.pubsub.publish(this.name + "_" + _.mode, message);
			}
		},
		remove: function(channel, key) {
			var action = "remove";
			if (channel.split("_")[1] == "scout")
				action = this._.panics[key] ? "unpanic" : "panic";
			CT.pubsub.publish(channel, {
				action: action,
				data: {
					key: key
				}
			});
		},
		resize: function() {
			this._.map.resizeMarkers(CT.align.height() * 14 / 100);
		}
	},
	update: function(data) {
		var mopts, mdim, msg = data.message,
			pnode, _ = this._, pz = _.panics,
			channel = data.channel.split("_")[1],
			key = data.user + data.channel + (msg.data.id || "");
		if (msg.action == "panic") {
			pnode = pz[msg.data.key] = _.map.getMarker(msg.data.key);
			pnode._normal = pnode.getIcon();
			pnode.setIcon("/img/scout/panic.png");
		} else if (msg.action == "unpanic") {
			pz[msg.data.key].setIcon(pz[msg.data.key]._normal);
			delete pz[msg.data.key];
		} else if (msg.action == "remove") {
			_.map.removeMarker(msg.data.key);
		} else if (msg.action == "move") {
			_.map.setMarker(msg.data);
			if (msg.data.rotation)
				core.util.rotate(_.map.getMarker(msg.data.key).getIcon(), msg.data.rotation);
		} else if (msg.action == "add") {
			mdim = CT.align.height() * 14 / 100;
			mopts = {
				key: key,
				optimized: false,
				icon: {
					url: "/img/" + channel + (msg.data.icon ? ("/" + msg.data.icon) : "") + ".png",
					size: new google.maps.Size(mdim, mdim)
				},
				position: msg.data.position,
				animation: google.maps.Animation.DROP,
				listeners: {
					dblclick: function(e) {
						_.map.getMarker(key).cancelInfo();
						_.remove(data.channel, key);
					}
				}
			};
			if (channel == "scout") {
				mopts.infoDelay = 500;
				mopts.info = CT.dom.div([CT.dom.img("/img/zap.png", "pointer hoverglow", function() {
					if (!pz[msg.data.key])
						_.remove(data.channel, key);
					CT.pubsub.pm(data.user, "zap");
					_.map.getMarker(key).hideInfo();
				}), "really zap???"]);
			} else {
				if (channel == "objective" && msg.data.rotation) {
					mopts.icon.url += "#" + data.user + "|" + msg.data.id;
					map.live.core.rotate(mopts.icon.url, msg.data.rotation);
				}
				mopts.draggable = true;
				mopts.listeners.dragend = function(evt) {
					var ddata = {
						key: key,
						position: evt.latLng
					};
					if (msg.data.rotation)
						ddata.rotation = msg.data.rotation;
					CT.pubsub.publish(data.channel, {
						action: "move",
						data: ddata
					});
				};
			}
			_.map.setMarker(mopts);
		}
	},
	leave: function(channel, user) {
		var key = user + channel;
		if (key in this._.panics)
			this.pulse(key);
		else // handles no-one-theres
			this._.map.removeMarker(key);
	},
	pulse: function(key) {
		var img, iteration = 0, p = map.live.core._.pulse, _ = this._,
			marker = _.panics[key], flash = function() {
				iteration += 1;
				if (iteration < p.iterations) {
					img = (iteration % 2) ? "default" : "panic";
					marker.setIcon("/img/scout/" + img + ".png");
					setTimeout(flash, p.interval);
				} else
					_.map.removeMarker(key);
			};
		delete _.panics[key];
		flash();
	},
	peep: function() {
		this._.peeper = this._.peeper || new CT.modal.Modal({
			center: false,
			className: "basicpopup bigger vslide h3-10",
			transition: "slide",
			slide: {
				origin: "bottom"
			},
			content: CT.dom.div([
				"Who else is lurking around?",
				CT.dom.iframe("https://fzn.party/stream/widget.html#" + this.name + "_zoom_chat", "w1 bw0")
			], "h1 noflow")
		});
		this._.peeper.showHide();
	},
	selectScout: function() {
		this._.select("scout");
	},
	selectObstacle: function() {
		this._.select("obstacle");
	},
	selectObjective: function() {
		this._.select("objective");
	},
	tick: function(latlng) {
		this._.map.panTo(latlng);
		CT.pubsub.publish(this.name + "_scout", {
			action: "add",
			data: {
				icon: this._.scout,
				position: latlng
			}
		});
	},
	scout: function(icon) { // select icon, start broadcasting
		this._.scout = icon;
		this.opts.controller.tick(this);
		setInterval(this._.tick, map.live.core._.interval);
	},
	obstacle: function(icon) {
		this._.obstacle = icon;
		this._.mode = "obstacle";
	},
	objective: function(icon, rotation) { // rotation for arrows
		this._.objective = icon;
		this._.objRotation = rotation;
		this._.mode = "objective";
	},
	initStream: function() {
		var schan = this.name + "_scout";
		CT.pubsub.set_autohistory(true, [schan], true);
		CT.pubsub.subscribe(schan);
		CT.pubsub.subscribe(this.name + "_obstacle");
		CT.pubsub.subscribe(this.name + "_objective");
	},
	initContent: function() {
		this.map = CT.dom.div(null, "abs full", this.name + "map");
		this._.buttons.scout = CT.dom.img({
			noanchor: true,
			onclick: this.selectScout,
			src: "/img/scout/default.png",
			imgid: name + "scout",
			imgclass: "hoverglow roundest"
		});
		this._.buttons.objective = CT.dom.img({
			noanchor: true,
			onclick: this.selectObjective,
			src: "/img/objective/default.png",
			imgid: name + "objective",
			imgclass: "hoverglow roundest hidden"
		});
		this._.buttons.obstacle = CT.dom.img({
			noanchor: true,
			onclick: this.selectObstacle,
			src: "/img/obstacle/default.png",
			imgid: name + "obstacle",
			imgclass: "hoverglow roundest hidden"
		});
		this._.buttons.peep = CT.dom.img({
			noanchor: true,
			onclick: this.peep,
			src: "/img/peep.png",
			imgid: name + "peep",
			imgclass: "hoverglow roundest hidden"
		});
		this.buttons = CT.dom.div([
			this._.buttons.scout,
			this._.buttons.objective,
			this._.buttons.obstacle,
			this._.buttons.peep
		], "abs ctl whitebacktrans", name + "buttons");
		CT.dom.setContent(this.opts.node, [
			this.map, this.buttons
		]);
		this._.map = new CT.map.Map({
			zoom: map.live.core._.zoom,
			node: this.map,
			listeners: { click: this._.drop }
		});
		CT.onresize(this._.resize);
	},
	init: function(opts) {
		this.opts = opts;
		this.name = opts.name;
		this.initContent();
		this.initStream();
	}
});