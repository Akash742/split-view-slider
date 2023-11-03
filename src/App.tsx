import {useState} from 'react';
import DeckGL from "@deck.gl/react/typed";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmVlbGR1dHRhMTkiLCJhIjoiY2tweG9mN3F4MThrNTJ4cDk0enVjcTN4dCJ9.uxa_h0rjqumTxFMI1QELKQ";

import { MVTLayer } from "@deck.gl/geo-layers/typed";
import StaticMap from 'react-map-gl';

const INITIAL_VIEW_STATE = {
  longitude: 88,
  latitude: 22,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

function App() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
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
    data: `https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.vector.pbf?access_token=${MAPBOX_ACCESS_TOKEN}`,
    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
  });
  const handleViewStateChange = ({viewState}) => {
    setViewState(viewState);
  }
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[myLayer]}
        onViewStateChange={handleViewStateChange}
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      >
        <StaticMap accessToken={MAPBOX_ACCESS_TOKEN}/>
      </DeckGL>
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={[myLayer2]}
        onViewStateChange={handleViewStateChange}
        style={{ position: 'absolute', bottom: '10px', right: '10px', height: '200px', width: '200px' }}
      >
         <StaticMap accessToken={MAPBOX_ACCESS_TOKEN}/>
      </DeckGL>
    </div>
  );
}

export default App;

