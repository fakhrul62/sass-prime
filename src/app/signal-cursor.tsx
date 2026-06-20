"use client";

import { useEffect, useRef } from "react";

const themeColors: Record<string, [number, number, number]> = {
  dark: [216, 255, 87],
  deep: [255, 103, 77],
  light: [255, 103, 77],
  blue: [7, 17, 25],
  acid: [7, 17, 25],
  coral: [7, 17, 25],
};

const vertexShader = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = 0.5 * (a_position + 1.0);
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const cursorShader = `#version 300 es
precision highp float;
in vec2 v_uv;

uniform sampler2D u_velocity;
uniform vec2 u_vector;
uniform vec2 u_cursor;
uniform vec2 u_resolution;

out vec2 FragColor;

void main() {
  float strength = 0.04;
  float radius = 0.04;
  vec2 velocity = texture(u_velocity, v_uv).rg;
  vec2 cursor = u_cursor / u_resolution;
  vec2 correction = cursor - v_uv;
  correction.x *= u_resolution.x / u_resolution.y;
  float mouse_pct = length(correction);
  float influence = exp(-mouse_pct * mouse_pct / (radius * radius));
  velocity += influence * u_vector * strength;
  FragColor = velocity;
}`;

const decayShader = `#version 300 es
precision highp float;
in vec2 v_uv;

uniform sampler2D u_previous;
uniform float u_delta;

out vec2 FragColor;

void main() {
  FragColor = texture(u_previous, v_uv).rg * (1.0 - min(0.5, u_delta / 250.0));
}`;

const displayShader = `#version 300 es
precision highp float;
in vec2 v_uv;

uniform sampler2D u_velocity;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform float u_pixel_size;

out vec4 FragColor;

float equalCell(float first, float second) {
  float difference = abs(first - second);
  return 1.0 - ceil(difference / 20.0);
}

float drawSignalPattern(vec2 rect, float opacity) {
  float x = mod(round(mod(rect.x, 1.0) * 4.0 + 1.5), 4.0);
  float y = mod(round(mod(rect.y, 1.0) * 4.0 + 0.5), 4.0);
  float progress = 1.0 / 16.0;
  float outputOpacity = 0.0;

  outputOpacity += step(1.0 - opacity, progress * 0.0) * equalCell(0.0, x) * equalCell(0.0, y);
  outputOpacity += step(1.0 - opacity, progress * 1.0) * equalCell(0.0, x) * equalCell(2.0, y);
  outputOpacity += step(1.0 - opacity, progress * 2.0) * equalCell(2.0, x) * equalCell(1.0, y);
  outputOpacity += step(1.0 - opacity, progress * 3.0) * equalCell(3.0, x) * equalCell(3.0, y);
  outputOpacity += step(1.0 - opacity, progress * 4.0) * equalCell(1.0, x) * equalCell(3.0, y);
  outputOpacity += step(1.0 - opacity, progress * 5.0) * equalCell(0.0, x) * equalCell(1.0, y);
  outputOpacity += step(1.0 - opacity, progress * 6.0) * equalCell(2.0, x) * equalCell(0.0, y);
  outputOpacity += step(1.0 - opacity, progress * 7.0) * equalCell(0.0, x) * equalCell(3.0, y);
  outputOpacity += step(1.0 - opacity, progress * 8.0) * equalCell(1.0, x) * equalCell(2.0, y);
  outputOpacity += step(1.0 - opacity, progress * 9.0) * equalCell(3.0, x) * equalCell(2.0, y);
  outputOpacity += step(1.0 - opacity, progress * 10.0) * equalCell(3.0, x) * equalCell(0.0, y);
  outputOpacity += step(1.0 - opacity, progress * 11.0) * equalCell(2.0, x) * equalCell(3.0, y);
  outputOpacity += step(1.0 - opacity, progress * 12.0) * equalCell(2.0, x) * equalCell(2.0, y);
  outputOpacity += step(1.0 - opacity, progress * 13.0) * equalCell(1.0, x) * equalCell(0.0, y);
  outputOpacity += step(1.0 - opacity, progress * 14.0) * equalCell(1.0, x) * equalCell(1.0, y);
  outputOpacity += step(1.0 - opacity, progress * 15.0) * equalCell(3.0, x) * equalCell(1.0, y);
  return min(1.0, outputOpacity);
}

void main() {
  float columns = u_resolution.x / u_pixel_size;
  float rows = u_resolution.y / u_pixel_size;
  vec2 roundedUV = vec2(
    round(v_uv.x * columns) / columns,
    round(v_uv.y * rows) / rows
  );
  vec2 velocity = texture(u_velocity, roundedUV).rg;
  float pattern = drawSignalPattern(vec2(v_uv.x * columns, v_uv.y * rows), min(1.0, length(velocity)));
  FragColor = vec4(u_color / 255.0, pattern);
}`;

