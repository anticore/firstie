import "regenerator-runtime/runtime";
import TETSUO from "@SolidSolutionsDev/tetsuo";
import { sand } from "./sand";
import { sandText } from "./sandText";
import { staticscreen } from "./static";
import { monitor } from "./monitor";

let renderer, assets, clock, syncer;

function init() {
    TETSUO.Utils.prepareViewport({ width: 1920, height: 1080 });
    let bs = new TETSUO.Bootstrap({ dev: false, autoStart: false });
    renderer = bs.renderer;

    clock = new TETSUO.Clock(false, update);

    new TETSUO.Preloader().loadManifest("manifest.json", (loaded) => {
        assets = loaded;

        syncer = new TETSUO.Syncer(assets["music"], {
            bpm: 73,
        });

        TETSUO.Utils.createStartButton(start);
        setupPipeline();
    });
}

function setupPipeline() {
    let sandOutput = sand().node;
    let sandTextOutside = sandText();
    let staticscreenNode = staticscreen().node;

    let { node, st } = monitor(syncer, assets, renderer);

    let select = new TETSUO.SelectorNode({ enabledNode: "monitor" })
        .addInput(node, "monitor")
        .addInput(sandOutput, "sand")
        .addInput(sandTextOutside.node, "sandText")
        .addInput(staticscreenNode, "staticscreen");
    select.set("sand");
    window.select = select;

    let bpms = 0;
    syncer.onBPM(() => {
        bpms++;
        console.log(bpms);

        if (bpms == 12) {
            select.set("staticscreen");
        }
        if (bpms == 20) {
            select.set("monitor");
        }
        if (bpms == 28) {
            select.set("staticscreen");
        }
        if (bpms == 36) {
            sandTextOutside.setText("ANTICORE");
            select.set("sandText");
        }
        if (bpms === 44) {
            select.set("staticscreen");
        }
        if (bpms === 52) {
            sandTextOutside.setText("INERCIA");
            select.set("sandText");
        }
        if (bpms == 60) {
            select.set("monitor");
        }
        if (bpms == 68) {
            select.set("sand");
        }
        if (bpms == 76) {
            select.set("monitor");
            st.setText("INERCIA");
        }
        if (bpms == 84) {
            st.setText("2020");
        }
        if (bpms == 90) {
            st.setText("FOREVER");
        }
        if (bpms == 94) {
            select.set("");
        }
    });

    let anaAmount = new TETSUO.UniformNode({ value: 1 });

    let anaglgyph = new TETSUO.AnaglyphNode()
        .addInput(select, "inputTex")
        .addInput(anaAmount, "amount");
    anaglgyph.onUpdate(() => {
        anaAmount.setValue(0);
        if (bpms > 11) {
            let until = syncer.getUntilBPM();
            anaAmount.setValue(0.01 - until / 100000);
        }
    });
    let grain = new TETSUO.GrainNode().addInput(anaglgyph, "inputTex");

    renderer.connectToScreen(grain);
}

function start() {
    clock.start();
    syncer.play();
}

function update(elapsed, delta, frameCount) {
    renderer.update(elapsed, delta, frameCount);
    renderer.render();
    syncer.update();
}

init();
