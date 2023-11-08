import React, { useCallback, useState, useEffect } from "react";
import DeckGL from "@deck.gl/react/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { MapView } from "@deck.gl/core/typed";
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

  useEffect(() => {
    function offSetCal(x) {
      // Adjust the offset value as needed
      x = Math.min(x, 100); // Example: limiting the offset to 100 pixels

      // Obtain a reference to the control container element
      var controlContainer = document.getElementById("control-container");

      if (controlContainer) {
        // Apply the offset to the control container
        var pos = 'translate(' + x + 'px, 0)';
        controlContainer.style.transform = pos;
        controlContainer.style.WebkitTransform = pos;
      }

      // Apply the offset to the map containers
      var clipA = 'rect(0, ' + x + 'px, 100%, 0)';
      var clipB = 'rect(0, 100%, 100%, ' + x + 'px)';
      var myLayerContainer = document.getElementById("myLayer-container");
      var mapContainer = document.getElementById("map-container");
      if (myLayerContainer) {
        myLayerContainer.style.clip = clipA;
      }
      if (mapContainer) {
        mapContainer.style.clip = clipB;
      }
    }

    const onViewStateChange = ({ viewId, viewState }) => {
      setViewStates((prevViewStates) => ({
        ...prevViewStates,
        [viewId]: {
          ...viewState,
          longitude: viewState.longitude + 0.1, // offset longitude by 0.1
          latitude: viewState.latitude + 0.1, // offset latitude by 0.1
        },
      }));

      const mapWidth = 360 / 2; // Assuming total map width is 360 degrees and there are 2 maps
      const offset = mapWidth * (viewId === "main" ? 1 : -1); // Calculate the offset based on the viewId
      offSetCal(offset);
    };

    return () => {
      document.removeEventListener("DOMContentLoaded", offSetCal);
    };
  }, []);

  const myLayer = new ScatterplotLayer({
    id: "myLayer",
    data: [
      { position: [88, 22], size: 100 },
      { position: [22, 88], size: 100 },
    ],
    getPosition: (d) => d.position,
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

  return (
    <div>
      <div id="control-container">{/* Control container content */}</div>
      <div style={{ display: "flex" }}>
        <DeckGL
          views={[
            new MapView({
              id: "main",
              width: "50%",
              controller: true,
            }),
            new MapView({
              id: "minimap",
              width: "50%",
              controller: true,
            }),
          ]}
          viewState={viewStates.main}
          layers={[myLayer]}
          onViewStateChange={(viewState) =>
            onViewStateChange({ viewId: "main", viewState })
          }
        >
          <div id="myLayer-container">
            {/* Additional content for myLayer */}
          </div>
        </DeckGL>
        <DeckGL
          views={[
            new MapView({
              id: "minimap",
              width: "50%",
              controller: true,
            }),
          ]}
          viewState={viewStates.minimap}
          layers={[myLayer2]}
          onViewStateChange={(viewState) =>
            onViewStateChange({ viewId: "minimap", viewState })
          }
        >
          <div id="map-container">{/* Additional content for map */}</div>
        </DeckGL>
      </div>
    </div>
  );
}
export default App;
