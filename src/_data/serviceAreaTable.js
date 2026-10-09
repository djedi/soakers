// Distance and elevation for the /service-areas/ hub table.
// Drive miles/minutes: OSRM routing (router.project-osrm.org) from the showroom
// (6905 S State St, 40.6254,-111.8899) to each city centre as geocoded by
// OpenStreetMap Nominatim, light-traffic estimates, retrieved Oct 9, 2026.
// Elevation: USGS Elevation Point Query Service at the same city-centre point.
module.exports = [
  { city: "Murray", miles: 2.9, minutes: 6, elevation: 4303, url: "/service-areas/murray/" },
  { city: "Sandy", miles: 4.2, minutes: 9, elevation: 4395, url: "/service-areas/sandy/" },
  { city: "West Jordan", miles: 4.3, minutes: 9, elevation: 4378, url: "/service-areas/west-jordan/" },
  { city: "Cottonwood Heights", miles: 5.0, minutes: 8, elevation: 4789, url: "/service-areas/cottonwood-heights/" },
  { city: "Taylorsville", miles: 5.6, minutes: 9, elevation: 4300 },
  { city: "Holladay", miles: 7.5, minutes: 13, elevation: 4469 },
  { city: "South Jordan", miles: 7.7, minutes: 12, elevation: 4458, url: "/service-areas/south-jordan/" },
  { city: "Draper", miles: 9.3, minutes: 14, elevation: 4504, url: "/service-areas/draper/" },
  { city: "Riverton", miles: 10.7, minutes: 17, elevation: 4445 },
  { city: "Salt Lake City", miles: 12.1, minutes: 17, elevation: 4264, url: "/service-areas/salt-lake-city/" },
  { city: "Herriman", miles: 17.5, minutes: 25, elevation: 4947 },
  { city: "Lehi", miles: 20.1, minutes: 25, elevation: 4554 },
  { city: "Park City", miles: 32.8, minutes: 43, elevation: 7013, url: "/service-areas/park-city/" },
];
