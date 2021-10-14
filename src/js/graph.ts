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

  prevWidth = -1; prevHeight = -1; resolutionFactor = -1;

  initRootComponents() {
    if (this.prevWidth === -1 || this.prevHeight === -1 || this.resolutionFactor === -1) {
      return;
    }

    const body = document.querySelector('body');
    body.querySelectorAll('.root').forEach(el => el.remove());
    
    this.roots.forEach((r, i) => {
      const x = (r.x - this.minX) / (this.maxX - this.minX) * this.prevWidth * this.resolutionFactor;
      const y = (r.y - this.maxY) / (this.minY - this.maxY) * this.prevHeight * this.resolutionFactor;
      const el = document.createElement('div');
      el.className = 'root';
      el.style.top = `${y}px`;
      el.style.left = `${x}px`;
      body.appendChild(el);
    });
  }

  // Moves the graph limits according to a direction vector, with components [0,1]
  moveGraphAlong(dir: Vector2) {
    this.maxX -= dir[0] * (this.maxX - this.minX);
    this.minX -= dir[0] * (this.maxX - this.minX);
    this.maxY -= dir[1] * (this.maxY - this.minY);
    this.minY -= dir[1] * (this.maxY - this.minY);
    this.initRootComponents();
  }

  // Adapt the graph limits to the screen resolution
  adaptDimensions(width: number, height: number, resolutionFactor: number) {
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
    this.resolutionFactor = resolutionFactor;
    this.initRootComponents();
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
    this.initRootComponents();
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