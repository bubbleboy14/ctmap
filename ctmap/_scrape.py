from importlib import import_module
from cantools.web import respond, cgi_get
from cantools import config

def response():
	scrape_target = cgi_get("scraper", choices=config.map.scrapers.split("|"))
	import_module("scrapers.%s"%(scrape_target,)).full_scan()

respond(response, threaded=True)