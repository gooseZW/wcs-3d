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

export default class Factory {
  constructor(scene) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.scene = scene;
    this.floor1Group;
    this.floor2Tags = [];


    gltfLoader.load("./model/transTape.glb", (gltf) => {
      console.log(gltf);
      this.floor1Group = gltf.scene;

      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 5;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
      });
      this.floor1Group.visible = false;
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

  createTag(object3d) {
    // 创建各个区域的元素
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
    // scene.add(objectCSS3D);
  }

  showFloor1() {
    this.floor1Group.visible = true;
  }


  initEvent() {
    eventHub.on("showTransTape", () => {
      this.showFloor1();
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
