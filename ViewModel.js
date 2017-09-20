/**
* @description This function is used to set a location when a name, id and location is passed.
* @param {string} name - The name of the location
* @param {integer} id - The id of the location
* @param {Object} location - The lat long coordinate of the location
*/

function SetLocation(name,id, location) {
	var self = this;
	self.id = id;
	self.name = name;
	self.location = ko.observable(location);

}

/**
* @description This function is used to create ko observable for all the location and form a list for all the locations
*/

function NeighborhoodMapViewModel() {

	var self = this;
	self.searchval = ko.observable("");
	self.location = [
	{lat: -38.339, lng: 144.3104}, // Great Ocean Road
	{lat: -37.7536, lng: 145.2218}, // Yarra River
	{lat: -38.2678, lng: 144.6287}, // Queens Cliff
	{lat: -37.9810, lng: 145.2150}, // Dandenong
	{lat: -37.9000, lng: 144.6640}, //Weribee
	{lat: -37.8225, lng: 144.9689}, //NGV
	{lat: -37.907, lng: 145.3581}, // Puffing Billy
	{lat: -37.8610, lng: 144.8850}, //Williamstown
	{lat: -37.868, lng: 144.9767}, // Luna Park
	{lat: -38.1499, lng: 144.3617} // Geelong
		];
self.neighborhoods = ko.observableArray([
new SetLocation("Great Ocean Road",0, self.location[0]),
new SetLocation("Yarra River",1, self.location[1]),
new SetLocation("Queens Cliff",2, self.location[2]),
new SetLocation("Dandenong",3, self.location[3]),
new SetLocation("Weribee",4, self.location[4]),
new SetLocation("National Gallery Of Victoria",5, self.location[5]),
new SetLocation("Puffing Billy",6, self.location[6]),
new SetLocation("Williamstown",7, self.location[7]),
new SetLocation("Luna Park",8, self.location[8]),
new SetLocation("Geelong",9, self.location[9]),

]);

self.setLists = function (locs) {
	var count =0;
	self.neighborhoods.removeAll();
	for (var i = 0; i < locs.length; i++) {
 	     	self.neighborhoods.push({
            		name: self.copy()[locs[i]].name,
            		id: self.copy()[locs[i]].id,
            		location: self.copy()[locs[i]].location
    });
     }
    for (var k = 0; k < markers.length; k++) {
          markers[k].setMap(null);
        }
    for(var j=0;j < locs.length;j++)
    {
    	markers[locs[j]].setMap(map);
    }
};
self.copy = ko.observableArray([
new SetLocation("Great Ocean Road",0, self.location[0]),
new SetLocation("Yarra River",1, self.location[1]),
new SetLocation("Queens Cliff",2, self.location[2]),
new SetLocation("Dandenong",3, self.location[3]),
new SetLocation("Weribee",4, self.location[4]),
new SetLocation("National Gallery Of Victoria",5, self.location[5]),
new SetLocation("Puffing Billy",6, self.location[6]),
new SetLocation("Williamstown",7, self.location[7]),
new SetLocation("Luna Park",8, self.location[8]),
new SetLocation("Geelong",9, self.location[9]),

]);


}
/**
* @description This function is used to dynamically change the markers and list based on user input
*/
this.setMarkerAndList = function()
	{
	var locs = [];
	var j = 0;
	var sear = this.searchval();
	for(var i=0;i<this.copy().length;i++)
	{
	var a = this.copy()[i].name;
	if(a.match(sear))
	{
		locs[j]=this.copy()[i].id;
		j++;
	}

}
this.setLists(locs);
};
this.setInfo = function()
	{
		populateInfoWindow(markers[this.id]);
	};

my = {viewModel: new NeighborhoodMapViewModel()};
ko.applyBindings(my.viewModel);
var locations = my.viewModel.neighborhoods();