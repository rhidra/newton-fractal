import { Complex } from "./complex";

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

  maxX = 1; minX = -1;
  maxY = 1; minY = -1;
}