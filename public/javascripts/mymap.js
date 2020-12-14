var mymap = L.map('mapid', {
    center: [35.704983, 139.560356],
    zoom: 11
});
L.tileLayer(
    //'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxaccessToken, {
    'https://api.mapbox.com/styles/v1/kigal/cki0make32fpr19pgcy0fo507/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2lnYWwiLCJhIjoiY2tpMGxzY2FnMWV5OTJxdGg3cThhYTFnbyJ9.ipn6vmJzk6ykZ81Gk9WLzw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);