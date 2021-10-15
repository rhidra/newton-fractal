#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec4 limits;

@const int ROOTS_COUNT
uniform float rootsReal[10];
uniform float rootsImag[10];

@const int MAX_ITERATIONS

vec2 cprod(vec2 a, vec2 b) { return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x); }
vec2 cdivide(vec2 a, vec2 b) { return vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y))); }

vec3 hsb2rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix( vec3(1.0), rgb, c.y);
}

vec2 f(vec2 x) {
  vec2 s = vec2(1., 0.);
  for (int i = 0; i < ROOTS_COUNT; i++) {
    s = cprod(s, x - vec2(rootsReal[i], rootsImag[i]));
  }
  return s;
}

vec2 df(vec2 x) {
  vec2 s1 = vec2(0.);
  for (int i = 0; i < ROOTS_COUNT; i++) {
    vec2 s2 = vec2(1., 0.);
    for (int j = 0; j < ROOTS_COUNT; j++) {
      vec2 t = x - vec2(rootsReal[j], rootsImag[j]);
      float mask = 1. - step(float(i) - .5, float(j)) + step(float(i) + .5, float(j));
      s2 = cprod(s2, t * mask + vec2(1., 0.) * (1. - mask));
    }
    s1 += s2;
  }
  return s1;
}

// From the end position, returns the color corresponding to the closest root
vec3 findRootColor(vec2 p) {
  float d = 100000.;
  vec3 color = vec3(0.);

  for (int i = 0; i < ROOTS_COUNT; i++) {
    float t = length(p - vec2(rootsReal[i], rootsImag[i]));
    if (t < d) {
      d = t;
      if (i == 0) {
        color = vec3(68., 1., 81.)/255.;
      } else if (i == 1) {
        color = vec3(41., 170., 200.)/255.;
      } else if (i == 2) {
        color = vec3(94., 201., 103.)/255.;
      } else if (i == 3) {
        color = vec3(60., 82., 135.)/255.;
      } else if (i == 4) {
        color = vec3(32., 144., 138.)/255.;
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
  return color;
}

void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 p = vec2(mix(limits[0], limits[1], st.x), mix(limits[2], limits[3], st.y));

  // Newton's method
  vec2 sol = vec2(p);
  float steps = 0.;
  for (int i = 0; i < MAX_ITERATIONS; i++) {
    sol -= cdivide(f(sol), df(sol));

    float isDone = -1.;
    for (int j = 0; j < ROOTS_COUNT; j++) {
      if (length(sol - vec2(rootsReal[j], rootsImag[j])) <= .001) {
        isDone = 1.;
        break;
      }
    }

    if (isDone > 0.) {
      break;
    } else {
      steps += 1.;
    }
  }

  vec3 color = vec3(0.);
  float t = 0.;

  // Color depending on the root
  color = findRootColor(sol);

  // Distance of the final solution, good with 10 iterations
  // t = length(f(sol)) * 100.;

  // Number of steps to converge
  // float t = steps/float(MAX_ITERATIONS);

  // color = vec3(t);
  // color = mix(vec3(1., .97647, .93725), vec3(.60392, .031373, .129412), t);
  // color = mix(vec3(.000686, 0., .1454901), vec3(.984313, .784313, .5333333), t);

  // Display the function
  // vec2 res = df(p);
  // float a = (atan(res.y, res.x)/2.*3.1415)+.5;
  // color = hsb2rgb(vec3(a, 1., length(res)));

  // Draw axis lines
  float axisLine = 1. - step(.000001*resolution.x*(limits[1]-limits[0]), length(p.x));
  axisLine += 1. - step(.000001*resolution.y*(limits[3]-limits[2]), length(p.y));
  color = color * (1. - axisLine) + vec3(1., 1., 1.) * axisLine;

  gl_FragColor = vec4(color, 1.);
}