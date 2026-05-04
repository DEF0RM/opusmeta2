'use client';
import React, { useEffect, useRef } from 'react';

// @ts-nocheck
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import GUI from 'lil-gui';
import Stats from 'stats.js';


export default function TorusScene({ 
    shouldManifest = true,
    debug = false
}: { 
    shouldManifest?: boolean,
    debug?: boolean
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        let isDestroyed = false;

        // Detailed Performance Monitor Setup
        let perfMonitor: HTMLDivElement | null = null;
        let perfFps: HTMLElement | null = null;
        let perfMs: HTMLElement | null = null;
        let perfCalls: HTMLElement | null = null;
        let perfTriangles: HTMLElement | null = null;
        let perfGeometries: HTMLElement | null = null;
        let perfTextures: HTMLElement | null = null;

        if (debug) {
            perfMonitor = document.createElement('div');
            perfMonitor.id = 'perf-monitor';
            perfMonitor.innerHTML = `
                <div class="perf-header">Detailed Performance</div>
                <div class="perf-grid">
                    <div class="perf-item"><span class="perf-label">FPS</span><span class="perf-value" id="perf-fps">0</span></div>
                    <div class="perf-item"><span class="perf-label">Frame Time</span><span class="perf-value" id="perf-ms">0 ms</span></div>
                    <div class="perf-item"><span class="perf-label">Draw Calls</span><span class="perf-value" id="perf-calls">0</span></div>
                    <div class="perf-item"><span class="perf-label">Triangles</span><span class="perf-value" id="perf-triangles">0</span></div>
                    <div class="perf-item"><span class="perf-label">Geometries</span><span class="perf-value" id="perf-geometries">0</span></div>
                    <div class="perf-item"><span class="perf-label">Textures</span><span class="perf-value" id="perf-textures">0</span></div>
                </div>
            `;
            document.body.appendChild(perfMonitor);

            perfFps = document.getElementById('perf-fps');
            perfMs = document.getElementById('perf-ms');
            perfCalls = document.getElementById('perf-calls');
            perfTriangles = document.getElementById('perf-triangles');
            perfGeometries = document.getElementById('perf-geometries');
            perfTextures = document.getElementById('perf-textures');
        }

// Mobile Detection
const isMobile = window.innerWidth <= 768 || navigator.hardwareConcurrency <= 4;

const params = {
    togglePerformanceGraph: () => {},
    lineColor: '#a8a8a8',
    glowColor: '#1a49ff',
    glowColor2: '#84E0F7',
    cursorLightColor: '#84E0F7',
    cursorBloomMult: 2.0,
    bottomBloomMult: 0.46,
    gradientSpread: 0.728,
    gradientShift: -0.094,
    initialLightX: 0.0,
    initialLightY: -1.36,
    initialLightZ: 0.29,
    bottomLightRadius: 2.1889,
    bottomLightIntensity: 1.7467,
    bottomLightScaleX: 1.0,
    bottomLightScaleY: 0.198,
    bottomLightScaleZ: 0.1,
    bottomLightDiskRadius: 2.6777,
    bottomLightInnerFill: 1.0,
    bottomLightAnimEnabled: true,
    bottomLightAnimSpeed: 0.5,
    bottomLightAnimAmp: 0.1,

    // --- Solid Lens Flare ---
    flareEnabled: true,

    // Ring (outer halo)
    ringColor: '#ffffff',
    ringOpacity: 0.022,
    ringRadius: 3.1492,
    ringThickness: 0.2595,
    ringIntensity: 1.891,
    ringXOffset: 0.11,
    ringYOffset: -1.38,
    ringZOffset: -0.01999,
    ringScaleX: 0.9428,
    ringScaleY: 0.9428,

    // Ring 2 (second outer halo)
    ring2Enabled: true,
    ring2Color: '#0364bf',
    ring2Opacity: 0.036,
    ring2Radius: 2.476,
    ring2Thickness: 1.07287,
    ring2Intensity: 23.0931,
    ring2XOffset: 0.0,
    ring2ZOffset: 0.0,
    ring2ScaleX: 1.0,
    ring2ScaleY: 1.0,

    // Glow (inner center flare)
    glowFlareColor: '#0aadff',
    glowFlareOpacity: 0.28,
    glowFlareRadius: 3.4165,
    glowFlareIntensity: 7.3567,
    glowFlareXOffset: -2.06,
    glowFlareYOffset: -3.55,
    glowFlareZOffset: 0.11,
    glowFlareScaleX: 0.4773,
    glowFlareScaleY: 1.3397,
    glowFlareAnimEnabled: true,
    glowFlareAnimWobbleSpeed: 1.0,
    glowFlareAnimWobbleAmp: 0.06,
    glowFlareAnimPulseSpeed: 2.0,
    glowFlareAnimPulseAmp: 0.05,

    // --- Localized Glow Zone ---
    localGlowEnabled: true,
    localGlowX: -2.22,
    localGlowY: -1.2,
    localGlowZ: -0.44,
    localGlowScaleX: 0.6841,
    localGlowScaleY: 0.8029,
    localGlowScaleZ: 1.9414,
    localGlowRadius: 1.7716,
    localGlowIntensity: 15,
    localGlowBloomMult: 2.49,
    localGlowColor: '#539eee',
    localGlowAnimEnabled: true,
    localGlowAnimSpeed: 0.5,
    localGlowAnimAmp: 0.2,

    gradientOffsetX: 0.0,
    gradientOffsetY: 0.0,
    gradientOffsetZ: 0.0,
    cameraZ: 4.19,
    rotationXBase: 0.263893,
    rotationXMouse: 0.016,
    rotationYMouse: 0.066,
    rotationZSpeed: 0,
    mouseLerp: 3.0,
    lightRadius: isMobile ? 0.5 : 1.189,
    lightIntensity: 2.7865,
    edgeThreshold: 1.8,
    modelScale: isMobile ? 0.16 : 0.3891,
    bloomStrength: isMobile ? 0.07 : 0.165,
    bloomRadius: 0,
    bloomThreshold: 0.16,
    chromaAmount: 0.00097,
    bokehFocus: 10.0,
    bokehAperture: 0.001,
    bokehMaxBlur: 0,
    revealProgress: -1.0,
    manifestSpeed: 2.0,
    manifestAxis: 'Y',
    revealStartOffset: -2.0,
    revealEndOffset: 2,

    // --- Per-element manifestation ---
    torusManifestSpeed: 1.0,
    torusManifestDelay: 0.0,
    haloManifestSpeed: 1.0,
    haloManifestDelay: 0.0,
    innerFlareManifestSpeed: 2.0,
    innerFlareManifestDelay: 1.8,

    // Internal tracking (not user-facing)
    _torusRevealProgress: -10.0,
    _haloRevealProgress: -10.0,
    _innerFlareRevealProgress: -10.0,
    smoothIterations: 0,
    smoothStrength: 0.5,
    modelName: 'Test_Torus.obj',
    useSmoothSplines: true,
    splineResolution: 5,
    renderAsTubes: true,
    tubeRadialSegments: 6,
    tubeRadius: 0.0023,
    testTorusTube: 0.0023,
    testTorusScale: 1.0,
    modelX: 0,
    modelY: 0,
    modelZ: 0,
    rotX: 0,
    rotY: 1.646194,
    rotZ: 0,

    // --- Unified Geometry ---
    unifiedMajorRadius: 1.974,
    unifiedMinorRadius: 1.39,
    unifiedPoloidalCount: 20,   // Vertical lines
    unifiedToroidalCount: 19,   // Horizontal rings
    unifiedPoloidalSegments: isMobile ? 128 : 512,
    unifiedToroidalSegments: isMobile ? 128 : 512,

    // Masking
    neckShowVertical: true,
    neckShowRings: false,
    torusShowVertical: true,
    torusShowRings: true,

    // --- Conveyor (physical line flow) ---
    conveyorSpeed: 0.016,
    // --- Torus Roll (horizontal rings slide around big ring) ---
    torusRollSpeed: 0.0,
    // --- Tornado Twist ---
    animTwist: 0.0,
    animTwistSpeed: 0.0,

    // --- Throat Noise ---
    throatNoiseEnabled: true,
    throatNoiseType: 'fbm',
    throatNoiseAmplitude: 0.733,
    throatNoiseScale: 3.3274,
    throatNoiseSpeed: 0.30003,
    throatEdgeMask: 1.1878,
    throatGeometry: 'Vertical Lines',
    throatNoiseFrequency: 0.298,
    throatNoiseBlend: 0.171,
    throatNoisePhaseShift: 0.5,
    throatNoiseLayers: 2,
    // Throat mask boundaries (adjustable)
    throatMaskStart: 0.27,
    throatMaskEnd: 0.73,
    throatMaskFade: 0.03,

    // --- Throat Noise Zone (two-layer system) ---
    throatContourWidth: 0.05,
    throatNoiseInnerStart: 0.214,
    throatNoiseInnerEnd: 0.68,
    throatNoiseInnerFade: 0.03555,
    throatNoiseRadialClamp: 0.70993,
    throatNoiseYWeight: 0.27,
    throatNoiseRadialWeight: 0.498,

    // --- Throat Extra Lines ---
    throatExtraEnabled: true,
    throatExtraGeomType: 'Vertical Lines',
    throatExtraLineCount: 94,
    throatExtraSegments: 256,
    throatExtraTopV: 0.322,
    throatExtraBottomV: 0.631,
    throatExtraTopFade: 0.379,
    throatExtraBottomFade: 0.4045,

    // --- Neck Back Cutout ---
    neckBackCutEnabled: true,
    neckBackCutStart: 0.1375,
    neckBackCutFade: 0.1284,

    // --- Torus Clip Mask (3D clipping plane) ---
    torusClipEnabled: true,
    torusClipX: 0.19,
    torusClipY: -2.96,
    torusClipZ: 3.18,
    torusClipNX: 0.768,
    torusClipNY: -0.426,
    torusClipNZ: 0.204,
    torusClipFade: 1.306,
    torusClipFlip: false
};

// GUI setup moved to initGui() at the bottom of the file

// Remove loader after initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 500);
});


