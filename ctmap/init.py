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
