import React, { useEffect } from "react";
import math from 'mathjs';
import './mapDrawer.css';
import { Map, WALL } from "./map";
import { Graph, Vertice, getCoordinatesId } from "./matrix2graph";



const transformMatrix2Rows = (matrix: math.Matrix) => {
  const [x, y] = matrix.size();
  const rows: number[][] = [];
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) {
      row.push(matrix.get([i, j]));
    }
    rows.push(row);
  }
  return rows;
}

interface CellWithId {
  id: string,
  value: number,
}

const transformMatrix2RowsWithIds = (matrix: math.Matrix): CellWithId[][] => {
  const [x, y] = matrix.size();
  const rows: CellWithId[][] = [];
  for (let i = 0; i < y; i++) {
    const row: CellWithId[] = [];
    for (let j = 0; j < x; j++) {
      row.push({
        value: matrix.get([i, j]),
        id: getCoordinatesId([i, j]),
      });
    }
    rows.push(row);
  }
  return rows;
}

export const bfs = (graph: Graph, startId: string, endId: string) => {
  const queue: string[] = [startId];
  const p: number[] = Array(1000).fill(0);
  const d: Record<string, number> = {};

  while (queue.length) {
    const id = queue.shift();
    if (!id) {
      continue;
    }

    const vertices = graph[id].vertices;

    vertices.forEach((vId) => {
      const v = graph[vId];
      if (v.isVisited) {
        return;
      }
      v.isVisited = true;
      queue.push(vId);
      d[vId] = (d[id] ?? 0) + 1;
      p[+vId] = +id;
    });
  }
  return {
    path: p,
    distance: d,
  };
}

interface MapDrawerProps {
  matrix: math.Matrix,
  start?: string,
  end?: string,
  pathIds?: string[],
  graph: Graph,
}

export const MapDrawer = ({ matrix, graph, start, end, pathIds }: MapDrawerProps) => {
  const rows = transformMatrix2RowsWithIds(matrix);


  useEffect(() => {
    pathIds?.forEach((id) => {
      document.getElementById(`${id}`)?.classList.add('mapDrawer-visited');
    })
    document.getElementById(`${start}`)?.classList.add('mapDrawer-start');
    document.getElementById(`${end}`)?.classList.add('mapDrawer-end');

  }, [pathIds, start, end])

  return (
    <div className="mapDrawer-root">
      {rows.map((row) => {
        return (
          <div className="mapDrawer-row">
            {row.map(({ value, id }, index) => {
              return (
                <div
                  id={id}
                  key={index}
                  className={`mapDrawer-cell ${value === WALL ? 'mapDrawer-wall' : 'mapDrawer-free'}`}
                  onMouseOver={() => {
                    if (value === WALL) {
                      return;
                    }
                    const ids = graph[id].vertices;
                    ids.forEach((listId) => {
                      document.getElementById(listId)?.classList.add('mapDrawer-list')
                    })
                  }}
                  onMouseOut={() => {
                    if (value === WALL) {
                      return;
                    }
                    const ids = graph[id].vertices;
                    ids.forEach((listId) => {
                      document.getElementById(listId)?.classList.remove('mapDrawer-list')
                    })
                  }}
                >
                  &nbsp;
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  );
}