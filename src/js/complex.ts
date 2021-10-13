export class Complex {
  real;
  imag;

  constructor(x: number, y: number) {
    this.real = x;
    this.imag = y;  
  }

  get x() {
    return this.real;
  }

  get y() {
    return this.imag;
  }
}