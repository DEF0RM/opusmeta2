const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

// 1. Revert params
code = code.replace(
`    // --- Cyclic Path Flow ---
    pathFlowEnabled: true,
    pathFlowSpeed: 0.5`,
`    // --- Unified Line Flow ---
    flowEnabled: true,
    flowSpeed: 1.0,
    flowRepeats: 10.0,
    flowAmplitude: 0.05`
);

// 2. Revert GUI
code = code.replace(
`    // --- Cyclic Path Flow ---
    const flowFolder = gui.addFolder('Cyclic Path Flow');
    flowFolder.add(params, 'pathFlowEnabled').name('Enable Flow');
    flowFolder.add(params, 'pathFlowSpeed', -10.0, 10.0).name('Flow Speed');`,
`    // --- Unified Line Flow ---
    const flowFolder = gui.addFolder('Unified Line Flow (Vertical Y)');
    flowFolder.add(params, 'flowEnabled').name('Enable').onChange(rebuildRover);
    flowFolder.add(params, 'animFlowY', -10.0, 10.0).name('Global Flow Down');
    flowFolder.add(params, 'flowSpeed', 0.1, 5.0).name('Ripple Speed');
    flowFolder.add(params, 'flowRepeats', 1.0, 30.0).name('Ripple Repeats');
    flowFolder.add(params, 'flowAmplitude', 0.0, 0.5).name('Ripple Size');`
);

// 3. Revert uniforms
code = code.replace(
`    uPathData: { value: null },
    uNumPaths: { value: 0 },
    uPathFlowSpeed: { value: params.pathFlowSpeed },
    uPathFlowEnabled: { value: params.pathFlowEnabled }`,
`    uFlowEnabled: { value: params.flowEnabled },
    uFlowSpeed: { value: params.flowSpeed },
    uFlowRepeats: { value: params.flowRepeats },
    uFlowAmplitude: { value: params.flowAmplitude },
    uFlowY: { value: params.animFlowY }`
);

code = code.replace(
`    uPathData: { value: null },
    uNumPaths: { value: 0 },
    uPathFlowSpeed: { value: params.pathFlowSpeed },
    uPathFlowEnabled: { value: params.pathFlowEnabled }`,
`    uFlowEnabled: { value: params.flowEnabled },
    uFlowSpeed: { value: params.flowSpeed },
    uFlowRepeats: { value: params.flowRepeats },
    uFlowAmplitude: { value: params.flowAmplitude },
    uFlowY: { value: params.animFlowY }`
);

// 4. Update animate uniforms
code = code.replace(
`    // Update Flow Uniforms
    uniforms.uPathFlowEnabled.value = params.pathFlowEnabled;
    uniforms.uPathFlowSpeed.value = params.pathFlowSpeed;
    fillUniforms.uPathFlowEnabled.value = params.pathFlowEnabled;
    fillUniforms.uPathFlowSpeed.value = params.pathFlowSpeed;`,
`    // Update Flow Uniforms
    uniforms.uFlowEnabled.value = params.flowEnabled;
    uniforms.uFlowSpeed.value = params.flowSpeed;
    uniforms.uFlowRepeats.value = params.flowRepeats;
    uniforms.uFlowAmplitude.value = params.flowAmplitude;
    
    fillUniforms.uFlowEnabled.value = params.flowEnabled;
    fillUniforms.uFlowSpeed.value = params.flowSpeed;
    fillUniforms.uFlowRepeats.value = params.flowRepeats;
    fillUniforms.uFlowAmplitude.value = params.flowAmplitude;`
);

// 5. Revert Vertex Shader
const vertexShaderCode = 'const vertexShader = `\\n' +
'varying vec3 vPosition;\\n' +
'varying vec3 vWorldPosition;\\n' +
'\\n' +
'uniform bool uFlowEnabled;\\n' +
'uniform float uFlowSpeed;\\n' +
'uniform float uFlowRepeats;\\n' +
'uniform float uFlowAmplitude;\\n' +
'uniform float uTime;\\n' +
'uniform float uFlowY;\\n' +
'\\n' +
'void main() {\\n' +
'    vec3 pos = position;\\n' +
'    \\n' +
'    if (uFlowEnabled) {\\n' +
'        float flowDist = pos.y + uTime * uFlowSpeed;\\n' +
'        float wave = sin(flowDist * uFlowRepeats) * uFlowAmplitude;\\n' +
'        pos.x += pos.x * wave * 0.1;\\n' +
'        pos.z += pos.z * wave * 0.1;\\n' +
'    }\\n' +
'    \\n' +
'    pos.y -= uFlowY * uTime;\\n' +
'    \\n' +
'    vPosition = pos;\\n' +
'    vec4 worldPos = modelMatrix * vec4(pos, 1.0);\\n' +
'    vWorldPosition = worldPos.xyz;\\n' +
'    gl_Position = projectionMatrix * viewMatrix * worldPos;\\n' +
'}\\n' +
'`;';
// End of vertex shader code

