import TETSUO from "@SolidSolutionsDev/tetsuo";
import * as PIXI from "pixi.js";
import { sand } from "./sand";

export function sandText(syncer, assets, renderer) {
    let textNode = new TETSUO.PIXINode();

    let t = new PIXI.Text("ANTICORE", {
        fill: "#ffffff",
        fontFamily:
            'Impact, "Palatino Linotype", "Book Antiqua", Palatino, serif',
        fontSize: 200,
        fontWeight: "bolder",
        align: "center",
        letterSpacing: 2,
    });
    textNode.add(t);
    t.pivot.set(t.width / 2, t.height / 2);
    t.position.set(1920 / 2, 1080 / 2);

    let sandNode = sand(syncer, assets, renderer).node;

    let node = new TETSUO.ShaderNode({
        /* glsl */ fragmentShader: /* glsl */ `
            varying vec2 vUv;
            uniform sampler2D bgTex;
            uniform sampler2D fgTex;

            void main() {
                vec4 bg = texture2D(bgTex, vUv);
                vec4 fg = texture2D(fgTex, vUv);

                gl_FragColor = fg.r > 0.5 ? vec4(1.) - bg : bg;
            }
        `,
    })
        .addInput(sandNode, "bgTex")
        .addInput(textNode, "fgTex");

    return {
        node: node,
        setText: (text) => {
            t.text = text;
            t.pivot.set(t.width / 2, t.height / 2);
        },
    };
}
