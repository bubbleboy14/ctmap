# ctmap
This package includes the necessary ingredients for building map-centric websites.


# Back (Init Config)

import os

idir = os.path.join("img", "map")
dirs = [idir, os.path.join("js", "kinds")]
copies = {
	"css": ["custom.css"]
}
copies[idir] = ["business.png", "commercial.png", "house.png",
	"industrial.png", "office.png", "one-family.png", "residential.png"]
syms = {
	"css": ["map.css"],
	"html": ["map"],
	"js": ["map"]
}
model = {
	"ctmap.model": ["*"]
}


# Front (JS Config)

## core.config.ctmap
### Import line: 'CT.require("core.config");'
{
	"city": "san francisco",
	"types": ["building"],
	"center": { "lat": 37.75, "lng": -122.45 },
	"queries": [{ "modelName": "building" }],
	"custom_kinds": [],
	"geokeys": []
}