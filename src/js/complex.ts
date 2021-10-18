import { distance, Vector2 } from "./utils";

export class Complex {
  _real;
  _imag;
  _radius;

  constructor(x: number, y: number) {
    this._real = x;
    this._imag = y;  
    this._radius = -1;
  }

  // Build a complex from its radius and angle (in radians)
  static fromAngle(radius: number, angle: number): Complex {
    return new Complex(radius * Math.cos(angle), radius * Math.sin(angle));
  }

  set real(r: number) {
    this._radius = -1;
    this._real = r;
  }

  set imag(i: number) {
    this._radius = -1;
    this._imag = i;
  }

  get real() { return this._real; }
  get imag() { return this._imag; }
  get x() { return this.real; }
  get y() { return this.imag; }
  get vec() { return [this.real, this.imag] as Vector2; }

  get radius() {
    if (this._radius < 0) {
      this._radius = distance(this.vec, [0, 0]);
    }
    return this._radius;
  }

  // Returns the complex angle in radians
  get angle() {
    return Math.atan2(this.imag, this.real);
  }
}