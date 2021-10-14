#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec4 limits;

@const int ROOTS_COUNT
uniform float rootsReal[10];
uniform float rootsImag[10];

@const int ITERATIONS

vec2 cprod(vec2 a, vec2 b) { return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdivide(vec2 a, vec2 b) { return vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y))); }

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

vec2 f(vec2 x) {
  vec2 s = vec2(1.);
  for (int i = 0; i < ROOTS_COUNT; i++) {
    s = cprod(s, x - vec2(rootsReal[i], rootsImag[i]));
  }
  return s;
}

vec2 df(vec2 x) {
  vec2 s1 = vec2(0.);
  for (int i = 0; i < ROOTS_COUNT; i++) {
    vec2 s2 = vec2(1.);
    for (int j = 0; j < ROOTS_COUNT; j++) {
      vec2 t = x - vec2(rootsReal[j], rootsImag[j]);
      float mask = 1. - step(float(i) - .5, float(j)) + step(float(i) + .5, float(j));
      s2 = cprod(s2, t * mask + (1. - mask));
    }
    s1 += s2;
  }
  return s1;
}

// From the end position, returns the color corresponding to the closest root
vec3 findRootColor(vec2 p, out float out_d) {
  float d = 100000.;
  vec3 color = vec3(0.);

  for (int i = 0; i < ROOTS_COUNT; i++) {
    float t = length(p - vec2(rootsReal[i], rootsImag[i]));
    if (t < d) {
      d = t;
      if (i == 0) {
        color = vec3(1., 0., 0.);
      } else if (i == 1) {
        color = vec3(0., 1., 0.);
      } else if (i == 2) {
        color = vec3(0., 0., 1.);
      } else if (i == 3) {
        color = vec3(1., 1., 0.);
      } else if (i == 4) {
        color = vec3(0., 1., 1.);
      } else if (i == 5) {
        color = vec3(1., 0., 1.);
      } else if (i == 6) {
        color = vec3(.5, 1., .5);
      } else if (i == 7) {
        color = vec3(1., .5, .5);
      } else if (i == 8) {
        color = vec3(.5, .5, 1.);
      } else if (i == 9) {
        color = vec3(.6, .2, .3);
      }
    }
  }
  out_d = d;
  return color;
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 p = vec2(mix(limits[0], limits[1], st.x), mix(limits[2], limits[3], st.y));

  // Newton's method
  vec2 sol = vec2(p);
  for (int i = 0; i < ITERATIONS; i++) {
    sol -= cdivide(f(sol), df(sol));
  }

  vec3 color = vec3(0.);
  float d = 100000.;
  color = findRootColor(sol, d);
  // color *= d;
  // color += vec3(d/1.);

  // Display the function
  // vec2 res = p - f(p)/df(p);
  // float a = (atan(res.y, res.x)/2.*3.1415)+.5;
  // color = hsb2rgb(vec3(a, length(res), 1.));

  // Draw axis lines
  float axisLine = 1. - step(.000001*resolution.x*(limits[1]-limits[0]), length(p.x));
  axisLine += 1. - step(.000001*resolution.y*(limits[3]-limits[2]), length(p.y));
  color = color * (1. - axisLine) + vec3(1., 1., 1.) * axisLine;

  gl_FragColor = vec4(color, 1.);
}