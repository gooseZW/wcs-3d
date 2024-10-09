import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import cameraModule from "../camera";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import eventHub from "@/utils/eventHub";
import { ShaderMaterial } from "three";
import fragmentShader from "@/shader/fighter/fragmentShader.glsl";
import vertexShader from "@/shader/fighter/vertexShader.glsl";

export default class City {
  constructor(scene) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.scene = scene;
    this.transTape;
    this.turnTransTape;
    this.box;
    this.animation;


    gltfLoader.load("./model/transTape.glb", (gltf) => {
      console.log('transTape',gltf);
      this.transTape = gltf.scene;
      this.transTape.visible = false;
      scene.add(gltf.scene);
    });

    gltfLoader.load("./model/turnTransTape.glb", (gltf) => {
      console.log('turnTransTape',gltf);
      this.turnTransTape = gltf.scene;
      this.turnTransTape.visible = false;
      scene.add(gltf.scene);
    });


    gltfLoader.load("./model/box.glb", (gltf) => {
      console.log('box',gltf);
      this.box = gltf.scene;
      gltf.scene.scale.set(0.5, 0.5, 0.5);
      gltf.scene.position.set(0, 0.5, -2);
      this.box.visible = false;
      scene.add(gltf.scene);
    });


    this.initEvent();
  }

  update(time) {
    if (this.mixer) {
      // console.log(time);
      this.mixer.update(time);
    }
  }




  showTransTape() {
    this.transTape.visible = true;
  }
  hideTransTape() {
    this.transTape.visible = false;
  }
  showTurnTransTape() {
    this.turnTransTape.visible = true;
  }
  hideTurnTransTape() {
    this.turnTransTape.visible = false;
  }
  showBox() {
    this.box.visible = true;
  }
  hideBox() {
    this.box.visible = false;
  }
  initEvent() {
    eventHub.on("showTransTape", () => {
      this.showTransTape();
      this.hideTurnTransTape();
      this.hideBox();
      this.animation.kill();
    });
    eventHub.on("showTurnTransTape", () => {
      this.showTurnTransTape();
      this.hideTransTape();
      this.hideBox();
      this.animation.kill();
    });
    eventHub.on("showBox", () => {
      this.showBox();
      this.showTransTape();
      this.hideTurnTransTape();
      this.animation= gsap.to(this.box.position, {
        z: 1.5,
        duration: 5,
        repeat:-1
      });
      this.animation.play();
      // gsap.from(this.box.position, {
      //   z: -5,
      //   duration: 5,
      //   repeat:-1
      // });

    });
    eventHub.on("showTurn", () => {
      this.showBox();
      this.showTransTape();
      this.hideTurnTransTape();
      this.animation = gsap.to(this.box.position, {
        z: 5,
        duration: 5,
        repeat:-1
      });
    });

  }


  transformPoints(object3d) {
    // 创建纹理图像
    const texture = new THREE.TextureLoader().load("./assets/particles/1.png");
    const group = new THREE.Group();

    function createPoints(object3d, newObject3d) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child) => {
          if (child.isMesh) {
            // 随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random()
            );
            // const material = new THREE.PointsMaterial({
            //   size: 0.1,
            //   color: color,
            //   map: texture,
            //   blending: THREE.AdditiveBlending,
            //   transparent: true,
            //   depthTest: false,
            // });

            const material = new THREE.ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: texture },
                uTime: {
                  value: 0,
                },
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false,
            });
            const points = new THREE.Points(child.geometry, material);
            points.position.copy(child.position);
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }

    createPoints(object3d, group);
    // object3d.traverse((child) => {
    //   if (child.isMesh) {
    //     const points = child.geometry.attributes.position.array;
    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute(
    //       "position",
    //       new THREE.Float32BufferAttribute(points, 3)
    //     );

    //     // 随机生成颜色
    //     const color = new THREE.Color(
    //       Math.random(),
    //       Math.random(),
    //       Math.random()
    //     );
    //     const material = new THREE.PointsMaterial({
    //       size: 0.1,
    //       color: color,
    //     });
    //     const pointsMesh = new THREE.Points(geometry, material);
    //     pointsMesh.position.copy(child.position);
    //     pointsMesh.rotation.copy(child.rotation);
    //     pointsMesh.scale.copy(child.scale);
    //     group.add(pointsMesh);
    //   }
    // });
    return group;
  }

  pointsBlast() {
    this.fighterPointsGroup.traverse((child) => {
      if (child.isPoints) {
        let randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        );
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }

        child.geometry.setAttribute(
          "aPosition",
          new THREE.BufferAttribute(randomPositionArray, 3)
        );

        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 10,
        });
      }
    });
  }

  pointsBack() {
    this.fighterPointsGroup.traverse((child) => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 10,
        });
      }
    });
  }
}
