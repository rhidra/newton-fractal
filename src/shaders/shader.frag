#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec4 limits;

uniform float rootsReal[10];
uniform float rootsImag[10];
uniform int rootsCount;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 p = vec2(mix(limits[0], limits[1], st.x), mix(limits[2], limits[3], st.y));

  vec3 color = vec3(0.);

  // Draw axis lines
  float axisLine = 1. - step(.003, length(p.x));
  axisLine += 1. - step(.003, length(p.y));
  color += .3 * axisLine;

  gl_FragColor = vec4(color, 1.);
}