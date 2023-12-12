import DeckGL from "@deck.gl/react/typed";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

import {GeoJsonLayer} from '@deck.gl/layers/typed';


const INITIAL_VIEW_STATE = {
  longitude: 76.6206927900588,
  latitude: 11.551920204973305,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const data = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        pollutionLevel: 10
      },
      "geometry": {
        "coordinates": [
          76.6206927900588,
          11.551920204973305
        ],
        "type": "Point"
      }
    }
  ]
};



const getPolygon = (lat: number, lng: number, size: number) => [
  [lat - size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng + size * 0.5],
  [lat - size * 0.5, lng + size * 0.5],
];
function App() {
  const layer = new GeoJsonLayer({
    id: 'pollution-layer',
    data,
    stroked: false,
    filled: true,
    extruded: false, // set extruded to false if you don't want the points to be extruded
    getFillColor: f => f && f.properties ? [f.properties.pollutionLevel * 255, 0, 0] : [0, 0, 0],
    getElevation: f => f && f.properties ? f.properties.pollutionLevel : 0,
    getPointRadius: 100, // set the point radius to a larger value to make the points visible
    updateTriggers: {
      getFillColor: [data] // re-calculate the getFillColor function when the data changes
    },
  });
 
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
        style={{ position: "absolute", height: "100%", width: "100%" }}
        onHover={(info) => {
          const coords = getPolygon(info.x, info.y, 150);
          const mapCoords = coords.map((coord) =>
            info.viewport?.unproject(coord)
          );
        }}
      ></DeckGL>
    </div>
  );
 } 

export default App;
