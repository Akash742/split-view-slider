import DeckGL from "@deck.gl/react/typed";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

import { IconLayer } from '@deck.gl/layers/typed';
import { useState } from "react";
import rightArrow from "../src/assets/right arrow.png"

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
    longitude: 77.6216927900588,
    latitude: 12.552920204973305,
    windSpeed: 10, // in m/s
    windDirection: 90, // in degrees from north
  },
  {
    longitude: 78.6226927900588,
    latitude: 13.553920204973305,
    windSpeed: 15, // in m/s
    windDirection: 135, // in degrees from north
  },
  {
    longitude: 79.6236927900588,
    latitude: 14.554920204973305,
    windSpeed: 20, // in m/s
    windDirection: 180, // in degrees from north
  },
  {
    longitude: 80.6246927900588,
    latitude: 15.555920204973305,
    windSpeed: 25, // in m/s
    windDirection: 225, // in degrees from north
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
  const maxWindSpeed = Math.max(...windData.map(d => d.windSpeed));

  const windLayer = new IconLayer({
    id: 'wind-layer',
    data: windData,
    pickable: true,
    iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    //iconAtlas: rightArrow,  //This is how it is implemented on Aru-Client app. But here it's not working.
    iconMapping: {
      marker: {x: 0, y: 0, width: 128, height: 128, mask: true}, 
      marker2: {x: 128, y: 0, width: 128, height: 128, mask: true}, 
      marker3: {x: 256, y: 0, width: 128, height: 128, mask: true}, 
    },
    getPosition: d => [d.longitude, d.latitude],
    getIcon: d => {
      if (d.windSpeed < 5) {
        return 'marker';
      } else if (d.windSpeed < 10) {
        return 'marker2';
      } else {
        return 'marker3';
      }
    },
    getSize: d => d.windSpeed * 10,
    getColor: d => [255, (d.windSpeed / maxWindSpeed) * 255, 0],
    getAngle: d => d.windDirection,
  });
  
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[windLayer]}
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
