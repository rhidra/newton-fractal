import * as twgl from 'twgl.js';
import { Controller, Quality } from './controls';
import { MouseListener } from './events';
import { Graph } from './graph';
import { distance } from './utils';

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

// Render type map in the shader
const renderType = {
  'root': 0,
  'distance': 1,
  'steps1': 2,
  'steps2': 3,
  'steps3': 4,
  'function': 5,
};

const graph = new Graph();

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
  
  // Vertex shader stuff
  const arrays = {position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]};
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  // Init graph data
  graph.adaptDimensions(gl.canvas.width, gl.canvas.height, resolutionFactor(controller));
  
  console.log(`resolution: ${gl.canvas.width} ${gl.canvas.height}`);

  // Dragging system (graph + root dragging)
  let isDragging: false|'graph'|number = false;
  listener.onMouseDrag((point, force) => {
    if (isDragging === false) {
      // Find what the user is dragging (a root or the graph)
      const h = gl.canvas.height * resolutionFactor(controller);
      point = [point[0] * h, (1 - point[1]) * h];
      for (let i = 0; i < graph.rootsCount; ++i) {
        if (distance(point, graph.convertGraph2Page(graph.roots[i].vec)) < 40) {
          isDragging = i;
          break;
        }
      }

      if (isDragging === false) {
        isDragging = 'graph';
      }
    }

    if (isDragging === 'graph') {
      graph.moveGraphAlong(force);
    } else {
      graph.moveRoot(isDragging, force);
    }
  });
  listener.onMouseDragStop(() => isDragging = false);
  listener.onMouseScroll(dy => graph.zoomGraph(dy/-114));

  let updateShaders = true;
  let prog: twgl.ProgramInfo;

  controller.onChangeQuality(() => initSimulation(listener, controller));
  controller.onChangeIterations(() => updateShaders = true);
  controller.onChangeRenderType(() => updateShaders = true);
  controller.onAddRoot(() => {
    graph.addRoot();
    updateShaders = true;
  });
  controller.onRemoveRoot(() => {
    graph.removeRoot();
    updateShaders = true;
  });

  function render(time: number) {
    // Programs/Shaders setup
    if (updateShaders) {
      updateShaders = false;
      
      const src = frag.sourceCode
        .replace(frag.consts.ROOTS_COUNT.variableName, graph.rootsCount)
        .replace(frag.consts.RENDER_TYPE.variableName, renderType[controller.renderType])
        .replace(frag.consts.MAX_ITERATIONS.variableName, controller.iterations);
      prog = twgl.createProgramInfo(gl, [vert.sourceCode, src]);
    }

    // Resize canvas and textures
    if (twgl.resizeCanvasToDisplaySize(gl.canvas as any)) {
      gl.canvas.width /= resolutionFactor(controller);
      gl.canvas.height /= resolutionFactor(controller);    
      graph.adaptDimensions(gl.canvas.width, gl.canvas.height, resolutionFactor(controller));
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    const uniforms = {
      [frag.uniforms.resolution.variableName]: [gl.canvas.width, gl.canvas.height],
      [frag.uniforms.limits.variableName]: [graph.minX, graph.maxX, graph.minY, graph.maxY],
      [frag.uniforms.rootsReal.variableName]: graph.getRealRoots(),
      [frag.uniforms.rootsImag.variableName]: graph.getImagRoots(),
    };
    
    renderToTexture(gl, prog, null, bufferInfo, uniforms);

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