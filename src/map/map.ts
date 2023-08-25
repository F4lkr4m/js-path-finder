import math, { zeros, matrix } from 'mathjs'
import { Graph, matrix2graph } from './matrix2graph';

export const FREE = 0;
export const WALL = 1;
export const START = 2;
export const END = 3;
export const VISITED = 4;

const drawVerticalWall = (matrix: math.Matrix, x: number, y: number, size: number) => {
  for (let i = 0; i < size; i++) {
    matrix.set([x, y + i], WALL);
  }
}

const drawHorizontalWall = (matrix: math.Matrix, x: number, y: number, size: number) => {
  for (let i = 0; i < size; i++) {
    matrix.set([x + i, y], WALL);
  }
}

export class Map {
  size: number = 1;
  matrix: math.Matrix;
  graph: Graph;

  constructor(size: number) {
    this.size = size;

    this.matrix = matrix(zeros(size, size));

    drawHorizontalWall(this.matrix, 1, 1, 3);
    drawVerticalWall(this.matrix, 1, 1, 3);
    drawHorizontalWall(this.matrix, 0, 10, 18);
    drawHorizontalWall(this.matrix, 3, 14, 18);


    this.graph = matrix2graph(this.matrix);
  }

  logMap() {
    console.log(this.matrix);
  }
}