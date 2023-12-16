import DeckGL from "@deck.gl/react/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";
import { TextLayer } from "@deck.gl/layers/typed"
import { rgb } from "d3";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

const INITIAL_VIEW_STATE = {
  longitude: 76.6206927900588,
  latitude: 11.551920204973305,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        aqi: 10,
      },
      geometry: {
        coordinates: [76.6906927900588, 11.571920204973305],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        aqi: 20,
      },
      geometry: {
        coordinates: [76.8206927900588, 11.591920204973305],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        aqi: 30,
      },
      geometry: {
        coordinates: [76.7206927900588, 11.511920204973305],
        type: "Point",
      },
    },
  ],
};

function App() {
  const textLayer = new TextLayer({
    id: "textLayer",
    data: data.features.map((feature) => ({
      position: feature.geometry.coordinates,
      text: `${feature.properties.aqi}`,
    })),
    getPosition: (d) => d.position,
    getText: (d) => d.text,
    getSize: 32,
    getColor: [59, 43, 82],
    pickable: true,
    sizeScale: 2,
    sizeMinPixels: 6,
    sizeMaxPixels: 25,
    getTextBorderColor: [225, 225, 225, 225],
    getTextOutlineWidth: 2,
    getTextOutlineColor: [225, 225, 225, 225],
  });

  const layer = new HeatmapLayer({
    id: "heatmapLayer",
    data: data.features.map((feature) => ({
      position: feature.geometry.coordinates,
      weight: feature.properties.aqi,
    })),
    getPosition: (d) => d.position,
    getWeight: (d) => d.weight,
    aggregation: "SUM",
    pickable: true,
    pickingRadius: 20,
  });

  const mapLayer = new MVTLayer({
    id: "map",
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    interactive: false,
  });

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[mapLayer, layer, textLayer]}
        style={{ position: "absolute", height: "100%", width: "100%" }}
      >
      </DeckGL>
    </div>
  );
}

export default App;
