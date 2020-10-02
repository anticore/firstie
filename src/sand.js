import TETSUO from "@SolidSolutionsDev/tetsuo";

export function sand() {
    let rm = new TETSUO.Shaders.Raymarcher(/* glsl */ `
        float sinDisp(vec2 q, float phase, float amplitude, float thickness) {
            float lo = sin(phase * q.x) * amplitude + sin(2. * phase * q.x) * amplitude - thickness * amplitude;
            float hi = sin(phase * q.x) * amplitude + sin(2. * phase * q.x) * amplitude;
            float distLo = clamp(q.y - lo, 0., 1.);
            float distHi = clamp(hi - q.y, 0., 1.);
            return min(distLo * 5., distHi * 5.);
        }


            mapHit map(vec3 point) {
                float disp = snoise(vec3((point.x / 15.) / 3., point.z / 15., 0.1));

                return mapHit(
                    sdSimplePlane( vec3(0., 6., 0.) + point ) 
                    + disp * 3.
                    + sinDisp(vec2(point.z, point.x + sin(point.z / 10.) * 10.), 1., 1., 1.5) * .02
                , 0.);
            }

            

            vec4 background(vec2 vUv) {
                return mix(vec4(0.3, 0.5, 0.8, 1.), vec4(1.), 1. - vUv.y);
            }


            vec4 shade(hit h, vec2 uv) {
                vec4 lightColor = vec4(1.);

                if (h.material == 0.) {
                    float lightDiff = dot(vec3(1., 1., 1.), h.normal);

                    vec4 color = vec4(1., 0.3, 0., 1.) + (0.1 * hash12(h.point.xz));
                    
                    return mix(color * lightDiff, background(uv), clamp(h.dist / 100., 0., 1.));
                }

                return background(uv);
            }


            camera getCamera() {
                return newCamera(vec3(0., 0., -iTime * 10.), vec3(0., -0.1, -1.), 45.);
            }
        `);

    let node = new TETSUO.ShaderNode({
        fragmentShader: rm.toString(),
    });

    return { node };
}
