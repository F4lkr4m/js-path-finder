import math from 'mathjs';
import { WALL } from './map';

type Coordinates = number[];

const MAX_MAP_SIZE = 64;

const isLeftTopAngle = ([x, y]: Coordinates) => x === 0 && y === 0;
const isLeftBottomAngle = ([x, y]: Coordinates, ySize: number) => x === 0 && y === ySize - 1;
const isRightBottomAngle = ([x, y]: Coordinates, xSize: number, ySize: number) => x === xSize - 1 && y === ySize - 1;
const isRightTopAngle = ([x, y]: Coordinates, xSize: number) => x === xSize - 1 && y === 0;

const isLeftEdge = ([x]: Coordinates) => x === 0;
const isRightEdge = ([x]: Coordinates, xSize: number) => x === xSize - 1;
const isTopEdge = ([, y]: Coordinates) => y === 0;
const isBottomEdge = ([, y]: Coordinates, ySize: number) => y === ySize - 1;

export const getCoordinatesId = ([x, y]: Coordinates): string => `${x + y * MAX_MAP_SIZE}`

const getVerticesByCoordinates = (coordinates: Coordinates[]): string[] => {
  return coordinates.map((value) => getCoordinatesId(value));
}

const getVertice = (coordinates: Coordinates, vertices: string[]): Vertice => {
  return {
    id: getCoordinatesId(coordinates),
    vertices,
    coordinates,
    isVisited: false,
  }
}

const getLeft = ([x, y]: Coordinates) => [x - 1, y];
const getRight = ([x, y]: Coordinates) => [x + 1, y];
const getTop = ([x, y]: Coordinates) => [x, y - 1];
const getBottom = ([x, y]: Coordinates) => [x, y + 1];

export interface Vertice {
  id: string,
  coordinates: Coordinates,
  isVisited: boolean,
  vertices: string[]
}

export type Graph = Record<string, Vertice>;

export const matrix2graph = (matrix: math.Matrix): Graph => {
  const [xSize, ySize] = matrix.size();
  const graph: Graph = {};

  matrix.forEach((value, coordinates) => {
    if (coordinates.length !== 2) {
      return;
    }
    if (value === WALL) {
      return;
    }
    const id = getCoordinatesId(coordinates);

    const getDefaultVertice = (vertices: Coordinates[]) => {
      const filteredV = vertices.filter((coors) => matrix.get(coors) !== WALL);
      return getVertice(coordinates, getVerticesByCoordinates(filteredV));
    }

    switch (true) {
      case isLeftTopAngle(coordinates):
        graph[id] = getDefaultVertice([getBottom(coordinates), getRight(coordinates)])
        return;
      case isLeftBottomAngle(coordinates, ySize):
        graph[id] = getDefaultVertice([getTop(coordinates), getRight(coordinates)]);
        return;
      case isRightBottomAngle(coordinates, xSize, ySize):
        graph[id] = getDefaultVertice([getTop(coordinates), getLeft(coordinates)]);
        return;
      case isRightTopAngle(coordinates, xSize):
        graph[id] = getDefaultVertice([getBottom(coordinates), getLeft(coordinates)]);
        return;
      case isLeftEdge(coordinates):
        graph[id] = getDefaultVertice([getRight(coordinates), getTop(coordinates), getBottom(coordinates)]);
        return;
      case isRightEdge(coordinates, xSize):
        graph[id] = getDefaultVertice([getLeft(coordinates), getTop(coordinates), getBottom(coordinates)]);
        return;
      case isBottomEdge(coordinates, ySize):
        graph[id] = getDefaultVertice([getLeft(coordinates), getTop(coordinates), getRight(coordinates)]);
        return;
      case isTopEdge(coordinates):
        graph[id] = getDefaultVertice([getLeft(coordinates), getBottom(coordinates), getRight(coordinates)]);
        return;
      default:
        graph[id] = getDefaultVertice([getLeft(coordinates), getBottom(coordinates), getRight(coordinates), getTop(coordinates)]);
        return;
    }
  });

  return graph;
}