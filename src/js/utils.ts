export type Vector2 = [number, number];

export function distance(a: Vector2, b: Vector2) {
  return Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]));
}