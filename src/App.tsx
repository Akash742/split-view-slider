import { useCallback, useState, useEffect } from "react";
import DeckGL from "@deck.gl/react/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { MapView, WebMercatorViewport } from "@deck.gl/core/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

function App() {
  const [viewStates, setViewStates] = useState({
    main: {
      longitude: 88,
      latitude: 22,
      zoom: 10,
      pitch: 0,
      bearing: 0,
    },
    minimap: {
      longitude: 88,
      latitude: 22,
      zoom: 10,
      pitch: 0,
      bearing: 0,
    },
  });

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
  const myLayer2 = new MVTLayer({
    id: "map",
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
  });

  const onViewStateChange = useCallback(({ viewId, viewState }) => {
    setViewStates({
      main: viewState,
      minimap: viewState,
    });
  }, []);

  return (
    <DeckGL
      views={[
        new MapView({
          id: "main",
          width: "50%",
          x: "50%",
          controller: true,
        }),
        new MapView({
          id: "minimap",
          width: "50%",
          controller: true,
        }),
      ]}
      viewState={viewStates.main}
      layers={[myLayer, myLayer2]}
      onViewStateChange={onViewStateChange}
    ></DeckGL>
  );
}

export default App;
