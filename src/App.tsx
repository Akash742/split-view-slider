import DeckGL from "@deck.gl/react/typed";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

import { IconLayer } from "@deck.gl/layers/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";

const INITIAL_VIEW_STATE = {
  longitude: 76.6206927900588,
  latitude: 11.551920204973305,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

const windData = [
  {
    longitude: 76.6206927900588,
    latitude: 11.551920204973305,
    windSpeed: 5, // in m/s
    windDirection: 390, // in degrees from north
  },
  {
    longitude: 76.66062027900588,
    latitude: 11.553920204973305,
    windSpeed: 15, // in m/s
    windDirection: 390, // in degrees from north
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

function createSVGIcon(idx: any, color: string) {
  return `<svg fill="${color}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
  width="800px" height="800px" viewBox="0 0 490.939 490.939"
  xml:space="preserve">
 <g>
  <g>
  <path fill="${color}" d="M41.552,490.939c-2.665,0-5.297-1.064-7.237-3.095c-3.185-3.337-3.675-8.419-1.186-12.303L181.221,244.52L33.149,15.43
    c-2.508-3.88-2.031-8.973,1.152-12.32c3.183-3.347,8.245-4.081,12.246-1.768l407.844,235.47c3.094,1.786,5,5.088,5,8.66
    s-1.906,6.874-5,8.66L46.548,489.6C44.986,490.5,43.263,490.939,41.552,490.939z M72.451,39.39l129.061,199.679
    c2.128,3.293,2.136,7.525,0.02,10.825L72.156,451.721l357.236-206.25L72.451,39.39z"/>
  </g>
 </g>
 </svg>`;
 }

function svgToDataURL(svg: any) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const getPolygon = (lat: number, lng: number, size: number) => [
  [lat - size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng - size * 0.5],
  [lat + size * 0.5, lng + size * 0.5],
  [lat - size * 0.5, lng + size * 0.5],
];
// const tileUrl = "https://cog-nk.kesowa.com/cog/tiles/{z}/{x}/{y}.png?url=http://172.17.0.1:5151/raster/246a6dd2-cb38-409a-bd57-d2ef82d30757.tif";
function App() {
  const maxWindSpeed = Math.max(...windData.map((d) => d.windSpeed));

  const windLayer = new IconLayer({
    id: "wind-layer",
    data: windData,
    getPosition: (d) => [d.longitude, d.latitude],
    getIcon: (d, { index }) => {
      const t = d.windSpeed / maxWindSpeed;
      const color = [255 * (1 - t), 255 * t, 0];
      return {
        url: svgToDataURL(createSVGIcon(index, `rgb(${color})`)),
        width: 1024,
        height: 1024,
      };
     },
    getSize: (d) => d.windSpeed * 10,
    getAngle: (d) => 90 - d.windDirection,
  });

  const mapLayer = new MVTLayer({
    id: "map",
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
  });
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[mapLayer, windLayer]}
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