let frameCount = 0;
let lastFpsTime = performance.now();
let fpsDisplayVisible = false;

const toggleStats = () => {
    fpsDisplayVisible = !fpsDisplayVisible;
    const pm = document.getElementById('perf-monitor');
    if (pm) pm.style.display = fpsDisplayVisible ? 'block' : 'none';
};

params.togglePerformanceGraph = toggleStats;
// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = params.cameraZ;

const canvas = canvasRef.current;
if (!canvas) return;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); // System-level transparency
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 2.0));
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.info.autoReset = false; 

// Post-processing Composer with Alpha Support
const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    samples: 4
});

const renderScene = new RenderPass(scene, camera);
renderScene.clearAlpha = 0; // Ensure transparency is preserved in the first pass
const composer = new EffectComposer(renderer, renderTarget);
composer.addPass(renderScene);

// 1. Depth of Field
const bokehPass = new BokehPass(scene, camera, {
    focus: params.bokehFocus,
    aperture: params.bokehAperture,
    maxblur: params.bokehMaxBlur,
    
    
});
if (!isMobile) composer.addPass(bokehPass);

// 2. Selective Bloom
const bloomRes = (isMobile) ? new THREE.Vector2(window.innerWidth/2, window.innerHeight/2) : new THREE.Vector2(window.innerWidth, window.innerHeight);
    const bloomPass = new UnrealBloomPass(bloomRes, params.bloomStrength, params.bloomRadius, params.bloomThreshold);
composer.addPass(bloomPass);

// 3. Chromatic Aberration
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = params.chromaAmount;
composer.addPass(rgbShiftPass);

// 4. SMAA Anti-Aliasing (Fixes the "lecence" - jaggy lines)
const smaaPass = new SMAAPass();
if (!isMobile) composer.addPass(smaaPass);

composer.addPass(new OutputPass());

// Mouse Tracking & Interaction State
const mouse = new THREE.Vector2(0, 0);
let hasInteracted = false;
const targetMouse = new THREE.Vector2(0, 0);
const raycaster = new THREE.Raycaster();
const mouseWorldPos = new THREE.Vector3(params.initialLightX, params.initialLightY, params.initialLightZ);
const targetMouseWorldPos = new THREE.Vector3(0, 0, 0);
const invisiblePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

