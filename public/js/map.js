
let map = L.map('map').setView(coordinate,13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
    
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);
 console.log(coordinate)
 L.circleMarker(coordinate, {
  radius: 10,
  color: 'red',    // border color
  fillColor: 'blue', // fill color
  fillOpacity: 0.8
}).addTo(map)
  .bindPopup(markPlace)
  .openPopup();
