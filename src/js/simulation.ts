import * as twgl from 'twgl.js';
import { Controller, Quality } from './controls';
import { MouseListener } from './events';

// Load shaders
const vert = require('../shaders/shader.vert');
const frag = require('../shaders/shader.frag');

const RESOLUTION_FACTOR_HIGH = 1;
const RESOLUTION_FACTOR_MEDIUM = 1.4;
const RESOLUTION_FACTOR_LOW = 3;

function resolutionFactor(controller: Controller) {
  return {
    [Quality.LOW]: RESOLUTION_FACTOR_LOW,
    [Quality.MEDIUM]: RESOLUTION_FACTOR_MEDIUM,
    [Quality.HIGH]: RESOLUTION_FACTOR_HIGH,
  }[controller.quality];
}

export function initSimulation(listener: MouseListener, controller: Controller) {
  // WebGL init
  const gl = document.querySelector<HTMLCanvasElement>("#c").getContext("webgl");
  twgl.resizeCanvasToDisplaySize(gl.canvas as any);
  gl.canvas.width /= resolutionFactor(controller);
  gl.canvas.height /= resolutionFactor(controller);

  if (!gl.getExtension('OES_texture_float')) {
      console.error('no floating point texture support');
      return;
  }
  gl.getExtension('OES_texture_float_linear');

  // Programs init
  const prog = twgl.createProgramInfo(gl, [vert.sourceCode, frag.sourceCode]);
  
  // Vertex shader stuff
  const arrays = {position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]};
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  
  console.log(`resolution: ${gl.canvas.width} ${gl.canvas.height}`);

  listener.onMouseDrag((point, force) => {
  });
  listener.onMouseDragStop(() => {
  });

  let lastTime = Date.now() / 1000;
  let i = 0;

  controller.onChangeQuality(() => initSimulation(listener, controller));

  function render(time: number) {
    const now = time / 1000;
    const dt = (now - lastTime) * 1;
    lastTime = now;

    // Resize canvas and textures
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as any)) {
      gl.canvas.width /= resolutionFactor(controller);
      gl.canvas.height /= resolutionFactor(controller);    
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    const uniforms = {
      [frag.uniforms.resolution.variableName]: [gl.canvas.width, gl.canvas.height],
    };
    

    renderToTexture(gl, prog, null, bufferInfo, uniforms);

    i++;
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);
}

/**
 * Runs a WebGL program with a GLSL shader to generate a texture.
 * 
 * @param gl Current WebGL context
 * @param programInfo The program linked to the shaders to use
 * @param framebuffer The framebuffer linked to the texture on which to render. If null, renders to the canvas.
 * @param bufferInfo The buffer info used with the vertex shader
 * @param uniforms The uniforms used in the fragment shader
 */
function renderToTexture(gl: WebGLRenderingContext, programInfo: twgl.ProgramInfo, framebuffer: twgl.FramebufferInfo|null, bufferInfo: twgl.BufferInfo, uniforms: any) {
  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

  twgl.bindFramebufferInfo(gl, framebuffer);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
}