# ctmap
This package includes the necessary ingredients for building map-centric websites.


# Back (Init Config)

    import os
    
    idir = os.path.join("img", "map")
    ldir = os.path.join(idir, "live")
    objd = os.path.join(ldir, "objective")
    obsd = os.path.join(ldir, "obstacle")
    scod = os.path.join(ldir, "scout")
    dirs = [idir, ldir, objd, obsd, scod, os.path.join("js", "kinds"),
    	"scrapers", os.path.join("scrapers", "data")]
    copies = {
    	"css": ["custom.css"]
    }
    copies[idir] = ["business.png", "commercial.png", "house.png",
    	"industrial.png", "office.png", "one-family.png", "residential.png"]
    copies[ldir] = ["clip.png", "peep.png", "remote.png", "zap.png"]
    copies[objd] = ["default.png", "red.png", "green_arrow.png", "red_arrow.png"]
    copies[obsd] = ["default.png"]
    copies[scod] = ["default.png", "panic.png"]
    syms = {
    	".": ["_scrape.py"],
    	"css": ["map.css", "live.css"],
    	"html": ["map"],
    	"js": ["map"]
    }
    model = {
    	"ctmap.model": ["*"]
    }
    routes = {
    	"/_scrape": "_scrape.py"
    }
    cfg = {
    	"zipdomain": "https://api.mkult.co"
    }

# Front (JS Config)

## core.config.ctmap
### Import line: 'CT.require("core.config");'
    {
    	"city": "san francisco",
    	"types": ["place"],
    	"zoom": 12,
    	"center": { "lat": 37.75, "lng": -122.45 },
    	"queries": [{ "modelName": "place" }],
    	"custom_kinds": [],
    	"geokeys": [],
    	"netcache": true,
    	"header": true,
    	"icons": ["business", "commercial", "house",
    		"industrial", "office", "one-family", "residential"],
    	"live": {
    		"port": 8888,
    		"zoom": 18,
    		"interval": 5000,
    		"resolution": 1000,
    		"scouts": ["default"],
    		"obstacles": ["default"],
    		"objectives": ["default", "red"]
    	}
    }