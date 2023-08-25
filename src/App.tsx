import './App.css'
import { MapDrawer, bfs } from './map/MapDrawer';
import { Map } from './map/map'
import { getCoordinatesId, matrix2graph } from './map/matrix2graph';

const restorePath = (path: number[], start: number, end: number) => {
  const ids = [];
  let current = +end;
  while (current !== +start) {
    current = path[+current];
    ids.push(String(current));
  }
  return ids;
}

const map = new Map(32);
const start = getCoordinatesId([3, 3]);
const end = getCoordinatesId([5, 23]);
const p = bfs(map.graph, start, end);
const ids = restorePath(p.path, +start, +end);

function App() {
  return (
    <>
      <button onClick={() => { }}>
        Start
      </button>
      <MapDrawer graph={map.graph} matrix={map.matrix} pathIds={ids} start={start} end={end} />
    </>
  )
}

export default App
