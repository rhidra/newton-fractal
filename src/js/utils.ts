export type Vector2 = [number, number];

export function distance(a: Vector2, b: Vector2) {
  return Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]));
}

export function random([x, y]: Vector2): number {
  return (Math.sin(x*12.9898 + y*78.233) * 43758.5453123) % 1;
}

// Basic value noise [-1, 1] in JS from the Book of shaders
export function valueNoise([x, y]: Vector2, scaling = 1): number {
  // Extract interger and floating parts
  const ix = Math.floor(x * scaling); // Integer part
  const fx = ix % 1; // Floating part
  const iy = Math.floor(y * scaling); // Integer part
  const fy = iy % 1; // Floating part

  // Random cells
  const a = random([ix, iy]);
  const b = random([ix+1, iy]);
  const c = random([ix, iy+1]);
  const d = random([ix+1, iy+1]);

  // Interpolation parameter
  const ux = fx*fx*(3.0-2.0*fx);
  const uy = fy*fy*(3.0-2.0*fy);

  // Noise between [-1, 1]
  const noise = a * ux + b * (1-ux) + (c - a) * uy * (1-ux) + (d - b) * ux * uy;

  return noise;
}

export function randomVectorFields([x, y]: Vector2, fieldIdx = 0): Vector2 {
  let vx = 0, vy = 0;
  const l = distance([0, 0], [x, y]);
  
  switch (fieldIdx) {
    case 0:
      vx = y * .1 / l;
      vy = -x * .1 / l;
    break;
  }
  
  console.log(vx, vy)
  return [vx, vy];
}