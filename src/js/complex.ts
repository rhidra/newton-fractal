import { distance, Vector2 } from "./utils";

export class Complex {
  real;
  imag;

  constructor(x: number, y: number) {
    this.real = x;
    this.imag = y;  
  }

  // Build a complex from its radius and angle (in radians)
  static fromAngle(radius: number, angle: number): Complex {
    return new Complex(radius * Math.cos(angle), radius * Math.sin(angle));
  }

  get x() {
    return this.real;
  }

  get y() {
    return this.imag;
  }

  get vec() {
    return [this.real, this.imag] as Vector2;
  }

  get radius() {
    return distance(this.vec, [0, 0]);
  }

  // Returns the complex angle in radians
  get angle() {
    return Math.atan2(this.imag, this.real);
  }
}