window.addEventListener('mousemove', (e) => {
    hasInteracted = true;
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('touchmove', (e) => {
    hasInteracted = true;
    if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
}, { passive: true });

window.addEventListener('touchstart', (e) => {
    hasInteracted = true;
    if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
}, { passive: true });

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    renderTarget.setSize(window.innerWidth, window.innerHeight); // Keep target in sync

    if (bokehPass) bokehPass.setSize(window.innerWidth, window.innerHeight);
    if (smaaPass) smaaPass.setSize(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
});

// Shader Setup
const vertexShader = `
attribute float aU;
attribute float aV;
attribute float aIsVertical;

varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vOpacity;
varying float vIsVertical;
varying float vV;
varying float vVOriginal;
varying float vU;

uniform float uConveyorSpeed;
uniform float uTorusRollSpeed;
uniform float uTime;
uniform float uTorusMajorR;
uniform float uTorusMinorR;

void main() {
    vOpacity = 1.0;
    vIsVertical = aIsVertical;
    vVOriginal = aV;
    vU = aU;
    
    float u = aU;
    float v = aV;
    
    // Conveyor: shift v for ALL lines (physical flow through tube cross-section)
    v = fract(aV + uTime * uConveyorSpeed);
    
    // Torus Roll: shift u for horizontal rings (slide around big ring)
    if (aIsVertical < 0.5 && abs(uTorusRollSpeed) > 0.001) {
        u = fract(aU + uTime * uTorusRollSpeed);
    }
    
    vV = v;

    float theta = u * 3.14159265 * 2.0;
    float phi = v * 3.14159265 * 2.0;
    
    vec3 pos;
    pos.x = (uTorusMajorR + uTorusMinorR * cos(phi)) * cos(theta);
    pos.y = uTorusMinorR * sin(phi);
    pos.z = (uTorusMajorR + uTorusMinorR * cos(phi)) * sin(theta);
    
    vPosition = pos;
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

// Separate vertex shader for fill lines — includes GPU noise animation
const fillVertexShader = `
attribute float aU;
attribute float aV;
attribute float aIsVertical;
attribute float aIsThroatExtra;

varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vOpacity;
varying float vIsVertical;
varying float vV;
varying float vVOriginal;
varying float vU;
varying float vIsThroatExtra;

uniform float uAnimTime;
uniform float uThroatNoiseAmplitude;
uniform float uThroatNoiseScale;
uniform float uThroatNoiseSpeed;
uniform int uThroatNoiseMode;
uniform float uThroatEdgeMask;
uniform float uThroatNoiseFrequency;
uniform float uThroatNoiseBlend;
uniform float uThroatNoisePhaseShift;
uniform int uThroatNoiseLayers;
uniform float uTwistAmount;
uniform float uTwistSpeed;

uniform float uConveyorSpeed;
uniform float uTorusRollSpeed;

uniform float uTorusMajorR;
uniform float uTorusMinorR;
uniform float uThroatMaskStart;
uniform float uThroatMaskEnd;
uniform float uThroatMaskFade;

// Two-layer noise zone uniforms
uniform float uThroatNoiseInnerStart;
uniform float uThroatNoiseInnerEnd;
uniform float uThroatNoiseInnerFade;
uniform float uThroatNoiseRadialClamp;
uniform float uThroatNoiseYWeight;
uniform float uThroatNoiseRadialWeight;

vec3 mod289v(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289v(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permutev(vec4 x) { return mod289v(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrtv(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise3(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289v(i);
  vec4 p = permutev(permutev(permutev(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrtv(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm3(vec3 p, int layers) {
  float v = 0.0, a = 1.0, f = 1.0, mx = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= layers) break;
    v += snoise3(p * f) * a; mx += a; a *= 0.5; f *= 2.0;
  }
  return v / mx;
}

void main() {
    vOpacity = 1.0;
    vIsVertical = aIsVertical;
    vIsThroatExtra = aIsThroatExtra;

    // Pass original coords for masking (unaffected by flow)
    vVOriginal = aV;
    vU = aU;

    float u = aU;
    float v = aV;
    
    // Conveyor: shift v for main torus lines only (extra throat lines stay in place)
    if (aIsThroatExtra < 0.5) {
        v = fract(aV + uAnimTime * uConveyorSpeed);
        // Torus Roll: shift u for horizontal rings
        if (aIsVertical < 0.5 && abs(uTorusRollSpeed) > 0.001) {
            u = fract(aU + uAnimTime * uTorusRollSpeed);
        }
    }
    
    vV = v;

    float theta = u * 3.14159265 * 2.0;
    float phi = v * 3.14159265 * 2.0;
    
    float R = uTorusMajorR;
    float r = uTorusMinorR;
    
    vec3 pos;
    // Apply twist before computing X and Z
    if (abs(uTwistAmount) > 0.001) {
        float localY = r * sin(phi);
        theta += localY * uTwistAmount + uAnimTime * uTwistSpeed;
    }

    pos.x = (R + r * cos(phi)) * cos(theta);
    pos.y = r * sin(phi);
    pos.z = (R + r * cos(phi)) * sin(theta);
    
    vec3 cleanPos = pos;
    vPosition = pos;

    if (abs(uTwistAmount) > 0.001) {
        float twistAngle = pos.y * uTwistAmount + uAnimTime * uTwistSpeed;
        float cs = cos(twistAngle);
        float sn = sin(twistAngle);
        float nx = pos.x * cs - pos.z * sn;
        float nz = pos.x * sn + pos.z * cs;
        pos.x = nx;
        pos.z = nz;
        cleanPos = pos;
    }

    // ===== Two-layer noise system =====
    // Inner noise mask: 0 at contour borders, 1 in the center
    float innerMask = smoothstep(uThroatNoiseInnerStart - uThroatNoiseInnerFade, uThroatNoiseInnerStart + uThroatNoiseInnerFade, v)
                    * smoothstep(uThroatNoiseInnerEnd + uThroatNoiseInnerFade, uThroatNoiseInnerEnd - uThroatNoiseInnerFade, v);
    
    if (uThroatNoiseMode > 0 && uThroatNoiseAmplitude > 0.001 && innerMask > 0.001) {
        float timeWithPhase = uAnimTime * uThroatNoiseSpeed + uThroatNoisePhaseShift;
        vec3 nc = pos * uThroatNoiseScale * uThroatNoiseFrequency + vec3(0.0, 1.0, 0.0) * timeWithPhase;
        float n = 0.0;
        float n2 = 0.0;
        vec2 rd = pos.xz;
        float rLen = length(rd);
        if (rLen > 0.001) rd = rd / rLen;
        else rd = vec2(1.0, 0.0);

        if (uThroatNoiseMode == 1) {
            n = snoise3(nc);
            n2 = snoise3(nc + vec3(17.0, 31.0, 7.0));
        } else if (uThroatNoiseMode == 2) {
            n = fbm3(nc, uThroatNoiseLayers);
            n2 = fbm3(nc + vec3(17.0, 31.0, 7.0), uThroatNoiseLayers);
        } else if (uThroatNoiseMode == 3) {
            float eps = 0.05;
            float dndz = (snoise3(nc + vec3(0,0,eps)) - snoise3(nc - vec3(0,0,eps))) / (2.0*eps);
            float dndx = (snoise3(nc + vec3(eps,0,0)) - snoise3(nc - vec3(eps,0,0))) / (2.0*eps);
            n = dndz;
            n2 = -dndx;
        }

        // Directional displacement with separate weights
        vec3 disp = vec3(
            rd.x * n * uThroatNoiseRadialWeight,
            n2 * uThroatNoiseYWeight,
            rd.y * n * uThroatNoiseRadialWeight
        );

        vec3 noisedPos = cleanPos + disp * (uThroatNoiseAmplitude * innerMask);
        
        // Radial clamp: prevent noise from pushing beyond contour boundary
        vec3 delta = noisedPos - cleanPos;
        float deltaLen = length(delta);
        if (deltaLen > uThroatNoiseRadialClamp) {
            delta = normalize(delta) * uThroatNoiseRadialClamp;
        }
        pos = cleanPos + delta * innerMask;
        pos = mix(cleanPos, pos, uThroatNoiseBlend + (1.0 - uThroatNoiseBlend) * innerMask);
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uMouseCenter;

uniform vec3 uLineColor;
uniform vec3 uGlowColor;
uniform vec3 uGlowColor2;
uniform float uGradientSpread;
uniform float uGradientShift;

// Light parameters
uniform float uLightRadius;
uniform float uLightIntensity;
uniform float uBottomLightRadius;
uniform float uBottomLightIntensity;
uniform vec3 uBottomLightScale;
uniform vec3 uGradientOffset;
uniform float uBottomLightDiskRadius;
uniform float uBottomLightInnerFill;
uniform float uRevealProgress;
uniform vec3 uRevealDir;
uniform vec3 uBottomCenter;
uniform bool uBottomLightAnimEnabled;
uniform float uBottomLightAnimSpeed;
uniform float uBottomLightAnimAmp;
uniform vec3 uCursorColor;
uniform float uCursorBloomMult;
uniform float uBottomBloomMult;

uniform bool uLocalGlowEnabled;
uniform vec3 uLocalGlowCenter;
uniform vec3 uLocalGlowScale;
uniform float uLocalGlowRadius;
uniform float uLocalGlowIntensity;
uniform float uLocalGlowBloomMult;
uniform vec3 uLocalGlowColor;
uniform bool uLocalGlowAnimEnabled;
uniform float uLocalGlowAnimSpeed;
uniform float uLocalGlowAnimAmp;
// (removed legacy uTorusHoleRadius)

// (removed legacy uAnimTime, uFlowY from fragment)

varying vec3 vPosition;
varying vec3 vWorldPosition;
varying float vOpacity;
varying float vIsVertical;
varying float vV;
varying float vVOriginal;
varying float vU;
varying float vIsThroatExtra;

uniform bool uNeckShowVertical;
uniform bool uNeckShowRings;
uniform bool uTorusShowVertical;
uniform bool uTorusShowRings;

uniform float uNeckBackCutStart;
uniform float uNeckBackCutFade;
uniform bool uNeckBackCutEnabled;
uniform float uThroatMaskStart;
uniform float uThroatMaskEnd;
uniform float uThroatMaskFade;

// Torus clip mask (3D clipping plane)
uniform bool uTorusClipEnabled;
uniform vec3 uTorusClipPoint;
uniform vec3 uTorusClipNormal;
uniform float uTorusClipFade;
uniform bool uTorusClipFlip;

uniform float uThroatExtraTopV;
uniform float uThroatExtraBottomV;
uniform float uThroatExtraTopFade;
uniform float uThroatExtraBottomFade;

// --- Simplex 3D Noise ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}


void main() {
    // Reveal logic (Architecture Manifestation)
    float posProjection = dot(vPosition, uRevealDir);
    float noiseOffset = snoise(vec3(vPosition.x * 10.0, vPosition.z * 10.0, uTime * 0.5)) * 0.04;
    float threshold = posProjection + noiseOffset;
    
    if (threshold > uRevealProgress) {
        discard; 
    }

    vec3 lineColor = uLineColor;
    vec3 glowColor = uGlowColor;

    // 2. Bright scanning edge
    float edgeWidth = 0.03;
    float distToEdge = abs(threshold - uRevealProgress);
    float edgeFactor = smoothstep(edgeWidth, 0.0, distToEdge);
    vec3 manifestEdge = lineColor * edgeFactor * 5.0;

    // 1. Static Bottom Light (Disk Stroke Shape, LOCAL SPACE)
    // Using vPosition so the ring perfectly follows the torus tilt/rotation
    vec3 animatedBottomCenter = uBottomCenter;
    if (uBottomLightAnimEnabled) {
        animatedBottomCenter.x += sin(uTime * uBottomLightAnimSpeed) * uBottomLightAnimAmp;
        animatedBottomCenter.z += cos(uTime * uBottomLightAnimSpeed * 0.8) * uBottomLightAnimAmp;
        animatedBottomCenter.y += sin(uTime * uBottomLightAnimSpeed * 1.2) * (uBottomLightAnimAmp * 0.5);
    }

    float rHorizontal = length(vPosition.xz - animatedBottomCenter.xz);
    float hDistStroke = abs(rHorizontal - uBottomLightDiskRadius);
    float vDist = abs(vPosition.y - animatedBottomCenter.y);
    
    // Distance to the stroke ring
    vec3 diffBottom = vec3(hDistStroke, vDist, 0.0) / uBottomLightScale;
    float distBottomStroke = length(diffBottom);
    float edgeLight = smoothstep(uBottomLightRadius, 0.0, distBottomStroke);
    
    // Distance to the center (for inner fill)
    vec3 diffFill = vec3(0.0, vDist, 0.0) / uBottomLightScale;
    float distFill = length(diffFill);
    float innerLight = smoothstep(uBottomLightRadius, 0.0, distFill) * uBottomLightInnerFill;
    // Only apply fill inside the disk
    if (rHorizontal > uBottomLightDiskRadius) innerLight = 0.0;
    
    float bottomLight = max(edgeLight, innerLight);
    
    // Gradient glow for bottom light (using stroke shape, LOCAL SPACE)
    float rHorizGrad = length(vPosition.xz - (animatedBottomCenter.xz + uGradientOffset.xz));
    float hDistGrad = abs(rHorizGrad - uBottomLightDiskRadius);
    float vDistGrad = abs(vPosition.y - (animatedBottomCenter.y + uGradientOffset.y));
    
    float distGradient = length(vec3(hDistGrad, vDistGrad, 0.0) / uBottomLightScale);
    float gradientTBottom = smoothstep(0.0, uBottomLightRadius * uGradientSpread, distGradient) + uGradientShift;
    gradientTBottom = clamp(gradientTBottom, 0.0, 1.0);
    vec3 gradientGlowColorBottom = mix(uGlowColor2, uGlowColor, gradientTBottom);
    
    // 2. Interactive Mouse Light (weaker, subtle illumination)
    float distMouse = distance(vWorldPosition, uMouseCenter);
    float mouseLight = smoothstep(uLightRadius * 0.7, 0.0, distMouse);
    
    // Noise shimmer across the lines
    float noiseVal = snoise(vec3(vPosition.x * 2.0, vPosition.y * 5.0, uTime * 0.3));
    float shimmer = smoothstep(0.3, 0.7, noiseVal);

    // Final color composition
    vec3 baseCol = lineColor * 0.15;
    
    // Selective HDR Bloom
    // Reduce multiplier slightly so the light blue color isn't completely blown out to white
    vec3 bottomGlow = gradientGlowColorBottom * (bottomLight * uBottomLightIntensity * uBottomBloomMult);
    vec3 mouseGlow = uCursorColor * (mouseLight * uLightIntensity * uCursorBloomMult);
    vec3 ambientGlow = uGlowColor * (shimmer * 0.8);
    
    // Localized Glow Zone
    vec3 localGlowRes = vec3(0.0);
    if (uLocalGlowEnabled) {
        vec3 animatedLocalCenter = uLocalGlowCenter;
        if (uLocalGlowAnimEnabled) {
            animatedLocalCenter.x += sin(uTime * uLocalGlowAnimSpeed) * uLocalGlowAnimAmp;
            animatedLocalCenter.z += cos(uTime * uLocalGlowAnimSpeed * 1.1) * uLocalGlowAnimAmp;
            animatedLocalCenter.y += sin(uTime * uLocalGlowAnimSpeed * 0.8) * (uLocalGlowAnimAmp * 0.5);
        }
        vec3 diffLocal = (vPosition - animatedLocalCenter) / uLocalGlowScale;
        float distLocal = length(diffLocal);
        float lGlow = smoothstep(uLocalGlowRadius, 0.0, distLocal);
        localGlowRes = uLocalGlowColor * (lGlow * uLocalGlowIntensity * uLocalGlowBloomMult);
    }
    
    float finalOpacity = vOpacity;
    
    // Smooth parametric mask using vV (post-conveyor) so it follows physical position
    float neckMask = smoothstep(uThroatMaskStart - uThroatMaskFade, uThroatMaskStart + uThroatMaskFade, vV)
                   * smoothstep(uThroatMaskEnd + uThroatMaskFade, uThroatMaskEnd - uThroatMaskFade, vV);
    
    float visibility = 0.0;
    
    if (vIsThroatExtra > 0.5) {
        // Extra throat lines: use their own separate top/bottom mask
        visibility = smoothstep(uThroatExtraTopV - uThroatExtraTopFade, uThroatExtraTopV + uThroatExtraTopFade, vV)
                   * smoothstep(uThroatExtraBottomV + uThroatExtraBottomFade, uThroatExtraBottomV - uThroatExtraBottomFade, vV);
    } else {
        if (vIsVertical > 0.5) {
            visibility = mix(uTorusShowVertical ? 1.0 : 0.0, uNeckShowVertical ? 1.0 : 0.0, neckMask);
        } else {
            visibility = mix(uTorusShowRings ? 1.0 : 0.0, uNeckShowRings ? 1.0 : 0.0, neckMask);
        }
    }
    
    // Back-side cutout for neck (toggleable)
    if (uNeckBackCutEnabled) {
        float deepNeck = smoothstep(0.30, 0.40, vV) * smoothstep(0.70, 0.60, vV);
        float backCut = smoothstep(uNeckBackCutStart, uNeckBackCutStart + uNeckBackCutFade, vU)
                      * smoothstep(1.0 - uNeckBackCutStart, 1.0 - uNeckBackCutStart - uNeckBackCutFade, vU);
        float neckBackMask = mix(1.0, backCut, deepNeck);
        finalOpacity *= neckBackMask;
    }
    
    // Torus clip mask: 3D clipping plane in local space
    // Only affects torus lines (not throat extra lines)
    if (uTorusClipEnabled && vIsThroatExtra < 0.5) {
        // Signed distance from the clip plane
        float clipDist = dot(vPosition - uTorusClipPoint, normalize(uTorusClipNormal));
        // Flip inverts which side is clipped
        if (uTorusClipFlip) clipDist = -clipDist;
        // Smooth fade: visible when clipDist < 0 (behind the plane)
        float clipMask = smoothstep(uTorusClipFade, -uTorusClipFade, clipDist);
        finalOpacity *= clipMask;
    }
    
    finalOpacity *= visibility;
    if (finalOpacity < 0.01) discard;
    
    vec3 finalColor = baseCol + bottomGlow + mouseGlow + ambientGlow + manifestEdge + localGlowRes;
    gl_FragColor = vec4(finalColor * finalOpacity, finalOpacity);
}
`;

// Uniforms
const uniforms = {
    uTime: { value: 0 },
    uMouseCenter: { value: new THREE.Vector3(0, 0, 0) },
    uLineColor: { value: new THREE.Color(params.lineColor) },
    uGlowColor: { value: new THREE.Color(params.glowColor) },
    uGlowColor2: { value: new THREE.Color(params.glowColor2) },
    uCursorColor: { value: new THREE.Color(params.cursorLightColor) },
    uCursorBloomMult: { value: params.cursorBloomMult },
    uBottomBloomMult: { value: params.bottomBloomMult },
    uGradientSpread: { value: params.gradientSpread },
    uGradientShift: { value: params.gradientShift },
    uLightRadius: { value: params.lightRadius },
    uLightIntensity: { value: params.lightIntensity },
    uBottomLightRadius: { value: params.bottomLightRadius },
    uBottomLightIntensity: { value: params.bottomLightIntensity },
    uBottomLightScale: { value: new THREE.Vector3(params.bottomLightScaleX, params.bottomLightScaleY, params.bottomLightScaleZ) },
    uGradientOffset: { value: new THREE.Vector3(params.gradientOffsetX, params.gradientOffsetY, params.gradientOffsetZ) },
    uBottomLightDiskRadius: { value: params.bottomLightDiskRadius },
    uBottomLightInnerFill: { value: params.bottomLightInnerFill },
    uBottomLightAnimEnabled: { value: params.bottomLightAnimEnabled },
    uBottomLightAnimSpeed: { value: params.bottomLightAnimSpeed },
    uBottomLightAnimAmp: { value: params.bottomLightAnimAmp },
    uRevealProgress: { value: params.revealProgress },
    uRevealDir: { value: new THREE.Vector3(0, 1, 0) },
    uHaloRevealProgress: { value: -10.0 },
    uInnerFlareRevealProgress: { value: -10.0 },
    uBottomCenter: { value: new THREE.Vector3(params.initialLightX, params.initialLightY, params.initialLightZ) },
    uConveyorSpeed: { value: params.conveyorSpeed },
    uTorusRollSpeed: { value: params.torusRollSpeed },
    uTorusMajorR: { value: params.unifiedMajorRadius },
    uTorusMinorR: { value: params.unifiedMinorRadius },
    uNeckShowVertical: { value: params.neckShowVertical },
    uNeckShowRings: { value: params.neckShowRings },
    uTorusShowVertical: { value: params.torusShowVertical },
    uTorusShowRings: { value: params.torusShowRings },
    uNeckBackCutStart: { value: params.neckBackCutStart },
    uNeckBackCutFade: { value: params.neckBackCutFade },
    uNeckBackCutEnabled: { value: params.neckBackCutEnabled },
    uThroatMaskStart: { value: params.throatMaskStart },
    uThroatMaskEnd: { value: params.throatMaskEnd },
    uThroatMaskFade: { value: params.throatMaskFade },
    uThroatExtraTopV: { value: params.throatExtraTopV },
    uThroatExtraBottomV: { value: params.throatExtraBottomV },
    uThroatExtraTopFade: { value: params.throatExtraTopFade },
    uThroatExtraBottomFade: { value: params.throatExtraBottomFade },
    uLocalGlowEnabled: { value: params.localGlowEnabled },
    uLocalGlowCenter: { value: new THREE.Vector3(params.localGlowX, params.localGlowY, params.localGlowZ) },
    uLocalGlowScale: { value: new THREE.Vector3(params.localGlowScaleX, params.localGlowScaleY, params.localGlowScaleZ) },
    uLocalGlowRadius: { value: params.localGlowRadius },
    uLocalGlowIntensity: { value: params.localGlowIntensity },
    uLocalGlowBloomMult: { value: params.localGlowBloomMult },
    uLocalGlowColor: { value: new THREE.Color(params.localGlowColor) },
    uLocalGlowAnimEnabled: { value: params.localGlowAnimEnabled },
    uLocalGlowAnimSpeed: { value: params.localGlowAnimSpeed },
    uLocalGlowAnimAmp: { value: params.localGlowAnimAmp },
    // Torus clip mask (3D plane)
    uTorusClipEnabled: { value: params.torusClipEnabled },
    uTorusClipPoint: { value: new THREE.Vector3(params.torusClipX, params.torusClipY, params.torusClipZ) },
    uTorusClipNormal: { value: new THREE.Vector3(params.torusClipNX, params.torusClipNY, params.torusClipNZ) },
    uTorusClipFade: { value: params.torusClipFade },
    uTorusClipFlip: { value: params.torusClipFlip }
};

// material will be set = fillMaterial after fillMaterial is created below
let material;

// Fill material — same fragment shader, animated vertex shader
const fillUniforms = {
    uTime: uniforms.uTime,
    uMouseCenter: uniforms.uMouseCenter,
    uLineColor: uniforms.uLineColor,
    uGlowColor: uniforms.uGlowColor,
    uGlowColor2: uniforms.uGlowColor2,
    uCursorColor: uniforms.uCursorColor,
    uCursorBloomMult: uniforms.uCursorBloomMult,
    uBottomBloomMult: uniforms.uBottomBloomMult,
    uGradientSpread: uniforms.uGradientSpread,
    uGradientShift: uniforms.uGradientShift,
    uLightRadius: uniforms.uLightRadius,
    uLightIntensity: uniforms.uLightIntensity,
    uBottomLightRadius: uniforms.uBottomLightRadius,
    uBottomLightIntensity: uniforms.uBottomLightIntensity,
    uBottomLightScale: uniforms.uBottomLightScale,
    uGradientOffset: uniforms.uGradientOffset,
    uBottomLightDiskRadius: uniforms.uBottomLightDiskRadius,
    uBottomLightInnerFill: uniforms.uBottomLightInnerFill,
    uBottomLightAnimEnabled: uniforms.uBottomLightAnimEnabled,
    uBottomLightAnimSpeed: uniforms.uBottomLightAnimSpeed,
    uBottomLightAnimAmp: uniforms.uBottomLightAnimAmp,
    uRevealProgress: uniforms.uRevealProgress,
    uRevealDir: uniforms.uRevealDir,
    uHaloRevealProgress: uniforms.uHaloRevealProgress,
    uInnerFlareRevealProgress: uniforms.uInnerFlareRevealProgress,
    uBottomCenter: uniforms.uBottomCenter,
    uAnimTime: { value: 0.0 },
    uConveyorSpeed: uniforms.uConveyorSpeed,
    uTorusRollSpeed: uniforms.uTorusRollSpeed,
    uThroatNoiseAmplitude: { value: params.throatNoiseAmplitude },
    uThroatNoiseScale: { value: params.throatNoiseScale },
    uThroatNoiseSpeed: { value: params.throatNoiseSpeed },
    uThroatNoiseMode: { value: 0 },  // 0=off, 1=simplex, 2=fbm, 3=curl
    uThroatEdgeMask: { value: params.throatEdgeMask },
    uTwistAmount: { value: params.animTwist },
    uTwistSpeed: { value: params.animTwistSpeed },
    uTorusMajorR: uniforms.uTorusMajorR,
    uTorusMinorR: uniforms.uTorusMinorR,
    uNeckShowVertical: uniforms.uNeckShowVertical,
    uNeckShowRings: uniforms.uNeckShowRings,
    uTorusShowVertical: uniforms.uTorusShowVertical,
    uTorusShowRings: uniforms.uTorusShowRings,
    uNeckBackCutStart: uniforms.uNeckBackCutStart,
    uNeckBackCutFade: uniforms.uNeckBackCutFade,
    uNeckBackCutEnabled: uniforms.uNeckBackCutEnabled,
    uThroatMaskStart: uniforms.uThroatMaskStart,
    uThroatMaskEnd: uniforms.uThroatMaskEnd,
    uThroatMaskFade: uniforms.uThroatMaskFade,
    uThroatExtraTopV: uniforms.uThroatExtraTopV,
    uThroatExtraBottomV: uniforms.uThroatExtraBottomV,
    uThroatExtraTopFade: uniforms.uThroatExtraTopFade,
    uThroatExtraBottomFade: uniforms.uThroatExtraBottomFade,
    uThroatNoiseFrequency: { value: params.throatNoiseFrequency },
    uThroatNoiseBlend: { value: params.throatNoiseBlend },
    uThroatNoisePhaseShift: { value: params.throatNoisePhaseShift },
    uThroatNoiseLayers: { value: params.throatNoiseLayers },
    // Two-layer noise zone
    uThroatNoiseInnerStart: { value: params.throatNoiseInnerStart },
    uThroatNoiseInnerEnd: { value: params.throatNoiseInnerEnd },
    uThroatNoiseInnerFade: { value: params.throatNoiseInnerFade },
    uThroatNoiseRadialClamp: { value: params.throatNoiseRadialClamp },
    uThroatNoiseYWeight: { value: params.throatNoiseYWeight },
    uThroatNoiseRadialWeight: { value: params.throatNoiseRadialWeight },
    uLocalGlowEnabled: uniforms.uLocalGlowEnabled,
    uLocalGlowCenter: uniforms.uLocalGlowCenter,
    uLocalGlowScale: uniforms.uLocalGlowScale,
    uLocalGlowRadius: uniforms.uLocalGlowRadius,
    uLocalGlowIntensity: uniforms.uLocalGlowIntensity,
    uLocalGlowBloomMult: uniforms.uLocalGlowBloomMult,
    uLocalGlowColor: uniforms.uLocalGlowColor,
    uLocalGlowAnimEnabled: uniforms.uLocalGlowAnimEnabled,
    uLocalGlowAnimSpeed: uniforms.uLocalGlowAnimSpeed,
    uLocalGlowAnimAmp: uniforms.uLocalGlowAnimAmp,
    // Torus clip mask (3D plane)
    uTorusClipEnabled: uniforms.uTorusClipEnabled,
    uTorusClipPoint: uniforms.uTorusClipPoint,
    uTorusClipNormal: uniforms.uTorusClipNormal,
    uTorusClipFade: uniforms.uTorusClipFade,
    uTorusClipFlip: uniforms.uTorusClipFlip
};

function getNoiseMode(typeName: any, enabled: any) {
    if (!enabled) return 0;
    if (typeName === 'simplex') return 1;
    if (typeName === 'fbm') return 2;
    if (typeName === 'curl') return 3;
    return 0;
}

const fillMaterial = new THREE.ShaderMaterial({
    vertexShader: fillVertexShader,
    fragmentShader,
    uniforms: fillUniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
material = fillMaterial;

// --- Solid Lens Flare Material (Split: Ring + Glow) ---
const flareUniforms = {
    // Ring uniforms
    uRingColor: { value: new THREE.Color(params.ringColor) },
    uRingOpacity: { value: params.ringOpacity },
    uRingRadius: { value: params.ringRadius },
    uRingThickness: { value: params.ringThickness },
    uRingIntensity: { value: params.ringIntensity },
    uRingOffset: { value: new THREE.Vector2(params.ringXOffset, params.ringZOffset) },
    uRingScale: { value: new THREE.Vector2(params.ringScaleX, params.ringScaleY) },
    // Ring 2 uniforms
    uRing2Enabled: { value: params.ring2Enabled },
    uRing2Color: { value: new THREE.Color(params.ring2Color) },
    uRing2Opacity: { value: params.ring2Opacity },
    uRing2Radius: { value: params.ring2Radius },
    uRing2Thickness: { value: params.ring2Thickness },
    uRing2Intensity: { value: params.ring2Intensity },
    uRing2Offset: { value: new THREE.Vector2(params.ring2XOffset, params.ring2ZOffset) },
    uRing2Scale: { value: new THREE.Vector2(params.ring2ScaleX, params.ring2ScaleY) },
    // Glow uniforms
    uGlowColor: { value: new THREE.Color(params.glowFlareColor) },
    uGlowOpacity: { value: params.glowFlareOpacity },
    uGlowRadius: { value: params.glowFlareRadius },
    uGlowIntensity: { value: params.glowFlareIntensity },
    uGlowOffset: { value: new THREE.Vector2(params.glowFlareXOffset, params.glowFlareZOffset) },
    uGlowScale: { value: new THREE.Vector2(params.glowFlareScaleX, params.glowFlareScaleY) },
    uGlowYOffset: { value: params.glowFlareYOffset },
    uGlowAnimEnabled: { value: params.glowFlareAnimEnabled },
    uGlowAnimWobbleSpeed: { value: params.glowFlareAnimWobbleSpeed },
    uGlowAnimWobbleAmp: { value: params.glowFlareAnimWobbleAmp },
    uGlowAnimPulseSpeed: { value: params.glowFlareAnimPulseSpeed },
    uGlowAnimPulseAmp: { value: params.glowFlareAnimPulseAmp },

    // Manifestation uniforms
    uRevealProgress: uniforms.uRevealProgress,
    uRevealDir: uniforms.uRevealDir,
    uHaloRevealProgress: uniforms.uHaloRevealProgress,
    uInnerFlareRevealProgress: uniforms.uInnerFlareRevealProgress,
    uRingYOffset: { value: params.ringYOffset },
    uTime: uniforms.uTime
};

const flareVertexShader = `
varying vec2 vUv;
varying vec3 vPos;
void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const flareFragmentShader = `
// Ring
uniform vec3 uRingColor;
uniform float uRingOpacity;
uniform float uRingRadius;
uniform float uRingThickness;
uniform float uRingIntensity;
uniform vec2 uRingOffset;
uniform vec2 uRingScale;
// Ring 2
uniform bool uRing2Enabled;
uniform vec3 uRing2Color;
uniform float uRing2Opacity;
uniform float uRing2Radius;
uniform float uRing2Thickness;
uniform float uRing2Intensity;
uniform vec2 uRing2Offset;
uniform vec2 uRing2Scale;
// Glow
uniform vec3 uGlowColor;
uniform float uGlowOpacity;
uniform float uGlowRadius;
uniform float uGlowIntensity;
uniform vec2 uGlowOffset;
uniform vec2 uGlowScale;
uniform float uGlowYOffset;
uniform bool uGlowAnimEnabled;
uniform float uGlowAnimWobbleSpeed;
uniform float uGlowAnimWobbleAmp;
uniform float uGlowAnimPulseSpeed;
uniform float uGlowAnimPulseAmp;

// Manifestation
uniform float uRevealProgress;
uniform float uHaloRevealProgress;
uniform float uInnerFlareRevealProgress;
uniform vec3 uRevealDir;
uniform float uRingYOffset;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

// --- Simplex 3D Noise for reveal ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    // --- Reveal Logic ---
    // The flare is a plane rotated -PI/2 on X.
    // Local vPos.x is Group X, Local vPos.y is Group -Z.
    // The plane is at uRingYOffset.
    vec3 groupPos = vec3(vPos.x, uRingYOffset, -vPos.y);
    
    // Check reveal for Ring layer height — uses halo-specific reveal progress
    float posProjRing = dot(groupPos, uRevealDir);
    // Smooth clean fade without noise for "beautiful" look
    float flareFadeWidth = 0.8; 
    float revealRing = 1.0 - smoothstep(uHaloRevealProgress, uHaloRevealProgress + flareFadeWidth, posProjRing);
    
    // Check reveal for Glow layer height — uses inner-flare-specific reveal progress
    vec3 glowGroupPos = vec3(vPos.x, uGlowYOffset, -vPos.y);
    float posProjGlow = dot(glowGroupPos, uRevealDir);
    float revealGlow = 1.0 - smoothstep(uInnerFlareRevealProgress, uInnerFlareRevealProgress + flareFadeWidth, posProjGlow);
    
    // Manifest edge highlight (slightly softer)
    float edgeWidth = 0.2;
    float distToEdgeRing = abs(posProjRing - uHaloRevealProgress);
    float edgeFactorRing = smoothstep(edgeWidth, 0.0, distToEdgeRing);
    
    float distToEdgeGlow = abs(posProjGlow - uInnerFlareRevealProgress);
    float edgeFactorGlow = smoothstep(edgeWidth, 0.0, distToEdgeGlow);
    
    vec3 ringManifestEdge = uRingColor * edgeFactorRing * 5.0;
    vec3 glowManifestEdge = uGlowColor * edgeFactorGlow * 5.0;

    // --- Ring layer (outer halo) ---
    vec2 ringPos = (vPos.xy - uRingOffset) / uRingScale;
    float rRing = length(ringPos);
    float ringDist = abs(rRing - uRingRadius * 0.8);
    float ringGlow = smoothstep(uRingThickness, 0.0, ringDist) * 0.5;
    vec3 ringResult = (uRingColor * ringGlow * uRingIntensity + ringManifestEdge) * revealRing;
    float ringAlpha = ringGlow * uRingOpacity * revealRing;
    
    // --- Ring 2 layer (second outer halo) ---
    vec3 ring2Result = vec3(0.0);
    float ring2Alpha = 0.0;
    if (uRing2Enabled) {
        vec2 ring2Pos = (vPos.xy - uRing2Offset) / uRing2Scale;
        float rRing2 = length(ring2Pos);
        float ring2Dist = abs(rRing2 - uRing2Radius * 0.8);
        float ring2Glow = smoothstep(uRing2Thickness, 0.0, ring2Dist) * 0.5;
        ring2Result = (uRing2Color * ring2Glow * uRing2Intensity + ringManifestEdge) * revealRing;
        ring2Alpha = ring2Glow * uRing2Opacity * revealRing;
    }
    
    // --- Glow layer (inner center flare) ---
    // Simple wobble movement
    vec2 glowWobble = vec2(0.0);
    float glowPulse = 1.0;
    
    if (uGlowAnimEnabled) {
        glowWobble = vec2(sin(uTime * 1.2 * uGlowAnimWobbleSpeed) * uGlowAnimWobbleAmp, cos(uTime * 0.9 * uGlowAnimWobbleSpeed) * (uGlowAnimWobbleAmp * 1.33));
        glowPulse += sin(uTime * uGlowAnimPulseSpeed) * uGlowAnimPulseAmp;
    }

    vec2 glowPos = (vPos.xy - (uGlowOffset + glowWobble)) / uGlowScale;
    float rGlow = length(glowPos);
    
    // Slight breathing/pulsing effect
    float centerGlow = smoothstep(uGlowRadius * 0.4 * glowPulse, 0.0, rGlow);
    
    vec3 glowResult = (uGlowColor * centerGlow * uGlowIntensity + glowManifestEdge) * revealGlow;
    float glowAlpha = centerGlow * uGlowOpacity * revealGlow;
    
    // Combine all layers
    vec3 color = ringResult + ring2Result + glowResult;
    float alpha = max(max(ringAlpha, ring2Alpha), glowAlpha);
    
    if (alpha < 0.001) discard;
    
    gl_FragColor = vec4(color, alpha);
}
`;

const flareMaterial = new THREE.ShaderMaterial({
    vertexShader: flareVertexShader,
    fragmentShader: flareFragmentShader,
    uniforms: flareUniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
});

let flareMeshRef: any = null;

// OBJ Loading and Processing
let roverGroup: any = null;



// Initial load will happen at the end

let isManifesting = false;
let manifestStartTime = 0;
let manifestClock: any = new THREE.Clock(false);

let modelBounds = { min: -1, max: 1 };
function updateModelBounds() {
    if (!roverGroup) return;

    // Create a local bounding box to get accurate start/end points for manifestation
    const box = new THREE.Box3().setFromObject(roverGroup);

    if (params.manifestAxis === 'X') {
        modelBounds.min = box.min.x;
        modelBounds.max = box.max.x;
    } else if (params.manifestAxis === 'Y') {
        modelBounds.min = Math.min(box.min.y, params.ringYOffset, params.glowFlareYOffset);
        modelBounds.max = Math.max(box.max.y, params.ringYOffset, params.glowFlareYOffset);
    } else if (params.manifestAxis === 'Z') {
        modelBounds.min = box.min.z;
        modelBounds.max = box.max.z;
    }

    console.log(`Bounds updated for ${params.manifestAxis}:`, modelBounds);
}

function triggerManifestation() {
    // Always allow re-trigger (reset if already running)
    isManifesting = true;

    updateModelBounds();

    const start = modelBounds.min + params.revealStartOffset;
    const end = modelBounds.max + params.revealEndOffset;

    // Initialize all three tracks to start (far behind)
    params.revealProgress = start;
    params._torusRevealProgress = start;
    params._haloRevealProgress = start;
    params._innerFlareRevealProgress = start;

    // Set direction vector based on selection
    if (params.manifestAxis === 'X') uniforms.uRevealDir.value.set(1, 0, 0);
    else if (params.manifestAxis === 'Y') uniforms.uRevealDir.value.set(0, 1, 0);
    else if (params.manifestAxis === 'Z') uniforms.uRevealDir.value.set(0, 0, 1);

    // Track elapsed time for delays
    let manifestElapsed = 0;
    let lastFrameTime = performance.now();

    const animateReveal = () => {
        const now = performance.now();
        const dt = (now - lastFrameTime) / 1000.0; // seconds
        lastFrameTime = now;
        manifestElapsed += dt;

        // Read speeds/delays live from params (GUI changes take effect immediately)
        const baseSpeed = params.manifestSpeed;
        const increment = dt * baseSpeed;

        let allDone = true;

        // --- Torus track ---
        if (manifestElapsed >= params.torusManifestDelay) {
            if (params._torusRevealProgress < end) {
                params._torusRevealProgress += increment * params.torusManifestSpeed;
                if (params._torusRevealProgress >= end) params._torusRevealProgress = end;
                else allDone = false;
            }
        } else {
            allDone = false;
        }

        // --- Halo rings track ---
        if (manifestElapsed >= params.haloManifestDelay) {
            if (params._haloRevealProgress < end) {
                params._haloRevealProgress += increment * params.haloManifestSpeed;
                if (params._haloRevealProgress >= end) params._haloRevealProgress = end;
                else allDone = false;
            }
        } else {
            allDone = false;
        }

        // --- Inner flare track ---
        if (manifestElapsed >= params.innerFlareManifestDelay) {
            if (params._innerFlareRevealProgress < end) {
                params._innerFlareRevealProgress += increment * params.innerFlareManifestSpeed;
                if (params._innerFlareRevealProgress >= end) params._innerFlareRevealProgress = end;
                else allDone = false;
            }
        } else {
            allDone = false;
        }

        // Update scale along with progress
        const totalDist = end - start;
        const currentDist = params._torusRevealProgress - start;
        const progressFactor = Math.min(1.0, Math.max(0.0, currentDist / totalDist));
        
        const targetScale = isMobile ? 0.16 : 0.3891;
        params.modelScale = targetScale * progressFactor;

        // Update uniforms
        params.revealProgress = params._torusRevealProgress;
        uniforms.uRevealProgress.value = params._torusRevealProgress;
        uniforms.uHaloRevealProgress.value = params._haloRevealProgress;
        uniforms.uInnerFlareRevealProgress.value = params._innerFlareRevealProgress;

        if (!allDone) {
            (window as any).revealAnimId = requestAnimationFrame(animateReveal);
        } else {
            params.revealProgress = end;
            params.modelScale = targetScale;
            uniforms.uRevealProgress.value = end;
            uniforms.uHaloRevealProgress.value = end;
            uniforms.uInnerFlareRevealProgress.value = end;
            isManifesting = false;
        }
    };
    animateReveal();
}


    function rebuildRover() {
        if (roverGroup) scene.remove(roverGroup);
        roverGroup = new THREE.Group();
        if (params.flareEnabled) {
            const flareGeo = new THREE.PlaneGeometry(20, 20);
            flareMeshRef = new THREE.Mesh(flareGeo, flareMaterial);
            flareMeshRef.rotation.x = -Math.PI / 2;
            flareMeshRef.position.set(0, params.ringYOffset, 0);
            roverGroup.add(flareMeshRef);
        } else {
            flareMeshRef = null;
        }
        const R = params.unifiedMajorRadius || 2.7;
        const r = params.unifiedMinorRadius || 1.8652;
        const positions: any = [];
        const aU: any = [];
        const aV: any = [];
        const aIsVertical: any = [];
        const aIsThroatExtra: any = [];
        function pushSegment(p1: any, p2: any, u1: any, u2: any, v1: any, v2: any, isVert: any, isExtra: any) {
            positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            aU.push(u1, u2); aV.push(v1, v2); aIsVertical.push(isVert, isVert); aIsThroatExtra.push(isExtra, isExtra);
        }
        function getPos(u: any, v: any) {
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;
            const x = (R + r * Math.cos(phi)) * Math.cos(theta);
            const y = r * Math.sin(phi);
            const z = (R + r * Math.cos(phi)) * Math.sin(theta);
            return new THREE.Vector3(x, y, z);
        }
        let pCount = Math.max(1, Math.floor(params.unifiedPoloidalCount));
        let pSegs = Math.max(2, Math.floor(params.unifiedPoloidalSegments));
        let tCount = Math.max(1, Math.floor(params.unifiedToroidalCount));
        let tSegs = Math.max(2, Math.floor(params.unifiedToroidalSegments));
        if (isMobile) { pSegs = Math.min(pSegs, 64); tSegs = Math.min(tSegs, 64); }
        for (let i = 0; i < pCount; i++) {
            const u = i / pCount;
            for (let j = 0; j < pSegs; j++) {
                const v1 = j / pSegs; const v2 = (j + 1) / pSegs;
                pushSegment(getPos(u, v1), getPos(u, v2), u, u, v1, v2, 1.0, 0.0);
            }
        }
        for (let i = 0; i < tCount; i++) {
            const v = i / tCount;
            for (let j = 0; j < tSegs; j++) {
                const u1 = j / tSegs; const u2 = (j + 1) / tSegs;
                pushSegment(getPos(u1, v), getPos(u2, v), u1, u2, v, v, 0.0, 0.0);
            }
        }
        if (params.throatExtraEnabled) {
            const eCount = Math.max(1, Math.floor(params.throatExtraLineCount));
            const eSegs = isMobile ? 64 : Math.max(2, Math.floor(params.throatExtraSegments));
            const geomType = params.throatExtraGeomType;
            if (geomType === 'Vertical Lines' || geomType === 'Both') {
                for (let i = 0; i < eCount; i++) {
                    const u = i / eCount;
                    for (let j = 0; j < eSegs; j++) {
                        const v1 = j / eSegs; const v2 = (j + 1) / eSegs;
                        pushSegment(getPos(u, v1), getPos(u, v2), u, u, v1, v2, 1.0, 1.0);
                    }
                }
            }
            if (geomType === 'Horizontal Rings' || geomType === 'Both') {
                for (let i = 0; i < eCount; i++) {
                    const v = i / eCount;
                    for (let j = 0; j < eSegs; j++) {
                        const u1 = j / eSegs; const u2 = (j + 1) / eSegs;
                        pushSegment(getPos(u1, v), getPos(u2, v), u1, u2, v, v, 0.0, 1.0);
                    }
                }
            }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geo.setAttribute('aU', new THREE.BufferAttribute(new Float32Array(aU), 1));
        geo.setAttribute('aV', new THREE.BufferAttribute(new Float32Array(aV), 1));
        geo.setAttribute('aIsVertical', new THREE.BufferAttribute(new Float32Array(aIsVertical), 1));
        geo.setAttribute('aIsThroatExtra', new THREE.BufferAttribute(new Float32Array(aIsThroatExtra), 1));
        roverGroup.add(new THREE.LineSegments(geo, fillMaterial));
        scene.add(roverGroup);
    }

// ---- Loop Extraction Algorithm ----
function buildLoopsFromEdges(edgesGeo: any) {
    const pos = edgesGeo.attributes.position.array;
    const edges = [];
    // EdgesGeometry stores vertices in pairs
    for (let i = 0; i < pos.length; i += 6) {
        const p1 = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
        const p2 = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
        edges.push({ p1, p2, used: false });
    }

    const loops = [];

    // Trace continuous paths along the grid intersections
    for (let i = 0; i < edges.length; i++) {
        if (edges[i].used) continue;
        const currentLoop = [edges[i].p1, edges[i].p2];
        edges[i].used = true;

        // Trace Forward
        while (true) {
            const tail = currentLoop[currentLoop.length - 1];
            const prev = currentLoop[currentLoop.length - 2];
            const incomingDir = new THREE.Vector3().subVectors(tail, prev).normalize();

            let bestNextPoint: any = null;
            let bestEdgeIndex = -1;
            let bestDot = -Infinity;

            for (let j = 0; j < edges.length; j++) {
                if (edges[j].used) continue;

                let candidatePt: any = null;
                if (tail.distanceTo(edges[j].p1) < 0.001) candidatePt = edges[j].p2;
                else if (tail.distanceTo(edges[j].p2) < 0.001) candidatePt = edges[j].p1;

                if (candidatePt) {
                    const outgoingDir = new THREE.Vector3().subVectors(candidatePt, tail).normalize();
                    const dot = incomingDir.dot(outgoingDir);
                    if (dot > bestDot) {
                        bestDot = dot;
                        bestNextPoint = candidatePt;
                        bestEdgeIndex = j;
                    }
                }
            }

            // If the best connection continues roughly forward, we take it
            if (bestDot > 0.4) {
                currentLoop.push(bestNextPoint);
                edges[bestEdgeIndex].used = true;
            } else {
                break;
            }
        }

        // Trace Backward
        while (true) {
            const head = currentLoop[0];
            const next = currentLoop[1];
            const incomingDir = new THREE.Vector3().subVectors(head, next).normalize();

            let bestPrevPoint: any = null;
            let bestEdgeIndex = -1;
            let bestDot = -Infinity;

            for (let j = 0; j < edges.length; j++) {
                if (edges[j].used) continue;

                let candidatePt: any = null;
                if (head.distanceTo(edges[j].p1) < 0.001) candidatePt = edges[j].p2;
                else if (head.distanceTo(edges[j].p2) < 0.001) candidatePt = edges[j].p1;

                if (candidatePt) {
                    const outgoingDir = new THREE.Vector3().subVectors(candidatePt, head).normalize();
                    const dot = incomingDir.dot(outgoingDir);
                    if (dot > bestDot) {
                        bestDot = dot;
                        bestPrevPoint = candidatePt;
                        bestEdgeIndex = j;
                    }
                }
            }

            if (bestDot > 0.4) {
                currentLoop.unshift(bestPrevPoint);
                edges[bestEdgeIndex].used = true;
            } else {
                break;
            }
        }

        loops.push(currentLoop);
    }

    return loops;
}

// loadSelectedModel(); // Removed in favor of loadModels()

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    renderer.info.reset();
    (window as any).torusAnimId = requestAnimationFrame(animate);
    
    if (fpsDisplayVisible) {
        frameCount++;
        const now = performance.now();
        if (now - lastFpsTime >= 1000) {
            if(perfFps) perfFps.innerText = String(frameCount);
            if(perfMs) perfMs.innerText = (1000 / frameCount).toFixed(1) + ' ms';
            frameCount = 0;
            lastFpsTime = now;
        }
    }

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Update variables from GUI
    uniforms.uLightRadius.value = params.lightRadius;
    uniforms.uLightIntensity.value = params.lightIntensity;

    // Interaction
    mouse.lerp(targetMouse, delta * params.mouseLerp);
    raycaster.setFromCamera(mouse, camera);

    // Raycast: prioritize wormhole (throat) over torus
    // Since ghost meshes are removed, we just use the invisible plane for lighting interaction
    raycaster.ray.intersectPlane(invisiblePlane, targetMouseWorldPos);
    if (!hasInteracted) { targetMouseWorldPos.set(9999, 9999, 9999); }

    // Smooth lerp to avoid harsh jumps between surfaces
    const lerpSpeed = Math.min(1.0, delta * 6.0);
    mouseWorldPos.lerp(targetMouseWorldPos, lerpSpeed);

    uniforms.uTime.value = elapsedTime;
    uniforms.uMouseCenter.value.copy(mouseWorldPos);
    // Update camera/params
    camera.position.z = params.cameraZ;

    // Update model transforms
    if (roverGroup) {
        roverGroup.position.set(params.modelX, params.modelY, params.modelZ);
        // Combine base rotation (tilt + auto-rotate) + Mouse Parallax + manual rotX/Y/Z
        roverGroup.rotation.set(
            params.rotationXBase - mouse.y * params.rotationXMouse + params.rotX,
            (elapsedTime * params.rotationZSpeed) + mouse.x * params.rotationYMouse + params.rotY,
            params.rotZ
        );
        roverGroup.scale.setScalar(params.modelScale);
    }


    // Update uniforms
    uniforms.uCursorBloomMult.value = params.cursorBloomMult;
    uniforms.uBottomBloomMult.value = params.bottomBloomMult;
    uniforms.uBottomLightDiskRadius.value = params.bottomLightDiskRadius;
    uniforms.uBottomLightInnerFill.value = params.bottomLightInnerFill;
    uniforms.uTime.value = elapsedTime;
    uniforms.uGradientSpread.value = params.gradientSpread;
    uniforms.uGradientShift.value = params.gradientShift;
    uniforms.uBottomCenter.value.set(params.initialLightX, params.initialLightY, params.initialLightZ);
    uniforms.uBottomLightRadius.value = params.bottomLightRadius;
    uniforms.uBottomLightIntensity.value = params.bottomLightIntensity;
    uniforms.uBottomLightAnimEnabled.value = params.bottomLightAnimEnabled;
    uniforms.uBottomLightAnimSpeed.value = params.bottomLightAnimSpeed;
    uniforms.uBottomLightAnimAmp.value = params.bottomLightAnimAmp;
    uniforms.uBottomLightScale.value.set(params.bottomLightScaleX, params.bottomLightScaleY, params.bottomLightScaleZ);
    uniforms.uGradientOffset.value.set(params.gradientOffsetX, params.gradientOffsetY, params.gradientOffsetZ);

    // Update conveyor + roll
    uniforms.uConveyorSpeed.value = params.conveyorSpeed;
    uniforms.uTorusRollSpeed.value = params.torusRollSpeed;

    // Update fill animation uniforms
    fillUniforms.uAnimTime.value = elapsedTime;
    fillUniforms.uThroatNoiseAmplitude.value = params.throatNoiseEnabled ? params.throatNoiseAmplitude : 0.0;
    fillUniforms.uThroatNoiseScale.value = params.throatNoiseScale;
    fillUniforms.uThroatNoiseSpeed.value = params.throatNoiseSpeed;
    fillUniforms.uThroatNoiseMode.value = getNoiseMode(params.throatNoiseType, params.throatNoiseEnabled);
    fillUniforms.uThroatEdgeMask.value = params.throatEdgeMask;
    fillUniforms.uTwistAmount.value = params.animTwist;
    fillUniforms.uTwistSpeed.value = params.animTwistSpeed;
    fillUniforms.uThroatNoiseFrequency.value = params.throatNoiseFrequency;
    fillUniforms.uThroatNoiseBlend.value = params.throatNoiseBlend;
    fillUniforms.uThroatNoisePhaseShift.value = params.throatNoisePhaseShift;
    fillUniforms.uThroatNoiseLayers.value = params.throatNoiseLayers;
    // Two-layer noise zone uniforms
    fillUniforms.uThroatNoiseInnerStart.value = params.throatNoiseInnerStart;
    fillUniforms.uThroatNoiseInnerEnd.value = params.throatNoiseInnerEnd;
    fillUniforms.uThroatNoiseInnerFade.value = params.throatNoiseInnerFade;
    fillUniforms.uThroatNoiseRadialClamp.value = params.throatNoiseRadialClamp;
    fillUniforms.uThroatNoiseYWeight.value = params.throatNoiseYWeight;
    fillUniforms.uThroatNoiseRadialWeight.value = params.throatNoiseRadialWeight;

    // Update Solid Flare — Ring
    flareUniforms.uRingColor.value.set(params.ringColor);
    flareUniforms.uRingOpacity.value = params.ringOpacity;
    flareUniforms.uRingRadius.value = params.ringRadius;
    flareUniforms.uRingThickness.value = params.ringThickness;
    flareUniforms.uRingIntensity.value = params.ringIntensity;
    flareUniforms.uRingOffset.value.set(params.ringXOffset, params.ringZOffset);
    flareUniforms.uRingScale.value.set(params.ringScaleX, params.ringScaleY);
    // Update Solid Flare — Ring 2
    flareUniforms.uRing2Enabled.value = params.ring2Enabled;
    flareUniforms.uRing2Color.value.set(params.ring2Color);
    flareUniforms.uRing2Opacity.value = params.ring2Opacity;
    flareUniforms.uRing2Radius.value = params.ring2Radius;
    flareUniforms.uRing2Thickness.value = params.ring2Thickness;
    flareUniforms.uRing2Intensity.value = params.ring2Intensity;
    flareUniforms.uRing2Offset.value.set(params.ring2XOffset, params.ring2ZOffset);
    flareUniforms.uRing2Scale.value.set(params.ring2ScaleX, params.ring2ScaleY);
    // Update Solid Flare — Glow
    flareUniforms.uGlowColor.value.set(params.glowFlareColor);
    flareUniforms.uGlowOpacity.value = params.glowFlareOpacity;
    flareUniforms.uGlowRadius.value = params.glowFlareRadius;
    flareUniforms.uGlowIntensity.value = params.glowFlareIntensity;
    flareUniforms.uGlowOffset.value.set(params.glowFlareXOffset, params.glowFlareZOffset);
    flareUniforms.uGlowScale.value.set(params.glowFlareScaleX, params.glowFlareScaleY);
    flareUniforms.uGlowYOffset.value = params.glowFlareYOffset;
    flareUniforms.uGlowAnimEnabled.value = params.glowFlareAnimEnabled;
    flareUniforms.uGlowAnimWobbleSpeed.value = params.glowFlareAnimWobbleSpeed;
    flareUniforms.uGlowAnimWobbleAmp.value = params.glowFlareAnimWobbleAmp;
    flareUniforms.uGlowAnimPulseSpeed.value = params.glowFlareAnimPulseSpeed;
    flareUniforms.uGlowAnimPulseAmp.value = params.glowFlareAnimPulseAmp;
    flareUniforms.uRingYOffset.value = params.ringYOffset;
    // Flare reveal progress is synced via shared uniform references (uHaloRevealProgress, uInnerFlareRevealProgress)
    if (flareMeshRef) {
        flareMeshRef.position.set(0, params.ringYOffset, 0);
    }

    // Update unified geometry radii
    uniforms.uTorusMajorR.value = params.unifiedMajorRadius;
    uniforms.uTorusMinorR.value = params.unifiedMinorRadius;

    // Update mask uniforms
    uniforms.uNeckShowVertical.value = params.neckShowVertical;
    uniforms.uNeckShowRings.value = params.neckShowRings;
    uniforms.uTorusShowVertical.value = params.torusShowVertical;
    uniforms.uTorusShowRings.value = params.torusShowRings;

    uniforms.uNeckBackCutStart.value = params.neckBackCutStart;
    uniforms.uNeckBackCutFade.value = params.neckBackCutFade;
    uniforms.uNeckBackCutEnabled.value = params.neckBackCutEnabled;
    uniforms.uThroatMaskStart.value = params.throatMaskStart;
    uniforms.uThroatMaskEnd.value = params.throatMaskEnd;
    uniforms.uThroatMaskFade.value = params.throatMaskFade;
    uniforms.uThroatExtraTopV.value = params.throatExtraTopV;
    uniforms.uThroatExtraBottomV.value = params.throatExtraBottomV;
    uniforms.uThroatExtraTopFade.value = params.throatExtraTopFade;
    uniforms.uThroatExtraBottomFade.value = params.throatExtraBottomFade;

    uniforms.uLocalGlowEnabled.value = params.localGlowEnabled;
    uniforms.uLocalGlowCenter.value.set(params.localGlowX, params.localGlowY, params.localGlowZ);
    uniforms.uLocalGlowAnimEnabled.value = params.localGlowAnimEnabled;
    uniforms.uLocalGlowAnimSpeed.value = params.localGlowAnimSpeed;
    uniforms.uLocalGlowAnimAmp.value = params.localGlowAnimAmp;
    uniforms.uLocalGlowScale.value.set(params.localGlowScaleX, params.localGlowScaleY, params.localGlowScaleZ);
    uniforms.uLocalGlowRadius.value = params.localGlowRadius;
    uniforms.uLocalGlowIntensity.value = params.localGlowIntensity;
    uniforms.uLocalGlowBloomMult.value = params.localGlowBloomMult;

    // Update torus clip mask (3D plane)
    uniforms.uTorusClipEnabled.value = params.torusClipEnabled;
    uniforms.uTorusClipPoint.value.set(params.torusClipX, params.torusClipY, params.torusClipZ);
    uniforms.uTorusClipNormal.value.set(params.torusClipNX, params.torusClipNY, params.torusClipNZ);
    uniforms.uTorusClipFade.value = params.torusClipFade;
    uniforms.uTorusClipFlip.value = params.torusClipFlip;

    composer.render();
    
    if (fpsDisplayVisible && frameCount === 0) { // Update detailed stats only once per second to avoid DOM spam
        if(perfCalls) perfCalls.innerText = String(renderer.info.render.calls);
        if(perfTriangles) perfTriangles.innerText = String(renderer.info.render.triangles.toLocaleString());
        if(perfGeometries) perfGeometries.innerText = String(renderer.info.memory.geometries);
        if(perfTextures) perfTextures.innerText = String(renderer.info.memory.textures);
    }
}

// Final Initialization
function initGui() {
    const gui = new GUI({ title: 'Torus Tuner (Production)' });
    
    const colorsFolder = gui.addFolder('Colors');
    colorsFolder.addColor(params, 'lineColor').name('Line Color (Base)').onChange((val: any) => uniforms.uLineColor.value.set(val));
    colorsFolder.addColor(params, 'glowColor').name('Glow Color (Light)').onChange((val: any) => uniforms.uGlowColor.value.set(val));
    colorsFolder.addColor(params, 'glowColor2').name('Glow Color 2 (Gradient)').onChange((val: any) => uniforms.uGlowColor2.value.set(val));
    colorsFolder.addColor(params, 'cursorLightColor').name('Cursor Color').onChange((val: any) => uniforms.uCursorColor.value.set(val));

    const bottomAnimFolder = gui.addFolder('Bottom Light Animation');
    bottomAnimFolder.add(params, 'bottomLightAnimEnabled').name('Enable Animation');
    bottomAnimFolder.add(params, 'bottomLightAnimSpeed', 0.0, 5.0).name('Anim Speed');
    bottomAnimFolder.add(params, 'bottomLightAnimAmp', 0.0, 2.0).name('Anim Amplitude');

    const localAnimFolder = gui.addFolder('Local Glow Animation');
    localAnimFolder.add(params, 'localGlowAnimEnabled').name('Enable Animation');
    localAnimFolder.add(params, 'localGlowAnimSpeed', 0.0, 5.0).name('Anim Speed');
    localAnimFolder.add(params, 'localGlowAnimAmp', 0.0, 2.0).name('Anim Amplitude');

    const flareAnimFolder = gui.addFolder('Inner Flare Animation');
    flareAnimFolder.add(params, 'glowFlareAnimEnabled').name('Enable Animation');
    flareAnimFolder.add(params, 'glowFlareAnimWobbleSpeed', 0.0, 5.0).name('Wobble Speed');
    flareAnimFolder.add(params, 'glowFlareAnimWobbleAmp', 0.0, 0.5).name('Wobble Amp');
    flareAnimFolder.add(params, 'glowFlareAnimPulseSpeed', 0.0, 5.0).name('Pulse Speed');
    flareAnimFolder.add(params, 'glowFlareAnimPulseAmp', 0.0, 0.5).name('Pulse Amp');

    const cameraFolder = gui.addFolder('Camera & Rotation');
    cameraFolder.add(params, 'cameraZ', 1, 30).name('Camera Z').onChange((val: any) => { camera.position.z = val; });
    cameraFolder.add(params, 'rotationXBase', -Math.PI, Math.PI).name('Base Tilt (X)');
    cameraFolder.add(params, 'rotationZSpeed', 0, 0.5).name('Auto Rotation Speed');
    cameraFolder.add(params, 'mouseLerp', 0.1, 10).name('Mouse Smoothness');
    cameraFolder.add(params, 'rotationXMouse', 0, 2).name('Mouse X Sensitivity');
    cameraFolder.add(params, 'rotationYMouse', 0, 2).name('Mouse Y Sensitivity');

    const noiseFolder = gui.addFolder('Throat Noise');
    noiseFolder.add(params, 'throatNoiseEnabled').name('Enable Noise');
    noiseFolder.add(params, 'throatNoiseType', ['simplex', 'fbm', 'curl']).name('Noise Type');
    noiseFolder.add(params, 'throatNoiseAmplitude', 0.0, 1.0).name('Amplitude');
    noiseFolder.add(params, 'throatNoiseSpeed', 0.01, 3.0).name('Noise Speed');
    noiseFolder.add(params, 'throatNoiseFrequency', 0.1, 10.0).name('Frequency');
    noiseFolder.add(params, 'throatNoiseScale', 0.1, 10.0).name('Noise Scale');
    
    // --- Torus Clip Mask (full 3D plane) ---
    const torusClipFolder = gui.addFolder('Torus Clip Mask');
    torusClipFolder.add(params, 'torusClipEnabled').name('Enable Clip');
    torusClipFolder.add(params, 'torusClipFlip').name('Flip Side');
    torusClipFolder.add(params, 'torusClipFade', 0.0, 2.0).name('Clip Fade');
    const clipPosFolder = torusClipFolder.addFolder('Plane Position');
    clipPosFolder.add(params, 'torusClipX', -5.0, 5.0).name('Position X');
    clipPosFolder.add(params, 'torusClipY', -5.0, 5.0).name('Position Y');
    clipPosFolder.add(params, 'torusClipZ', -5.0, 5.0).name('Position Z');
    const clipNormFolder = torusClipFolder.addFolder('Plane Normal (Direction)');
    clipNormFolder.add(params, 'torusClipNX', -1.0, 1.0).name('Normal X');
    clipNormFolder.add(params, 'torusClipNY', -1.0, 1.0).name('Normal Y');
    clipNormFolder.add(params, 'torusClipNZ', -1.0, 1.0).name('Normal Z');
    
    gui.add(params, 'togglePerformanceGraph').name('📈 Toggle Perf Graph');
}

// Initial setup
if (debug) {
    initGui();
}
rebuildRover();
updateModelBounds();

// Set initial scale to 0 (it will be animated in triggerManifestation)
params.modelScale = 0;

// Watch for manual trigger
(window as any).triggerTorusManifest = triggerManifestation;

// If we are already told to manifest on mount, do it after a small delay to ensure assets are ready
if (shouldManifest) {
    setTimeout(triggerManifestation, 100);
}

animate();


        return () => {
            isDestroyed = true;
            if ((window as any).torusAnimId) cancelAnimationFrame((window as any).torusAnimId);
            if ((window as any).revealAnimId) cancelAnimationFrame((window as any).revealAnimId);
            document.getElementById('perf-monitor')?.remove();
            document.querySelectorAll('.lil-gui').forEach(el => el.remove());
            try {
                if (typeof renderer !== 'undefined' && renderer) renderer.dispose();
                if (typeof scene !== 'undefined' && scene) scene.traverse((obj: any) => {
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
                        else obj.material.dispose();
                    }
                });
            } catch(e) {}
        };
    }, [shouldManifest, debug]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'auto', background: 'transparent' }} />
        </div>
    );
}
