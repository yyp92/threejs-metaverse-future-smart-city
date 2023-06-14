<template>
  <div id="bigScreen">
    <div class="header">老陈未来智慧城市平台</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <GdpGrow></GdpGrow>

          <div class="footerBorder"></div>
        </div>
        <div class="cityEvent">
          <PieChart></PieChart>

          <div class="footerBorder"></div>
        </div>
        <div class="cityEvent">
          <ScatterChart></ScatterChart>

          <div class="footerBorder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent video">
          <video
            src="/video/city.mp4"
            style="width: 230px; margin: 5px"
            muted
            autoplay
            loop
          ></video>
          <div class="btns">
            <button class="btn" @click="toggleScene">切换场景</button>
            <button class="btn" @click="toSceneJoin">场景融合</button>
          </div>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent test">
          <h3>
            <span>智慧检测</span>
          </h3>
          <h1>
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>{{ toFixInt(data.num) }}（台）</span>
          </h1>
          <h3>
            <span>巡检排查</span>
          </h3>
          <h1>
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>{{ toFixInt(data.num2) }}（次）</span>
          </h1>
          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent">
          <RadarCharts></RadarCharts>

          <div class="footerBorder"></div>
        </div>
        <div class="cityEvent view">
          <h3>
            <span>游览模式</span>
          </h3>
          <div class="btns">
            <button class="btn">自由导览</button>
            <button class="btn">第三人称</button>
          </div>
          <div class="footerBorder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import eventHub from "@/utils/eventHub";
import GdpGrow from "./GdpGrow.vue";
import PieChart from "./PieChart.vue";
import ScatterChart from "./ScatterChart.vue";
import RadarCharts from "./RadarCharts.vue";
import gsap from "gsap";

let data = reactive({
  num: 99,
  num2: 76,
});

setInterval(() => {
  let random = Math.random() * 100;
  let random2 = Math.random() * 100;
  gsap.to(data, {
    num: random,
    num2: random2,
    duration: 1,
    ease: "power2.inOut",
  });
}, 5000);

const toFixInt = (num) => {
  return num.toFixed(0);
};

const toSceneJoin = () => {
  // console.log("toSceneJoin");
  eventHub.emit("sceneJoin");
};
const toggleScene = () => {
  eventHub.emit("toggleScene");
};
</script>

<style>
#bigScreen {
  width: 1920px;
  height: 1080px;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  width: 1920px;
  height: 70px;

  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(240, 245, 251);
  font-size: 35px;
  /* font-weight: bold; */
  line-height: 70px;
  /* text-shadow: 0 0 10px #fff; */
  letter-spacing: 5px;
  filter: hue-rotate(5deg) brightness(4.8);
}

.main {
  flex: 1;
  width: 1920px;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 300px;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png),
    linear-gradient(to right, rgb(3 12 25), rgb(240 245 251 / 10%));
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.right {
  width: 300px;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png),
    linear-gradient(to left, rgb(3 12 25), rgb(240 245 251 / 10%));
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.cityEvent {
  position: relative;
  width: 240px;
  height: 260px;
  margin-bottom: 50px;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
  pointer-events: auto;
}

.cityEvent::before {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(227, 239, 252);
  border-left: 4px solid rgb(227, 239, 252);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(227, 239, 252);
  border-right: 4px solid rgb(227, 239, 252);
  content: "";
  display: block;
}
.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 240px;
  height: 20px;
}
.footerBorder::before {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(227, 239, 252);
  border-left: 4px solid rgb(227, 239, 252);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(227, 239, 252);
  border-right: 4px solid rgb(227, 239, 252);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 20px;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
  text-shadow: 0 0 5px #000;
  font-size: 20px;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}
.cityEvent li.active p {
  color: red;
}

.cityEvent .btn {
  width: 47%;
  height: 40px;
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  color: #000;
  font-size: 0.3rem;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
.btns {
  display: flex;
  justify-content: space-around;
  pointer-events: auto;
}
.cityEvent.video {
  height: 180px;
}
.cityEvent h1,
.cityEvent h3 {
  padding: 10px 15px;
}
.cityEvent.test {
  height: 210px;
}
.cityEvent.view {
  height: 120px;
}
</style>
