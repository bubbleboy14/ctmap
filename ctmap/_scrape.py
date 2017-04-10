from importlib import import_module
from cantools.web import respond, cgi_get, fail
from cantools import config

def response():
	if not config.map or not config.map.scrapers:
		fail("no scrapers configured! (define MAP_SCRAPERS, '|'-delimited, in your config)")
	scrape_target = cgi_get("scraper", choices=config.map.scrapers.split("|"))
	import_module("scrapers.%s"%(scrape_target,)).full_scan()

respond(response, threaded=True)