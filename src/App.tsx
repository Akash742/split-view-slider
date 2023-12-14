import { useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";
import { PickingInfo } from "@deck.gl/core/typed";

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
        pollutionLevel: 10,
      },
      geometry: {
        coordinates: [76.6906927900588, 11.571920204973305],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        pollutionLevel: 20,
      },
      geometry: {
        coordinates: [76.8206927900588, 11.591920204973305],
        type: "Point",
      },
    },
    {
      type: "Feature",
      properties: {
        pollutionLevel: 30,
      },
      geometry: {
        coordinates: [76.7206927900588, 11.511920204973305],
        type: "Point",
      },
    },
  ],
};

function App() {
  const [hoveredObject, setHoveredObject] = useState<{
    x: number | null;
    y: number | null;
    content: string | null;
  }>({
    x: null,
    y: null,
    content: null,
  });

  const layer = new HeatmapLayer({
    id: "heatmapLayer",
    data: data.features.map((feature) => ({
      position: feature.geometry.coordinates,
      weight: feature.properties.pollutionLevel,
    })),
    getPosition: (d) => d.position,
    getWeight: (d) => d.weight,
    aggregation: "SUM",
    pickable: true,
    pickingRadius: 20,
    getTooltip: ({ object }: PickingInfo): string | null => {
      console.log('getTooltip', object);
      if (object) {
        return `Pollution Level: ${object.weight}`;
      }
      return null;
    },
    onHover: ({ object, x, y }: PickingInfo): boolean => {
      console.log('onHover' ,{ object, x, y });
      if (object) {
        setHoveredObject({
          x,
          y,
          content: `Pollution Level: ${object.weight}`,
        });
        return true;
      } else {
        setHoveredObject({ x: null, y: null, content: null });
        return false;
      }
    },
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
        layers={[mapLayer, layer]}
        style={{ position: "absolute", height: "100%", width: "100%" }}
      >
        {hoveredObject?.content && (
          <div
            style={{
              position: "absolute",
              top: hoveredObject.y ? `${hoveredObject.y}px` : "auto",
              left: hoveredObject.x ? `${hoveredObject.x}px` : "auto",
              background: "white",
              color: "black",
              padding: "5px",
              borderRadius: "3px",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)",
            }}
          >
            {hoveredObject.content}
          </div>
        )}
      </DeckGL>
    </div>
  );
}

export default App;
