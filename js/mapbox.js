mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhZ2lhIiwiYSI6ImNqNXZrbDBycjAzMm8zMnAzdmc4N3E2MmkifQ.cd09H32cxBuCcwaI0bOghA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/shagia/ck08oc95c1clq1bmzny32clqs?optimize=true',
center: [-77.04, 38.907],
logoPosition: 'top-left',
zoom: 2,
interactive: false,

});
 
/* given a query in the form "lng, lat" or "lat, lng" returns the matching
* geographic coordinate(s) as search results in carmen geojson format,
* https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
*/
var coordinatesGeocoder = function (query) {
// match anything which looks like a decimal degrees coordinate pair
var matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
if (!matches) {
return null;
}
function coordinateFeature(lng, lat) {
return {
center: [lng, lat],
geometry: {
type: "Point",
coordinates: [lng, lat]
},
place_name: 'Lat: ' + lat + ' Lng: ' + lng, // eslint-disable-line camelcase
place_type: ['coordinate'], // eslint-disable-line camelcase
properties: {},
type: 'Feature'
};
}
var coord1 = Number(matches[1]);
var coord2 = Number(matches[2]);
var geocodes = [];
if (coord1 < -90 || coord1 > 90) {
// must be lng, lat
geocodes.push(coordinateFeature(coord1, coord2));
}
if (coord2 < -90 || coord2 > 90) {
// must be lat, lng
geocodes.push(coordinateFeature(coord2, coord1));
}
if (geocodes.length === 0) {
// else could be either lng, lat or lat, lng
geocodes.push(coordinateFeature(coord1, coord2));
geocodes.push(coordinateFeature(coord2, coord1));
}
return geocodes;
};