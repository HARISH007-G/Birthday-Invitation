import React, {
  useEffect,
  useRef,
  forwardRef,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

// --- WebGL Shaders & Constants ---
const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) {
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) {
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
    (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
    (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  v_responsiveBoxGivenSize = vec2(
    (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
    (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
    (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
    (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  v_patternUV *= .01;

  vec2 imageBoxSize;
  if (u_fit == 1.) {
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) {
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}
`;

const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;
const proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`;
const proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;
const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const ditheringFragmentShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

uniform float u_pxSize;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = .5 * snoise(uv - vec2(0., .3 * t));
  noise += .5 * snoise(2. * uv + vec2(0., .32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float t = .5 * u_time;
  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec2 shapeUV = normalizedUV;

  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * PI / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 boxSize = vec2(
    (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
    (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  
  if (u_shape > 3.5) {
    vec2 objectBoxSize = vec2(0.);
    objectBoxSize.x = min(boxSize.x, boxSize.y);
    if (u_fit == 1.) {
      objectBoxSize.x = min(u_resolution.x, u_resolution.y);
    } else if (u_fit == 2.) {
      objectBoxSize.x = max(u_resolution.x, u_resolution.y);
    }
    objectBoxSize.y = objectBoxSize.x;
    vec2 objectWorldScale = u_resolution.xy / objectBoxSize;

    shapeUV *= objectWorldScale;
    shapeUV += boxOrigin * (objectWorldScale - 1.);
    shapeUV += vec2(-u_offsetX, u_offsetY);
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
  } else {
    vec2 patternBoxSize = vec2(0.);
    patternBoxSize.x = patternBoxRatio * min(boxSize.x / patternBoxRatio, boxSize.y);
    float patternWorldNoFitBoxWidth = patternBoxSize.x;
    if (u_fit == 1.) {
      patternBoxSize.x = patternBoxRatio * min(u_resolution.x / patternBoxRatio, u_resolution.y);
    } else if (u_fit == 2.) {
      patternBoxSize.x = patternBoxRatio * max(u_resolution.x / patternBoxRatio, u_resolution.y);
    }
    patternBoxSize.y = patternBoxSize.x / patternBoxRatio;
    vec2 patternWorldScale = u_resolution.xy / patternBoxSize;

    shapeUV += vec2(-u_offsetX, u_offsetY) / patternWorldScale;
    shapeUV += boxOrigin;
    shapeUV -= boxOrigin / patternWorldScale;
    shapeUV *= u_resolution.xy;
    shapeUV /= u_pixelRatio;
    if (u_fit > 0.) {
      shapeUV *= (patternWorldNoFitBoxWidth / patternBoxSize.x);
    }
    shapeUV /= u_scale;
    shapeUV = graphicRotation * shapeUV;
    shapeUV += boxOrigin / patternWorldScale;
    shapeUV -= boxOrigin;
    shapeUV += .5;
  }

  float shape = 0.;
  if (u_shape < 1.5) {
    shapeUV *= .001;
    shape = 0.5 + 0.5 * getSimplexNoise(shapeUV, t);
    shape = smoothstep(0.3, 0.9, shape);
  } else if (u_shape < 2.5) {
    shapeUV *= .003;
    for (float i = 1.0; i < 6.0; i++) {
      shapeUV.x += 0.6 / i * cos(i * 2.5 * shapeUV.y + t);
      shapeUV.y += 0.6 / i * cos(i * 1.5 * shapeUV.x + t);
    }
    shape = .15 / max(0.001, abs(sin(t - shapeUV.y - shapeUV.x)));
    shape = smoothstep(0.02, 1., shape);
  } else if (u_shape < 3.5) {
    shapeUV *= .05;
    float stripeIdx = floor(2. * shapeUV.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.);
    rand = sign(rand - .5) * pow(.1 + abs(rand), .4);
    shape = sin(shapeUV.x) * cos(shapeUV.y - 5. * rand * t);
    shape = pow(abs(shape), 6.);
  } else if (u_shape < 4.5) {
    shapeUV *= 4.;
    float wave = cos(.5 * shapeUV.x - 2. * t) * sin(1.5 * shapeUV.x + t) * (.75 + .25 * cos(3. * t));
    shape = 1. - smoothstep(-1., 1., shapeUV.y + wave);
  } else if (u_shape < 5.5) {
    float dist = length(shapeUV);
    shape = sin(pow(dist, 1.7) * 7. - 3. * t) * .5 + .5;
  } else if (u_shape < 6.5) {
    float l = length(shapeUV);
    float angle = 6. * atan(shapeUV.y, shapeUV.x) + 4. * t;
    float twist = 1.2;
    float offset = 1. / pow(max(l, 1e-6), twist) + angle / TWO_PI;
    float mid = smoothstep(0., 1., pow(l, twist));
    shape = mix(0., fract(offset), mid);
  } else {
    shapeUV *= 2.;
    float d = 1. - pow(length(shapeUV), 2.);
    vec3 pos = vec3(shapeUV, sqrt(max(0., d)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }

  int type = int(floor(u_type));
  float dithering = 0.0;
  switch (type) {
    case 1:
      dithering = step(hash21(ditheringNoiseUV), shape);
      break;
    case 2:
      dithering = getBayerValue(pxSizeUV, 2);
      break;
    case 3:
      dithering = getBayerValue(pxSizeUV, 4);
      break;
    default:
      dithering = getBayerValue(pxSizeUV, 8);
      break;
  }

  dithering -= .5;
  float res = step(.5, shape + dithering);

  vec3 fgColor = u_colorFront.rgb * u_colorFront.a;
  float fgOpacity = u_colorFront.a;
  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  float bgOpacity = u_colorBack.a;

  vec3 color = fgColor * res;
  float opacity = fgOpacity * res;
  color += bgColor * (1. - opacity);
  opacity += bgOpacity * (1. - opacity);

  fragColor = vec4(color, opacity);
}
`;

const DitheringShapes: Record<string, number> = {
  simplex: 1,
  warp: 2,
  dots: 3,
  wave: 4,
  ripple: 5,
  swirl: 6,
  sphere: 7,
};
const DitheringTypes: Record<string, number> = {
  random: 1,
  "2x2": 2,
  "4x4": 3,
  "8x8": 4,
};

function hexToRgba(hex: string): [number, number, number, number] {
  let cleanHex = hex.replace(/^#/, "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  if (cleanHex.length === 6) {
    cleanHex = cleanHex + "ff";
  }
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const a = parseInt(cleanHex.slice(6, 8), 16) / 255;
  return [r, g, b, a];
}

function getShaderColorFromString(colorString: string | number[]): number[] {
  if (Array.isArray(colorString)) {
    if (colorString.length === 4) return colorString;
    if (colorString.length === 3) return [...colorString, 1];
    return [0, 0, 0, 1];
  }
  if (typeof colorString !== "string") return [0, 0, 0, 1];
  if (colorString.startsWith("#")) {
    return hexToRgba(colorString);
  }
  return [0.96, 0.77, 0.36, 1];
}

class ShaderMount {
  parentElement: HTMLElement;
  canvasElement: HTMLCanvasElement;
  gl: WebGL2RenderingContext | null = null;
  program: WebGLProgram | null = null;
  uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  fragmentShader: string;
  rafId: number | null = null;
  lastRenderTime = 0;
  currentFrame = 0;
  speed = 0;
  currentSpeed = 0;
  providedUniforms: Record<string, any>;
  hasBeenDisposed = false;
  resolutionChanged = true;

  constructor(
    parentElement: HTMLElement,
    fragmentShader: string,
    uniforms: Record<string, any>,
    speed = 0.3,
  ) {
    this.parentElement = parentElement;
    this.canvasElement = document.createElement("canvas");
    this.canvasElement.style.position = "absolute";
    this.canvasElement.style.inset = "0";
    this.canvasElement.style.width = "100%";
    this.canvasElement.style.height = "100%";
    this.canvasElement.style.pointerEvents = "none";
    this.parentElement.prepend(this.canvasElement);

    this.fragmentShader = fragmentShader;
    this.providedUniforms = uniforms;
    this.speed = speed;
    this.currentSpeed = speed;

    try {
      this.gl = this.canvasElement.getContext("webgl2", { alpha: true });
    } catch {
      this.gl = null;
    }

    if (this.gl) {
      this.initProgram();
      this.setupPositionAttribute();
      this.setupUniforms();
      this.setUniformValues(this.providedUniforms);
      this.handleResize();
      this.requestRender();
    }
  }

  initProgram() {
    if (!this.gl) return;
    const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    this.gl.shaderSource(vs, vertexShaderSource);
    this.gl.compileShader(vs);
    this.gl.shaderSource(fs, this.fragmentShader);
    this.gl.compileShader(fs);

    this.program = this.gl.createProgram();
    if (!this.program) return;
    this.gl.attachShader(this.program, vs);
    this.gl.attachShader(this.program, fs);
    this.gl.linkProgram(this.program);
  }

  setupPositionAttribute() {
    if (!this.gl || !this.program) return;
    const posLoc = this.gl.getAttribLocation(this.program, "a_position");
    const buf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(posLoc);
    this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);
  }

  setupUniforms() {
    if (!this.gl || !this.program) return;
    const locs: Record<string, WebGLUniformLocation | null> = {
      u_time: this.gl.getUniformLocation(this.program, "u_time"),
      u_pixelRatio: this.gl.getUniformLocation(this.program, "u_pixelRatio"),
      u_resolution: this.gl.getUniformLocation(this.program, "u_resolution"),
    };
    Object.keys(this.providedUniforms).forEach((key) => {
      locs[key] = this.gl!.getUniformLocation(this.program!, key);
    });
    this.uniformLocations = locs;
  }

  setUniformValues(uniforms: Record<string, any>) {
    if (!this.gl || !this.program) return;
    this.gl.useProgram(this.program);
    Object.entries(uniforms).forEach(([key, val]) => {
      const loc = this.uniformLocations[key];
      if (!loc) return;
      if (Array.isArray(val)) {
        if (val.length === 2) this.gl!.uniform2fv(loc, val);
        else if (val.length === 4) this.gl!.uniform4fv(loc, val);
      } else if (typeof val === "number") {
        this.gl!.uniform1f(loc, val);
      }
    });
  }

  handleResize = () => {
    if (!this.gl || !this.parentElement) return;
    const rect = this.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (w > 0 && h > 0) {
      this.canvasElement.width = w;
      this.canvasElement.height = h;
      this.gl.viewport(0, 0, w, h);
      this.resolutionChanged = true;
    }
  };

  render = (currentTime: number) => {
    if (this.hasBeenDisposed || !this.gl || !this.program) return;
    const dt = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;
    if (this.currentSpeed !== 0) {
      this.currentFrame += dt * this.currentSpeed;
    }
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uniformLocations.u_time, this.currentFrame * 1e-3);
    if (this.resolutionChanged) {
      this.gl.uniform2f(this.uniformLocations.u_resolution, this.canvasElement.width, this.canvasElement.height);
      this.gl.uniform1f(this.uniformLocations.u_pixelRatio, 1);
      this.resolutionChanged = false;
    }
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    if (this.currentSpeed !== 0) {
      this.requestRender();
    }
  };

  requestRender() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.render);
  }

  dispose() {
    this.hasBeenDisposed = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
    this.canvasElement.remove();
  }
}

// --- Dithering React Component ---
const Dithering = forwardRef<HTMLDivElement, any>(function DitheringImpl(
  {
    speed = 0.3,
    colorBack = "#f5c65d",
    colorFront = "#f3a187",
    shape = "warp",
    type = "4x4",
    size = 1.2,
    scale = 1.2,
    rotation = 15,
    offsetX = 0,
    offsetY = 0,
    style,
    className,
    ...props
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<ShaderMount | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const uniforms = {
      u_colorBack: getShaderColorFromString(colorBack),
      u_colorFront: getShaderColorFromString(colorFront),
      u_shape: DitheringShapes[shape] || 2,
      u_type: DitheringTypes[type] || 3,
      u_pxSize: size,
      u_fit: 0,
      u_scale: scale,
      u_rotation: rotation,
      u_offsetX: offsetX,
      u_offsetY: offsetY,
      u_originX: 0.5,
      u_originY: 0.5,
      u_worldWidth: 0,
      u_worldHeight: 0,
    };

    mountRef.current = new ShaderMount(el, ditheringFragmentShader, uniforms, speed);

    const ro = new ResizeObserver(() => mountRef.current?.handleResize());
    ro.observe(el);

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && mountRef.current?.rafId) {
        cancelAnimationFrame(mountRef.current.rafId);
        mountRef.current.rafId = null;
      } else if (entry.isIntersecting && mountRef.current && !mountRef.current.rafId) {
        mountRef.current.requestRender();
      }
    }, { threshold: 0.05 });
    io.observe(el);

    return () => {
      io.disconnect();
      ro.disconnect();
      mountRef.current?.dispose();
      mountRef.current = null;
    };
  }, [colorBack, colorFront, shape, type, size, scale, rotation, offsetX, offsetY, speed]);

  return (
    <div
      ref={(instance) => {
        containerRef.current = instance;
        if (typeof ref === "function") ref(instance);
        else if (ref) ref.current = instance;
      }}
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}
      {...props}
    />
  );
});

// --- Ticket Geometry & Layout ---
export const REF = 741;
export const TICKET_GEOMETRY = {
  aspect: 741 / 425,
  cornerRadius: 25 / REF,
  notchRadius: 21 / REF,
  perforation: 562 / REF,
};

export const TICKET_LAYOUT = {
  padding: 44 / REF,
  watermarkSize: 130 / REF,
  watermarkOpacity: 0.22,
  watermarkColor: "#ffffff",
  inkColor: "#49362d", // Warm deep birthday brown
};

export const TICKET_TEXTURE = {
  engine: "generative",
  colorBack: "#f5c65d",     // Sunshine Gold
  colorFront: "#f3a187",    // Warm Peach
  shape: "warp",
  type: "4x4",
  size: 1.2,
  scale: 1.3,
  rotation: 15,
  offsetX: 0,
  offsetY: 0,
  speed: 0.35,
};

export function ticketClipPath(width: number, height: number, geometry = TICKET_GEOMETRY) {
  const r = geometry.cornerRadius * width;
  const n = geometry.notchRadius * width;
  const p = geometry.perforation * width;
  return [
    `M ${r} 0`,
    `L ${p - n} 0`,
    `A ${n} ${n} 0 0 0 ${p + n} 0`,
    `L ${width - r} 0`,
    `A ${r} ${r} 0 0 0 ${width} ${r}`,
    `L ${width} ${height - r}`,
    `A ${r} ${r} 0 0 0 ${width - r} ${height}`,
    `L ${p + n} ${height}`,
    `A ${n} ${n} 0 0 0 ${p - n} ${height}`,
    `L ${r} ${height}`,
    `A ${r} ${r} 0 0 0 0 ${height - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 0 ${r} 0`,
    "Z",
  ].join(" ");
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  );
}

// --- Audio Shutter Sound ---
let audioCtx: AudioContext | null = null;
export function playShutterSound({ volume = 0.35, gap = 0.045 } = {}) {
  try {
    const Ctor = typeof window !== "undefined" ? window.AudioContext || (window as any).webkitAudioContext : null;
    if (!Ctor) return;
    audioCtx = audioCtx || new Ctor();
    if (audioCtx.state === "suspended") void audioCtx.resume();
    const now = audioCtx.currentTime;

    const burst = (ctx: AudioContext, at: number, opts: { gain: number; decay: number; frequency: number; q: number }) => {
      const length = Math.ceil(0.05 * ctx.sampleRate);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = opts.frequency;
      filter.Q.value = opts.q;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(opts.gain, at + 1e-3);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + opts.decay);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(at);
      source.stop(at + opts.decay + 0.02);
    };

    burst(audioCtx, now, { gain: volume, decay: 0.035, frequency: 3200, q: 1.1 });
    burst(audioCtx, now + gap, { gain: volume * 0.75, decay: 0.055, frequency: 1800, q: 0.9 });
  } catch {
    // AudioContext blocked or not supported
  }
}

// --- TicketCard Component ---
export interface TicketCardProps {
  name: string;
  presenter: string;
  event: string;
  venue: string;
  dates: string;
  time?: string;
  cakeCutting?: string;
  dressCode?: string;
  qrCodeUrl?: string;
  passId?: string;
  stubText: string;
  watermark: string;
  width?: number;
  geometry?: typeof TICKET_GEOMETRY;
  layout?: typeof TICKET_LAYOUT;
  texture?: typeof TICKET_TEXTURE;
  className?: string;
}

export function TicketCard({
  name,
  presenter,
  event,
  venue,
  dates,
  time = "6:00 PM (Cake cutting 7:00 PM)",
  dressCode = "Pastel Colors",
  qrCodeUrl,
  passId = "#YSH-2026",
  stubText = "VIP PASS",
  watermark = "2026",
  width = REF,
  geometry = TICKET_GEOMETRY,
  layout = TICKET_LAYOUT,
  texture = TICKET_TEXTURE,
  className = "",
}: TicketCardProps) {
  const height = width / geometry.aspect;
  const perfX = geometry.perforation * width;
  const reduced = usePrefersReducedMotion();

  const shaderStyle = {
    position: "absolute" as const,
    inset: 0,
    width,
    height,
  };

  const stubWidth = width - perfX;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width,
        height,
        clipPath: `path('${ticketClipPath(width, height, geometry)}')`,
      }}
    >
      {/* Background Dithering Generative WebGL Shader */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5c65d] via-[#f3a187] to-[#f5d6d0]" />
      <Dithering
        colorBack={texture.colorBack}
        colorFront={texture.colorFront}
        shape={texture.shape}
        type={texture.type}
        size={texture.size}
        scale={texture.scale}
        rotation={texture.rotation}
        offsetX={texture.offsetX}
        offsetY={texture.offsetY}
        speed={reduced ? 0 : texture.speed}
        style={shaderStyle}
      />

      {/* Perforation Dotted Line */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: perfX,
          width: Math.max(1.5, 0.0022 * width),
          backgroundImage: `repeating-linear-gradient(to bottom, ${layout.inkColor}55 0 ${0.012 * width}px, transparent ${0.012 * width}px ${0.024 * width}px)`,
        }}
      />

      {/* Watermark in Stub */}
      <div
        className="pointer-events-none absolute grid place-items-center font-black tabular-nums"
        style={{
          left: perfX,
          top: 0,
          width: stubWidth,
          height,
          color: layout.watermarkColor,
          opacity: layout.watermarkOpacity,
        }}
      >
        <span
          style={{
            writingMode: "vertical-rl",
            fontSize: layout.watermarkSize * width,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          {watermark}
        </span>
      </div>

      {/* Stub Vertical VIP Pass Text */}
      <div
        className="absolute grid place-items-center font-black whitespace-nowrap uppercase tracking-widest pointer-events-none"
        style={{
          left: perfX,
          top: 0,
          width: stubWidth,
          height,
          color: layout.inkColor,
          fontSize: Math.max(12, 0.048 * width),
          opacity: 0.9,
        }}
      >
        <span style={{ writingMode: "vertical-rl" }}>{stubText}</span>
      </div>

      {/* Main Ticket Details Content Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-5 md:p-6"
        style={{
          color: layout.inkColor,
          width: perfX,
        }}
      >
        {/* Top Header: Presenter + Pass ID + Event Title */}
        <div>
          <div className="flex items-center justify-between gap-1 text-[8px] sm:text-xs font-black uppercase tracking-wider text-[#49362d]/85 min-w-0">
            <span className="truncate">{presenter}</span>
            <span className="font-mono text-[8px] sm:text-[11px] bg-white/70 px-1.5 sm:px-2 py-0.5 rounded-full border border-white shadow-2xs shrink-0">
              {passId}
            </span>
          </div>
          <h3 className="font-serif font-black text-[11px] sm:text-lg md:text-xl text-[#49362d] uppercase tracking-tight mt-0.5 truncate">
            {event}
          </h3>
        </div>

        {/* Center: Guest Name (Guest of Honor) */}
        <div className="my-auto py-1 min-w-0">
          <span className="text-[8px] sm:text-[11px] font-black uppercase tracking-widest text-[#f3a187] block mb-0.5 truncate">
            ✦ GUEST OF HONOR ✦
          </span>
          <div className="font-serif font-black text-sm sm:text-2xl md:text-3xl text-[#49362d] uppercase tracking-tight leading-tight line-clamp-1 drop-shadow-xs">
            {name}
          </div>
        </div>

        {/* Bottom Highlights & QR Code Box */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 bg-white/85 backdrop-blur-xs p-1.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/90 shadow-xs min-w-0">
          {/* Details Column */}
          <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1 text-[8px] sm:text-[11px] md:text-xs font-extrabold text-[#49362d]">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="shrink-0">🗓️</span>
              <span className="truncate">{dates}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="shrink-0">⏰</span>
              <span className="truncate">{time}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="shrink-0">📍</span>
              <span className="truncate">{venue}</span>
            </div>
            {dressCode && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-[#f3a187] min-w-0">
                <span className="shrink-0">🎨</span>
                <span className="truncate">Dress Code: {dressCode}</span>
              </div>
            )}
          </div>

          {/* Scannable Location QR Code */}
          {qrCodeUrl && (
            <div className="flex flex-col items-center bg-white p-1 sm:p-1.5 rounded-lg border border-gray-200 shadow-2xs shrink-0">
              <div className="w-8 h-8 sm:w-14 sm:h-14 flex items-center justify-center bg-white overflow-hidden">
                <img
                  src={qrCodeUrl}
                  alt="Venue Google Maps QR Code"
                  className="w-full h-full object-contain"
                  style={{ borderRadius: 0 }}
                  draggable={false}
                />
              </div>
              <span className="text-[6px] sm:text-[9px] font-black text-[#49362d] mt-0.5 whitespace-nowrap">
                Scan Map 📍
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- TiltCard with 3D Specular Light Glare ---
export function TiltCard({
  children,
  clipPath,
  maxTilt = 8,
  scale = 1.02,
  glare = 0.22,
  className = "",
}: {
  children: React.ReactNode;
  clipPath?: string;
  maxTilt?: number;
  scale?: number;
  glare?: number;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "touch") return; // Disable tilt on touch to allow normal scroll
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${-(dy * 2) * maxTilt}deg) rotateY(${dx * 2 * maxTilt}deg) scale(${scale})`;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(45% 60% at ${(dx + 0.5) * 100}% ${(dy + 0.5) * 100}%, rgba(255,255,255,${glare}) 0%, rgba(255,255,255,0) 70%)`;
      }
    },
    [maxTilt, scale, glare]
  );

  const onLeave = useCallback(() => {
    setHovering(false);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    if (glareRef.current) {
      glareRef.current.style.background = "transparent";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerEnter={(e) => e.pointerType !== "touch" && setHovering(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      className={`relative w-fit will-change-transform ${className}`}
      style={{
        transition: hovering ? "none" : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
        transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {glare > 0 && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            clipPath,
            transition: hovering ? "none" : "background 420ms ease-out",
          }}
        />
      )}
    </div>
  );
}

// --- AdmitOneTicket Main Component ---
export function AdmitOneTicket({
  tilt,
  ...props
}: TicketCardProps & { tilt?: any }) {
  const width = props.width ?? REF;
  const geometry = props.geometry ?? TICKET_GEOMETRY;

  if (tilt === false) return <TicketCard {...props} />;

  return (
    <TiltCard
      clipPath={`path('${ticketClipPath(width, width / geometry.aspect, geometry)}')`}
      {...tilt}
    >
      <TicketCard {...props} />
    </TiltCard>
  );
}

export default AdmitOneTicket;
