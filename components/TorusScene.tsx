'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import gsap from 'gsap';

const PARAMS = {
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
    flareEnabled: true,
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
    glowFlareColor: '#0aadff',
    glowFlareOpacity: 0.28,
    glowFlareRadius: 3.4165,
    glowFlareIntensity: 7.3567,
    glowFlareXOffset: -2.06,
    glowFlareYOffset: -3.55,
    glowFlareZOffset: 0.11,
    glowFlareScaleX: 0.4773,
    glowFlareScaleY: 1.3397,
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
    gradientOffsetX: 0.0,
    gradientOffsetY: 0.0,
    gradientOffsetZ: 0.0,
    cameraZ: 4.19,
    rotationXBase: 0.263893,
    mouseLerp: 3.0,
    lightRadius: 1.189,
    lightIntensity: 2.7865,
    modelScale: 0.3891,
    bloomStrength: 0.165,
    bloomRadius: 0,
    bloomThreshold: 0.16,
    chromaAmount: 0.00097,
    revealProgress: -10.0,
    manifestSpeed: 2.0,
    manifestAxis: 'Y',
    revealStartOffset: -2.0,
    revealEndOffset: 2,
    torusManifestSpeed: 1.0,
    torusManifestDelay: 0.0,
    haloManifestSpeed: 1.0,
    haloManifestDelay: 0.0,
    innerFlareManifestSpeed: 2.0,
    innerFlareManifestDelay: 1.8,
    unifiedMajorRadius: 1.974,
    unifiedMinorRadius: 1.39,
    unifiedPoloidalCount: 20,
    unifiedToroidalCount: 19,
    unifiedPoloidalSegments: 128,
    unifiedToroidalSegments: 128,
    neckShowVertical: true,
    neckShowRings: false,
    torusShowVertical: true,
    torusShowRings: true,
    conveyorSpeed: 0.016,
    torusRollSpeed: 0.0,
    throatMaskStart: 0.27,
    throatMaskEnd: 0.73,
    throatMaskFade: 0.03,
    neckBackCutEnabled: true,
    neckBackCutStart: 0.1375,
    neckBackCutFade: 0.1284,
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

const FILL_VERTEX_SHADER = `
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
uniform float uConveyorSpeed;
uniform float uTorusRollSpeed;
uniform float uTorusMajorR;
uniform float uTorusMinorR;

void main() {
    vOpacity = 1.0;
    vIsVertical = aIsVertical;
    vIsThroatExtra = aIsThroatExtra;
    vVOriginal = aV;
    vU = aU;

    float u = aU;
    float v = aV;
    
    if (aIsThroatExtra < 0.5) {
        v = fract(aV + uAnimTime * uConveyorSpeed);
        if (aIsVertical < 0.5 && abs(uTorusRollSpeed) > 0.001) {
            u = fract(aU + uAnimTime * uTorusRollSpeed);
        }
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

const FRAGMENT_SHADER = `
uniform float uTime;
uniform vec3 uMouseCenter;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;
uniform vec3 uGlowColor2;
uniform vec3 uCursorColor;
uniform float uCursorBloomMult;
uniform float uBottomBloomMult;
uniform float uGradientSpread;
uniform float uGradientShift;
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

uniform bool uLocalGlowEnabled;
uniform vec3 uLocalGlowCenter;
uniform vec3 uLocalGlowScale;
uniform float uLocalGlowRadius;
uniform float uLocalGlowIntensity;
uniform float uLocalGlowBloomMult;
uniform vec3 uLocalGlowColor;

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

uniform bool uTorusClipEnabled;
uniform vec3 uTorusClipPoint;
uniform vec3 uTorusClipNormal;
uniform float uTorusClipFade;
uniform bool uTorusClipFlip;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
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
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
    float posProjection = dot(vPosition, uRevealDir);
    float noiseOffset = snoise(vec3(vPosition.x * 10.0, vPosition.z * 10.0, uTime * 0.5)) * 0.04;
    float threshold = posProjection + noiseOffset;
    
    if (threshold > uRevealProgress) {
        discard; 
    }

    vec3 lineColor = uLineColor;
    float edgeWidth = 0.03;
    float distToEdge = abs(threshold - uRevealProgress);
    float edgeFactor = smoothstep(edgeWidth, 0.0, distToEdge);
    vec3 manifestEdge = lineColor * edgeFactor * 5.0;

    float rHorizontal = length(vPosition.xz - uBottomCenter.xz);
    float hDistStroke = abs(rHorizontal - uBottomLightDiskRadius);
    float vDist = abs(vPosition.y - uBottomCenter.y);
    vec3 diffBottom = vec3(hDistStroke, vDist, 0.0) / uBottomLightScale;
    float distBottomStroke = length(diffBottom);
    float edgeLight = smoothstep(uBottomLightRadius, 0.0, distBottomStroke);
    vec3 diffFill = vec3(0.0, vDist, 0.0) / uBottomLightScale;
    float distFill = length(diffFill);
    float innerLight = smoothstep(uBottomLightRadius, 0.0, distFill) * uBottomLightInnerFill;
    if (rHorizontal > uBottomLightDiskRadius) innerLight = 0.0;
    float bottomLight = max(edgeLight, innerLight);
    
    float rHorizGrad = length(vPosition.xz - (uBottomCenter.xz + uGradientOffset.xz));
    float hDistGrad = abs(rHorizGrad - uBottomLightDiskRadius);
    float vDistGrad = abs(vPosition.y - (uBottomCenter.y + uGradientOffset.y));
    float distGradient = length(vec3(hDistGrad, vDistGrad, 0.0) / uBottomLightScale);
    float gradientTBottom = smoothstep(0.0, uBottomLightRadius * uGradientSpread, distGradient) + uGradientShift;
    gradientTBottom = clamp(gradientTBottom, 0.0, 1.0);
    vec3 gradientGlowColorBottom = mix(uGlowColor2, uGlowColor, gradientTBottom);
    
    float distMouse = distance(vWorldPosition, uMouseCenter);
    float mouseLight = smoothstep(uLightRadius * 0.7, 0.0, distMouse);
    float noiseVal = snoise(vec3(vPosition.x * 2.0, vPosition.y * 5.0, uTime * 0.3));
    float shimmer = smoothstep(0.3, 0.7, noiseVal);

    vec3 baseCol = lineColor * 0.15;
    vec3 bottomGlow = gradientGlowColorBottom * (bottomLight * uBottomLightIntensity * uBottomBloomMult);
    vec3 mouseGlow = uCursorColor * (mouseLight * uLightIntensity * uCursorBloomMult);
    vec3 ambientGlow = uGlowColor * (shimmer * 0.8);
    
    vec3 localGlowRes = vec3(0.0);
    if (uLocalGlowEnabled) {
        vec3 diffLocal = (vPosition - uLocalGlowCenter) / uLocalGlowScale;
        float distLocal = length(diffLocal);
        float lGlow = smoothstep(uLocalGlowRadius, 0.0, distLocal);
        localGlowRes = uLocalGlowColor * (lGlow * uLocalGlowIntensity * uLocalGlowBloomMult);
    }
    
    float finalOpacity = vOpacity;
    float neckMask = smoothstep(uThroatMaskStart - uThroatMaskFade, uThroatMaskStart + uThroatMaskFade, vV)
                   * smoothstep(uThroatMaskEnd + uThroatMaskFade, uThroatMaskEnd - uThroatMaskFade, vV);
    
    float visibility = 0.0;
    if (vIsVertical > 0.5) {
        visibility = mix(uTorusShowVertical ? 1.0 : 0.0, uNeckShowVertical ? 1.0 : 0.0, neckMask);
    } else {
        visibility = mix(uTorusShowRings ? 1.0 : 0.0, uNeckShowRings ? 1.0 : 0.0, neckMask);
    }
    
    if (uNeckBackCutEnabled) {
        float deepNeck = smoothstep(0.30, 0.40, vV) * smoothstep(0.70, 0.60, vV);
        float backCut = smoothstep(uNeckBackCutStart, uNeckBackCutStart + uNeckBackCutFade, vU)
                      * smoothstep(1.0 - uNeckBackCutStart, 1.0 - uNeckBackCutStart - uNeckBackCutFade, vU);
        finalOpacity *= mix(1.0, backCut, deepNeck);
    }
    
    if (uTorusClipEnabled) {
        float clipDist = dot(vPosition - uTorusClipPoint, normalize(uTorusClipNormal));
        if (uTorusClipFlip) clipDist = -clipDist;
        finalOpacity *= smoothstep(uTorusClipFade, -uTorusClipFade, clipDist);
    }
    
    finalOpacity *= visibility;
    if (finalOpacity < 0.01) discard;
    
    vec3 finalColor = baseCol + bottomGlow + mouseGlow + ambientGlow + manifestEdge + localGlowRes;
    gl_FragColor = vec4(finalColor * finalOpacity, finalOpacity);
}
`;

const FLARE_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vPos;
void main() {
    vUv = uv;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FLARE_FRAGMENT_SHADER = `
