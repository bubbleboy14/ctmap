from cantools import db, config
from cantools.web import fetch
from cantools.geo import address2latlng, addr2zip

class Place(db.TimeStampedBase):
    latitude = db.Float()
    longitude = db.Float()
    address = db.String()
    zipcode = db.ForeignKey(kind="zipcode")
    label = "address"

class Building(Place):
    year = db.Integer()
    building_id = db.String()
    building_type = db.String()
    owner = db.ForeignKey(kind="owner")
    rent_control = db.Boolean()

def data2building(data):
    changes = False
    b = None
    if data.get("address"):
        data["address"] = data["address"].strip().upper()
    if data.get("building_id"):
        b = Building.query(Building.building_id == data["building_id"]).get()
    if not b and data.get("address"):
        b = Building.query(Building.address == data["address"]).get()
    if not b:
        changes = True
        if data.get("zipcode"):
            data["zipcode"] = getzip(data["zipcode"]).key
        if data.get("year"):
            data["year"] = int(data["year"])
        data["latitude"] = data["latitude"] and float(data["latitude"])
        data["longitude"] = data["longitude"] and float(data["longitude"])
        b = Building(**data)
    addr = "%s, san francisco, CA"%(b.address,)
    if not b.zipcode:
        changes = True
        b.zipcode = getzip(addr2zip(addr)).key
    if not b.latitude:
        changes = True
        b.latitude, b.longitude = address2latlng(addr)
    if changes:
        b.put()
    return b

class ZipCode(db.ModelBase):
    code = db.String()
    city = db.String()
    state = db.String()
    county = db.String()
    latitude = db.Float()
    longitude = db.Float()
    label = "code"

    def __str__(self):
        return self.code

    def fullString(self):
        return "%s, %s, %s"%(self.city, self.state, self.code)

def getzip(code, noerror=False):
    try:
        code = str(int(code.strip()[:5]))
        while len(code) < 5: # preceding 0's
            code = '0'+code
    except:
        if noerror:
            return
        from cantools.util import error
        error("invalid zip code: %s"%(code,))
    zipcode = ZipCode.query().filter(ZipCode.code == code).get()
    if not zipcode:
        if config.map: # old configuration style
            city, state, county = fetch(config.map.zipdomain, path="/%s"%(code,), asjson=True)
        else: # use mkpi-style ctmap.zip.domain
            city, state, county = fetch("%s/geo?action=zip&code=%s"%(config.ctmap.zip.domain,
                code), ctjson=True)
        zipcode = ZipCode(code=code, city=city, state=state, county=county)
        zipcode.put()
    if config.ctmap.zip.latlng and not zipcode.latitude:
        zipcode.latitude, zipcode.longitude = address2latlng(code)
        zipcode.put()
    return zipcode

def getzips(kwargs):
    zips = ZipCode.query()
    for key, val in list(kwargs.items()):
        zips = zips.filter(db.GenericProperty(key) == val)
    return zips.fetch(1000)