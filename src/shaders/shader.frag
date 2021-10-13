#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(st.x, st.y, 0., 1.);
}