uniform vec3 uRingColor;
uniform float uRingOpacity;
uniform float uRingRadius;
uniform float uRingThickness;
uniform float uRingIntensity;
uniform vec2 uRingOffset;
uniform vec2 uRingScale;
uniform bool uRing2Enabled;
uniform vec3 uRing2Color;
uniform float uRing2Opacity;
uniform float uRing2Radius;
uniform float uRing2Thickness;
uniform float uRing2Intensity;
uniform vec2 uRing2Offset;
uniform vec2 uRing2Scale;
uniform vec3 uGlowColor;
uniform float uGlowOpacity;
uniform float uGlowRadius;
uniform float uGlowIntensity;
uniform vec2 uGlowOffset;
uniform vec2 uGlowScale;
uniform float uGlowYOffset;
uniform float uRevealProgress;
uniform float uHaloRevealProgress;
uniform float uInnerFlareRevealProgress;
uniform vec3 uRevealDir;
uniform float uRingYOffset;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

void main() {
    vec3 groupPos = vec3(vPos.x, uRingYOffset, -vPos.y);
    float posProjRing = dot(groupPos, uRevealDir);
    float flareFadeWidth = 0.8; 
    float revealRing = 1.0 - smoothstep(uHaloRevealProgress, uHaloRevealProgress + flareFadeWidth, posProjRing);
    
    vec3 glowGroupPos = vec3(vPos.x, uGlowYOffset, -vPos.y);
    float posProjGlow = dot(glowGroupPos, uRevealDir);
    float revealGlow = 1.0 - smoothstep(uInnerFlareRevealProgress, uInnerFlareRevealProgress + flareFadeWidth, posProjGlow);
    
    vec2 ringPos = (vPos.xy - uRingOffset) / uRingScale;
    float rRing = length(ringPos);
    float ringDist = abs(rRing - uRingRadius * 0.8);
    float ringGlow = smoothstep(uRingThickness, 0.0, ringDist) * 0.5;
    vec3 ringResult = (uRingColor * ringGlow * uRingIntensity) * revealRing;
    float ringAlpha = ringGlow * uRingOpacity * revealRing;
    
    vec3 ring2Result = vec3(0.0);
    float ring2Alpha = 0.0;
    if (uRing2Enabled) {
        vec2 ring2Pos = (vPos.xy - uRing2Offset) / uRing2Scale;
        float rRing2 = length(ring2Pos);
        float ring2Dist = abs(rRing2 - uRing2Radius * 0.8);
        float ring2Glow = smoothstep(uRing2Thickness, 0.0, ring2Dist) * 0.5;
        ring2Result = (uRing2Color * ring2Glow * uRing2Intensity) * revealRing;
        ring2Alpha = ring2Glow * uRing2Opacity * revealRing;
    }
    
    vec2 glowPos = (vPos.xy - uGlowOffset) / uGlowScale;
    float rGlow = length(glowPos);
    float centerGlow = smoothstep(uGlowRadius * 0.4, 0.0, rGlow);
    vec3 glowResult = (uGlowColor * centerGlow * uGlowIntensity) * revealGlow;
    float glowAlpha = centerGlow * uGlowOpacity * revealGlow;
    
    vec3 color = ringResult + ring2Result + glowResult;
    float alpha = max(max(ringAlpha, ring2Alpha), glowAlpha);
    if (alpha < 0.001) discard;
    gl_FragColor = vec4(color, alpha);
}
`;

export default function TorusScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = PARAMS.cameraZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    mountRef.current.appendChild(renderer.domElement);

    // Uniforms
    const uniforms = {
        uTime: { value: 0 },
        uAnimTime: { value: 0 },
        uMouseCenter: { value: new THREE.Vector3(0, 0, 0) },
        uLineColor: { value: new THREE.Color(PARAMS.lineColor) },
        uGlowColor: { value: new THREE.Color(PARAMS.glowColor) },
        uGlowColor2: { value: new THREE.Color(PARAMS.glowColor2) },
        uCursorColor: { value: new THREE.Color(PARAMS.cursorLightColor) },
        uCursorBloomMult: { value: PARAMS.cursorBloomMult },
        uBottomBloomMult: { value: PARAMS.bottomBloomMult },
        uGradientSpread: { value: PARAMS.gradientSpread },
        uGradientShift: { value: PARAMS.gradientShift },
        uLightRadius: { value: PARAMS.lightRadius },
        uLightIntensity: { value: PARAMS.lightIntensity },
        uBottomLightRadius: { value: PARAMS.bottomLightRadius },
        uBottomLightIntensity: { value: PARAMS.bottomLightIntensity },
        uBottomLightScale: { value: new THREE.Vector3(PARAMS.bottomLightScaleX, PARAMS.bottomLightScaleY, PARAMS.bottomLightScaleZ) },
        uGradientOffset: { value: new THREE.Vector3(PARAMS.gradientOffsetX, PARAMS.gradientOffsetY, PARAMS.gradientOffsetZ) },
        uBottomLightDiskRadius: { value: PARAMS.bottomLightDiskRadius },
        uBottomLightInnerFill: { value: PARAMS.bottomLightInnerFill },
        uRevealProgress: { value: PARAMS.revealProgress },
        uRevealDir: { value: new THREE.Vector3(0, 1, 0) },
        uHaloRevealProgress: { value: -10.0 },
        uInnerFlareRevealProgress: { value: -10.0 },
        uBottomCenter: { value: new THREE.Vector3(PARAMS.initialLightX, PARAMS.initialLightY, PARAMS.initialLightZ) },
        uConveyorSpeed: { value: PARAMS.conveyorSpeed },
        uTorusRollSpeed: { value: PARAMS.torusRollSpeed },
        uTorusMajorR: { value: PARAMS.unifiedMajorRadius },
        uTorusMinorR: { value: PARAMS.unifiedMinorRadius },
        uNeckShowVertical: { value: PARAMS.neckShowVertical },
        uNeckShowRings: { value: PARAMS.neckShowRings },
        uTorusShowVertical: { value: PARAMS.torusShowVertical },
        uTorusShowRings: { value: PARAMS.torusShowRings },
        uNeckBackCutStart: { value: PARAMS.neckBackCutStart },
        uNeckBackCutFade: { value: PARAMS.neckBackCutFade },
        uNeckBackCutEnabled: { value: PARAMS.neckBackCutEnabled },
        uThroatMaskStart: { value: PARAMS.throatMaskStart },
        uThroatMaskEnd: { value: PARAMS.throatMaskEnd },
        uThroatMaskFade: { value: PARAMS.throatMaskFade },
        uLocalGlowEnabled: { value: PARAMS.localGlowEnabled },
        uLocalGlowCenter: { value: new THREE.Vector3(PARAMS.localGlowX, PARAMS.localGlowY, PARAMS.localGlowZ) },
        uLocalGlowScale: { value: new THREE.Vector3(PARAMS.localGlowScaleX, PARAMS.localGlowScaleY, PARAMS.localGlowScaleZ) },
        uLocalGlowRadius: { value: PARAMS.localGlowRadius },
        uLocalGlowIntensity: { value: PARAMS.localGlowIntensity },
        uLocalGlowBloomMult: { value: PARAMS.localGlowBloomMult },
        uLocalGlowColor: { value: new THREE.Color(PARAMS.localGlowColor) },
        uTorusClipEnabled: { value: PARAMS.torusClipEnabled },
        uTorusClipPoint: { value: new THREE.Vector3(PARAMS.torusClipX, PARAMS.torusClipY, PARAMS.torusClipZ) },
        uTorusClipNormal: { value: new THREE.Vector3(PARAMS.torusClipNX, PARAMS.torusClipNY, PARAMS.torusClipNZ) },
        uTorusClipFade: { value: PARAMS.torusClipFade },
        uTorusClipFlip: { value: PARAMS.torusClipFlip }
    };

    const fillMaterial = new THREE.ShaderMaterial({
        vertexShader: FILL_VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const flareUniforms = {
        uRingColor: { value: new THREE.Color(PARAMS.ringColor) },
        uRingOpacity: { value: PARAMS.ringOpacity },
        uRingRadius: { value: PARAMS.ringRadius },
        uRingThickness: { value: PARAMS.ringThickness },
        uRingIntensity: { value: PARAMS.ringIntensity },
        uRingOffset: { value: new THREE.Vector2(PARAMS.ringXOffset, PARAMS.ringZOffset) },
        uRingScale: { value: new THREE.Vector2(PARAMS.ringScaleX, PARAMS.ringScaleY) },
        uRing2Enabled: { value: PARAMS.ring2Enabled },
        uRing2Color: { value: new THREE.Color(PARAMS.ring2Color) },
        uRing2Opacity: { value: PARAMS.ring2Opacity },
        uRing2Radius: { value: PARAMS.ring2Radius },
        uRing2Thickness: { value: PARAMS.ring2Thickness },
        uRing2Intensity: { value: PARAMS.ring2Intensity },
        uRing2Offset: { value: new THREE.Vector2(PARAMS.ring2XOffset, PARAMS.ring2ZOffset) },
        uRing2Scale: { value: new THREE.Vector2(PARAMS.ring2ScaleX, PARAMS.ring2ScaleY) },
        uGlowColor: { value: new THREE.Color(PARAMS.glowFlareColor) },
        uGlowOpacity: { value: PARAMS.glowFlareOpacity },
        uGlowRadius: { value: PARAMS.glowFlareRadius },
        uGlowIntensity: { value: PARAMS.glowFlareIntensity },
        uGlowOffset: { value: new THREE.Vector2(PARAMS.glowFlareXOffset, PARAMS.glowFlareZOffset) },
        uGlowScale: { value: new THREE.Vector2(PARAMS.glowFlareScaleX, PARAMS.glowFlareScaleY) },
        uGlowYOffset: { value: PARAMS.glowFlareYOffset },
        uRevealProgress: uniforms.uRevealProgress,
        uHaloRevealProgress: uniforms.uHaloRevealProgress,
        uInnerFlareRevealProgress: uniforms.uInnerFlareRevealProgress,
        uRevealDir: uniforms.uRevealDir,
        uRingYOffset: { value: PARAMS.ringYOffset },
        uTime: uniforms.uTime
    };

    const flareMaterial = new THREE.ShaderMaterial({
        vertexShader: FLARE_VERTEX_SHADER,
        fragmentShader: FLARE_FRAGMENT_SHADER,
        uniforms: flareUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const roverGroup = new THREE.Group();
    roverGroup.scale.set(PARAMS.modelScale, PARAMS.modelScale, PARAMS.modelScale);
    roverGroup.rotation.x = PARAMS.rotationXBase;
    scene.add(roverGroup);

    // Flare Mesh
    const flareGeo = new THREE.PlaneGeometry(20, 20);
    const flareMesh = new THREE.Mesh(flareGeo, flareMaterial);
    flareMesh.rotation.x = -Math.PI / 2;
    flareMesh.position.set(0, PARAMS.ringYOffset, 0);
    roverGroup.add(flareMesh);

    // Geometry Builder
    const R = PARAMS.unifiedMajorRadius;
    const r = PARAMS.unifiedMinorRadius;

    function addLine(positions: Float32Array, uArr: Float32Array, vArr: Float32Array, isVertArr: Float32Array) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aU', new THREE.BufferAttribute(uArr, 1));
        geo.setAttribute('aV', new THREE.BufferAttribute(vArr, 1));
        geo.setAttribute('aIsVertical', new THREE.BufferAttribute(isVertArr, 1));
        geo.setAttribute('aIsThroatExtra', new THREE.BufferAttribute(new Float32Array(uArr.length).fill(0), 1));
        roverGroup.add(new THREE.Line(geo, fillMaterial));
    }

    // Poloidal Lines
    for (let i = 0; i < PARAMS.unifiedPoloidalCount; i++) {
        const u = i / PARAMS.unifiedPoloidalCount;
        const n = PARAMS.unifiedPoloidalSegments + 1;
        const pos = new Float32Array(n * 3);
        const aU = new Float32Array(n);
        const aV = new Float32Array(n);
        const aIsVertical = new Float32Array(n);
        for (let j = 0; j <= PARAMS.unifiedPoloidalSegments; j++) {
            const v = j / PARAMS.unifiedPoloidalSegments;
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;
            pos[j * 3] = (R + r * Math.cos(phi)) * Math.cos(theta);
            pos[j * 3 + 1] = r * Math.sin(phi);
            pos[j * 3 + 2] = (R + r * Math.cos(phi)) * Math.sin(theta);
            aU[j] = u; aV[j] = v; aIsVertical[j] = 1.0;
        }
        addLine(pos, aU, aV, aIsVertical);
    }

    // Toroidal Rings
    for (let i = 0; i < PARAMS.unifiedToroidalCount; i++) {
        const v = i / PARAMS.unifiedToroidalCount;
        const n = PARAMS.unifiedToroidalSegments + 1;
        const pos = new Float32Array(n * 3);
        const aU = new Float32Array(n);
        const aV = new Float32Array(n);
        const aIsVertical = new Float32Array(n);
        for (let j = 0; j <= PARAMS.unifiedToroidalSegments; j++) {
            const u = j / PARAMS.unifiedToroidalSegments;
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;
            pos[j * 3] = (R + r * Math.cos(phi)) * Math.cos(theta);
            pos[j * 3 + 1] = r * Math.sin(phi);
            pos[j * 3 + 2] = (R + r * Math.cos(phi)) * Math.sin(theta);
            aU[j] = u; aV[j] = v; aIsVertical[j] = 0.0;
        }
        addLine(pos, aU, aV, aIsVertical);
    }

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), PARAMS.bloomStrength, PARAMS.bloomRadius, PARAMS.bloomThreshold);
    composer.addPass(bloomPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms['amount'].value = PARAMS.chromaAmount;
    composer.addPass(rgbShiftPass);
    composer.addPass(new OutputPass());

    // Manifestation Animation
    const start = -3.0;
    const end = 3.0;
    const manifestState = { 
        torus: start,
        halo: start,
        flare: start
    };

    gsap.to(manifestState, {
        torus: end,
        duration: 2.5 / PARAMS.torusManifestSpeed,
        delay: PARAMS.torusManifestDelay,
        ease: 'power2.inOut',
        onUpdate: () => {
            uniforms.uRevealProgress.value = manifestState.torus;
        }
    });

    gsap.to(manifestState, {
        halo: end,
        duration: 2.5 / PARAMS.haloManifestSpeed,
        delay: PARAMS.haloManifestDelay,
        ease: 'power2.inOut',
        onUpdate: () => {
            uniforms.uHaloRevealProgress.value = manifestState.halo;
        }
    });

    gsap.to(manifestState, {
        flare: end,
        duration: 2.5 / PARAMS.innerFlareManifestSpeed,
        delay: PARAMS.innerFlareManifestDelay,
        ease: 'power2.inOut',
        onUpdate: () => {
            uniforms.uInnerFlareRevealProgress.value = manifestState.flare;
        }
    });

    // Interaction
    const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        const target = new THREE.Vector3(x * 5, y * 5, 0);
        gsap.to(uniforms.uMouseCenter.value, {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 0.5
        });
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = (time: number) => {
        const t = time * 0.001;
        uniforms.uTime.value = t;
        uniforms.uAnimTime.value = t;
        composer.render();
        animationFrameId = requestAnimationFrame(animate);
    };
    animate(0);

    const handleResize = () => {
        const w = mountRef.current?.clientWidth || window.innerWidth;
        const h = mountRef.current?.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      mountRef.current?.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
}
