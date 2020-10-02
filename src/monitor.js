import TETSUO from "@SolidSolutionsDev/tetsuo";

import * as THREE from "three";
import { sandText } from "./sandText";
import { staticscreen } from "./static";

export function monitor(syncer, assets, renderer) {
    let monitorModel = assets.monitor;

    monitorModel.children.forEach((child) => {
        if (child.name === "screen") {
            monitorModel.remove(child);
        }
    });

    let node = new TETSUO.THREENode({ orbitControls: true });
    node.add(monitorModel);
    monitorModel.position.y += 0.3;
    monitorModel.position.x -= 0.3;
    monitorModel.position.z = -5;
    monitorModel.rotation.y = Math.PI / 2;

    let st = sandText();

    let tvSelector = new TETSUO.SelectorNode({ enabledNode: "sand" })
        .addInput(st.node, "sand")
        .addInput(staticscreen().node, "static");
    tvSelector.set("sand");
    window.tv = tvSelector;

    let sandMaterial = new TETSUO.MaterialNode().addInput(
        tvSelector,
        "inputTex"
    );
    renderer.connectNonRootNode(sandMaterial);

    let screenPlane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(4, 2.2),
        sandMaterial.material
    );
    screenPlane.position.set(
        monitorModel.position.x + 0.3,
        monitorModel.position.y + -0.4,
        monitorModel.position.z + 0.6
    );
    node.add(screenPlane);
    window.screenPlane = screenPlane;

    let light = new THREE.DirectionalLight(0xffffff, 1);
    node.add(light);

    let light2 = new THREE.DirectionalLight(0xff0000, 0.1);
    light2.position.set(5, 5, 5);
    node.add(light2);

    let bloom = new TETSUO.BloomNode()
        .addInput(node, "inputTex")
        .uniform("amount", 0.7)
        .uniform("separation", 0.6);

    return { node: bloom, tvSelector, st };
}
