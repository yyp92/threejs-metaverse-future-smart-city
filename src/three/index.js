import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// 导入后期效果合成器
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// three框架本身自带效果
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { SSAARenderPass } from "three/examples/jsm/postprocessing/SSAARenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import gsap from "gsap";

// 导入云
import { Clouds, CloudsPlus } from "./Clouds";
// 导入海洋
import Ocean from "./Ocean";
// 导入八叉树物理碰撞类
import Physics from "./Physics";
// 添加视频平面
import VideoPlane from "./VideoPlane";
// 导入光环
import LightCircle from "./LightCircle";
// 导入canvasplane
import CanvasPlane from "./CanvasPlane";
// 导入canvasVideo
import TextVideo from "./TextVideo";
// 导入FireSprite
import FireSprite from "./FireSprite";

export default class ThreePlus {
  constructor(selector) {
    // console.log("THREEPlus");
    this.mixers = [];
    this.actions = [];
    this.textVideoArrays = [];
    this.clock = new THREE.Clock();
    this.domElement = document.querySelector(selector);
    this.width = this.domElement.clientWidth;
    this.height = this.domElement.clientHeight;
    this.updateMeshArr = [];
    this.init();
  }
  init() {
    // console.log("THREEPlus init");
    this.initScene();
    this.initCamera();
    this.initRenderer();
    // this.initControl();
    this.initEffect();
    this.render();
    // this.addAxis();
    console.log(this.renderer.info);
  }
  initScene() {
    this.scene = new THREE.Scene();
  }
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.000001,
      10000
    );
    this.camera.position.set(0, 10, 50);

    this.camera.aspect = this.width / this.height;
    //   更新摄像机的投影矩阵
    this.camera.updateProjectionMatrix();
  }
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.75;
    this.renderer.sortObjects = true;
    this.domElement.appendChild(this.renderer.domElement);
  }
  initControl() {
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
  }
  render() {
    let deltaTime = this.clock.getDelta();
    // 更新mixers
    for (let i = 0; i < this.mixers.length; i++) {
      this.mixers[i].update(deltaTime * 0.2);
    }
    this.control && this.control.update();
    // this.renderer.render(this.scene, this.camera);
    if (this.physics) {
      this.physics.update(deltaTime);
    }
    if (this.textVideoArrays.length > 0) {
      for (let i = 0; i < this.textVideoArrays.length; i++) {
        this.textVideoArrays[i].update(deltaTime);
      }
    }
    if (this.updateMeshArr.length > 0) {
      for (let i = 0; i < this.updateMeshArr.length; i++) {
        this.updateMeshArr[i].update(deltaTime);
      }
    }
    this.effectComposer.render();
    requestAnimationFrame(this.render.bind(this));
  }
  gltfLoader(url) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    // 设置public下的解码路径，注意最后面的/
    dracoLoader.setDecoderPath("./draco/gltf/");
    // 使用兼容性强的draco_decoder.js解码器
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      gltfLoader.load(url, (gltf) => {
        resolve(gltf);
      });
    });
  }
  fbxLoader(url) {
    const fbxLoader = new FBXLoader();
    return new Promise((resolve, reject) => {
      fbxLoader.load(url, (fbx) => {
        resolve(fbx);
      });
    });
  }
  hdrLoader(url) {
    const hdrLoader = new RGBELoader();
    return new Promise((resolve, reject) => {
      hdrLoader.load(url, (hdr) => {
        resolve(hdr);
      });
    });
  }
  setBg(url) {
    this.hdrLoader(url).then((texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.anisotropy = 16;
      texture.format = THREE.RGBAFormat;
      this.scene.background = texture;
      this.scene.environment = texture;
    });
  }
  setLight() {
    // 添加环境光

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambientLight);
    const light1 = new THREE.DirectionalLight(0xffffff, 0.1);
    light1.position.set(0, 10, 10);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.1);
    light2.position.set(0, 10, -10);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.6);
    light3.position.set(10, 10, 10);
    light1.castShadow = true;
    light2.castShadow = true;
    light3.castShadow = true;
    light1.shadow.mapSize.width = 10240;
    light1.shadow.mapSize.height = 10240;
    light2.shadow.mapSize.width = 10240;
    light2.shadow.mapSize.height = 10240;
    light3.shadow.mapSize.width = 10240;
    light3.shadow.mapSize.height = 10240;
    this.scene.add(light1, light2, light3);
  }
  initEffect() {
    // 合成效果
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setSize(window.innerWidth, window.innerHeight);

    // 添加渲染通道
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effectComposer.addPass(renderPass);

    // 点效果
    // const dotScreenPass = new DotScreenPass();
    // dotScreenPass.enabled = false;
    // effectComposer.addPass(dotScreenPass);

    // 抗锯齿
    // const smaaPass = new SMAAPass();
    // this.effectComposer.addPass(smaaPass);

    // // 发光效果
    // this.unrealBloomPass = new UnrealBloomPass();
    // this.effectComposer.addPass(this.unrealBloomPass);
  }
  // 添加云效果
  addClouds() {
    let clouds = new Clouds();
    this.scene.add(clouds.mesh);
  }
  addCloudsPlus() {
    let clouds = new CloudsPlus();
    this.scene.add(clouds.mesh);
  }
  addOcean() {
    let ocean = new Ocean();
    this.scene.add(ocean.mesh);
  }
  // 添加辅助坐标轴
  addAxis() {
    let axis = new THREE.AxesHelper(20);
    this.scene.add(axis);
  }
  addPhysics(planeGroup) {
    this.physics = new Physics(planeGroup, this.camera, this.scene);
    return this.physics;
  }
  addVideoPlane(url, size, position) {
    let videoPlane = new VideoPlane(url, size, position);
    this.scene.add(videoPlane.mesh);
    return videoPlane;
  }
  addLightCircle(position, scale) {
    let lightCircle = new LightCircle(this.scene, position, scale);
    return lightCircle;
  }
  addCanvasPlane(text, position, euler) {
    let canvasPlane = new CanvasPlane(this.scene, text, position, euler);
    return canvasPlane;
  }
  addTextVideo(url, position, euler) {
    let textVideo = new TextVideo(this.scene, url, position, euler);
    this.textVideoArrays.push(textVideo);
    return textVideo;
  }
  addFireSprite(position, scale) {
    let fireSprite = new FireSprite(this.camera, position, scale);
    this.scene.add(fireSprite.mesh);
    this.updateMeshArr.push(fireSprite);
    return fireSprite;
  }
}
