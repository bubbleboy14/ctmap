import os

idir = os.path.join("img", "map")
dirs = [idir, os.path.join("js", "kinds"), "scrapers", os.path.join("scrapers", "data")]
copies = {
	"css": ["custom.css"]
}
copies[idir] = ["business.png", "commercial.png", "house.png",
	"industrial.png", "office.png", "one-family.png", "residential.png"]
syms = {
	".": ["_scrape.py"],
	"css": ["map.css"],
	"html": ["map"],
	"js": ["map"]
}
model = {
	"ctmap.model": ["*"]
}
routes = {
	"/_scrape": "_scrape.py"
}