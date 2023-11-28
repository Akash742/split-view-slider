import DeckGL from "@deck.gl/react/typed";
import { ScatterplotLayer, SolidPolygonLayer, BitmapLayer } from "@deck.gl/layers/typed";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

import { TileLayer, } from "@deck.gl/geo-layers/typed";
import { MaskExtension } from "@deck.gl/extensions/typed";
import { useState } from "react";

const INITIAL_VIEW_STATE = {
  longitude: 76.6206927900588,
  latitude: 11.551920204973305,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

const windData = [
  {
    longitude: 76.6206927900588,
    latitude: 11.551920204973305,
    windSpeed: 5, // in m/s
    windDirection: 45, // in degrees from north
  },
  {
    longitude: 76.6206927900588,
    latitude: 11.551920204973305,
    windSpeed: 10, // in m/s
    windDirection: 90, // in degrees from north
  },
  // ... more data points
];

const getPolygon = (lat: number, lng: number, size: number) => [
  [lat - size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng + size * 0.5],
  [lat - size * 0.5, lng + size * 0.5],
];
const tileUrl = "https://cog-nk.kesowa.com/cog/tiles/{z}/{x}/{y}.png?url=http://172.17.0.1:5151/raster/246a6dd2-cb38-409a-bd57-d2ef82d30757.tif";
function App() {
  const myLayer = new ScatterplotLayer({
    id: "myLayer",
    data: [
      { position: [88, 22], size: 100 },
      { position: [22, 88], size: 100 },
    ],
    geoPosition: (d) => d.position,
    getRadius: (d) => d.size,
    getColor: [255, 0, 0],
  });
  const [polygon, setPolygon] = useState(getPolygon(88, 22, 1));
  const maskLayer = new SolidPolygonLayer({
    id: "geofence",
    operation: "mask",
    data: [polygon],
    getPolygon: (d) => d,
    getColor: [255, 0, 0],
  });
  const myLayer2 = new TileLayer({
    data: tileUrl,
    minZoom: 0,
    maxZoom: 23,
    tileSize: 256,
    extensions: [new MaskExtension()],
    maskId: maskLayer.id,
    renderSubLayers: props => {
      const { bbox: { west, south, east, north } } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north]
      })
    }
  });

  const windLayer = new ScatterplotLayer({
    id: 'wind-layer',
    data: windData, // your wind data here
    getPosition: d => [d.longitude, d.latitude],
    getRadius: d => d.windSpeed * 1000,
    getFillColor: d => [255, (d.windSpeed / maxWindSpeed) * 255, 0],
    getAngle: d => d.windDirection,
    pickable: true,
  });
  
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[maskLayer, myLayer, myLayer2, windLayer]}
        style={{ position: "absolute", height: "100%", width: "100%" }}
        onHover={(info) => {
          const coords = getPolygon(info.x, info.y, 150);
          const mapCoords = coords.map((coord) =>
            info.viewport?.unproject(coord)
          );
          setPolygon(mapCoords);
        }}
      ></DeckGL>
    </div>
  );
}

export default App;
