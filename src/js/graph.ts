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

  maxX = 2; minX = -2;
  maxY = 2; minY = -2;

  prevWidth = -1; prevHeight = -1;

  // Moves the graph limits according to a direction vector, with components [0,1]
  moveGraphAlong(dir: Vector2) {
    this.maxX -= dir[0] * (this.maxX - this.minX);
    this.minX -= dir[0] * (this.maxX - this.minX);
    this.maxY -= dir[1] * (this.maxY - this.minY);
    this.minY -= dir[1] * (this.maxY - this.minY);
  }

  // Adapt the graph limits to the screen resolution
  adaptDimensions(width: number, height: number) {
    if (this.prevWidth === -1) {
      this.prevWidth = width;
      this.prevHeight = height;
      const l = (this.maxY - this.minY) * width / height;
      const dl = (this.maxX - this.minX - l) / 2;
      this.minX += dl;
      this.maxX -= dl;
    } else {
      this.adaptXLimits((this.maxX - this.minX) * width / this.prevWidth);
      this.adaptYLimits((this.maxY - this.minY) * height / this.prevHeight);
      this.prevWidth = width;
      this.prevHeight = height;
    }
  }

  // Change limits to be the new length
  adaptXLimits(newLength: number) {
    const oldLength = this.maxX - this.minX;
    this.minX += (oldLength - newLength) / 2;
    this.maxX -= (oldLength - newLength) / 2;
  }

  adaptYLimits(newLength: number) {
    const oldLength = this.maxY - this.minY;
    this.minY += (oldLength - newLength) / 2;
    this.maxY -= (oldLength - newLength) / 2;
  }

  // Positive to zoom, negative to unzoom
  zoomGraph(scale: number) {
    let factor: number;
    if (scale >= 1) {
      factor = -.1 * scale + 1;
    } else if (scale <= -1) {
      factor = -.1 * scale + 1;
    } else {
      return;
    }
    this.adaptXLimits((this.maxX - this.minX) * factor);
    this.adaptYLimits((this.maxY - this.minY) * factor);
    console.log(factor, this.minX, this.maxX)
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