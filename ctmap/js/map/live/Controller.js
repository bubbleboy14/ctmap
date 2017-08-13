map.live.Controller = CT.Class({
	CLASSNAME: "map.live.Controller",
	_: {
		maps: {},
		tickers: [],
		tick: function() {
			var latlng, map, _ = this._;
			navigator.geolocation.getCurrentPosition(function(pos) {
				if (!_.position || map.live.core.diff(_.position, pos)) {
					_.position = pos;
					latlng = map.live.core.strip(_.position);
					_.tickers.forEach(function(t) {
						t.tick(latlng);
					});
				}
			}, null, { enableHighAccuracy: true });
		},
		url: function(name) {
			var si = CT.dom.id("secretinput");
			si.value = location.protocol + "//" + location.host
				+ location.pathname + "#" + name;
			si.select();
			document.execCommand("copy") && alert("link saved");
		},
		clip: function(name) {
			var u = this._.url;
			return CT.dom.img("/img/map/live/clip.png", null, function() {
				u(name);
			});
		}
	},
	tick: function(map) {
		if (this._.tickers.length)
			this._.position = null; // forces next tick
		else
			setInterval(this._.tick, map.live.core._.interval);
		this._.tickers.push(map);
	},
	pm: function(msg) {
		// for now you can only zap people
		location = "http://maps.google.com";
	},
	leave: function(channel, user) {
		var cparts = channel.split("_"),
			party = cparts[0],
			sub = cparts[1];
		if (sub == "scout") // only care about scouts!!!
			this._.maps[party].leave(channel, user);
	},
	update: function(data) {
		this._.maps[data.channel.split("_")[0]].update(data);
	},
	join: function(name) {
		CT.trans.translate("parties", { x: -155 });
		this._.maps[name] = new map.live.Map({
			name: name,
			controller: this,
			node: this.slider.add(name, true)
		});
	},
	initStream: function() {
		CT.pubsub.set_cb("pm", this.pm);
		CT.pubsub.set_cb("leave", this.leave);
		CT.pubsub.set_cb("message", this.update);
		CT.pubsub.connect(map.live.core._.host, map.live.core._.port);
	},
	initRemote: function() {
		var thiz = this;
		CT.dom.id("remote").onclick = function() {
			var m = thiz.remote = thiz.remote || new CT.modal.Prompt({
				clear: true,
				noClose: true,
				cb: thiz.join,
				transition: "slide"
			});
			m.showHide();
		};
	},
	init: function(opts) {
		this.slider = CT.panel.slider([], "parties", "maps", this._.clip);
		this.initStream();
		this.initRemote();
		var hash = location.hash.slice(1);
		if (hash) {
			location.hash = "";
			this.join(hash);
		}
	}
});