type GlProgram = {
  program: WebGLProgram;
  position: number;
};

function compileProgram(gl: WebGL2RenderingContext, fragmentSource: string): GlProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexShader);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return { program, position: gl.getAttribLocation(program, "a_position") };
}

export default function SignalCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const canvas = canvasRef.current;
    const label = labelRef.current;
    const labelText = labelTextRef.current;
    if (!canvas || !label || !labelText) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;

    const cursorProgram = compileProgram(gl, cursorShader);
    const decayProgram = compileProgram(gl, decayShader);
    const displayProgram = compileProgram(gl, displayShader);
    if (!cursorProgram || !decayProgram || !displayProgram) return;

    const buffer = gl.createBuffer();
    if (!buffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    let textures: WebGLTexture[] = [];
    let framebuffers: WebGLFramebuffer[] = [];
    let readIndex = 0;
    let frame = 0;
    let fieldWidth = 1;
    let fieldHeight = 1;
    let dpr = 1;
    let lastTime = 0;
    let lastCursorTime = 0;
    let color = themeColors.dark;
    const pointer = { x: -1, y: -1, previousX: -1, previousY: -1 };
    const labelPosition = { x: -100, y: -100, targetX: -100, targetY: -100 };

    const destroyTargets = () => {
      textures.forEach((texture) => gl.deleteTexture(texture));
      framebuffers.forEach((framebuffer) => gl.deleteFramebuffer(framebuffer));
      textures = [];
      framebuffers = [];
    };

    const makeTarget = () => {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      if (!texture || !framebuffer) return null;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, fieldWidth, fieldHeight, 0, gl.RG, gl.HALF_FLOAT, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
      return { texture, framebuffer };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      fieldWidth = Math.max(1, Math.round((window.innerWidth * dpr) / 36));
      fieldHeight = Math.max(1, Math.round((window.innerHeight * dpr) / 36));
      destroyTargets();
      const first = makeTarget();
      const second = makeTarget();
      if (!first || !second) return;
      textures = [first.texture, second.texture];
      framebuffers = [first.framebuffer, second.framebuffer];
      readIndex = 0;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[0]);
      gl.viewport(0, 0, fieldWidth, fieldHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1]);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const updateTheme = () => {
      const theme = document.querySelector(".site-header")?.getAttribute("data-active-theme") || "dark";
      color = themeColors[theme] || themeColors.dark;
    };

    const bindProgram = (entry: GlProgram) => {
      gl.useProgram(entry.program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(entry.position);
      gl.vertexAttribPointer(entry.position, 2, gl.FLOAT, false, 0, 0);
    };

    const runFieldPass = (entry: GlProgram, uniforms: () => void) => {
      if (textures.length < 2) return;
      const writeIndex = 1 - readIndex;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[writeIndex]);
      gl.viewport(0, 0, fieldWidth, fieldHeight);
      bindProgram(entry);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[readIndex]);
      uniforms();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      readIndex = writeIndex;
    };

    const inject = (event: MouseEvent) => {
      if (pointer.previousX < 0 || textures.length < 2) {
        pointer.previousX = event.clientX;
        pointer.previousY = event.clientY;
        return;
      }

      const vectorX = event.clientX - pointer.previousX;
      const vectorY = pointer.previousY - event.clientY;
      pointer.x = event.clientX;
      pointer.y = window.innerHeight - event.clientY;
      pointer.previousX = event.clientX;
      pointer.previousY = event.clientY;

      runFieldPass(cursorProgram, () => {
        gl.uniform1i(gl.getUniformLocation(cursorProgram.program, "u_velocity"), 0);
        gl.uniform2f(gl.getUniformLocation(cursorProgram.program, "u_vector"), vectorX, vectorY);
        gl.uniform2f(gl.getUniformLocation(cursorProgram.program, "u_cursor"), pointer.x, pointer.y);
        gl.uniform2f(gl.getUniformLocation(cursorProgram.program, "u_resolution"), window.innerWidth, window.innerHeight);
      });
      lastCursorTime = lastTime;
    };

    const handleMouseMove = (event: MouseEvent) => {
      labelPosition.targetX = event.clientX;
      labelPosition.targetY = event.clientY;
      inject(event);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-label]");
      if (!target) return;
      labelText.textContent = `[ ${target.dataset.cursorLabel || ""} ]`;
      label.classList.add("is-visible");
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor-label]");
      const related = (event.relatedTarget as HTMLElement | null)?.closest?.("[data-cursor-label]");
      if (target && target !== related) label.classList.remove("is-visible");
    };

    const render = (time: number) => {
      const delta = lastTime ? time - lastTime : 0;
      if (lastTime - lastCursorTime < 1500 && textures.length === 2) {
        runFieldPass(decayProgram, () => {
          gl.uniform1i(gl.getUniformLocation(decayProgram.program, "u_previous"), 0);
          gl.uniform1f(gl.getUniformLocation(decayProgram.program, "u_delta"), delta);
        });
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      bindProgram(displayProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[readIndex] || null);
      gl.uniform1i(gl.getUniformLocation(displayProgram.program, "u_velocity"), 0);
      gl.uniform2f(gl.getUniformLocation(displayProgram.program, "u_resolution"), canvas.width, canvas.height);
      gl.uniform3f(gl.getUniformLocation(displayProgram.program, "u_color"), color[0], color[1], color[2]);
      gl.uniform1f(gl.getUniformLocation(displayProgram.program, "u_pixel_size"), 8 * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.disable(gl.BLEND);

      labelPosition.x += (labelPosition.targetX - labelPosition.x) * 0.16;
      labelPosition.y += (labelPosition.targetY - labelPosition.y) * 0.16;
      const rect = label.getBoundingClientRect();
      const offsetX = labelPosition.x + rect.width + 18 > window.innerWidth ? -rect.width - 12 : 14;
      const offsetY = labelPosition.y + rect.height + 18 > window.innerHeight ? -rect.height - 12 : 14;
      label.style.transform = `translate3d(${labelPosition.x + offsetX}px, ${labelPosition.y + offsetY}px, 0)`;

      if (pointer.previousX >= 0) {
        const normalizedX = ((pointer.previousX / window.innerWidth) - 0.5) * 2;
        const normalizedY = ((pointer.previousY / window.innerHeight) - 0.5) * 2;
        document.documentElement.style.setProperty("--pointer-x", normalizedX.toFixed(4));
        document.documentElement.style.setProperty("--pointer-y", normalizedY.toFixed(4));
      }

      lastTime = time;
      frame = window.requestAnimationFrame(render);
    };

    const header = document.querySelector(".site-header");
    const themeObserver = header ? new MutationObserver(updateTheme) : null;
    if (header && themeObserver) {
      themeObserver.observe(header, { attributes: true, attributeFilter: ["data-active-theme"] });
    }

    resize();
    updateTheme();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      themeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      destroyTargets();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(cursorProgram.program);
      gl.deleteProgram(decayProgram.program);
      gl.deleteProgram(displayProgram.program);
      document.documentElement.style.removeProperty("--pointer-x");
      document.documentElement.style.removeProperty("--pointer-y");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="signal-cursor-canvas" aria-hidden="true" />
      <div ref={labelRef} className="signal-cursor-label" aria-hidden="true">
        <span ref={labelTextRef}>[ Signal ]</span>
      </div>
    </>
  );
}
