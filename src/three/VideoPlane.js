import * as THREE from "three";
import gsap from "gsap";

export default class VideoPlane {
  constructor(
    videoSrc,
    size = new THREE.Vector2(1, 1),
    position = new THREE.Vector3(0, 0, 0)
  ) {
    // 添加视频纹理
    this.video = document.createElement("video");
    this.video.src = videoSrc;
    // 如果想要视频能够自动播放，那么就设置为静音
    this.video.muted = true;
    this.video.loop = true;
    this.video.play();
    const texture = new THREE.VideoTexture(this.video);

    // 创建一个平面
    const planeGeometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: texture,
      alphaMap: texture,
    });

    this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.mesh.position.copy(position);
  }
}
