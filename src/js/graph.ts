import { Complex } from "./complex";
import { Vector2 } from "./utils";

/**
 * Graph
 * Description of a graph frame and the math equations, with the X and Y axis limits displayed,
 * and the equation solved.
 */

export class Graph {
  // Default polynomial: z^3 - 1 
  // roots: 1, -.5+.86603i, -.5-.86603i
  roots = [
    new Complex(1, 0), 
    new Complex(-.5, .86603), 
    new Complex(-.5, -.86603), 
  ];

  maxX = 5; minX = -5;
  maxY = 5; minY = -5;

  moveGraphAlong(vec: Vector2) {
    this.maxX += -vec[0] * (this.maxX - this.minX);
    this.minX += -vec[0] * (this.maxX - this.minX);
    this.maxY += -vec[1] * (this.maxY - this.minY);
    this.minY += -vec[1] * (this.maxY - this.minY);
  }

  getRealRoots(): number[] {
    return this.roots.map(r => r.real);
  }

  getImagRoots(): number[] {
    return this.roots.map(r => r.imag);
  }

  get rootsCount() {
    return this.roots.length;
  }
}