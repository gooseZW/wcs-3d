import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 初始化场景
const scene = new THREE.Scene();

// 添加雾霾
// const fog = new THREE.Fog(0x000000, 0, 10);
// scene.fog = fog;

// const cubeTextureLoader = new THREE.CubeTextureLoader().setPath("./textures/");
// const texture = cubeTextureLoader.load([
//   "1.jpg",
//   "2.jpg",
//   "3.jpg",
//   "4.jpg",
//   "5.jpg",
//   "6.jpg",
// ]);

// 添加圆柱形天空
const rgbeloader = new RGBELoader();

// rgbeloader.loadAsync("./textures/2k.hdr").then((texture) => {
//   // 设置纹理为圆柱形纹理
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   // 添加天空环境
//   scene.background = texture;
//   scene.environment = texture;
// });
scene.background = new THREE.Color("#ccc");
scene.environment = new THREE.Color("#ccc");

// 场景亮度物理灯光效果
// 1设置色调映射
// 2设置曝光
// 3设置场景灯光
// 添加灯光
const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(0, 0, 10);
scene.add(light1);
const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, -10);
scene.add(light2);
const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(10, 0, 0);
scene.add(light3);
const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(-10, 0, 0);
scene.add(light4);
const light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, 10, 0);
scene.add(light5);
const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
light6.position.set(5, 10, 0);
scene.add(light6);
const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
light7.position.set(0, 10, 5);
scene.add(light7);
const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
light8.position.set(0, 10, -5);
scene.add(light8);
const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
light9.position.set(-5, 10, 0);
scene.add(light9);



export default scene;
