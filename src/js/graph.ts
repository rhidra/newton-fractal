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
      const Lx = this.maxX - this.minX;
      const lx = Lx * width / this.prevWidth;
      this.minX += (Lx - lx) / 2;
      this.maxX -= (Lx - lx) / 2;

      const Ly = this.maxY - this.minY;
      const ly = Ly * height / this.prevHeight;
      this.minY += (Ly - ly) / 2;
      this.maxY -= (Ly - ly) / 2;

      this.prevWidth = width;
      this.prevHeight = height;
    }
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