code = code.replace(/const vertexShader = \`[\s\S]*?gl_Position = projectionMatrix \* viewMatrix \* worldPos;\n\}\n\`;/, vertexShaderCode);

// 6. Revert Fill Vertex Shader
const fillVertexShaderCode = 'const fillVertexShader = `\\n' +
'varying vec3 vPosition;\\n' +
'varying vec3 vWorldPosition;\\n' +
'\\n' +
'uniform float uAnimTime;\\n' +
'uniform float uAnimAmplitude;\\n' +
'uniform float uAnimScale;\\n' +
'uniform float uAnimSpeed;\\n' +
'uniform vec3 uAnimFlow;\\n' +
'uniform int uAnimNoiseMode;\\n' +
'uniform float uTwistAmount;\\n' +
'uniform float uTwistSpeed;\\n' +
'\\n' +
'uniform bool uFlowEnabled;\\n' +
'uniform float uFlowSpeed;\\n' +
'uniform float uFlowRepeats;\\n' +
'uniform float uFlowAmplitude;\\n' +
'uniform float uFlowY;\\n' +
'\\n' +
'vec3 mod289v(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\\n' +
'vec4 mod289v(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }\\n' +
'vec4 permutev(vec4 x) { return mod289v(((x*34.0)+10.0)*x); }\\n' +
'vec4 taylorInvSqrtv(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }\\n' +
'\\n' +
'float snoise3(vec3 v) {\\n' +
'  const vec2 C = vec2(1.0/6.0, 1.0/3.0);\\n' +
'  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\\n' +
'  vec3 i = floor(v + dot(v, C.yyy));\\n' +
'  vec3 x0 = v - i + dot(i, C.xxx);\\n' +
'  vec3 g = step(x0.yzx, x0.xyz);\\n' +
'  vec3 l = 1.0 - g;\\n' +
'  vec3 i1 = min(g.xyz, l.zxy);\\n' +
'  vec3 i2 = max(g.xyz, l.zxy);\\n' +
'  vec3 x1 = x0 - i1 + C.xxx;\\n' +
'  vec3 x2 = x0 - i2 + C.yyy;\\n' +
'  vec3 x3 = x0 - D.yyy;\\n' +
'  i = mod289v(i);\\n' +
'  vec4 p = permutev(permutev(permutev(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));\\n' +
'  float n_ = 0.142857142857;\\n' +
'  vec3 ns = n_ * D.wyz - D.xzx;\\n' +
'  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);\\n' +
'  vec4 x_ = floor(j * ns.z);\\n' +
'  vec4 y_ = floor(j - 7.0 * x_);\\n' +
'  vec4 x = x_ * ns.x + ns.yyyy;\\n' +
'  vec4 y = y_ * ns.x + ns.yyyy;\\n' +
'  vec4 h = 1.0 - abs(x) - abs(y);\\n' +
'  vec4 b0 = vec4(x.xy, y.xy);\\n' +
'  vec4 b1 = vec4(x.zw, y.zw);\\n' +
'  vec4 s0 = floor(b0)*2.0 + 1.0;\\n' +
'  vec4 s1 = floor(b1)*2.0 + 1.0;\\n' +
'  vec4 sh = -step(h, vec4(0.0));\\n' +
'  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;\\n' +
'  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;\\n' +
'  vec3 p0 = vec3(a0.xy, h.x);\\n' +
'  vec3 p1 = vec3(a0.zw, h.y);\\n' +
'  vec3 p2 = vec3(a1.xy, h.z);\\n' +
'  vec3 p3 = vec3(a1.zw, h.w);\\n' +
'  vec4 norm = taylorInvSqrtv(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));\\n' +
'  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;\\n' +
'  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\\n' +
'  m = m * m;\\n' +
'  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));\\n' +
'}\\n' +
'\\n' +
'float fbm3(vec3 p) {\\n' +
'  float v = 0.0, a = 1.0, f = 1.0, mx = 0.0;\\n' +
'  for (int i = 0; i < 4; i++) {\\n' +
'    v += snoise3(p * f) * a; mx += a; a *= 0.5; f *= 2.0;\\n' +
'  }\\n' +
'  return v / mx;\\n' +
'}\\n' +
'\\n' +
'void main() {\\n' +
'    vec3 pos = position;\\n' +
'\\n' +
'    if (uFlowEnabled) {\\n' +
'        float flowDist = pos.y + uAnimTime * uFlowSpeed;\\n' +
'        float wave = sin(flowDist * uFlowRepeats) * uFlowAmplitude;\\n' +
'        pos.x += pos.x * wave * 0.1;\\n' +
'        pos.z += pos.z * wave * 0.1;\\n' +
'    }\\n' +
'    \\n' +
'    pos.y -= uFlowY * uAnimTime;\\n' +
'\\n' +
'    vPosition = pos;\\n' +
'\\n' +
'    if (abs(uTwistAmount) > 0.001) {\\n' +
'        float twistAngle = pos.y * uTwistAmount + uAnimTime * uTwistSpeed;\\n' +
'        float cs = cos(twistAngle);\\n' +
'        float sn = sin(twistAngle);\\n' +
'        float nx = pos.x * cs - pos.z * sn;\\n' +
'        float nz = pos.x * sn + pos.z * cs;\\n' +
'        pos.x = nx;\\n' +
'        pos.z = nz;\\n' +
'    }\\n' +
'\\n' +
'    if (uAnimNoiseMode > 0 && uAnimAmplitude > 0.001) {\\n' +
'        vec3 nc = pos * uAnimScale + uAnimFlow * uAnimTime * uAnimSpeed;\\n' +
'        float n = 0.0;\\n' +
'        vec3 disp = vec3(0.0);\\n' +
'        vec2 rd = pos.xz;\\n' +
'        float rLen = length(rd);\\n' +
'        if (rLen > 0.001) rd = rd / rLen;\\n' +
'        else rd = vec2(1.0, 0.0);\\n' +
'\\n' +
'        if (uAnimNoiseMode == 1) {\\n' +
'            n = snoise3(nc);\\n' +
'            float n2 = snoise3(nc + vec3(17.0, 31.0, 7.0));\\n' +
'            disp = vec3(rd.x * n, n2 * 0.3, rd.y * n);\\n' +
'        } else if (uAnimNoiseMode == 2) {\\n' +
'            n = fbm3(nc);\\n' +
'            float n2 = fbm3(nc + vec3(17.0, 31.0, 7.0));\\n' +
'            disp = vec3(rd.x * n, n2 * 0.3, rd.y * n);\\n' +
'        } else if (uAnimNoiseMode == 3) {\\n' +
'            float eps = 0.05;\\n' +
'            float dndz = (snoise3(nc + vec3(0,0,eps)) - snoise3(nc - vec3(0,0,eps))) / (2.0*eps);\\n' +
'            float dndx = (snoise3(nc + vec3(eps,0,0)) - snoise3(nc - vec3(eps,0,0))) / (2.0*eps);\\n' +
'            disp = vec3(dndz, 0.0, -dndx);\\n' +
'        }\\n' +
'        pos += disp * uAnimAmplitude;\\n' +
'    }\\n' +
'\\n' +
'    vec4 worldPos = modelMatrix * vec4(pos, 1.0);\\n' +
'    vWorldPosition = worldPos.xyz;\\n' +
'    gl_Position = projectionMatrix * viewMatrix * worldPos;\\n' +
'}\\n' +
'`;';
// End of fill shader code

code = code.replace(/const fillVertexShader = \`[\\s\\S]*?gl_Position = projectionMatrix \\* viewMatrix \\* worldPos;\\n\\}\\n\`;/, fillVertexShaderCode);

// 7. Remove path generation
code = code.replace(/let allPaths = \[\];\nlet pathDataTex = null;[\s\S]*?function createFlowTube[\s\S]*?\}\n/, '');

// 8. Rebuild Rover cleanup
code = code.replace(/    roverGroup = new THREE\.Group\(\);\n    allPaths = \[\];/g, '    roverGroup = new THREE.Group();');

// 9. Scene Add Cleanup
code = code.replace(/    if \(pathDataTex\) pathDataTex\.dispose\(\);[\s\S]*?fillUniforms\.uNumPaths\.value = allPaths\.length;\n    \n    scene\.add\(roverGroup\);/g, '    scene.add(roverGroup);');

// 10. Torus replacement
code = code.replace(/createFlowTube\(pts, isClosed, params\.testTorusTube, mat, targetGroup, false\);\n                    \}\)/g, 
\`const curve = new THREE.CatmullRomCurve3(pts, isClosed, 'catmullrom', 0.5);
                        const res = Math.max(1, Math.floor(params.splineResolution));
                        const segments = pts.length * res;
                        if (params.renderAsTubes) {
                            const geo = new THREE.TubeGeometry(curve, segments, params.testTorusTube, Math.floor(params.tubeRadialSegments), isClosed);
                            targetGroup.add(new THREE.Mesh(geo, mat));
                        } else {
                            const geo = createLineGeometry(curve.getPoints(segments));
                            targetGroup.add(new THREE.Line(geo, mat));
                        }
                    })\`);

// 11. RenderLoop replacement
code = code.replace(/            const renderLoop = \(loopPoints, thickness, isHorizontal\) => \{[\s\S]*?\}\n            \};/g,
\`            const renderLoop = (loopPoints, thickness) => {
                let isClosed = loopPoints[0].distanceTo(loopPoints[loopPoints.length - 1]) < 0.001;
                if (isClosed && loopPoints.length > 2) {
                    const pts = [...loopPoints];
                    pts.pop();
                    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
                    const res = Math.max(1, Math.floor(params.splineResolution));
                    const segments = pts.length * res;
                    if (params.renderAsTubes) {
                        const geo = new THREE.TubeGeometry(curve, segments, thickness, Math.floor(params.tubeRadialSegments), true);
                        targetGroup.add(new THREE.Mesh(geo, material));
                    } else {
                        const geo = createLineGeometry(curve.getPoints(segments));
                        targetGroup.add(new THREE.Line(geo, material));
                    }
                } else {
                    let pts = [...loopPoints];
                    if (params.torusExtendArc > 0 && pts.length >= 2) {
                        pts = extendOntoTorus(pts);
                    }
                    if (pts.length < 2) return;
                    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
                    const res = Math.max(1, Math.floor(params.splineResolution));
                    const segments = pts.length * res;
                    if (params.renderAsTubes) {
                        const geo = new THREE.TubeGeometry(curve, segments, thickness, Math.floor(params.tubeRadialSegments), false);
                        targetGroup.add(new THREE.Mesh(geo, material));
                    } else {
                        const geo = createLineGeometry(curve.getPoints(segments));
                        targetGroup.add(new THREE.Line(geo, material));
                    }
                }
            };\`);

// 12. RenderFillCurve replacement
code = code.replace(/            const renderFillCurve = \(points, isClosed\) => \{[\s\S]*?\}\n            \};/g,
\`            const renderFillCurve = (points, isClosed) => {
                if (points.length < 2) return;
                const curve = new THREE.CatmullRomCurve3(points, isClosed, 'catmullrom', 0.5);
                const res = Math.max(1, Math.floor(params.splineResolution));
                const segments = points.length * res;
                if (params.renderAsTubes) {
                    const geo = new THREE.TubeGeometry(curve, segments, params.tubeRadius, Math.floor(params.tubeRadialSegments), isClosed);
                    targetGroup.add(new THREE.Mesh(geo, fillMaterial));
                } else {
                    const geo = createLineGeometry(curve.getPoints(segments));
                    targetGroup.add(new THREE.Line(geo, fillMaterial));
                }
            };\`);

// 13. Remove isHorizontal from renderLoop calls
code = code.replace(/renderLoop\(loop, params\.contourThickness, false\)/g, 'renderLoop(loop, params.contourThickness)');
code = code.replace(/renderLoop\(loop, params\.contourThickness, true\)/g, 'renderLoop(loop, params.contourThickness)');
code = code.replace(/renderLoop\(parallelPts, params\.contourThickness \* 0\.7, false\)/g, 'renderLoop(parallelPts, params.contourThickness * 0.7)');

fs.writeFileSync('src/main.js', code);
console.log("Rollback completed successfully.");
